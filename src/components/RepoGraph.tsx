import { motion } from 'motion/react';
import styles from './RepoGraph.module.css';

export interface CommitNode {
  id: string;
  x: number;       // 0..1
  y: number;       // 0..1 (lane)
  branch: 'main' | 'feature' | 'fix';
  isHead?: boolean;
  label?: string;
}

export interface BranchEdge {
  from: string; // commit id
  to: string;
  branch: 'main' | 'feature' | 'fix';
  curve?: 'straight' | 'split' | 'merge';
}

interface Props {
  commits: CommitNode[];
  edges: BranchEdge[];
  width?: number;
  height?: number;
  showLegend?: boolean;
}

const COLOR: Record<CommitNode['branch'], string> = {
  main: 'var(--green)',
  feature: 'var(--blue)',
  fix: 'var(--amber)',
};

export default function RepoGraph({ commits, edges, width = 720, height = 240, showLegend = true }: Props) {
  const padX = 36;
  const padY = 30;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const px = (n: number) => padX + n * innerW;
  const py = (n: number) => padY + n * innerH;

  const findCommit = (id: string) => commits.find((c) => c.id === id);

  const pathFor = (e: BranchEdge): string => {
    const a = findCommit(e.from);
    const b = findCommit(e.to);
    if (!a || !b) return '';
    const ax = px(a.x), ay = py(a.y), bx = px(b.x), by = py(b.y);
    if (e.curve === 'split' || e.curve === 'merge') {
      const midX = (ax + bx) / 2;
      return `M ${ax} ${ay} C ${midX} ${ay}, ${midX} ${by}, ${bx} ${by}`;
    }
    return `M ${ax} ${ay} L ${bx} ${by}`;
  };

  return (
    <div className={styles.wrap}>
      {showLegend && (
        <div className={styles.legend}>
          <span className={styles.legendItem}>main</span>
          <span className={`${styles.legendItem} ${styles.blue}`}>feature/*</span>
          <span className={`${styles.legendItem} ${styles.amber}`}>fix/*</span>
          <span className={`${styles.legendItem} ${styles.head}`}>HEAD</span>
        </div>
      )}
      <svg
        className={styles.svg}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Animated git repository graph"
      >
        {edges.map((e, i) => (
          <motion.path
            key={`${e.from}-${e.to}-${i}`}
            d={pathFor(e)}
            stroke={COLOR[e.branch]}
            strokeWidth={2}
            strokeDasharray={e.branch === 'fix' ? '4 4' : undefined}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
          />
        ))}
        {commits.map((c, i) => (
          <motion.g
            key={c.id}
            className={styles.commitNode}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ transformOrigin: `${px(c.x)}px ${py(c.y)}px` }}
          >
            <circle
              cx={px(c.x)}
              cy={py(c.y)}
              r={c.isHead ? 9 : 7}
              fill={c.isHead ? 'var(--bg)' : COLOR[c.branch]}
              stroke={COLOR[c.branch]}
              strokeWidth={c.isHead ? 2 : 1}
              style={{ filter: `drop-shadow(0 0 8px ${COLOR[c.branch]})` }}
            />
            {c.label && (
              <text
                x={px(c.x)}
                y={py(c.y) + (c.y > 0.5 ? 24 : -14)}
                textAnchor="middle"
                className={`${styles.label} ${
                  c.branch === 'main' ? styles.labelMain : c.branch === 'feature' ? styles.labelBlue : styles.labelAmber
                }`}
              >
                {c.label}
              </text>
            )}
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
