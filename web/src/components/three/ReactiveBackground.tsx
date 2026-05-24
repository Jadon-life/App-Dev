"use client";

/**
 * ReactiveBackground — A full-screen WebGL canvas that reacts to mouse movement.
 * Uses Three.js with a custom shader for a morphing gradient mesh that follows
 * the cursor, creating a living, breathing background.
 * 
 * Integration with GSAP ScrollTrigger:
 * The scroll position is mapped to the shader's time uniform, creating
 * scroll-driven color shifts in the background gradient.
 */

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "@/components/theme/ThemeContext";

// Custom shader for reactive gradient mesh
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Displacement based on mouse and time
    float dist = distance(uv, uMouse);
    float wave = sin(pos.x * 3.0 + uTime) * 0.15;
    float mouseWave = exp(-dist * 4.0) * 0.3;
    
    pos.z += wave + mouseWave;
    vElevation = pos.z;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShaderDark = `
  uniform float uTime;
  uniform float uScroll;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    // Deep blue to purple gradient that shifts with scroll
    vec3 deepBlue = vec3(0.02, 0.01, 0.08);
    vec3 purple = vec3(0.18, 0.04, 0.35);
    vec3 indigo = vec3(0.05, 0.02, 0.2);
    
    float scrollMix = uScroll * 0.5;
    vec3 color1 = mix(deepBlue, indigo, scrollMix);
    vec3 color2 = mix(purple, deepBlue, scrollMix);
    
    vec3 color = mix(color1, color2, vUv.y + sin(uTime * 0.3) * 0.1);
    
    // Add glow where elevation is high (mouse hover area)
    color += vec3(0.3, 0.1, 0.5) * max(vElevation * 2.0, 0.0);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const fragmentShaderLight = `
  uniform float uTime;
  uniform float uScroll;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    // Light mode: soft lavender to indigo wash
    vec3 lavender = vec3(0.95, 0.93, 1.0);
    vec3 softIndigo = vec3(0.85, 0.82, 0.98);
    vec3 paleBlue = vec3(0.9, 0.92, 1.0);
    
    float scrollMix = uScroll * 0.3;
    vec3 color1 = mix(lavender, paleBlue, scrollMix);
    vec3 color2 = mix(softIndigo, lavender, scrollMix);
    
    vec3 color = mix(color1, color2, vUv.y + sin(uTime * 0.3) * 0.05);
    
    // Subtle glow on hover
    color += vec3(0.05, 0.02, 0.1) * max(vElevation * 1.5, 0.0);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function BackgroundMesh({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const scrollRef = useRef(0);
  const { viewport } = useThree();

  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: isDark ? fragmentShaderDark : fragmentShaderLight,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uScroll: { value: 0 },
      },
    });
  }, [isDark]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
    };
    const handleScroll = () => {
      scrollRef.current = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Animation loop — syncs GSAP/scroll state with Three.js render loop
  useFrame((state) => {
    if (material.uniforms) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
      // Smooth lerp mouse position for fluid following
      material.uniforms.uMouse.value.lerp(mouseRef.current, 0.05);
      material.uniforms.uScroll.value += (scrollRef.current - material.uniforms.uScroll.value) * 0.03;
    }
  });

  return (
    <mesh ref={meshRef} material={material} scale={[viewport.width * 1.2, viewport.height * 1.2, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
    </mesh>
  );
}

export default function ReactiveBackground() {
  const { isDark } = useTheme();

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1.5], fov: 45 }}
        gl={{ alpha: false, antialias: false }}
        dpr={[1, 1.5]} // Cap pixel ratio for performance
      >
        <BackgroundMesh isDark={isDark} />
      </Canvas>
    </div>
  );
}
