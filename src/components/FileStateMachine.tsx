import { useState } from 'react';
import { motion, LayoutGroup } from 'motion/react';
import styles from './FileStateMachine.module.css';

const STATES = [
  { key: 'untracked', title: 'Untracked', cmd: '— (create file)', advance: '$ git add' },
  { key: 'staged', title: 'Staged', cmd: '$ git add Button.tsx', advance: '$ git commit' },
  { key: 'committed', title: 'Committed', cmd: '$ git commit -m "…"', advance: '$ git push' },
  { key: 'pushed', title: 'Pushed', cmd: '$ git push', advance: '✓ on github' },
] as const;

export default function FileStateMachine() {
  const [stateIdx, setStateIdx] = useState(0);

  const next = () => setStateIdx((i) => Math.min(STATES.length - 1, i + 1));
  const reset = () => setStateIdx(0);

  return (
    <div className={styles.wrap}>
      <LayoutGroup>
        <div className={styles.lanes}>
          {STATES.map((s, i) => {
            const isCurrent = i === stateIdx;
            return (
              <div key={s.key} className={`${styles.lane} ${isCurrent ? styles.current : ''}`}>
                <span className={styles.laneIndex}>0{i + 1}</span>
                <span className={styles.laneTitle}>{s.title}</span>
                <div className={styles.dock}>
                  {isCurrent && (
                    <motion.div layoutId="file-token" className={styles.token} transition={{ duration: 0.5, ease: [0.85, 0, 0.15, 1] }}>
                      <span className={styles.icon} />
                      Button.tsx
                    </motion.div>
                  )}
                </div>
                <span className={styles.laneCmd}>
                  {s.advance && <b>{s.advance}</b>}
                </span>
              </div>
            );
          })}
        </div>
      </LayoutGroup>

      <div className={styles.controls}>
        <button
          className={styles.btn}
          type="button"
          onClick={next}
          disabled={stateIdx >= STATES.length - 1}
        >
          ▸ Run {STATES[stateIdx].advance.replace('$ ', '').replace('✓ ', '')}
        </button>
        <button className={`${styles.btn} ${styles.reset}`} type="button" onClick={reset}>
          ↻ Reset
        </button>
      </div>
      <div className={styles.hint}>
        // every file in a repo is in exactly one of these four states.
      </div>
    </div>
  );
}
