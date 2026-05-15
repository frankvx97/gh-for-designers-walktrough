import { useState } from 'react';
import { HABITS } from '../data/habits';
import styles from './HabitCard.module.css';

export default function HabitGrid() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const toggle = (n: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  return (
    <div className={styles.grid} role="list">
      {HABITS.map((h) => {
        const isFlipped = flipped.has(h.num);
        return (
          <button
            key={h.num}
            className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
            onClick={() => toggle(h.num)}
            type="button"
            aria-pressed={isFlipped}
            role="listitem"
          >
            <div className={styles.inner}>
              <div className={styles.face}>
                <span className={styles.num}>0{h.num}</span>
                <span className={styles.rule}>{h.rule}</span>
                <span className={styles.detail}>{h.detail}</span>
                <span className={styles.flipHint}>tap → see failure</span>
              </div>
              <div className={`${styles.face} ${styles.faceBack}`}>
                <span className={styles.num}>!{h.num}</span>
                <span className={styles.failureLabel}>// what skipping this looks like</span>
                <span className={styles.failureText}>{h.failure}</span>
                <span className={styles.flipHint}>tap → flip back</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
