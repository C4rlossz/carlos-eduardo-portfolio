import React, { useEffect, useRef, useState } from 'react';
import { createAvatarAnimation } from './avatarAnimation';

const plates = { dark: '/avatar/carlos-dark.png', light: '/avatar/carlos-light.png' };

function canvasOf(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

// Animate the selected render without replacing Carlos's chosen appearance.
// This is a canvas animation of a 3D render, not a rigged GLB model.
export default function DeveloperAvatar({ theme, reduced }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const settingsRef = useRef({ theme, reduced });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    settingsRef.current = { theme, reduced };
  }, [theme, reduced]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    let disposed = false;
    let frame = 0;
    let visible = true;
    let lastDraw = 0;
    let elapsed = 0;
    let blend = settingsRef.current.theme === 'light' ? 1 : 0;
    const pointer = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const darkCanvas = canvasOf(768, 768);
    const lightCanvas = canvasOf(768, 768);
    const restartClock = () => { lastDraw = 0; };

    const move = event => {
      if (event.pointerType === 'touch') return;
      const box = host.getBoundingClientRect();
      pointer.x = ((event.clientX - box.left) / box.width - 0.5) * 2;
      pointer.y = ((event.clientY - box.top) / box.height - 0.5) * 2;
    };
    const leave = () => { pointer.x = 0; pointer.y = 0; };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) restartClock();
    });
    observer.observe(host);
    document.addEventListener('visibilitychange', restartClock);

    Promise.all([loadImage(plates.dark), loadImage(plates.light)]).then(([dark, light]) => {
      if (disposed) return;
      const darkAnimation = createAvatarAnimation(dark, canvasOf);
      const lightAnimation = createAvatarAnimation(light, canvasOf);
      const animate = now => {
        frame = requestAnimationFrame(animate);
        if (!visible || document.hidden || now - lastDraw < 1000 / 30) return;
        const { theme: nextTheme, reduced: gentle } = settingsRef.current;
        const target = nextTheme === 'light' ? 1 : 0;
        blend = gentle ? target : blend + (target - blend) * 0.19;
        if (Math.abs(target - blend) < 0.002) blend = target;
        // Explicitly requested autoplay remains active, with a gentler reduced-motion rhythm.
        elapsed += (now - (lastDraw || now)) / 1000 * (gentle ? 0.65 : 1);
        lastDraw = now;

        const mouseX = gentle ? 0 : pointer.x;
        const mouseY = gentle ? 0 : pointer.y;
        smooth.x += (mouseX - smooth.x) * 0.14;
        smooth.y += (mouseY - smooth.y) * 0.14;
        if (gentle) { smooth.x = 0; smooth.y = 0; }
        const transform = `translate3d(${smooth.x * 7}px, ${smooth.y * 4}px, 0) rotateX(${-smooth.y * 2}deg) rotateY(${smooth.x * 3}deg)`;
        canvas.style.transform = transform;

        if (blend < 1) darkAnimation.render(darkCanvas, elapsed);
        if (blend > 0) lightAnimation.render(lightCanvas, elapsed);
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (blend < 1) context.drawImage(darkCanvas, 0, 0);
        if (blend > 0) {
          context.globalAlpha = blend;
          context.drawImage(lightCanvas, 0, 0);
          context.globalAlpha = 1;
        }
        canvas.dataset.screen = nextTheme === 'dark' ? 'on' : 'off';
        canvas.dataset.animation = 'playing';
        canvas.dataset.frameTime = elapsed.toFixed(2);
      };
      darkAnimation.render(darkCanvas, 0);
      lightAnimation.render(lightCanvas, 0);
      context.drawImage(blend === 1 ? lightCanvas : darkCanvas, 0, 0);
      setReady(true);
      frame = requestAnimationFrame(animate);
    }).catch(() => {
      // Preserve a theme-correct image if canvas initialization cannot finish.
      if (!disposed) setReady(false);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', restartClock);
    };
  }, []);

  return <div className="avatar-host" ref={hostRef} data-theme={theme}>
    {!ready && <img className="avatar-still" src={plates[theme]} width="1254" height="1254" alt="Carlos com piercing na sobrancelha, no notebook, com um café ao lado" fetchPriority="high" />}
    <canvas ref={canvasRef} width="768" height="768" className={ready ? 'avatar-canvas ready' : 'avatar-canvas'} role="img" aria-label={`Avatar com piercing na sobrancelha, digitando no notebook, com vapor saindo do café. ${theme === 'dark' ? 'Tela ligada, com luz verde iluminando o rosto.' : 'Tela desligada, sem luz do notebook.'}`} />
  </div>;
}
