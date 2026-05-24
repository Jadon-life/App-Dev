"use client";

/**
 * ReactiveBackground — Full WebGL background using raw Three.js (not R3F).
 * 
 * WHY RAW THREE.JS:
 * @react-three/fiber creates its own React reconciler which conflicts with
 * Next.js 14's App Router React instance, causing the "Cannot read properties
 * of undefined (reading 'S')" crash. By using Three.js directly inside useEffect,
 * we bypass the reconciler entirely while keeping all WebGL capabilities.
 * 
 * FEATURES:
 * - Custom vertex/fragment shaders for morphing gradient
 * - Reacts to mouse position (smooth lerp following)
 * - Scroll position shifts gradient colors
 * - Theme-aware (dark/light via MutationObserver on <html> class)
 * - Proper cleanup (disposes geometry, material, renderer on unmount)
 * - Handles resize responsively
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    float dist = distance(uv, uMouse);
    float wave = sin(pos.x * 3.0 + uTime) * 0.12;
    float mouseWave = exp(-dist * 5.0) * 0.25;
    
    pos.z += wave + mouseWave;
    vElevation = pos.z;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform float uDark;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    // Dark mode colors
    vec3 darkBase = vec3(0.02, 0.01, 0.08);
    vec3 darkPurple = vec3(0.15, 0.03, 0.3);
    vec3 darkIndigo = vec3(0.04, 0.02, 0.18);
    
    // Light mode colors
    vec3 lightBase = vec3(0.97, 0.96, 1.0);
    vec3 lightPurple = vec3(0.88, 0.85, 0.98);
    vec3 lightIndigo = vec3(0.92, 0.93, 1.0);
    
    // Mix based on theme
    vec3 base = mix(lightBase, darkBase, uDark);
    vec3 purple = mix(lightPurple, darkPurple, uDark);
    vec3 indigo = mix(lightIndigo, darkIndigo, uDark);
    
    float scrollMix = uScroll * 0.4;
    vec3 color1 = mix(base, indigo, scrollMix);
    vec3 color2 = mix(purple, base, scrollMix);
    
    vec3 color = mix(color1, color2, vUv.y + sin(uTime * 0.2) * 0.08);
    
    // Glow at mouse position (where mesh is elevated)
    float glowStrength = mix(0.8, 1.5, uDark);
    color += vec3(0.2, 0.05, 0.35) * max(vElevation * glowStrength, 0.0);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function ReactiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);
  const isDarkRef = useRef(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // ═══ THREE.JS SETUP ═══
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.z = 1.8;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    containerRef.current.appendChild(renderer.domElement);

    // ═══ SHADER MATERIAL ═══
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
      uDark: { value: 1.0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(3.5, 2.5, 64, 64);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ═══ EVENT LISTENERS ═══
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current.x = e.clientX / window.innerWidth;
      targetMouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
    };

    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Theme observer — watches for class changes on <html>
    const themeObserver = new MutationObserver(() => {
      isDarkRef.current = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    isDarkRef.current = document.documentElement.classList.contains("dark");

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // ═══ RENDER LOOP ═══
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      uniforms.uTime.value = clock.getElapsedTime();

      // Smooth lerp mouse (fluid cursor-following)
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.04;
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      // Smooth scroll interpolation
      uniforms.uScroll.value += (scrollRef.current - uniforms.uScroll.value) * 0.03;

      // Smooth theme transition
      const targetDark = isDarkRef.current ? 1.0 : 0.0;
      uniforms.uDark.value += (targetDark - uniforms.uDark.value) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // ═══ CLEANUP — Prevents memory leaks ═══
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      themeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
