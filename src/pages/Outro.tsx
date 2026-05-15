import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import DitherShader from '../components/DitherShader';
import CompletionBadge from '../components/CompletionBadge';
import { COMMANDS } from '../data/commands';
import styles from './Outro.module.css';

export default function Outro() {
  return (
    <main className={styles.page}>
      <div className={styles.bg}>
        <DitherShader variant="hero" speed={0.4} intensity={0.6} pixelSize={6} palette="green" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className={styles.eyebrow}>▸ MISSION COMPLETE · 08/08</span>
      </motion.div>

      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        YOU&apos;RE READY <br />
        <span className={styles.accent}>FOR THE WORKSHOP.</span>
      </motion.h1>

      <motion.p
        className={styles.lede}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12 }}
      >
        You now have the mental model — Git tracks state on your computer, GitHub hosts a
        copy in the cloud. You know the four file states, the parallel-universe metaphor for
        branches, what makes a good PR, and the ten commands that cover 95% of designer work.
        That&apos;s enough to ship the Button. Keep this cheat sheet open in a tab.
      </motion.p>

      <motion.div
        className={styles.cheatsheet}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {COMMANDS.map((c) => (
          <div className={styles.cheatRow} key={c.cmd}>
            <span className={styles.cheatCmd}>{c.cmd}</span>
            <span className={styles.cheatDef}>{c.english}</span>
          </div>
        ))}
      </motion.div>

      <div className={styles.ctaRow}>
        <CompletionBadge />
        <Link to="/" className={styles.cta}>↻ Restart from CH 01</Link>
        <Link to="/chapter/git-vs-github" className={`${styles.cta} ${styles.alt}`}>▸ Re-read theory</Link>
      </div>
    </main>
  );
}
