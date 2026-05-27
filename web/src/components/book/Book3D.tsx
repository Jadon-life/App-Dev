"use client";

/**
 * Book3D — Realistic book-opening experience using raw Three.js.
 * 
 * The book sits facing the user (like a textbook on a desk).
 * The FRONT COVER has "CrysLearn" embossed on it.
 * When clicked, the cover opens TOWARD the user (like opening a real book),
 * then 8 pages flip from right to left one by one.
 * After all pages flip, the book zooms in and transitions to the website.
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
    cover: THREE.Mesh;
    pages: THREE.Mesh[];
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // ═══ SCENE SETUP ═══
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ═══ LIGHTING ═══
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0x48cae4, 1.0);
    key.position.set(2, 4, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x6C3AE0, 0.4);
    fill.position.set(-3, 2, 3);
    scene.add(fill);
    const rim = new THREE.PointLight(0x00b4d8, 0.6, 10);
    rim.position.set(0, -1, 4);
    scene.add(rim);

    // ═══ BOOK DIMENSIONS ═══
    const W = 1.6;
    const H = 2.2;
    const D = 0.015;
    const numPages = 8;

    const book = new THREE.Group();
    scene.add(book);

    // ═══ COVER TEXTURE WITH "CrysLearn" ═══
    const coverCanvas = document.createElement("canvas");
    coverCanvas.width = 512;
    coverCanvas.height = 700;
    const ctx = coverCanvas.getContext("2d")!;

    const gradient = ctx.createLinearGradient(0, 0, 512, 700);
    gradient.addColorStop(0, "#03045e");
    gradient.addColorStop(1, "#023e8a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 700);

    ctx.strokeStyle = "rgba(72, 202, 228, 0.4)";
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 452, 640);
    ctx.strokeStyle = "rgba(108, 58, 224, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 432, 620);

    ctx.fillStyle = "#48cae4";
    ctx.font = "bold 64px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CrysLearn", 256, 320);

    ctx.fillStyle = "rgba(144, 224, 239, 0.6)";
    ctx.font = "20px Arial, sans-serif";
    ctx.fillText("Learn with clarity.", 256, 380);
    ctx.fillText("Score with confidence.", 256, 410);

    ctx.strokeStyle = "rgba(72, 202, 228, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, 440);
    ctx.lineTo(332, 440);
    ctx.stroke();

    const coverTexture = new THREE.CanvasTexture(coverCanvas);

    // ═══ FRONT COVER (pivots on left edge like a real book) ═══
    const coverGeo = new THREE.PlaneGeometry(W, H);
    coverGeo.translate(W / 2, 0, 0);
    const coverMat = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.4,
      metalness: 0.2,
    });
    const cover = new THREE.Mesh(coverGeo, coverMat);
    cover.position.set(-W / 2, 0, numPages * D / 2 + 0.01);
    book.add(cover);

    // Back cover
    const backGeo = new THREE.PlaneGeometry(W, H);
    const backMat = new THREE.MeshStandardMaterial({ color: 0x03045e, roughness: 0.5, metalness: 0.3 });
    const backCover = new THREE.Mesh(backGeo, backMat);
    backCover.position.set(0, 0, -numPages * D / 2 - 0.01);
    backCover.rotation.y = Math.PI;
    book.add(backCover);

    // ═══ PAGES ═══
    const pages: THREE.Mesh[] = [];
    for (let i = 0; i < numPages; i++) {
      const pageGeo = new THREE.PlaneGeometry(W, H);
      pageGeo.translate(W / 2, 0, 0);
      const pageMat = new THREE.MeshStandardMaterial({
        color: 0xfafcff,
        roughness: 0.9,
        metalness: 0,
        side: THREE.DoubleSide,
      });
      const page = new THREE.Mesh(pageGeo, pageMat);
      page.position.set(-W / 2, 0, (numPages / 2 - i) * D);
      book.add(page);
      pages.push(page);
    }

    book.rotation.x = -0.15;

    // ═══ RENDER LOOP ═══
    const clock = new THREE.Clock();
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (!isFlipping) {
        book.position.y = Math.sin(t * 0.6) * 0.03;
        book.rotation.y = Math.sin(t * 0.3) * 0.02;
      }
      renderer.render(scene, camera);
    };
    animate();

    // ═══ RESIZE ═══
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    sceneRef.current = { book, cover, pages };

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      coverGeo.dispose();
      coverMat.dispose();
      backGeo.dispose();
      backMat.dispose();
      coverTexture.dispose();
      pages.forEach((p) => { p.geometry.dispose(); (p.material as THREE.Material).dispose(); });
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ═══ OPEN ANIMATION ═══
  useEffect(() => {
    if (!isFlipping || !sceneRef.current) return;
    const { book, cover, pages } = sceneRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(book.position, { z: 2, duration: 1, ease: "power2.in", delay: 0.3 });
        gsap.to(book.scale, { x: 1.8, y: 1.8, z: 1.8, duration: 1, ease: "power2.in", delay: 0.3, onComplete: onComplete });
      },
    });

    gsap.to(book.rotation, { y: 0, x: -0.1, duration: 0.5, ease: "power2.out" });
    gsap.to(book.position, { y: 0, duration: 0.4, ease: "power2.out" });

    // Open front cover
    tl.to(cover.rotation, { y: -Math.PI, duration: 1.5, ease: "power3.inOut" }, 0.3);

    // Flip pages one by one
    pages.forEach((page, i) => {
      tl.to(page.rotation, { y: -Math.PI, duration: 1.2, ease: "power2.inOut" }, 1.0 + i * 0.4);
    });
  }, [isFlipping, onComplete]);

  return <div ref={containerRef} className="w-full h-full cursor-pointer" style={{ touchAction: "none" }} />;
}
