import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import RegionHighlighter from './RegionHighlighter';
import turkeyData from './turkey.json';
import australiaData from './australia.json';
import canadaData from './canada.json';
import Santa from './Santa';
import Glitter from './Glitter';


interface EarthProps {
  onSuccess?: () => void;
}

const Earth: React.FC<EarthProps> = (props) => {
  const earthRef = useRef<THREE.Mesh>(null);
  // Ref for Santa to update position directly without re-renders if possible, 
  // but we need position for Glitter, so state might be needed or just mutable ref shared.
  const santaRef = useRef<THREE.Group>(null);

  // We track Santa's world position to pass to Glitter
  // Since update loop is fast, we can use a mutable vector ref for Santa's position
  // and force Glitter to read it, but React props need state or ref passing.
  // Best way for performance: Pass a RefObject to Glitter? Or just update a shared vector.
  // Let's use a ref for the vector.
  const santaWorldPosition = useRef(new THREE.Vector3(1.1, 0, 0));

  const [colorMap] = useLoader(TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
  ]);

  // Flight State
  const [flightState, setFlightState] = React.useState<'orbiting' | 'flying' | 'arrived'>('orbiting');
  const targetPosition = useRef<THREE.Vector3 | null>(null);
  const wanderTarget = useRef<THREE.Vector3 | null>(null);



  const handleCountryClick = (point: THREE.Vector3) => {
    // Calculate world position of the click on the rotating earth surface
    // The point passed from RegionHighlighter is relative to Earth mesh.
    // But Earth mesh is rotating. So we need to calculate the actual WORLD target position at the moment of click?
    // No, Santa moves in World Space (or Scene space).
    // Earth rotates. If we fly to "Turkey", we fly to a moving target?
    // Or does Santa stick to the surface?
    // User said: "Santa flies to the country and waits there."
    // Simplest approach: Santa enters 'flying' mode where he chases the target point which is rotating with Earth.

    if (flightState === 'orbiting') {
      // Store the LOCAL point on Earth
      targetPosition.current = point.clone();
      setFlightState('flying');
    }
  };

  useFrame((state) => {
    const { clock, raycaster, camera, pointer } = state;
    const time = clock.getElapsedTime();

    // 1. Rotate Earth
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }

    if (santaRef.current) {
      if (flightState === 'orbiting') {
        // 2. Mouse Following Logic (Mathematical Ray-Sphere Intersection)
        // This avoids issues with country meshes blocking the ray or providing inconsistent depth.
        raycaster.setFromCamera(pointer, camera);
        const ray = raycaster.ray;
        const target = new THREE.Vector3();

        // Intersect with a virtual sphere of radius 2.5 (Earth Surface + Scale roughly)
        // Earth scale is 2.5. So radius is 2.5.
        // We want the point on the SURFACE (r=2.5).
        // Ray: O + tD. Sphere: |P|^2 = R^2
        const sphereRadius = 2.5;

        // Simple ray-sphere intersection logic
        // We assume sphere at 0,0,0
        // a = D.dot(D) = 1 (if normalized)
        // b = 2 * O.dot(D)
        // c = O.dot(O) - R^2

        const O = ray.origin;
        const D = ray.direction;
        const b = 2 * O.dot(D);
        const c = O.dot(O) - sphereRadius * sphereRadius;
        const d = b * b - 4 * c; // Discriminant

        if (d >= 0) {
          // Hit!
          const t = (-b - Math.sqrt(d)) / 2; // Closest hit
          if (t >= 0) {
            target.copy(O).add(D.clone().multiplyScalar(t));
            // Convert to "TargetPos" we use for lerp (Radius ~2.7 usually for flight? No, target is usually surface)
            // Let's set targetPos to this surface point.
          }
        } else {
          // Miss - Wander Logic
          // If we don't have a wander target, or we are close to it, pick a new one.
          const currentPos = santaRef.current.position.clone();

          if (!wanderTarget.current || currentPos.distanceTo(wanderTarget.current) < 0.2) {
            // Pick a new random point on the sphere surface
            // We make the jump distance larger (4.0) so he flies in a straight line for longer (fewer turns)
            const randomOffset = new THREE.Vector3(
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2
            ).normalize().multiplyScalar(4.0); // Longer wander segments

            // Add to current, then project back to surface (radius 2.5)
            const nextWander = currentPos.clone().add(randomOffset).normalize().multiplyScalar(2.5);
            wanderTarget.current = nextWander;
          }

          target.copy(wanderTarget.current);
        }

        // Smoothing
        const lerpSpeed = 0.01; // Slower movement (was 0.05)
        // Logic: Move current Santa pos towards 'target' (projected to flight altitude)
        const currentPos = santaRef.current.position.clone();

        // We want target at Flight Altitude (2.7) for calculation
        const flightTarget = target.clone().normalize().multiplyScalar(2.7);

        const nextPos = currentPos.lerp(flightTarget, lerpSpeed);
        nextPos.normalize().multiplyScalar(2.7); // Enforce altitude

        santaRef.current.position.copy(nextPos);
        santaWorldPosition.current.copy(nextPos);

        // ORIENTATION
        // 1. UP vector always away from center
        const up = nextPos.clone().normalize();
        santaRef.current.up.copy(up);

        // 2. Look At
        // If we look strictly at 'flightTarget', and we are very close, it jitters.
        // We calculate a forward direction.
        // Since we are lerping, nextPos is on the way to flightTarget.
        // So looking at flightTarget is generally correct for "flying towards mouse".
        // But let's look slightly beyond it to avoid "arrived" jitter if we want?
        // Actually, just looking at flightTarget is fine for "following".
        santaRef.current.lookAt(flightTarget);

      } else if (flightState === 'flying' && targetPosition.current && earthRef.current) {
        // 3. Flight Logic (Curved Path)
        // Convert to world target
        const localTarget = targetPosition.current.clone();
        const worldTarget = localTarget.applyMatrix4(earthRef.current.matrixWorld);

        // Current position
        const currentPos = santaRef.current.position.clone();

        // Direction towards target
        const direction = new THREE.Vector3().subVectors(worldTarget, currentPos);
        const dist = direction.length();

        const speed = 0.02; // Slower speed (was 0.05)
        const flightAltitude = 2.7; // Standard orbit altitude to maintain curve

        if (dist < speed) {
          // Arrived
          // Set to target but pushed out by altitude offset for hovering
          const arrivalNormal = worldTarget.clone().normalize();
          const hoverPos = worldTarget.clone().add(arrivalNormal.multiplyScalar(0.2)); // Hover 0.2 units above

          santaRef.current.position.copy(hoverPos);
          setFlightState('arrived');

          // Trigger Success after 1 second
          setTimeout(() => {
            if (props.onSuccess) props.onSuccess();
          }, 1000);
        } else {
          // Move linearly then project back to sphere surface
          direction.normalize().multiplyScalar(speed);
          const nextPos = currentPos.add(direction);

          // Project to flight altitude radius (spherical flight)
          nextPos.normalize().multiplyScalar(flightAltitude);

          santaRef.current.position.copy(nextPos);

          // Orientation: Up = Surface Normal (Outwards)
          const up = nextPos.clone().normalize();
          santaRef.current.up.copy(up);
          santaRef.current.lookAt(worldTarget);
        }

        santaWorldPosition.current.copy(santaRef.current.position);

      } else if (flightState === 'arrived' && targetPosition.current && earthRef.current) {
        // 4. Stuck to Country Logic (Hovering)
        const localTarget = targetPosition.current.clone();
        const worldTarget = localTarget.applyMatrix4(earthRef.current.matrixWorld);

        // Add hover offset
        const arrivalNormal = worldTarget.clone().normalize();
        const hoverPos = worldTarget.clone().add(arrivalNormal.multiplyScalar(0.2)); // Keep hovering

        santaRef.current.position.copy(hoverPos);

        // Orientation
        const up = hoverPos.clone().normalize();
        santaRef.current.up.copy(up);
        // Look tangent: Create a tangent vector by cross product with arbitrary axis (e.g., Y), then cross again?
        // Or simpler: Look at a point slightly "East" or "North" relative to the surface.
        // Let's make him look "up" relative to the map (North).
        // Tangent = Up cross Right.
        // Let's just look at the camera? No.
        // Let's just look "forward" relative to his flight path? We don't have flight path anymore.
        // Let's look at (0,1,0) world? No.
        // Let's just look at a fixed offset from position?
        // Let's look at a point slightly offset in latitude.
        const lookTarget = hoverPos.clone().add(new THREE.Vector3(0, 1, 0));
        santaRef.current.lookAt(lookTarget);
      }
    }
  });

  return (
    <group>
      {/* Earth Sphere - Rotating on its own */}
      <mesh ref={earthRef} rotation={[0, 0, 23.5 * Math.PI / 180]} scale={[2.5, 2.5, 2.5]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          map={colorMap}
          roughness={1}
          metalness={0}
          clearcoat={0.1}
          clearcoatRoughness={0.4}
        />
        <RegionHighlighter geoJson={turkeyData} status="pending" altitude={1.01} onClick={handleCountryClick} />
        <RegionHighlighter geoJson={australiaData} status="pending" altitude={1.01} onClick={handleCountryClick} />
        <RegionHighlighter geoJson={canadaData} status="pending" altitude={1.03} onClick={handleCountryClick} />
      </mesh>

      {/* Atmosphere Glow - Keep with Earth */}
      {/* We need to apply same rotation/scale or make it child of a group? 
          Previously it was sibling of Earth mesh but shared scale logic manually. 
          Let's wrap Earth+Atmos in a group if we want them to rotate together, OR just keep rotating Earth Mesh
          and let Atmos be static? Actually atmosphere usually rotates with planet? 
          Let's keep previous logic: Mesh was rotating. Atmosphere was separate mesh.
          I will restore Atmosphere as sibling of Earth Mesh, scaled up.
      */}
      <mesh scale={[2.55, 2.55, 2.55]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          uniforms={{
            c: { value: 0.1 },
            p: { value: 3.0 },
            glowColor: { value: new THREE.Color(0x93c5fd) },
            viewVector: { value: new THREE.Vector3(0, 0, 6) }
          }}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vPositionWorld;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPositionWorld = (modelMatrix * vec4(position, 1.0)).xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 glowColor;
            uniform vec3 viewVector; // Camera position
            uniform float c;
            uniform float p;
            varying vec3 vNormal;
            varying vec3 vPositionWorld;
            void main() {
              vec3 viewDirection = normalize(viewVector - vPositionWorld);
              float intensity = pow(c - dot(vNormal, viewDirection), p);
              gl_FragColor = vec4(glowColor, intensity);
            }
          `}
        />
      </mesh>

      {/* Santa - Now Independent Sibling to move freely */}
      <Santa
        ref={santaRef}
        scale={[0.25, 0.25, 0.25]}
        mode={flightState}
      // Position set in useFrame
      />





      {/* Glitter Trail */}
      {/* We render it here. It needs to read santaWorldPosition.current every frame. 
          But React won't re-render Glitter just because ref changed.
          However, Glitter's useFrame READS the ref. So we need to pass the REF itself.
      */}
      <Glitter targetWrapper={santaWorldPosition} />
    </group >
  );
};

export default Earth;
