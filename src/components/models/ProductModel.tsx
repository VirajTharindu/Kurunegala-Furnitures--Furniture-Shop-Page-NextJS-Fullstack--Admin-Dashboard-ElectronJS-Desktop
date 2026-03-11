"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { useConfigurator } from "@/hooks/useConfigurator";
import { useEffect, useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ProductModelProps {
    url: string;
    scale?: number;
    position?: [number, number, number];
    float?: boolean;
}

export default function ProductModel({
    url,
    scale = 1,
    position = [0, 0, 0],
    float = false
}: ProductModelProps) {
    const [error, setError] = useState(false);

    // Attempt to load GLTF
    const gltf = useGLTF(url);

    const { color, material, width, height, depth } = useConfigurator();
    const [hovered, setHovered] = useState(false);
    const modelRef = useRef<THREE.Group>(null);

    // Process scene SYNCHRONOUSLY before render
    const processedScene = useMemo(() => {
        if (!gltf?.scene) return null;

        // Clone to avoid clobbering the cache
        const scene = gltf.scene.clone();

        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                const oldMat = child.material as THREE.MeshStandardMaterial;
                const matName = (oldMat.name || "").toLowerCase();

                const isCustomizable = matName.includes("fabric") ||
                    matName.includes("surface") ||
                    matName.includes("seat");

                const isLegs = matName.includes("legs") || matName.includes("frame");

                let newMat: THREE.Material;

                if (isCustomizable) {
                    // Reconstruct Standard material to strip broken extensions
                    newMat = new THREE.MeshStandardMaterial({
                        color: new THREE.Color(color),
                        map: oldMat.map,
                        roughness: material === "fabric" ? 0.9 : 0.4,
                        metalness: material === "leather" ? 0.3 : 0.05,
                        name: oldMat.name
                    });
                } else if (isLegs) {
                    // Use Phong for legs - highly stable, metallic-looking specular
                    newMat = new THREE.MeshPhongMaterial({
                        color: oldMat.color.clone(),
                        map: oldMat.map,
                        shininess: 90,
                        specular: new THREE.Color(0x666666),
                        name: oldMat.name
                    });
                } else {
                    // Fallback to basic Standard for other parts
                    newMat = new THREE.MeshStandardMaterial({
                        color: oldMat.color.clone(),
                        map: oldMat.map,
                        roughness: 0.5,
                        metalness: 0.2,
                        name: oldMat.name
                    });
                }

                child.material = newMat;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        return scene;
    }, [gltf, color, material]);

    // Update dynamic scale based on dimensions
    const dynamicScale = useMemo(() => [
        (width / 240) * scale,
        (height / 85) * scale,
        (depth / 100) * scale
    ] as [number, number, number], [width, height, depth, scale]);

    useEffect(() => {
        document.body.style.cursor = hovered ? "pointer" : "auto";
    }, [hovered]);

    useFrame((state) => {
        if (float && modelRef.current) {
            modelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
            modelRef.current.rotation.y += 0.005;
        }
    });

    if (error) {
        return (
            <group position={position} scale={scale}>
                <mesh>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color={color} wireframe />
                </mesh>
            </group>
        );
    }

    if (!processedScene) return null;

    return (
        <primitive
            ref={modelRef}
            object={processedScene}
            scale={dynamicScale}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        />
    );
}

// Pre-load default assets
// useGLTF.preload("/models/sofa.glb");
