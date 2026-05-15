import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import AsciiDots from '../components/AsciiDots';
import IsometricStack from '../components/IsometricStack';
import { CHAPTERS } from '../data/chapters';
import { useLastChapter } from '../hooks/useLastChapter';
import styles from './Landing.module.css';

const stagger = (i: number) => ({
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.1 + i * 0.06, ease: [0.2, 0.8, 0.2, 1] as const },
  },
});

export default function Landing() {
  const [last, , clear] = useLastChapter();
  // Only offer "Resume" when the user has actually progressed past the first
  // chapter — otherwise it's redundant with the Start button and would suggest
  // there was prior progress on a fresh visit.
  const lastMeta = last ? CHAPTERS.find((c) => c.slug === last) : null;
  const resumeChapter = lastMeta && lastMeta.num > 1 ? lastMeta : null;

  return (
    <main className={styles.page}>
      <div className={styles.heroBg}>
        <AsciiDots spacing={22} dotSize={1.2} baseAlpha={0.16} flickerAlpha={0.6} />
      </div>

      <div className={styles.topbar}>
        <div className={styles.versionBadge}>
          <span>v0.1.0</span>
          <b>·</b>
          <span>BUILD <b>2026.05</b></span>
        </div>
        <a href="https://github.com" target="_blank" rel="noreferrer">
          ↗ docs / github
        </a>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <motion.div
            className={styles.eyebrow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            INTERACTIVE WALKTHROUGH · GIT &amp; GITHUB · FOR DESIGNERS
          </motion.div>

          <motion.h1
            className={styles.title}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          >
            <motion.span variants={stagger(0)} style={{ display: 'block' }}>
              <span className={styles.green}>LEARN&nbsp;GIT.</span>
            </motion.span>
            <motion.span variants={stagger(1)} style={{ display: 'block' }}>
              <span className={styles.blue}>SHIP&nbsp;VIBES.</span>
              <span className={styles.blink}>_</span>
            </motion.span>
          </motion.h1>

          <motion.div
            className={styles.tagline}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
          >
            <motion.span className={styles.pre} variants={stagger(0)}>
              &gt; designers/intro_to_git.md
            </motion.span>
            <motion.p variants={stagger(1)}>
              Most designers learning Git pick up the commands and miss the
              mental model. This walkthrough flips that — eight short scenes
              that build the model first, then the muscle memory. Designed to
              read in fifteen minutes, internalize for life.
            </motion.p>
          </motion.div>

          <motion.div
            className={styles.ctaRow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Link to={`/chapter/${CHAPTERS[0].slug}`} className={styles.cta}>
              ▸ Start mission
            </Link>
            {resumeChapter && (
              <Link
                to={`/chapter/${resumeChapter.slug}`}
                className={`${styles.cta} ${styles.ctaSecondary}`}
                onClick={(e) => {
                  if ((e.target as HTMLElement).dataset.action === 'clear') {
                    e.preventDefault();
                    clear();
                  }
                }}
              >
                ↻ Resume CH{String(resumeChapter.num).padStart(2, '0')}
              </Link>
            )}
          </motion.div>
        </div>

        <motion.div
          className={styles.heroLogos}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <IsometricStack />
        </motion.div>

        <motion.div
          className={styles.statRow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className={styles.statCell}>
            <span className={styles.statLabel}>Chapters</span>
            <span className={styles.statValue}>08</span>
          </div>
          <div className={styles.statCell}>
            <span className={styles.statLabel}>Read time</span>
            <span className={`${styles.statValue} ${styles.blue}`}>~15m</span>
          </div>
          <div className={styles.statCell}>
            <span className={styles.statLabel}>Commands</span>
            <span className={styles.statValue}>10</span>
          </div>
          <div className={styles.statCell}>
            <span className={styles.statLabel}>Audience</span>
            <span className={`${styles.statValue} ${styles.blue}`}>DESIGNERS</span>
          </div>
        </motion.div>
      </section>

      <section className={styles.chaptersSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.accent}>// </span>WORLD MAP
        </h2>
        <div className={styles.chapterGrid}>
          {CHAPTERS.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Link to={`/chapter/${c.slug}`} className={styles.chapterCard}>
                <span className={styles.chapterNum}>{String(c.num).padStart(2, '0')}</span>
                <span className={styles.chapterMeta}>
                  <span className={styles.chapterTitle}>{c.title}</span>
                  <span className={styles.chapterBlurb}>· {c.duration} · scene</span>
                </span>
                <span className={styles.chapterArrow}>▸</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>© design-systems · figma → code workshop</span>
        <span>scroll-pace: medium · audio: off</span>
      </footer>
    </main>
  );
}
