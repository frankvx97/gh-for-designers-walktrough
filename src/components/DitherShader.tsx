import { useEffect, useRef, useState, useMemo } from 'react';
import vertSrc from '../shaders/dither.vert.glsl?raw';
import fragSrc from '../shaders/dither.frag.glsl?raw';
import { useWebGLShader } from '../hooks/useWebGLShader';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './DitherShader.module.css';

export type DitherVariant = 'hero' | 'divider' | 'panel';

interface Props {
  variant?: DitherVariant;
  speed?: number;
  intensity?: number;
  pixelSize?: number;
  palette?: 'green' | 'blue' | 'mixed';
  className?: string;
}

const PALETTES: Record<string, [number, number, number][]> = {
  // [colorA dark, colorB mid, colorC bright]
  green: [
    [0.024, 0.039, 0.055],   // bg
    [0.114, 0.753, 0.42],    // green-mid
    [0.486, 1.0, 0.42],      // green-bright
  ],
  blue: [
    [0.024, 0.039, 0.055],
    [0.114, 0.6, 0.76],
    [0.36, 0.88, 1.0],
  ],
  mixed: [
    [0.024, 0.039, 0.055],
    [0.36, 0.88, 1.0],       // blue
    [0.486, 1.0, 0.42],      // green
  ],
};

const VARIANT_INDEX: Record<DitherVariant, number> = { hero: 0, divider: 1, panel: 2 };

export default function DitherShader({
  variant = 'hero',
  speed = 1,
  intensity = 0.7,
  pixelSize = 4,
  palette = 'mixed',
  className,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? true),
      { rootMargin: '120px' },
    );
    io.observe(canvas);
    return () => io.disconnect();
  }, []);

  const colors = PALETTES[palette];

  const uniforms = useMemo(
    () => ({
      u_pixelSize: pixelSize * (window.devicePixelRatio || 1),
      u_intensity: intensity,
      u_speed: reduced ? 0 : speed,
      u_variant: VARIANT_INDEX[variant],
      u_colorA: colors[0],
      u_colorB: colors[1],
      u_colorC: colors[2],
    }),
    [pixelSize, intensity, speed, variant, colors, reduced],
  );

  useWebGLShader(ref, {
    vertex: vertSrc,
    fragment: fragSrc,
    uniforms,
    paused: reduced || !inView,
  });

  return (
    <div className={`${styles.root} ${className ?? ''}`} aria-hidden="true">
      <div className={styles.fallback} />
      <canvas ref={ref} className={styles.canvas} />
    </div>
  );
}
