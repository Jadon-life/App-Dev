"use client";

/**
 * Book3D — Realistic thick 3D book standing upright, slightly angled, slightly open.
 * 
 * Visual concept: "Picking a book from a library shelf"
 * - Book stands upright facing viewer (like on a shelf)
 * - Tilted at a slight angle so you see: front cover + spine + page edges
 * - Slightly cracked open (~15°) — inviting you to open it
 * - Front cover has "CrysLearn" rendered via CanvasTexture
 * - On click: cover swings open → pages flip one by one → transition
 * 
 * 3D construction:
 * - Front/back covers: BoxGeometry with real thickness (0.04 units)
 * - Page block: BoxGeometry representing stacked pages (visible from top/right)
 * - Spine: BoxGeometry connecting covers
 * - Individual flip pages: PlaneGeometry (pivot on left edge)
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface Book3DProps {
  onComplete: () => void;
  isFlipping: boolean;
}

export default function Book3D({ onComplete, isFlipping }: Book3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    book: THREE.Group;
    frontCover: THREE.Group;
    pages: THREE.Mesh[];
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(1.5, 0.8, 4.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const keyLight = new THREE.DirectionalLight(0x48cae4, 1.2);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x6C3AE0, 0.5);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);
    const backLight = new THREE.DirectionalLight(0x00b4d8, 0.3);
    backLight.position.set(0, 2, -3);
    scene.add(backLight);

    // Dimensions
    const W = 1.5;
    const H = 2.0;
    const coverThick = 0.04;
    const pageBlockThick = 0.25;
    const numFlipPages = 8;
    const flipPageGap = 0.012;

    const book = new THREE.Group();
    scene.add(book);

    // Cover texture
    const coverCanvas = document.createElement("canvas");
    coverCanvas.width = 512;
    coverCanvas.height = 680;
    const ctx = coverCanvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 0, 680);
    grad.addColorStop(0, "#023e8a");
    grad.addColorStop(1, "#03045e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 680);
    ctx.strokeStyle = "rgba(72, 202, 228, 0.6)";
    ctx.lineWidth = 4;
    ctx.strokeRect(25, 25, 462, 630);
    ctx.strokeStyle = "rgba(108, 58, 224, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, 442, 610);
    ctx.fillStyle = "rgba(72, 202, 228, 0.3)";
    ctx.beginPath();
    ctx.arc(256, 180, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(72, 202, 228, 0.8)";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("C", 256, 195);
    ctx.fillStyle = "#48cae4";
    ctx.font = "bold 56px Arial, sans-serif";
    ctx.fillText("CrysLearn", 256, 340);
    ctx.fillStyle = "rgba(144, 224, 239, 0.7)";
    ctx.font = "18px Arial, sans-serif";
    ctx.fillText("Learn with clarity.", 256, 400);
    ctx.fillText("Score with confidence.", 256, 428);
    ctx.strokeStyle = "rgba(72, 202, 228, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(160, 460);
    ctx.lineTo(352, 460);
    ctx.stroke();
    ctx.fillStyle = "rgba(144, 224, 239, 0.4)";
    ctx.font = "14px Arial";
    ctx.fillText("JAMB \u2022 WAEC \u2022 Excellence", 256, 600);
    const coverTexture = new THREE.CanvasTexture(coverCanvas);

    // Front cover (BoxGeometry with thickness, pivots on left)
    const frontCoverGroup = new THREE.Group();
    frontCoverGroup.position.set(0, 0, pageBlockThick / 2);
    const frontCoverGeo = new THREE.BoxGeometry(W, H, coverThick);
    frontCoverGeo.translate(W / 2, 0, 0);
    const frontCoverMats = [
      new THREE.MeshStandardMaterial({ color: 0x023e8a, roughness: 0.4, metalness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x023e8a, roughness: 0.4, metalness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x03045e, roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0x03045e, roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ map: coverTexture, roughness: 0.35, metalness: 0.15 }),
      new THREE.MeshStandardMaterial({ color: 0x021d44, roughness: 0.6 }),
    ];
    const frontCoverMesh = new THREE.Mesh(frontCoverGeo, frontCoverMats);
    frontCoverGroup.add(frontCoverMesh);
    book.add(frontCoverGroup);
    frontCoverGroup.rotation.y = -0.26;

    // Back cover
    const backCoverGeo = new THREE.BoxGeometry(W, H, coverThick);
    const backCoverMat = new THREE.MeshStandardMaterial({ color: 0x03045e, roughness: 0.4, metalness: 0.2 });
    const backCoverMesh = new THREE.Mesh(backCoverGeo, backCoverMat);
    backCoverMesh.position.set(W / 2, 0, -pageBlockThick / 2 - coverThick / 2);
    book.add(backCoverMesh);

    // Spine
    const spineGeo = new THREE.BoxGeometry(coverThick, H, pageBlockThick + coverThick * 2);
    const spineMat = new THREE.MeshStandardMaterial({ color: 0x023e8a, roughness: 0.35, metalness: 0.3 });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(-coverThick / 2, 0, 0);
    book.add(spine);

    // Page block (visible thickness)
    const pageBlockGeo = new THREE.BoxGeometry(W - 0.05, H - 0.04, pageBlockThick);
    const pageBlockMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.95, metalness: 0 });
    const pageBlock = new THREE.Mesh(pageBlockGeo, pageBlockMat);
    pageBlock.position.set(W / 2, 0, 0);
    book.add(pageBlock);

    // Flip pages
    const pages: THREE.Mesh[] = [];
    for (let i = 0; i < numFlipPages; i++) {
      const pageGeo = new THREE.PlaneGeometry(W - 0.06, H - 0.05);
      pageGeo.translate((W - 0.06) / 2, 0, 0);
      const pageMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0, side: THREE.DoubleSide });
      const page = new THREE.Mesh(pageGeo, pageMat);
      page.position.set(0.03, 0, pageBlockThick / 2 - i * flipPageGap - 0.01);
      book.add(page);
      pages.push(page);
    }

    // Position book (upright, angled to show depth)
    book.rotation.y = -0.35;
    book.rotation.x = 0.05;

    // Render loop
    const clock = new THREE.Clock();
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (!isFlipping) {
        book.position.y = Math.sin(t * 0.5) * 0.02;
        book.rotation.y = -0.35 + Math.sin(t * 0.3) * 0.015;
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    sceneRef.current = { book, frontCover: frontCoverGroup, pages };

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      frontCoverGeo.dispose();
      frontCoverMats.forEach(m => m.dispose());
      backCoverGeo.dispose();
      backCoverMat.dispose();
      spineGeo.dispose();
      spineMat.dispose();
      pageBlockGeo.dispose();
      pageBlockMat.dispose();
      coverTexture.dispose();
      pages.forEach(p => { p.geometry.dispose(); (p.material as THREE.Material).dispose(); });
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open animation
  useEffect(() => {
    if (!isFlipping || !sceneRef.current) return;
    const { book, frontCover, pages } = sceneRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(book.position, { z: 2.5, y: 0, duration: 1.2, ease: "power2.in", delay: 0.2 });
        gsap.to(book.scale, { x: 2, y: 2, z: 2, duration: 1.2, ease: "power2.in", delay: 0.2, onComplete: onComplete });
      },
    });

    // Straighten book slightly for opening view
    gsap.to(book.rotation, { y: -0.15, x: 0, duration: 0.6, ease: "power2.out" });
    gsap.to(book.position, { y: 0, duration: 0.4, ease: "power2.out" });

    // Open front cover (swings to the left, rests flat at -170°)
    tl.to(frontCover.rotation, { y: -Math.PI + 0.1, duration: 1.8, ease: "power3.inOut" }, 0.2);

    // Flip pages — each page rotates -180° and stays flat on the left side
    // The key fix: pages rotate to exactly -PI and their z-position shifts slightly
    // so they stack on top of each other on the left (like a real open book)
    pages.forEach((page, i) => {
      tl.to(
        page.rotation,
        { y: -Math.PI, duration: 1.3, ease: "power2.inOut" },
        1.2 + i * 0.35
      );
      // Shift page slightly on z-axis after flip so they don't overlap perfectly
      // This creates the stacked-pages-on-left effect
      tl.to(
        page.position,
        { z: -(i * 0.012) - 0.02, duration: 0.3, ease: "power1.out" },
        1.2 + i * 0.35 + 1.0 // Starts moving after the flip is mostly done
      );
    });
  }, [isFlipping, onComplete]);

  return <div ref={containerRef} className="w-full h-full cursor-pointer" style={{ touchAction: "none" }} />;
}
