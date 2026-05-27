"use client";

/**
 * Book3D — A full 3D interactive book using raw Three.js.
 * 
 * Architecture:
 * - Uses imperative Three.js inside useEffect (avoids R3F reconciler crash)
 * - Book consists of a cover (front/back) + 8 flippable pages
 * - Each page flips sequentially with GSAP for butter-smooth animation
 * - After all 8 pages flip, fires onComplete callback to transition to site
 * - Book slowly rotates/floats when idle (before click)
 * - On click: stops floating → pages flip one by one → fade out
 * 
 * Performance: 
 * - Low poly planes for pages (no heavy geometry)
 * - Single render loop, cleaned up on unmount
 * - DPR capped at 1.5 for mobile
 */

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface Book3DProps {
  onComplete: () => void;
  isFlipping: boolean;
}

export default function Book3D({ onComplete, isFlipping }: Book3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    book: THREE.Group;
    pages: THREE.Mesh[];
    animationId: number;
  } | null>(null);

  // Build the 3D book scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // ═══ SCENE ═══
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ═══ LIGHTING ═══
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x48cae4, 1.2);
    keyLight.position.set(3, 4, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6C3AE0, 0.6);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00b4d8, 0.4);
    rimLight.position.set(0, -2, -3);
    scene.add(rimLight);

    // ═══ BOOK GROUP ═══
    const book = new THREE.Group();
    scene.add(book);

    const pageWidth = 1.4;
    const pageHeight = 1.9;
    const pageDepth = 0.008;
    const numPages = 8;

    // Book cover (front)
    const coverGeo = new THREE.BoxGeometry(pageWidth + 0.06, pageHeight + 0.06, 0.04);
    const coverMat = new THREE.MeshStandardMaterial({
      color: 0x03045e,
      metalness: 0.3,
      roughness: 0.4,
    });
    const frontCover = new THREE.Mesh(coverGeo, coverMat);
    frontCover.position.set(pageWidth / 2, 0, -numPages * pageDepth - 0.03);
    book.add(frontCover);

    // Book cover (back)
    const backCover = new THREE.Mesh(coverGeo, coverMat.clone());
    backCover.position.set(pageWidth / 2, 0, 0.03);
    book.add(backCover);

    // Book spine
    const spineGeo = new THREE.BoxGeometry(0.04, pageHeight + 0.06, numPages * pageDepth + 0.1);
    const spineMat = new THREE.MeshStandardMaterial({
      color: 0x023e8a,
      metalness: 0.4,
      roughness: 0.3,
    });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(-0.02, 0, -numPages * pageDepth / 2);
    book.add(spine);

    // ═══ PAGES ═══
    const pages: THREE.Mesh[] = [];
    const pageGeo = new THREE.BoxGeometry(pageWidth, pageHeight, pageDepth);

    // Page colors — gradient from teal to purple across pages
    const pageColors = [
      0xffffff, 0xf8fdff, 0xf0faff, 0xe8f8ff,
      0xe0f5ff, 0xd8f0ff, 0xd0ecff, 0xc8e8ff,
    ];

    for (let i = 0; i < numPages; i++) {
      const pageMat = new THREE.MeshStandardMaterial({
        color: pageColors[i],
        roughness: 0.8,
        metalness: 0.0,
        side: THREE.DoubleSide,
      });

      const page = new THREE.Mesh(pageGeo, pageMat);
      // Position each page stacked — pivot point is the left edge (spine)
      page.geometry.translate(pageWidth / 2, 0, 0);
      page.position.set(0, 0, -i * pageDepth - 0.02);
      page.userData = { index: i, flipped: false };

      book.add(page);
      pages.push(page);
    }

    // Center the book
    book.position.set(-pageWidth / 2, 0, 0);
    book.rotation.y = -0.2;

    // ═══ IDLE FLOATING ANIMATION ═══
    const clock = new THREE.Clock();
    let animationId: number = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle float + rotation when idle
      if (!isFlipping) {
        book.rotation.y = -0.2 + Math.sin(elapsed * 0.5) * 0.05;
        book.position.y = Math.sin(elapsed * 0.8) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ═══ RESIZE ═══
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Store refs for flip animation
    sceneRef.current = { renderer, scene, camera, book, pages, animationId };

    // ═══ CLEANUP ═══
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      coverGeo.dispose();
      coverMat.dispose();
      spineGeo.dispose();
      spineMat.dispose();
      pageGeo.dispose();
      pages.forEach((p) => (p.material as THREE.Material).dispose());
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ═══ PAGE FLIP ANIMATION (triggered when isFlipping becomes true) ═══
  useEffect(() => {
    if (!isFlipping || !sceneRef.current) return;

    const { pages, book } = sceneRef.current;

    // Straighten the book first
    gsap.to(book.rotation, {
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    });
    gsap.to(book.position, {
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    // Flip each page sequentially with beautiful slow motion
    const timeline = gsap.timeline({
      onComplete: () => {
        // After all pages flip, wait a moment then trigger transition
        gsap.to(book.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 1,
          ease: "power2.in",
          delay: 0.3,
        });
        gsap.to(book.position, {
          z: 3,
          duration: 1.2,
          ease: "power2.in",
          delay: 0.3,
          onComplete: onComplete,
        });
      },
    });

    pages.forEach((page, i) => {
      timeline.to(
        page.rotation,
        {
          y: -Math.PI,
          duration: 1.2,
          ease: "power2.inOut",
        },
        i * 0.4 // Stagger: each page starts 0.4s after the previous
      );
    });
  }, [isFlipping, onComplete]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-pointer"
      style={{ touchAction: "none" }}
    />
  );
}
