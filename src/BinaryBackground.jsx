import React, { useEffect, useRef } from 'react';
import { advanceBinaryParticles, createBinaryParticles } from './binaryAnimation';

const colors = { dark: '#b6f36a', light: '#49741b' };

export default function BinaryBackground({ theme, reduced }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const settingsRef = useRef({ theme, reduced });
  useEffect(() => { settingsRef.current = { theme, reduced }; }, [theme, reduced]);

  useEffect(() => {
    const host = hostRef.current;
    const hero = host.parentElement;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    let width = 0, height = 0, particles = [], pointer = null;
    let frame = 0, lastDraw = 0, visible = true;

    const resize = () => {
      const box = host.getBoundingClientRect();
      width = box.width; height = box.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = createBinaryParticles(width, height);
      lastDraw = 0;
    };
    const move = event => {
      if (event.pointerType === 'touch') return;
      const box = host.getBoundingClientRect();
      pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
    };
    const leave = () => { pointer = null; };
    const restartClock = () => { lastDraw = 0; pointer = null; };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      restartClock();
    });
    visibilityObserver.observe(host);
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', leave);
    hero.addEventListener('pointercancel', leave);
    document.addEventListener('visibilitychange', restartClock);
    resize();

    const animate = now => {
      frame = requestAnimationFrame(animate);
      if (!visible || document.hidden || now - lastDraw < 1000 / 30 || !width) return;
      const { theme: currentTheme, reduced: gentle } = settingsRef.current;
      const dt = Math.min((now - (lastDraw || now)) / 1000, 1);
      lastDraw = now;
      // Stable spring steps preserve the fall speed even when frames arrive slowly.
      const steps = Math.max(1, Math.ceil(dt * 60));
      let displacement = 0;
      for (let step = 0; step < steps; step++) {
        displacement = advanceBinaryParticles(particles, { dt: dt / steps, height, pointer, gentle });
      }
      context.clearRect(0, 0, width, height);
      context.font = `${width < 620 ? 11 : 13}px 'Space Mono', monospace`;
      context.fillStyle = colors[currentTheme];
      context.textBaseline = 'top';
      for (const particle of particles) {
        const x = particle.homeX + particle.offsetX;
        const y = particle.y + particle.offsetY;
        if (y < -20 || y > height + 20 || x < -20 || x > width + 20) continue;
        const highlight = 1 + Math.min(Math.hypot(particle.offsetX, particle.offsetY) / 60, .7);
        context.globalAlpha = particle.alpha * highlight * (currentTheme === 'light' ? .8 : 1);
        context.fillText(particle.bit, x, y);
      }
      context.globalAlpha = 1;
      canvas.dataset.motion = 'falling';
      canvas.dataset.interaction = pointer ? 'scattering' : 'returning';
      canvas.dataset.displacement = displacement.toFixed(1);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
      hero.removeEventListener('pointercancel', leave);
      document.removeEventListener('visibilitychange', restartClock);
    };
  }, []);

  return <div ref={hostRef} className="ambient-code" aria-hidden="true">
    <canvas ref={canvasRef} className="binary-canvas" />
    <div className="code-glow" /><div className="code-sweep" />
  </div>;
}
