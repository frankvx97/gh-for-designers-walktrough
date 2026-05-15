import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './AsciiDots.module.css';

interface Props {
  spacing?: number;       // px between dot centers
  dotSize?: number;       // px radius
  baseAlpha?: number;     // 0..1 dim resting opacity
  flickerAlpha?: number;  // 0..1 max twinkle boost
  className?: string;
}

/**
 * Delicate ASCII dot field. Canvas 2D grid of dim dots that twinkle gently
 * and brighten near pointer + along a slow drifting "shine" diagonal.
 */
export default function AsciiDots({
  spacing = 22,
  dotSize = 1,
  baseAlpha = 0.18,
  flickerAlpha = 0.55,
  className,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;

    // Deterministic per-dot offsets so twinkles look unique
    const phases: number[] = [];
    const seeds: number[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;
      phases.length = 0;
      seeds.length = 0;
      for (let i = 0; i < cols * rows; i++) {
        phases.push(Math.random() * Math.PI * 2);
        seeds.push(Math.random());
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const mouse = { x: -9999, y: -9999, has: false };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.has = true;
    };
    const onLeave = () => {
      mouse.has = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);

    let raf = 0;
    let alive = true;
    const start = performance.now();

    const draw = (t: number) => {
      if (!alive) return;
      const time = (t - start) / 1000;

      ctx.clearRect(0, 0, width, height);

      // Drifting diagonal "scan" position (loops 0..1)
      const scan = (time * 0.05) % 2.4 - 0.2;

      // Reusable
      const green = '124, 255, 107';
      const blue  = '92, 224, 255';
      const grey  = '120, 150, 175';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const x = c * spacing + (spacing / 2);
          const y = r * spacing + (spacing / 2);

          // Soft twinkle via per-dot phase
          const tw = reduced
            ? 0
            : 0.5 + 0.5 * Math.sin(time * 0.9 + phases[i]);

          // Diagonal scan: how close is this dot to the moving scan line?
          // Normalize coords to 0..1, then test against scan position.
          const u = (x + y) / (width + height);
          const dScan = Math.max(0, 1 - Math.abs(u - scan) * 9);

          // Pointer proximity (real px radius)
          let dPt = 0;
          if (mouse.has) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            dPt = Math.max(0, 1 - dist / 140);
          }

          // Random sparkle: 1 in N dots gets a brief brighten
          const seed = seeds[i];
          const sparkle = seed > 0.985 && tw > 0.85 ? 0.9 : 0;

          // Color selection — bias by region
          const isGreenZone = u < 0.35;      // top-left
          const isBlueZone  = u > 0.65;      // bottom-right
          const accentScan  = isGreenZone ? green : isBlueZone ? blue : grey;
          const accentPt    = isBlueZone ? blue : green;

          const baseRGB = grey;
          const accentRGB = (dPt > dScan ? accentPt : accentScan);

          // Resting brightness — most dots stay dim
          const baseA = baseAlpha + tw * 0.06;

          // Accent brightness — only when scan or pointer or sparkle hits
          const accentA = Math.min(
            flickerAlpha,
            dScan * 0.45 + dPt * 0.85 + sparkle,
          );

          // Draw base dim dot
          if (baseA > 0.02) {
            ctx.fillStyle = `rgba(${baseRGB}, ${baseA})`;
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }

          // Overlay accent
          if (accentA > 0.02) {
            ctx.fillStyle = `rgba(${accentRGB}, ${accentA})`;
            ctx.beginPath();
            ctx.arc(x, y, dotSize + (accentA > 0.45 ? 0.5 : 0), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      // Single static frame
      draw(start);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [spacing, dotSize, baseAlpha, flickerAlpha, reduced]);

  return (
    <div className={`${styles.wrap} ${className ?? ''}`} aria-hidden="true">
      <div className={styles.fallback} />
      <canvas ref={ref} className={styles.canvas} />
    </div>
  );
}
