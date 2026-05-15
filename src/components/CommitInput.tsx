import { useMemo, useState } from 'react';
import styles from './CommitInput.module.css';

const SUGGEST = [
  'feat(button): add loading state',
  'fix(input): correct focus ring color',
  'chore: bump react to 18.3.1',
  'docs(readme): add setup instructions',
  'feat(card)!: BREAKING CHANGE rename variant prop',
];

type Bump = 'none' | 'patch' | 'minor' | 'major';

function classify(msg: string): Bump {
  const t = msg.trim().toLowerCase();
  if (!t) return 'none';
  if (/breaking change/i.test(msg) || /^[a-z]+(\([^)]+\))?!:/.test(t)) return 'major';
  if (/^feat(\(|:)/.test(t)) return 'minor';
  if (/^fix(\(|:)/.test(t)) return 'patch';
  if (/^(chore|docs|refactor|test|style)(\(|:)/.test(t)) return 'patch';
  return 'none';
}

export default function CommitInput() {
  const [msg, setMsg] = useState('feat(button): add loading state');
  const bump = useMemo(() => classify(msg), [msg]);

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <div className={styles.terminalLike}>
          <span className={styles.label}>$ git commit -m</span>
          <div className={styles.composer}>
            <span className={styles.prompt}>&quot;</span>
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              spellCheck={false}
              placeholder="feat(button): add loading state"
              aria-label="commit message"
            />
            <span className={styles.prompt}>&quot;</span>
          </div>
          <div className={styles.suggestions}>
            {SUGGEST.map((s) => (
              <button key={s} className={styles.suggest} type="button" onClick={() => setMsg(s)}>
                {s.split(':')[0]}
              </button>
            ))}
          </div>
          <div className={styles.match}>
            // detected: <b>{bump === 'none' ? '— no convention prefix' : bump.toUpperCase()}</b>
          </div>
        </div>

        <div className={styles.bumpPanel}>
          <span className={styles.label}>// release tooling reads the prefix and bumps</span>
          <div className={`${styles.bumpRow} ${styles.patch} ${bump === 'patch' ? styles.active : ''}`}>
            <span className={styles.bumpKind}>patch</span>
            <span className={styles.bumpVer}>0.1.0 → 0.1.1 — bug fix, internal refactor</span>
          </div>
          <div className={`${styles.bumpRow} ${styles.minor} ${bump === 'minor' ? styles.active : ''}`}>
            <span className={styles.bumpKind}>minor</span>
            <span className={styles.bumpVer}>0.1.1 → 0.2.0 — new prop / feature, additive</span>
          </div>
          <div className={`${styles.bumpRow} ${styles.major} ${bump === 'major' ? styles.active : ''}`}>
            <span className={styles.bumpKind}>major</span>
            <span className={styles.bumpVer}>0.2.0 → 1.0.0 — BREAKING CHANGE, rename / removal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
