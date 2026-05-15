import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './PrCard.module.css';

interface DiffLine {
  num: number;
  type: 'context' | 'add' | 'del';
  text: string;
  comment?: { author: string; text: string };
}

const DIFF: DiffLine[] = [
  { num: 18, type: 'context', text: '  variant?: "primary" | "secondary";' },
  { num: 19, type: 'add', text: '  loading?: boolean;', comment: { author: 'reviewer', text: 'Should this also disable the click handler? Add a test for it.' } },
  { num: 20, type: 'context', text: '  children: ReactNode;' },
  { num: 21, type: 'context', text: '}' },
  { num: 22, type: 'context', text: '' },
  { num: 23, type: 'context', text: 'export function Button({' },
  { num: 24, type: 'context', text: '  variant = "primary",' },
  { num: 25, type: 'add', text: '  loading = false,' },
  { num: 26, type: 'context', text: '  children,' },
  { num: 27, type: 'context', text: '  ...props' },
  { num: 28, type: 'context', text: '}: ButtonProps) {' },
  { num: 29, type: 'add', text: '  return <button data-loading={loading} {...props}>{children}</button>;', comment: { author: 'designer', text: 'Use the existing <Button> styles — the loading state is just a class.' } },
  { num: 30, type: 'del', text: '  return <button {...props}>{children}</button>;' },
  { num: 31, type: 'context', text: '}' },
];

const GOOD = `**What** — Adds a \`loading\` prop to <Button>. Defaults to false; when true, renders a spinner and prevents clicks.

**Why** — Async actions in the dashboard need consistent feedback. Today every team rolls their own.

**How to review** — Toggle the \`loading\` control in Storybook. Confirm the spinner respects \`prefers-reduced-motion\` and the button is non-interactive.

**Figma** — design link in the deploy preview comment.`;

const BAD = `updates`;

export default function PrCard() {
  const [mode, setMode] = useState<'good' | 'bad'>('good');

  return (
    <div className={styles.wrap}>
      <div className={styles.toggle} role="tablist" aria-label="PR description quality">
        <button
          className={`${styles.toggleBtn} ${mode === 'good' ? styles.on : ''}`}
          onClick={() => setMode('good')}
          role="tab"
          type="button"
          aria-selected={mode === 'good'}
        >
          ▸ good PR
        </button>
        <button
          className={`${styles.toggleBtn} ${mode === 'bad' ? `${styles.on} ${styles.bad}` : ''}`}
          onClick={() => setMode('bad')}
          role="tab"
          type="button"
          aria-selected={mode === 'bad'}
        >
          ▸ rushed PR
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.head}>
          <div className={styles.headTop}>
            <span className={styles.statusChip}>open</span>
            <span>#42 · feat/button-loading</span>
            <span style={{ marginLeft: 'auto' }}>+3 / −1</span>
          </div>
          <div className={styles.title}>
            {mode === 'good' ? 'feat(button): add loading state' : 'updates'}
          </div>
          <div className={styles.meta}>
            <span>by <b>@designer</b></span>
            <span>2 reviewers</span>
            <span>checks: <b>passing</b></span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            className={`${styles.desc} ${mode === 'bad' ? styles.bad : ''}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            dangerouslySetInnerHTML={{
              __html: (mode === 'good' ? GOOD : BAD).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>'),
            }}
          />
        </AnimatePresence>

        <div className={styles.diff}>
          {DIFF.map((line) => {
            const cls = `${styles.diffLine} ${line.type === 'add' ? styles.add : ''} ${
              line.type === 'del' ? styles.del : ''
            } ${line.comment ? styles.hasComment : ''}`;
            const prefix = line.type === 'add' ? '+ ' : line.type === 'del' ? '- ' : '  ';
            return (
              <Fragment key={line.num + line.text}>
                <div className={cls}>
                  <span className={styles.diffNum}>{line.num}</span>
                  <span className={styles.diffText}>{prefix}{line.text}</span>
                </div>
                {line.comment && (
                  <motion.div
                    className={styles.commentRow}
                    initial={{ opacity: 0, height: 0 }}
                    whileInView={{ opacity: 1, height: 'auto' }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <b>@{line.comment.author}</b> · {line.comment.text}
                  </motion.div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
