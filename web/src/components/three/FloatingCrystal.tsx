"use client";

/**
 * FloatingCrystal — 3D rotating crystal using raw Three.js (not R3F).
 * 
 * Uses imperative Three.js inside useEffect to avoid the React reconciler
 * conflict that crashes with @react-three/fiber + Next.js 14.
 * 
 * Features:
 * - Octahedron crystal with metallic purple material
 * - Wireframe inner glow
 * - Orbiting torus ring
 * - Floating particle field
 * - Smooth rotation + float animation
 * - Full cleanup on unmount
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function FloatingCrystal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ═══ SCENE SETUP ═══
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);

    // ═══ LIGHTING ═══
    const ambientLight = new THREE.AmbientLight(0x7C3AED, 0.3);
    scene.add(ambientLight);
    const dirLight1 = new THREE.DirectionalLight(0x7C3AED, 1);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0x3B82F6, 0.5);
    dirLight2.position.set(-5, -5, 5);
    scene.add(dirLight2);

    // ═══ CRYSTAL (Octahedron) ═══
    const crystalGeometry = new THREE.OctahedronGeometry(1.2, 0);
    const crystalMaterial = new THREE.MeshStandardMaterial({
      color: 0x7C3AED,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x4C1D95,
      emissiveIntensity: 0.2,
    });
    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
    scene.add(crystal);

    // ═══ WIREFRAME INNER GLOW ═══
    const wireGeometry = new THREE.OctahedronGeometry(1.0, 0);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xA855F7,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wireframe);

    // ═══ ORBIT RING ═══
    const ringGeometry = new THREE.TorusGeometry(2, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // Second ring
    const ring2Geometry = new THREE.TorusGeometry(2.5, 0.015, 16, 100);
    const ring2Material = new THREE.MeshBasicMaterial({
      color: 0xA855F7,
      transparent: true,
      opacity: 0.2,
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // ═══ PARTICLES ═══
    const particleCount = 150;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xA855F7,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ═══ ANIMATION LOOP ═══
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Crystal rotation
      crystal.rotation.y = elapsed * 0.3;
      crystal.rotation.x = Math.sin(elapsed * 0.2) * 0.15;

      // Float effect
      crystal.position.y = Math.sin(elapsed * 0.5) * 0.2;
      wireframe.position.y = crystal.position.y;

      // Wireframe counter-rotation
      wireframe.rotation.y = -elapsed * 0.2;
      wireframe.rotation.x = Math.cos(elapsed * 0.15) * 0.1;

      // Ring rotation
      ring.rotation.z = elapsed * 0.1;
      ring2.rotation.z = -elapsed * 0.08;

      // Particle drift
      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = elapsed * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // ═══ RESIZE HANDLER ═══
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ═══ CLEANUP ═══
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      crystalGeometry.dispose();
      crystalMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      ring2Geometry.dispose();
      ring2Material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}
