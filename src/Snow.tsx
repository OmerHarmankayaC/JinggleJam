import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Snow: React.FC = () => {
    const count = 2000;
    const meshRef = useRef<THREE.Points>(null);

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Spread particles across a wide area centered at (0,0,0)
            positions[i * 3] = (Math.random() - 0.5) * 50; // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
        }
        return positions;
    }, [count]);

    useFrame((state, delta) => {
        if (meshRef.current) {
            const positions = meshRef.current.geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < count; i++) {
                // Move down
                positions[i * 3 + 1] -= delta * 2; // Speed

                // Reset if too low
                if (positions[i * 3 + 1] < -25) {
                    positions[i * 3 + 1] = 25;
                }
            }
            meshRef.current.geometry.attributes.position.needsUpdate = true;

            // Rotate the whole system slightly for wind effect
            meshRef.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particlesPosition.length / 3}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.2}
                color="#ffffff"
                transparent
                opacity={0.8}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
};

export default Snow;
