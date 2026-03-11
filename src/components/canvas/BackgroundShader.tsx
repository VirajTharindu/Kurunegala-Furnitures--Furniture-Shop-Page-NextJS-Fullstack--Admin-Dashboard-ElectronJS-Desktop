"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= uResolution.x / max(uResolution.y, 0.0001);

    float d = length(p);
    float color = 0.0;

    for(int i = 0; i < 2; i++) {
      float t = uTime * (0.3 + float(i) * 0.1);
      float denom = abs(sin(d * 8.0 + t)) * abs(1.2 - d) + 0.001;
      color += 0.05 / denom;
    }

    vec3 finalColor = vec3(0.95, 0.96, 0.98); // Very light luxury grey/white
    finalColor = mix(finalColor, vec3(color * 0.05 + 0.9), 0.1);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function BackgroundShader() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) }
  }), [size]);

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}
