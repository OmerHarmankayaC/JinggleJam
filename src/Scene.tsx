import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Earth from './Earth';
import Snow from './Snow';

interface SceneProps {
    onSuccess?: () => void;
}

const Scene: React.FC<SceneProps> = ({ onSuccess }) => {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <Suspense fallback={null}>
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={2.5} />
                <directionalLight position={[-5, 5, 5]} intensity={1.5} />
                <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade speed={1} />
                <Earth onSuccess={onSuccess} />
                <Snow />
                <OrbitControls
                    enablePan={false}
                    minDistance={3}
                    maxDistance={10}
                    enableZoom={true}
                />
            </Suspense>
        </Canvas>
    );
};

export default Scene;
