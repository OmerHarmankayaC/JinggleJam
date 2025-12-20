import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GlitterProps {
    targetWrapper: React.MutableRefObject<THREE.Vector3>;
}

const Glitter: React.FC<GlitterProps> = ({ targetWrapper }) => {
    const count = 300; // Number of particles in the trail
    const meshRef = useRef<THREE.Points>(null);

    // Store particle data: (x, y, z) position, (life) age
    // We use a circular buffer effectively, or just update varying based on index
    const particlesData = useMemo(() => {
        return {
            positions: new Float32Array(count * 3),
            ages: new Float32Array(count), // 0.0 to 1.0 (1.0 = dead)
        };
    }, [count]);

    const currentParticleIndex = useRef(0);

    useFrame((_, delta) => {
        if (!meshRef.current) return;

        // 1. Spawn new particles at target position
        // Spawn rate: somewhat dependent on delta, but let's just spawn a few per frame
        const spawnCount = 2;

        for (let s = 0; s < spawnCount; s++) {
            const idx = currentParticleIndex.current;

            // Random offset for "sparkle" width
            const offset = new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05
            );

            const pos = targetWrapper.current.clone().add(offset);

            particlesData.positions[idx * 3] = pos.x;
            particlesData.positions[idx * 3 + 1] = pos.y;
            particlesData.positions[idx * 3 + 2] = pos.z;
            particlesData.ages[idx] = 0; // Fresh particle

            currentParticleIndex.current = (currentParticleIndex.current + 1) % count;
        }

        // 2. Update all particles
        for (let i = 0; i < count; i++) {
            // Age the particle
            particlesData.ages[i] += delta * 1.5; // Fade speed

            if (particlesData.ages[i] >= 1) {
                // "Dead" particles can be hidden or just clamp alpha to 0 (done in shader/material usually, or visually via scale)
                // We'll just hide them by moving them far away or letting alpha handle it
                particlesData.ages[i] = 1;
            }
        }

        // 3. Update Geometry
        meshRef.current.geometry.attributes.position.array.set(particlesData.positions);
        meshRef.current.geometry.attributes.position.needsUpdate = true;

        // We need to pass opacity/age to shader or use vertex colors
        // For simplicity, let's use size attenuation or vertex alpha if possible?
        // Standard PointsMaterial doesn't support per-vertex alpha easily without custom attributes.
        // Let's use a custom buffer attribute 'alpha' and modify the material or use size.

        // Actually, let's use a simple trick: Vertex Colors. 
        // White color with fading alpha? PointsMaterial vertexColors supports RGB, not Alpha usually? 
        // Docs say vertexColors: true uses the color attribute.
        // Let's try to map age to color brightness (fade to black) which looks like fading in additive blending.
        const colors = meshRef.current.geometry.attributes.color.array as Float32Array;
        for (let i = 0; i < count; i++) {
            const life = 1 - particlesData.ages[i];
            const brightness = Math.max(0, life);
            // Gold/Yellow glitter: 1.0, 0.8, 0.0
            colors[i * 3] = brightness * 1.0;     // R
            colors[i * 3 + 1] = brightness * 0.84; // G
            colors[i * 3 + 2] = brightness * 0.0;  // B
        }
        meshRef.current.geometry.attributes.color.needsUpdate = true;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particlesData.positions}
                    itemSize={3}
                    usage={THREE.DynamicDrawUsage}
                    args={[particlesData.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={new Float32Array(count * 3)}
                    itemSize={3}
                    usage={THREE.DynamicDrawUsage}
                    args={[new Float32Array(count * 3), 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                vertexColors
                transparent
                // map={...} // Could add a star texture for extra glitter
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                sizeAttenuation
            />
        </points>
    );
};

export default Glitter;
