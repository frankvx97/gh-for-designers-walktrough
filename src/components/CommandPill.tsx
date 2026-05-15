import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { COMMANDS } from '../data/commands';
import Terminal from './Terminal';
import CollaborateDetail from './CollaborateDetail';
import styles from './CommandPill.module.css';

const COLLAB_INDEX = -1;

export default function CommandGrid() {
  const [active, setActive] = useState<number>(0);
  const isCollab = active === COLLAB_INDEX;
  const cmd = isCollab ? null : COMMANDS[active];

  return (
    <div>
      <div className={styles.grid}>
        {COMMANDS.map((c, i) => (
          <button
            key={c.cmd}
            className={`${styles.pill} ${styles[c.tone]} ${i === active ? styles.active : ''}`}
            onClick={() => setActive(i)}
            type="button"
            aria-pressed={i === active}
          >
            <span className={styles.cmdLine}>
              <span className={styles.prompt}>$</span>
              {c.short}
            </span>
            <span className={styles.english}>{c.english.split('.')[0]}</span>
          </button>
        ))}
        <button
          key="collaborate"
          className={`${styles.pill} ${styles.blue} ${styles.wide} ${isCollab ? styles.active : ''}`}
          onClick={() => setActive(COLLAB_INDEX)}
          type="button"
          aria-pressed={isCollab}
        >
          <span className={styles.cmdLine}>
            <span className={styles.prompt}>◆</span>
            collaborate on github
          </span>
          <span className={styles.english}>clone a repo · fork a repo you don&apos;t own</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isCollab ? (
          <motion.div
            key="collab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <CollaborateDetail />
          </motion.div>
        ) : (
          <motion.div
            key={active}
            className={styles.detail}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className={styles.detailCopy}>
              <div className={styles.detailCmd}>{cmd!.cmd}</div>
              <p className={styles.detailEnglish}>{cmd!.english}</p>
            </div>
            <Terminal title={`> ${cmd!.short}`} steps={cmd!.example ?? []} loop />
          </motion.div>
        )}
      </AnimatePresence>

      {!isCollab && cmd?.extension && (
        <motion.div
          key={`ext-${active}`}
          className={`${styles.setup} ${styles.extension}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1], delay: 0.08 }}
        >
          <div className={styles.setupCopy}>
            <span className={styles.extensionEyebrow}>{cmd.extension.eyebrow}</span>
            <div className={styles.setupHead}>{cmd.extension.headline}</div>
            <p className={styles.setupBody}>{cmd.extension.body}</p>
          </div>
          <div className={styles.setupTerms}>
            {cmd.extension.terms.map((t) => (
              <Terminal key={t.title} title={t.title} steps={t.steps} loop />
            ))}
          </div>
        </motion.div>
      )}

      {!isCollab && cmd?.setup && (
        <motion.div
          key={`setup-${active}`}
          className={styles.setup}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1], delay: 0.08 }}
        >
          <div className={styles.setupCopy}>
            <span className={styles.setupEyebrow}>// first time on this folder?</span>
            <div className={styles.setupHead}>{cmd.setup.headline}</div>
            <p className={styles.setupBody}>{cmd.setup.body}</p>
          </div>
          <div className={styles.setupTerms}>
            <Terminal title="> error" steps={cmd.setup.error} loop />
            <Terminal title="> fix" steps={cmd.setup.fix} loop />
          </div>
        </motion.div>
      )}
    </div>
  );
}
