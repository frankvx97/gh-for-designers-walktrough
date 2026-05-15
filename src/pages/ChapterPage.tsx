import { Navigate, useParams } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { chapterBySlug } from '../data/chapters';
import ChapterShell from '../components/ChapterShell';

const chapterModules: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'git-vs-github': lazy(() => import('../chapters/01-git-vs-github')),
  'four-states': lazy(() => import('../chapters/02-four-states')),
  'designer-toolkit': lazy(() => import('../chapters/03-designer-toolkit')),
  'branches': lazy(() => import('../chapters/04-branches')),
  'pull-requests': lazy(() => import('../chapters/05-pull-requests')),
  'conventional-commits': lazy(() => import('../chapters/06-conventional-commits')),
  'five-habits': lazy(() => import('../chapters/07-five-habits')),
  'ship-the-button': lazy(() => import('../chapters/08-ship-the-button')),
};

export default function ChapterPage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = chapterBySlug(slug);
  if (!meta || !slug) return <Navigate to="/" replace />;
  const Body = chapterModules[slug];

  return (
    <ChapterShell chapter={meta}>
      <Suspense fallback={<div style={{ padding: '4rem', color: 'var(--ink-mute)' }}>loading scene…</div>}>
        <Body />
      </Suspense>
    </ChapterShell>
  );
}
