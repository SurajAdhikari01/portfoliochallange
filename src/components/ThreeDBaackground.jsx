"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function ThreeDBackground() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;

    const positionArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position (scattered in a sphere)
      positionArray[i] = (Math.random() - 0.5) * 50;
      positionArray[i + 1] = (Math.random() - 0.5) * 50;
      positionArray[i + 2] = (Math.random() - 0.5) * 50;

      // Color in pink shades
      colorArray[i] = 0.9 + Math.random() * 0.1; // R (strong)
      colorArray[i + 1] = 0.4 + Math.random() * 0.4; // G (medium)
      colorArray[i + 2] = 0.7 + Math.random() * 0.3; // B (medium-high)
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colorArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Mouse interaction
    const mouse = { x: 0, y: 0 };

    document.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Gentle rotation based on mouse position
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.001;

      // Follow mouse with gentle easing
      particlesMesh.rotation.x +=
        (mouse.y * 0.01 - particlesMesh.rotation.x) * 0.1;
      particlesMesh.rotation.y +=
        (mouse.x * 0.01 - particlesMesh.rotation.y) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      scene.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-2] pointer-events-none"
      aria-hidden="true"
    />
  );
}
