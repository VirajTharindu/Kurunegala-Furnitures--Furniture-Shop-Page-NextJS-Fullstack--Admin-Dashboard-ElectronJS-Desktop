"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { useConfigurator } from "@/hooks/useConfigurator";
import { useEffect, useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ProductModelProps {
    url: string;
    scale?: number;
    position?: [number, number, number]
    float?: boolean;
}

// Note: Do not preload here with a hardcoded path. Pass the `url` prop at call sites.

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
    const { processedScene, autoScale, centerOffset } = useMemo(() => {
        if (!gltf?.scene) return { processedScene: null, autoScale: 1, centerOffset: new THREE.Vector3() };

        // Clone to avoid clobbering the cache
        const scene = gltf.scene.clone();

        // 1. Process Materials
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                const oldMat = child.material as THREE.MeshStandardMaterial;
                const matName = (oldMat.name || "").toLowerCase();

                const isCustomizable = matName.includes("fabric") ||
                    matName.includes("surface") ||
                    matName.includes("seat");

                const isLegs = matName.includes("legs") || matName.includes("frame");

                if (isCustomizable) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: new THREE.Color(color),
                        map: oldMat.map,
                        roughness: material === "fabric" ? 0.9 : 0.4,
                        metalness: material === "leather" ? 0.3 : 0.05,
                        name: oldMat.name
                    });
                } else if (isLegs) {
                    child.material = new THREE.MeshPhongMaterial({
                        color: oldMat.color.clone(),
                        map: oldMat.map,
                        shininess: 90,
                        specular: new THREE.Color(0x666666),
                        name: oldMat.name
                    });
                }
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // 2. Compute Bounding Box to auto-normalize scale and centering
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // Find the largest dimension to normalize to a 1-unit bounding box
        const maxDim = Math.max(size.x, size.y, size.z);
        // We multiply by 2 because 1 unit maxDim usually feels a bit small
        const calculatedAutoScale = 2 / maxDim;

        return { processedScene: scene, autoScale: calculatedAutoScale, centerOffset: center };
    }, [gltf, color, material]);

    // Default dimension values (midpoints of the slider ranges)
    const DEFAULT_WIDTH = 240;
    const DEFAULT_HEIGHT = 85;
    const DEFAULT_DEPTH = 100;

    // Final scale: normalised auto-scale × prop scale × dimension ratio per axis
    const dynamicScale = useMemo(() => {
        const base = autoScale * scale;
        return [
            base * (width / DEFAULT_WIDTH),
            base * (height / DEFAULT_HEIGHT),
            base * (depth / DEFAULT_DEPTH),
        ] as [number, number, number];
    }, [autoScale, scale, width, height, depth]);

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
        <group position={position}>
            {/* Center the model relative to its bounding box center */}
            <primitive
                ref={modelRef}
                object={processedScene}
                scale={dynamicScale}
                position={[-centerOffset.x * autoScale * scale, -centerOffset.y * autoScale * scale, -centerOffset.z * autoScale * scale]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            />
        </group>
    );
}

// Pre-load default assets
// useGLTF.preload("/models/sofa.glb");
