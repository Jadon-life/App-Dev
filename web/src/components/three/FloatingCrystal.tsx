"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function Crystal() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={2.2}>
        <octahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color="#7C3AED"
          roughness={0.1}
          metalness={0.8}
          distort={0.2}
          speed={2}
          envMapIntensity={1}
        />
      </mesh>
      {/* Inner glow */}
      <mesh scale={1.8}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.15} wireframe />
      </mesh>
      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={3}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.4} />
      </mesh>
    </Float>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color="#A855F7"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function FloatingCrystal() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#7C3AED" />
        <directionalLight position={[-5, -5, 5]} intensity={0.5} color="#3B82F6" />
        <Crystal />
        <Particles />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
