import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: {
    saveData?: boolean;
  };
}

export function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileViewport = window.innerWidth < 768;
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;

    // Mobile performance & reduced-motion priority: skip Canvas loop completely
    if (prefersReducedMotion || isMobileViewport || saveData) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    const PARTICLE_COUNT = 26;

    const particles: Particle[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          radius: Math.random() * 1.6 + 0.8,
          alpha: Math.random() * 0.42 + 0.18,
        });
      }
    };

    const drawFrame = () => {
      if (document.hidden) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${p.alpha})`;
        ctx.fill();
      }

      animationFrameId = window.requestAnimationFrame(drawFrame);
    };

    const handleVisibilityChange = () => {
      window.cancelAnimationFrame(animationFrameId);
      if (!document.hidden && window.innerWidth >= 768) {
        animationFrameId = window.requestAnimationFrame(drawFrame);
      }
    };

    resize();
    initParticles();
    animationFrameId = window.requestAnimationFrame(drawFrame);

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="cyber-bg" aria-hidden="true">
      <div className="cyber-bg__grid" />
      <canvas ref={canvasRef} className="cyber-bg__canvas" />
    </div>
  );
}
