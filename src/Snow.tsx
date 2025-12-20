import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Snow: React.FC = () => {
    const count = 1500; // Optimal density
    const meshRef = useRef<THREE.Points>(null);

    // Generate a soft circular snowflake texture
    const snowTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        if (context) {
            const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, 32, 32);
        }
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }, []);

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3); // Store individual random velocities

        for (let i = 0; i < count; i++) {
            // Focus heavier snow around the immediate view area (±12)
            positions[i * 3] = (Math.random() - 0.5) * 24; // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 24; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 24; // z

            // Random velocities for drift
            velocities[i * 3] = (Math.random() - 0.5) * 0.5; // x drift speed
            velocities[i * 3 + 1] = Math.random() * 1.0 + 1.0; // y fall speed (1.0 to 2.0)
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5; // z drift speed
        }
        return { positions, velocities };
    }, [count]);

    useFrame((state, delta) => {
        if (meshRef.current) {
            const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
            const time = state.clock.getElapsedTime();

            for (let i = 0; i < count; i++) {
                // Base indices
                const ix = i * 3;
                const iy = i * 3 + 1;
                const iz = i * 3 + 2;

                // Move down
                // Vary speed slightly by time to simulate gusts? Or just constant per particle.
                // Let's use stored velocity
                positions[iy] -= particles.velocities[iy] * delta;

                // Horizontal Drift - Add Sine wave based on time and vertical position (turbulence)
                // We add a small offset to the current position calculation, OR modify the position directly?
                // Modifying directly is cumulative, so be careful. 
                // Better to just add linear drift:
                positions[ix] += particles.velocities[ix] * delta;
                positions[iz] += particles.velocities[iz] * delta;

                // Add "Wiggle"
                positions[ix] += Math.sin(time + positions[iy]) * 0.02;

                // Reset logic - Cylinder/Box wrapping
                if (positions[iy] < -12) {
                    positions[iy] = 12;
                    positions[ix] = (Math.random() - 0.5) * 24;
                    positions[iz] = (Math.random() - 0.5) * 24;
                }
            }
            meshRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                map={snowTexture}
                color="#ffffff"
                transparent
                opacity={0.9}
                alphaTest={0.001} // Helps with blending artifacts
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export default Snow;
