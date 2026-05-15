import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import RepoGraph, { CommitNode, BranchEdge } from './RepoGraph';
import styles from './BranchUniverse.module.css';

type Stage = 'init' | 'branched' | 'edited' | 'merged';

const STORY: Record<Stage, JSX.Element> = {
  init: (
    <span className={styles.storyLine}>
      We start with three commits on <b className={styles.storyLine}><span className={styles.green}>main</span></b>. Production lives here. We don&apos;t experiment here.
    </span>
  ),
  branched: (
    <span className={styles.storyLine}>
      <b className={styles.green}>git checkout -b feat/loading-state</b> — a parallel universe forks off, sharing all of main&apos;s history.
    </span>
  ),
  edited: (
    <span className={styles.storyLine}>
      Two commits on the new branch. <b className={styles.blue}>main</b> is untouched — still safe, still deployable.
    </span>
  ),
  merged: (
    <span className={styles.storyLine}>
      <b className={styles.green}>git merge feat/loading-state</b> — universes collapse. The branch&apos;s commits land on main, history stays linear.
    </span>
  ),
};

export default function BranchUniverse() {
  const [stage, setStage] = useState<Stage>('init');

  const { commits, edges } = useMemo(() => buildGraph(stage), [stage]);

  return (
    <div className={styles.wrap}>
      <RepoGraph commits={commits} edges={edges} height={260} />
      <div className={styles.controls}>
        <button
          className={`${styles.btn} ${styles.blue}`}
          onClick={() => setStage('branched')}
          disabled={stage !== 'init'}
          type="button"
        >
          ▸ git checkout -b feat/*
        </button>
        <button
          className={`${styles.btn} ${styles.blue}`}
          onClick={() => setStage('edited')}
          disabled={stage !== 'branched'}
          type="button"
        >
          ▸ commit on branch ×2
        </button>
        <button
          className={styles.btn}
          onClick={() => setStage('merged')}
          disabled={stage !== 'edited'}
          type="button"
        >
          ▸ git merge feat/*
        </button>
        <button className={`${styles.btn} ${styles.ghost}`} onClick={() => setStage('init')} type="button">
          ↻ reset
        </button>
      </div>
      <div className={styles.story} aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {STORY[stage]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function buildGraph(stage: Stage): { commits: CommitNode[]; edges: BranchEdge[] } {
  // Three baseline commits on main (lane y=0.5)
  const main: CommitNode[] = [
    { id: 'm1', x: 0.06, y: 0.5, branch: 'main', label: 'init' },
    { id: 'm2', x: 0.22, y: 0.5, branch: 'main', label: 'tokens' },
    { id: 'm3', x: 0.38, y: 0.5, branch: 'main', label: 'button v1', isHead: stage === 'init' },
  ];
  const mainEdges: BranchEdge[] = [
    { from: 'm1', to: 'm2', branch: 'main' },
    { from: 'm2', to: 'm3', branch: 'main' },
  ];

  if (stage === 'init') return { commits: main, edges: mainEdges };

  // Branch off m3 — feature lane y=0.18
  const branched: CommitNode[] = [
    ...main.map((c) => ({ ...c, isHead: false })),
    { id: 'f0', x: 0.5, y: 0.18, branch: 'feature', label: 'branch', isHead: stage === 'branched' },
  ];
  const branchedEdges: BranchEdge[] = [
    ...mainEdges,
    { from: 'm3', to: 'f0', branch: 'feature', curve: 'split' },
  ];

  if (stage === 'branched') return { commits: branched, edges: branchedEdges };

  // Two commits on feature branch
  const edited: CommitNode[] = [
    ...branched.map((c) => ({ ...c, isHead: false })),
    { id: 'f1', x: 0.62, y: 0.18, branch: 'feature', label: 'add prop' },
    { id: 'f2', x: 0.74, y: 0.18, branch: 'feature', label: 'styles', isHead: stage === 'edited' },
  ];
  const editedEdges: BranchEdge[] = [
    ...branchedEdges,
    { from: 'f0', to: 'f1', branch: 'feature' },
    { from: 'f1', to: 'f2', branch: 'feature' },
  ];

  if (stage === 'edited') return { commits: edited, edges: editedEdges };

  // Merge back to main — adds m4
  const merged: CommitNode[] = [
    ...edited.map((c) => ({ ...c, isHead: false })),
    { id: 'm4', x: 0.92, y: 0.5, branch: 'main', label: 'merge', isHead: true },
  ];
  const mergedEdges: BranchEdge[] = [
    ...editedEdges,
    { from: 'm3', to: 'm4', branch: 'main' },
    { from: 'f2', to: 'm4', branch: 'feature', curve: 'merge' },
  ];

  return { commits: merged, edges: mergedEdges };
}
