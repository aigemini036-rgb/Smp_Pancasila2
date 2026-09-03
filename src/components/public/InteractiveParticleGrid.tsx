import React, { useEffect, useRef, useState } from 'react';

/**
 * InteractiveParticleGrid
 * 
 * Replaces or enhances the static golden dot grid with a subtle interactive particle canvas.
 * Desktop: Soft local disturbance when cursor passes over dots.
 * Mobile / Reduced Motion: Falls back to lightweight static CSS dots.
 */
export default function InteractiveParticleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      setIsInteractive(false);
      return;
    }

    setIsInteractive(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const mouse = { x: -1000, y: -1000, active: false };
    const SPACING = 24;
    const DOT_RADIUS = 1.2;
    const REPEL_RADIUS = 90;
    const REPEL_FORCE = 8;

    interface Particle {
      originX: number;
      originY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
    }

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;

      for (let x = SPACING / 2; x < width; x += SPACING) {
        for (let y = SPACING / 2; y < height; y += SPACING) {
          particles.push({
            originX: x,
            originY: y,
            x,
            y,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    initParticles();

    const handleResize = () => {
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    const parent = canvas.parentElement;
    parent?.addEventListener('mousemove', handleMouseMove, { passive: true });
    parent?.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(249, 207, 0, 0.35)';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < REPEL_RADIUS && dist > 0) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force * 0.4;
            p.vy += Math.sin(angle) * force * 0.4;
          }
        }

        // Return spring to origin
        const homeDx = p.originX - p.x;
        const homeDy = p.originY - p.y;
        p.vx += homeDx * 0.08;
        p.vy += homeDy * 0.08;

        // Damping
        p.vx *= 0.82;
        p.vy *= 0.82;

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      parent?.removeEventListener('mousemove', handleMouseMove);
      parent?.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden select-none">
      {isInteractive ? (
        <canvas ref={canvasRef} className="w-full h-full block opacity-60" />
      ) : (
        <div className="w-full h-full opacity-20 bg-[radial-gradient(#f9cf00_1px,transparent_1px)] [background-size:20px_20px]" />
      )}
    </div>
  );
}
