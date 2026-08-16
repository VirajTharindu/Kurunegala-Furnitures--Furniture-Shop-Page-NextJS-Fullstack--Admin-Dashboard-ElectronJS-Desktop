"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface SceneProps {
    children: React.ReactNode;
    cameraPosition?: [number, number, number];
    enableControls?: boolean;
    shadowPosition?: [number, number, number];
    showEnvironment?: boolean;
}

export default function Scene({
    children,
    cameraPosition = [5, 2, 5],
    enableControls = true,
    shadowPosition = [0, -0.8, 0],
    showEnvironment = true
}: SceneProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isDark = theme === "dark";

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
                        enableZoom={false}
                        minDistance={3}
                        maxDistance={15}
                        autoRotate={false}
                        enableDamping={true}
                        dampingFactor={0.05}
                    />
                )}

                <ambientLight intensity={isDark ? 0.5 : 0.4} />
                <spotLight
                    position={[5, 4, 5]}
                    angle={0.25}
                    penumbra={1}
                    intensity={isDark ? 1.5 : 1.2}
                    castShadow
                />
                <directionalLight
                    position={[-2, 5, 2]}
                    intensity={isDark ? 0.8 : 0.6}
                    castShadow
                />

                {children}

                {mounted && (
                    <ContactShadows
                        position={shadowPosition}
                        opacity={isDark ? 0.4 : 0.15}
                        scale={10}
                        blur={2.5}
                        far={4}
                        color={isDark ? "#000000" : "#2d2a25"}
                    />
                )}
                {showEnvironment && <Environment preset="city" />}
            </Suspense>
        </Canvas>
    );
}
