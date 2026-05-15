import { motion, useReducedMotion as useMotionReduced } from 'motion/react';
import DitherShader from './DitherShader';
import styles from './Section.module.css';

interface SectionProps {
  eyebrow?: string;
  title?: React.ReactNode;
  width?: 'tight' | 'wide';
  children: React.ReactNode;
}

export function Section({ eyebrow, title, width = 'tight', children }: SectionProps) {
  const reduced = useMotionReduced();
  return (
    <section className={`${styles.section} ${width === 'tight' ? styles.sectionTight : styles.sectionWide}`}>
      {eyebrow && (
        <motion.div
          className={styles.sectionEyebrow}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          ▸ {eyebrow}
        </motion.div>
      )}
      {title && (
        <motion.h2
          className={styles.sectionTitle}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {title}
        </motion.h2>
      )}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}

export function Callout({
  label,
  tone = 'green',
  children,
}: {
  label: string;
  tone?: 'green' | 'blue' | 'amber';
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.callout} ${tone === 'blue' ? styles.blue : ''} ${tone === 'amber' ? styles.amber : ''}`}>
      <span className={styles.calloutLabel}>{label}</span>
      {children}
    </div>
  );
}

export function CalloutGrid({ children }: { children: React.ReactNode }) {
  return <div className={styles.calloutGrid}>{children}</div>;
}

export function ShaderDivider({ palette = 'mixed' as 'green' | 'blue' | 'mixed' }) {
  return (
    <div className={styles.divider}>
      <DitherShader variant="divider" speed={0.5} intensity={0.6} pixelSize={5} palette={palette} />
    </div>
  );
}
