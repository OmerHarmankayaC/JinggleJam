import React, { forwardRef } from 'react';
import type { ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

type SantaProps = ThreeElements['group'] & {
    mode?: 'orbiting' | 'flying' | 'arrived';
};

const Santa = forwardRef<THREE.Group, SantaProps>(({ mode = 'orbiting', ...props }, ref) => {
    // "Rotate 90 degrees forward" relative to previous -90 means returning to 0.
    // User wants:
    // Orbiting/Flying: [0, 0, 0] (Forward relative to previous)
    // Arrived: [-Math.PI / 2, 0, 0] (Keep previous)

    // We treat 'flying' same as 'orbiting' for orientation transition? 
    // Or maybe flying needs to interpolate? User just said "while flying normally" (orbiting?).
    // Let's stick to simple switch first.

    const rotation: [number, number, number] = (mode === 'arrived')
        ? [-Math.PI / 2, 0, 0]
        : [0, 0, 0];

    return (
        <group ref={ref} {...props}>
            <group rotation={rotation}>
                {/* --- SLEIGH --- */}
                <group>
                    {/* Runners */}
                    <mesh position={[0.35, 0.05, 0]}>
                        <boxGeometry args={[0.05, 0.05, 1.8]} />
                        <meshStandardMaterial color="#C0C0C0" metalness={0.6} roughness={0.2} />
                    </mesh>
                    <mesh position={[-0.35, 0.05, 0]}>
                        <boxGeometry args={[0.05, 0.05, 1.8]} />
                        <meshStandardMaterial color="#C0C0C0" metalness={0.6} roughness={0.2} />
                    </mesh>

                    {/* Sleigh Body */}
                    <mesh position={[0, 0.4, -0.2]}>
                        <boxGeometry args={[0.8, 0.4, 1.0]} />
                        <meshStandardMaterial color="#8B0000" /> {/* Dark Red */}
                    </mesh>
                    <mesh position={[0, 0.7, -0.6]} rotation={[-0.2, 0, 0]}>
                        <boxGeometry args={[0.78, 0.4, 0.1]} /> {/* Back rest */}
                        <meshStandardMaterial color="#8B0000" />
                    </mesh>
                    {/* Gold Trim */}
                    <mesh position={[0, 0.4, 0.31]}>
                        <boxGeometry args={[0.82, 0.1, 0.05]} />
                        <meshStandardMaterial color="#FFD700" metalness={0.5} roughness={0.3} />
                    </mesh>
                </group>

                {/* --- SANTA --- */}
                <group position={[0, 0.5, -0.2]}>
                    {/* Legs */}
                    <mesh position={[-0.15, 0.1, 0.2]} rotation={[-0.2, 0, 0]}>
                        <boxGeometry args={[0.12, 0.3, 0.3]} />
                        <meshStandardMaterial color="#D90000" />
                    </mesh>
                    <mesh position={[0.15, 0.1, 0.2]} rotation={[-0.2, 0, 0]}>
                        <boxGeometry args={[0.12, 0.3, 0.3]} />
                        <meshStandardMaterial color="#D90000" />
                    </mesh>

                    {/* Boots */}
                    <mesh position={[-0.15, -0.05, 0.4]}>
                        <boxGeometry args={[0.13, 0.15, 0.2]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                    <mesh position={[0.15, -0.05, 0.4]}>
                        <boxGeometry args={[0.13, 0.15, 0.2]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>

                    {/* Torso */}
                    <mesh position={[0, 0.5, 0]}>
                        <sphereGeometry args={[0.32, 32, 32]} />
                        <meshStandardMaterial color="#D90000" />
                    </mesh>
                    {/* Belt */}
                    <mesh position={[0, 0.4, 0.28]} scale={[1.05, 0.2, 0.5]}>
                        <sphereGeometry args={[0.32, 32, 32]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                    {/* Head */}
                    <mesh position={[0, 0.9, 0]}>
                        <sphereGeometry args={[0.18, 32, 32]} />
                        <meshStandardMaterial color="#FFD1DC" />
                    </mesh>
                    {/* Beard */}
                    <mesh position={[0, 0.85, 0.12]}>
                        <sphereGeometry args={[0.12, 32, 20]} />
                        <meshStandardMaterial color="#EEE" />
                    </mesh>
                    {/* Hat */}
                    <mesh position={[0, 1.05, 0]}>
                        <coneGeometry args={[0.18, 0.4, 32]} />
                        <meshStandardMaterial color="#D90000" />
                    </mesh>
                    <mesh position={[0, 1.25, 0]}>
                        <sphereGeometry args={[0.06, 16, 16]} />
                        <meshStandardMaterial color="#FFF" />
                    </mesh>

                    {/* --- TOY BAG --- */}
                    <mesh position={[0, 0.6, -0.6]} rotation={[0.2, 0, 0]}>
                        <dodecahedronGeometry args={[0.45]} />
                        <meshStandardMaterial color="#5C4033" roughness={1} />
                    </mesh>
                </group>

                {/* --- REINDEER GROUP --- */}
                {/* Just one pair for clarity and performance */}
                <group position={[0, 0.1, 1.8]}>
                    {/* Reindeer LEFT */}
                    <group position={[-0.4, 0, 0]}>
                        {/* Body */}
                        <mesh position={[0, 0.3, 0]}>
                            <boxGeometry args={[0.2, 0.3, 0.6]} />
                            <meshStandardMaterial color="#8B4513" />
                        </mesh>
                        {/* Legs */}
                        <mesh position={[-0.08, 0.05, 0.2]}> <boxGeometry args={[0.05, 0.25, 0.05]} /> <meshStandardMaterial color="#5A3008" /> </mesh>
                        <mesh position={[0.08, 0.05, 0.2]}>  <boxGeometry args={[0.05, 0.25, 0.05]} /> <meshStandardMaterial color="#5A3008" /> </mesh>
                        <mesh position={[-0.08, 0.05, -0.2]}> <boxGeometry args={[0.05, 0.25, 0.05]} /> <meshStandardMaterial color="#5A3008" /> </mesh>
                        <mesh position={[0.08, 0.05, -0.2]}>  <boxGeometry args={[0.05, 0.25, 0.05]} /> <meshStandardMaterial color="#5A3008" /> </mesh>

                        {/* Neck & Head */}
                        <mesh position={[0, 0.5, 0.3]} rotation={[-0.3, 0, 0]}>
                            <boxGeometry args={[0.12, 0.3, 0.15]} />
                            <meshStandardMaterial color="#8B4513" />
                        </mesh>
                        <mesh position={[0, 0.7, 0.45]}>
                            <boxGeometry args={[0.15, 0.15, 0.25]} />
                            <meshStandardMaterial color="#8B4513" />
                        </mesh>
                        {/* Antlers */}
                        <mesh position={[0.1, 0.85, 0.4]}> <cylinderGeometry args={[0.01, 0.01, 0.2]} /> <meshStandardMaterial color="#D2B48C" /> </mesh>
                        <mesh position={[-0.1, 0.85, 0.4]}> <cylinderGeometry args={[0.01, 0.01, 0.2]} /> <meshStandardMaterial color="#D2B48C" /> </mesh>
                        {/* Red Nose for one of them? */}
                    </group>

                    {/* Reindeer RIGHT (Rudolph) */}
                    <group position={[0.4, 0, 0]}>
                        {/* Body */}
                        <mesh position={[0, 0.3, 0]}>
                            <boxGeometry args={[0.2, 0.3, 0.6]} />
                            <meshStandardMaterial color="#8B4513" />
                        </mesh>
                        {/* Legs */}
                        <mesh position={[-0.08, 0.05, 0.2]}> <boxGeometry args={[0.05, 0.25, 0.05]} /> <meshStandardMaterial color="#5A3008" /> </mesh>
                        <mesh position={[0.08, 0.05, 0.2]}>  <boxGeometry args={[0.05, 0.25, 0.05]} /> <meshStandardMaterial color="#5A3008" /> </mesh>
                        <mesh position={[-0.08, 0.05, -0.2]}> <boxGeometry args={[0.05, 0.25, 0.05]} /> <meshStandardMaterial color="#5A3008" /> </mesh>
                        <mesh position={[0.08, 0.05, -0.2]}>  <boxGeometry args={[0.05, 0.25, 0.05]} /> <meshStandardMaterial color="#5A3008" /> </mesh>

                        {/* Neck & Head */}
                        <mesh position={[0, 0.5, 0.3]} rotation={[-0.3, 0, 0]}>
                            <boxGeometry args={[0.12, 0.3, 0.15]} />
                            <meshStandardMaterial color="#8B4513" />
                        </mesh>
                        <mesh position={[0, 0.7, 0.45]}>
                            <boxGeometry args={[0.15, 0.15, 0.25]} />
                            <meshStandardMaterial color="#8B4513" />
                        </mesh>
                        {/* Antlers */}
                        <mesh position={[0.1, 0.85, 0.4]}> <cylinderGeometry args={[0.01, 0.01, 0.2]} /> <meshStandardMaterial color="#D2B48C" /> </mesh>
                        <mesh position={[-0.1, 0.85, 0.4]}> <cylinderGeometry args={[0.01, 0.01, 0.2]} /> <meshStandardMaterial color="#D2B48C" /> </mesh>
                        {/* Nose */}
                        <mesh position={[0, 0.72, 0.6]}> <sphereGeometry args={[0.03]} /> <meshStandardMaterial color="red" emissive="red" emissiveIntensity={0.5} /> </mesh>
                    </group>

                    {/* Harness */}
                    <mesh position={[0, 0.4, -0.5]}>
                        <boxGeometry args={[0.8, 0.02, 1.2]} />
                        <meshStandardMaterial color="#333" />
                    </mesh>
                </group>
            </group>
        </group>
    );
});

export default Santa;
