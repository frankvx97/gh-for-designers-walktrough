import { useMemo } from 'react';
import DitherShader from './DitherShader';
import styles from './DitheredLogo.module.css';

export type LogoVariant = 'git' | 'github';

/* Silhouette SVGs (black-on-transparent) used as CSS masks.
   - git:    diamond + 3 commit nodes + branch lines (Jason Long's icon, simplified)
   - github: Octocat mark (Octicons, MIT) */
const SVGS: Record<LogoVariant, string> = {
  // Git icon rendered as a SINGLE path so the inner branch tree cuts out of
  // the diamond via fill-rule=evenodd. Outer = diamond CW. Inner = stadium
  // tubes drawn CCW which subtract from the fill.
  git: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill-rule="evenodd">
<path fill="black" d="
M 50 4
L 96 50
L 50 96
L 4 50 Z
M 41 50
A 5 5 0 0 0 31 50
A 5 5 0 0 0 41 50 Z
M 78 50
A 5 5 0 0 0 68 50
A 5 5 0 0 0 78 50 Z
M 70 30
A 5 5 0 0 0 60 30
A 5 5 0 0 0 70 30 Z
M 70 70
A 5 5 0 0 0 60 70
A 5 5 0 0 0 70 70 Z
M 36 47 L 73 47 L 73 53 L 36 53 Z
M 50 47 L 66 27 L 71 31 L 55 51 Z
M 50 53 L 66 73 L 71 69 L 55 49 Z
" />
</svg>`,
  github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
<path fill="black" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.111.82-.261.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
</svg>`,
};

interface Props {
  variant: LogoVariant;
  label?: string;
  pixelSize?: number;
  className?: string;
}

export default function DitheredLogo({ variant, label, pixelSize = 7, className }: Props) {
  const palette = variant === 'git' ? 'green' : 'blue';

  const maskUrl = useMemo(() => {
    const encoded = encodeURIComponent(SVGS[variant])
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');
    return `url("data:image/svg+xml;utf8,${encoded}")`;
  }, [variant]);

  return (
    <div className={`${styles.wrap} ${className ?? ''}`}>
      <div className={`${styles.glow} ${styles[variant]}`} aria-hidden="true" />
      <div
        className={styles.masked}
        style={{
          maskImage: maskUrl,
          WebkitMaskImage: maskUrl,
        }}
        role="img"
        aria-label={variant === 'git' ? 'Git logo, dithered' : 'GitHub logo, dithered'}
      >
        <DitherShader
          variant="hero"
          palette={palette}
          pixelSize={pixelSize}
          intensity={0.9}
          speed={0.8}
        />
      </div>
      {label && <span className={`${styles.label} ${styles[variant]}`}>{label}</span>}
    </div>
  );
}
