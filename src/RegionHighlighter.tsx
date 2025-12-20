import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RegionHighlighterProps {
    geoJson: any;
    status?: 'pending' | 'completed'; // Replaces color
    borderColor?: string;
    altitude?: number; // Control height to prevent Z-clipping
    onClick?: (point: THREE.Vector3) => void;
}

const RegionHighlighter: React.FC<RegionHighlighterProps> = ({
    geoJson,
    status = 'pending',
    borderColor = 'white',
    altitude = 1.01,
    onClick
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const blinkSpeed = 5; // Use fast blink for both states as implied by "yanıp sönsün" description? 
    // Or maybe the user meant "blink red" vs "solid green"? 
    // "yeşil yanıp sönsünler" -> Green BLINKING. So both blink.

    // Determine color based on status
    const baseColor = status === 'completed' ? '#22c55e' : '#990000'; // Green vs Blood Red

    // Parse GeoJSON and create Geometry
    const { geometry, lineGeometries } = useMemo(() => {
        const features = geoJson.features;
        const shapes: THREE.Shape[] = [];
        const lineGeos: THREE.BufferGeometry[] = [];

        // Use prop for radius
        const r = altitude;

        // Helper to Convert Lat/Lon to Sphere on Y-up
        const convertToSphere = (lon: number, lat: number) => {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 90) * (Math.PI / 180);

            const x = r * Math.sin(phi) * Math.sin(theta);
            const y = r * Math.cos(phi);
            const z = r * Math.sin(phi) * Math.cos(theta);
            return new THREE.Vector3(x, y, z);
        };

        if (!features) return { geometry: new THREE.BufferGeometry(), lineGeometries: [] };

        features.forEach((feature: any) => {
            // Handle Polygon and MultiPolygon
            const polygons = [];
            if (feature.geometry.type === 'Polygon') {
                polygons.push(feature.geometry.coordinates);
            } else if (feature.geometry.type === 'MultiPolygon') {
                polygons.push(...feature.geometry.coordinates);
            }

            polygons.forEach((polygon) => {
                const coordinates = polygon[0];
                const shape = new THREE.Shape();
                const loopPoints: THREE.Vector3[] = [];

                coordinates.forEach(([lon, lat]: [number, number], index: number) => {
                    if (index === 0) {
                        shape.moveTo(lon, lat);
                    } else {
                        shape.lineTo(lon, lat);
                    }
                    loopPoints.push(convertToSphere(lon, lat));
                });
                shapes.push(shape);

                const loopGeo = new THREE.BufferGeometry().setFromPoints(loopPoints);
                lineGeos.push(loopGeo);
            });
        });

        let geo = new THREE.ShapeGeometry(shapes);

        // TESSELLATION Logic (Simplified for brevity in replacement, but keeping original logic conceptually is better)
        // I will copy the tessellation logic exactly to avoid regression.

        geo = geo.toNonIndexed() as THREE.ShapeGeometry;
        const subdivisionPasses = 3;

        for (let pass = 0; pass < subdivisionPasses; pass++) {
            const positions = geo.attributes.position.array;
            const newPositions: number[] = [];

            for (let i = 0; i < positions.length; i += 9) {
                const ax = positions[i], ay = positions[i + 1], az = positions[i + 2];
                const bx = positions[i + 3], by = positions[i + 4], bz = positions[i + 5];
                const cx = positions[i + 6], cy = positions[i + 7], cz = positions[i + 8];

                const d1 = (ax - bx) ** 2 + (ay - by) ** 2;
                const d2 = (bx - cx) ** 2 + (by - cy) ** 2;
                const d3 = (cx - ax) ** 2 + (cy - ay) ** 2;
                const threshold = 16;

                if (d1 > threshold || d2 > threshold || d3 > threshold) {
                    const abx = (ax + bx) / 2, aby = (ay + by) / 2, abz = (az + bz) / 2;
                    const bcx = (bx + cx) / 2, bcy = (by + cy) / 2, bcz = (bz + cz) / 2;
                    const cax = (cx + ax) / 2, cay = (cy + ay) / 2, caz = (cz + az) / 2;

                    newPositions.push(ax, ay, az, abx, aby, abz, cax, cay, caz);
                    newPositions.push(abx, aby, abz, bx, by, bz, bcx, bcy, bcz);
                    newPositions.push(bcx, bcy, bcz, cx, cy, cz, cax, cay, caz);
                    newPositions.push(abx, aby, abz, bcx, bcy, bcz, cax, cay, caz);
                } else {
                    newPositions.push(ax, ay, az, bx, by, bz, cx, cy, cz);
                }
            }
            geo.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        }

        const positionAttribute = geo.attributes.position;
        for (let i = 0; i < positionAttribute.count; i++) {
            const lon = positionAttribute.getX(i);
            const lat = positionAttribute.getY(i);
            const spherePos = convertToSphere(lon, lat);
            positionAttribute.setXYZ(i, spherePos.x, spherePos.y, spherePos.z);
        }

        geo.computeVertexNormals();

        return { geometry: geo, lineGeometries: lineGeos };
    }, [geoJson, altitude]);

    const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({
        color: borderColor,
        transparent: true,
        linewidth: 2
    }), [borderColor]);

    const [hovered, setHovered] = React.useState(false);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();

        let opacity;
        if (hovered) {
            opacity = 0.8;
        } else {
            // Blink Effect
            opacity = (Math.sin(time * blinkSpeed) + 1) / 2 * 0.5 + 0.2;
        }

        if (meshRef.current) {
            const material = meshRef.current.material as THREE.MeshBasicMaterial;
            material.opacity = opacity;
            material.color.set(baseColor); // Update color dynamically based on status
        }

        lineMaterial.opacity = opacity + 0.3;
        lineMaterial.color.set(hovered ? 'white' : (borderColor || 'white'));
    });

    const handleClick = (e: any) => {
        e.stopPropagation();
        if (onClick && geometry.boundingSphere) {
            onClick(geometry.boundingSphere.center);
        }
    };

    return (
        <group>
            {/* Filled Mesh */}
            <mesh
                ref={meshRef}
                geometry={geometry}
                onClick={handleClick}
                onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
            >
                <meshBasicMaterial
                    color={baseColor}
                    side={THREE.DoubleSide}
                    transparent
                    polygonOffset
                    polygonOffsetFactor={-1}
                    depthWrite={false}
                />
            </mesh>
            {/* Border Loops */}
            {lineGeometries.map((geo, index) => (
                <lineLoop key={index} geometry={geo} material={lineMaterial} />
            ))}
        </group>
    );
};

export default RegionHighlighter;
