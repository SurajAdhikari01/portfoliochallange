"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Particles({
  className,
  quantity = 50,
  isDark = false,
}) {
  const particlesRef = useRef(null);

  useEffect(() => {
    const particles = [];
    const colors = isDark
      ? ["#FDCFF340", "#F9A8D440", "#F472B640"]
      : ["#FDCFF380", "#F9A8D480", "#F472B680"];

    const container = particlesRef.current;
    if (!container) return;

    const createParticle = (x, y) => {
      const size = Math.random() * 10 + 3;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const particle = document.createElement("div");

      particle.style.position = "absolute";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.borderRadius = "50%";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.opacity = (0.3 + Math.random() * 0.3).toString();
      particle.style.pointerEvents = "none";
      particle.style.boxShadow = isDark
        ? `0 0 ${Math.floor(size / 2)}px ${color}`
        : "none";

      container.appendChild(particle);
      particles.push(particle);

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.7 + 0.2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      let posX = x;
      let posY = y;

      const animate = () => {
        posX += vx;
        posY += vy;

        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;

        if (
          posX < -size ||
          posX > window.innerWidth + size ||
          posY < -size ||
          posY > window.innerHeight + size
        ) {
          if (container.contains(particle)) {
            container.removeChild(particle);
          }
          particles.splice(particles.indexOf(particle), 1);

          // Create a new particle to replace the one that went off-screen
          const newX = Math.random() * window.innerWidth;
          const newY = Math.random() * window.innerHeight;
          createParticle(newX, newY);
          return;
        }

        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    };

    // Create initial particles
    for (let i = 0; i < quantity; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      createParticle(x, y);
    }

    const handleResize = () => {
      // Clear existing particles on resize
      particles.forEach((particle) => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      });
      particles.length = 0;

      // Create new particles for the new viewport size
      for (let i = 0; i < quantity; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        createParticle(x, y);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      particles.forEach((particle) => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      });
    };
  }, [quantity, isDark]);

  return <div ref={particlesRef} className={cn("w-full h-full", className)} />;
}
