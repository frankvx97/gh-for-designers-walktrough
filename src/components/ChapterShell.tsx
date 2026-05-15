import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { ChapterMeta, nextChapter, prevChapter } from '../data/chapters';
import { useLastChapter } from '../hooks/useLastChapter';
import ChapterNav from './ChapterNav';
import DitherShader from './DitherShader';
import styles from './ChapterShell.module.css';

interface Props {
  chapter: ChapterMeta;
  children: React.ReactNode;
}

export default function ChapterShell({ chapter, children }: Props) {
  const next = nextChapter(chapter.slug);
  const prev = prevChapter(chapter.slug);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 32, mass: 0.4 });
  const [, save] = useLastChapter();

  useEffect(() => {
    save(chapter.slug);
  }, [chapter.slug, save]);

  return (
    <div className={styles.shell} ref={containerRef}>
      <div className={styles.progress} aria-hidden="true">
        <motion.div className={styles.progressBar} style={{ scaleX }} />
      </div>

      <header className={styles.topbar}>
        <Link to="/" className={styles.brand} aria-label="Back to landing">
          GH<span className={styles.slash}>/</span>4D
        </Link>
        <div className={styles.crumb}>
          CH {String(chapter.num).padStart(2, '0')} <b>· {chapter.title}</b>
        </div>
      </header>

      <ChapterNav currentSlug={chapter.slug} />

      <section className={styles.heroSection}>
        <div className={styles.heroDither}>
          <DitherShader variant="divider" speed={0.6} intensity={0.55} pixelSize={5} palette="mixed" />
        </div>
        <motion.div
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span className={styles.eyebrowChip}>CH {String(chapter.num).padStart(2, '0')}</span>
          <span>EST. READ {chapter.duration}</span>
        </motion.div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {chapter.title}
        </motion.h1>
        <motion.p
          className={styles.lede}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {chapter.blurb}
        </motion.p>
      </section>

      <div className={styles.body}>{children}</div>

      <footer className={styles.footer}>
        <div className={styles.navRow}>
          {prev ? (
            <Link to={`/chapter/${prev.slug}`} className={styles.navCard}>
              <span className={styles.navCardLabel}>← PREV / CH {String(prev.num).padStart(2, '0')}</span>
              <span className={styles.navCardTitle}>{prev.title}</span>
            </Link>
          ) : (
            <Link to="/" className={styles.navCard}>
              <span className={styles.navCardLabel}>← BACK</span>
              <span className={styles.navCardTitle}>Landing</span>
            </Link>
          )}
          {next ? (
            <Link to={`/chapter/${next.slug}`} className={`${styles.navCard} ${styles.navCardRight}`}>
              <span className={styles.navCardLabel}>NEXT / CH {String(next.num).padStart(2, '0')} →</span>
              <span className={styles.navCardTitle}>{next.title}</span>
            </Link>
          ) : (
            <Link to="/done" className={`${styles.navCard} ${styles.navCardRight}`}>
              <span className={styles.navCardLabel}>FINISH →</span>
              <span className={styles.navCardTitle}>You did it</span>
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
}
