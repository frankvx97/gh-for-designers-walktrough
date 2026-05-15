import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './Terminal.module.css';

export interface Step {
  prompt?: string;       // "$" by default; pass "" to render output-only
  command?: string;
  output?: string;
  delayMs?: number;      // pause before this step
  typeSpeedMs?: number;  // override per-char speed
}

interface Props {
  title?: string;
  steps: Step[];
  start?: boolean;       // gate the typing (e.g. tied to inView)
  loop?: boolean;
  className?: string;
}

export default function Terminal({ title = '~/my-design-system', steps, start = true, loop = false, className }: Props) {
  const reduced = useReducedMotion();
  const [stepIdx, setStepIdx] = useState(0);
  const [typedCmd, setTypedCmd] = useState('');
  const [phase, setPhase] = useState<'wait' | 'typing' | 'output' | 'done'>('wait');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset on steps change
  useEffect(() => {
    setStepIdx(0);
    setTypedCmd('');
    setPhase('wait');
  }, [steps, start]);

  useEffect(() => {
    if (!start) return;
    const step = steps[stepIdx];
    if (!step) {
      if (loop) {
        timerRef.current = setTimeout(() => {
          setStepIdx(0);
          setTypedCmd('');
          setPhase('wait');
        }, 2200);
      } else {
        setPhase('done');
      }
      return;
    }

    if (reduced) {
      setTypedCmd(step.command ?? '');
      setPhase('output');
      timerRef.current = setTimeout(() => setStepIdx((i) => i + 1), 20);
      return;
    }

    if (phase === 'wait') {
      const delay = step.delayMs ?? (stepIdx === 0 ? 200 : 380);
      timerRef.current = setTimeout(() => setPhase('typing'), delay);
    } else if (phase === 'typing') {
      const cmd = step.command ?? '';
      if (typedCmd.length < cmd.length) {
        const speed = step.typeSpeedMs ?? 28;
        timerRef.current = setTimeout(() => setTypedCmd(cmd.slice(0, typedCmd.length + 1)), speed);
      } else {
        timerRef.current = setTimeout(() => setPhase('output'), 220);
      }
    } else if (phase === 'output') {
      timerRef.current = setTimeout(() => {
        setStepIdx((i) => i + 1);
        setTypedCmd('');
        setPhase('wait');
      }, step.output ? 700 : 200);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stepIdx, phase, typedCmd, steps, start, reduced, loop]);

  const completed = steps.slice(0, stepIdx);
  const current = steps[stepIdx];

  return (
    <div className={`${styles.term} ${className ?? ''}`}>
      <div className={styles.bar}>
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.amber}`} />
          <span className={`${styles.dot} ${styles.blue}`} />
          <span className={`${styles.dot} ${styles.green}`} />
        </div>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.body} aria-live="polite">
        {completed.map((s, i) => (
          <span key={i} className={styles.line}>
            {(s.prompt ?? (s.command ? '$' : '')) && (
              <span className={styles.prompt}>{s.prompt ?? '$'}</span>
            )}
            {s.command && <span className={styles.cmd}>{s.command}</span>}
            {s.output && <span className={styles.out}>{s.output}</span>}
          </span>
        ))}
        {current && (
          <span className={styles.line}>
            {(current.prompt ?? (current.command ? '$' : '')) && (
              <span className={styles.prompt}>{current.prompt ?? '$'}</span>
            )}
            {current.command && <span className={styles.cmd}>{typedCmd}</span>}
            {phase === 'output' && current.output && <span className={styles.out}>{current.output}</span>}
            {phase !== 'done' && <span className={styles.cursor} aria-hidden="true" />}
          </span>
        )}
      </div>
      <div className={styles.scanlines} aria-hidden="true" />
    </div>
  );
}
