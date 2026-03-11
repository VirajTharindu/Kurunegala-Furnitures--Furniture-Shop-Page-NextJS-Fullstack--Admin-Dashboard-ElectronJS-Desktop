"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";

interface SceneProps {
    children: React.ReactNode;
    cameraPosition?: [number, number, number];
    enableControls?: boolean;
}

export default function Scene({
    children,
    cameraPosition = [5, 2, 5],
    enableControls = true
}: SceneProps) {
    return (
        <Canvas
            shadows
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
            className="w-full h-full"
        >
            <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={cameraPosition} fov={35} />

                {enableControls && (
                    <OrbitControls
                        enablePan={false}
                        minDistance={3}
                        maxDistance={15}
                        autoRotate={false}
                        enableDamping={true}
                        dampingFactor={0.05}
                    />
                )}

                <ambientLight intensity={0.5} />
                <spotLight
                    position={[5, 4, 5]}
                    angle={0.25}
                    penumbra={1}
                    intensity={1.5}
                    castShadow
                />
                <directionalLight
                    position={[-2, 5, 2]}
                    intensity={0.8}
                    castShadow
                />

                {children}

                <ContactShadows
                    position={[0, -1, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2.5}
                    far={4}
                />
                <Environment preset="city" />
            </Suspense>
        </Canvas>
    );
}
