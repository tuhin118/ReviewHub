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

    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;
    if (saveData) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const PARTICLE_COUNT = 26;
    const particles: Particle[] = [];

    let animationFrameId: number | null = null;
    let isDisposed = false;
    let width = 0;
    let height = 0;

    const shouldAnimate = (): boolean => {
      return !motionQuery.matches && window.innerWidth >= 768 && !document.hidden;
    };

    const resizeCanvas = () => {
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

    const stopAnimation = () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const drawFrame = () => {
      if (isDisposed || !shouldAnimate()) {
        animationFrameId = null;
        return;
      }

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

    const startAnimation = () => {
      if (isDisposed || animationFrameId !== null || !shouldAnimate()) {
        return;
      }
      animationFrameId = window.requestAnimationFrame(drawFrame);
    };

    const syncAnimationState = () => {
      if (!shouldAnimate()) {
        stopAnimation();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      const needsInit = particles.length === 0 || width === 0 || height === 0;
      resizeCanvas();
      if (needsInit) {
        initParticles();
      }
      startAnimation();
    };

    syncAnimationState();

    window.addEventListener('resize', syncAnimationState, { passive: true });
    document.addEventListener('visibilitychange', syncAnimationState);
    motionQuery.addEventListener('change', syncAnimationState);

    return () => {
      isDisposed = true;
      stopAnimation();
      window.removeEventListener('resize', syncAnimationState);
      document.removeEventListener('visibilitychange', syncAnimationState);
      motionQuery.removeEventListener('change', syncAnimationState);
    };
  }, []);

  return (
    <div className="cyber-bg" aria-hidden="true">
      <div className="cyber-bg__grid" />
      <canvas ref={canvasRef} className="cyber-bg__canvas" />
    </div>
  );
}
