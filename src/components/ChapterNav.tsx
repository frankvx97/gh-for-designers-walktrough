import { Link, useLocation } from 'react-router-dom';
import { CHAPTERS } from '../data/chapters';
import styles from './ChapterNav.module.css';

interface Props {
  currentSlug?: string;
}

export default function ChapterNav({ currentSlug }: Props) {
  const location = useLocation();
  const currentIndex = CHAPTERS.findIndex((c) => c.slug === currentSlug);

  return (
    <nav className={styles.rail} aria-label="Chapters">
      {CHAPTERS.map((c, i) => {
        const active = c.slug === currentSlug;
        const visited = currentIndex > -1 && i < currentIndex;
        const cls = `${styles.dot} ${active ? styles.active : ''} ${visited ? styles.visited : ''}`;
        return (
          <Link key={c.slug} to={`/chapter/${c.slug}`} className={cls} aria-current={active ? 'page' : undefined}>
            <span className={styles.label}>
              {String(c.num).padStart(2, '0')} {c.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
