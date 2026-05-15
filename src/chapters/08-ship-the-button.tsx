import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Section, Callout, CalloutGrid, ShaderDivider } from '../components/Section';
import Terminal, { Step } from '../components/Terminal';
import RepoGraph, { CommitNode, BranchEdge } from '../components/RepoGraph';
import styles from './08-ship-the-button.module.css';

interface Beat {
  num: number;
  tone: 'green' | 'blue' | 'amber';
  title: string;
  body: React.ReactNode;
  steps: Step[];
}

const BEATS: Beat[] = [
  {
    num: 1,
    tone: 'green',
    title: 'check status & cut a branch',
    body: (
      <>
        New Button is on disk. Git knows it&apos;s there but it&apos;s untracked. Before staging
        anything, cut a branch so we never commit straight to <b>main</b>.
      </>
    ),
    steps: [
      { command: 'git status' },
      { prompt: '', output: 'On branch main\nUntracked files:\n  src/components/atoms/Button/' },
      { command: 'git checkout -b feat/button-component' },
      { prompt: '', output: 'Switched to a new branch \'feat/button-component\'' },
    ],
  },
  {
    num: 2,
    tone: 'blue',
    title: 'stage just the button',
    body: (
      <>
        Stage the Button folder by name — not <code>git add .</code>. Precision keeps
        generated artifacts out of the commit.
      </>
    ),
    steps: [
      { command: 'git add src/components/atoms/Button' },
      { command: 'git status' },
      { prompt: '', output: 'Changes to be committed:\n  new file: src/components/atoms/Button/Button.tsx\n  new file: src/components/atoms/Button/Button.stories.tsx\n  new file: src/components/atoms/Button/index.ts' },
    ],
  },
  {
    num: 3,
    tone: 'green',
    title: 'commit with a conventional message',
    body: (
      <>
        Use a Conventional Commit prefix — release tooling reads it. The <code>(button)</code>
        scope tells reviewers which component changed at a glance.
      </>
    ),
    steps: [
      { command: 'git commit -m "feat(button): add Button atom with variants"' },
      { prompt: '', output: '[feat/button-component a1b2c3d] feat(button): add Button atom with variants\n 3 files changed, 142 insertions(+)' },
    ],
  },
  {
    num: 4,
    tone: 'blue',
    title: 'push to github',
    body: (
      <>
        <code>-u origin</code> tells git &quot;remember this branch&apos;s remote so I can just
        type <code>git push</code> next time.&quot;
      </>
    ),
    steps: [
      { command: 'git push -u origin feat/button-component' },
      { prompt: '', output: 'Branch \'feat/button-component\' set up to track remote.\nremote: Create a pull request: https://github.com/you/my-design-system/pull/new/feat/button-component' },
    ],
  },
  {
    num: 5,
    tone: 'amber',
    title: 'open the pull request',
    body: (
      <>
        <code>--fill</code> pre-populates the PR title and body from your commit message. Treat
        that as a draft — rewrite the description before requesting review.
      </>
    ),
    steps: [
      { command: 'gh pr create --fill' },
      { prompt: '', output: 'Creating pull request for feat/button-component into main\nhttps://github.com/you/my-design-system/pull/42' },
    ],
  },
];

const ALL_COMMITS: CommitNode[] = [
  { id: 'm1', x: 0.05, y: 0.55, branch: 'main', label: 'init' },
  { id: 'm2', x: 0.18, y: 0.55, branch: 'main', label: 'tokens' },
  { id: 'm3', x: 0.31, y: 0.55, branch: 'main', label: 'storybook' },
  { id: 'b0', x: 0.46, y: 0.18, branch: 'feature', label: 'branch' },
  { id: 'b1', x: 0.62, y: 0.18, branch: 'feature', label: 'add Button' },
  { id: 'b2', x: 0.78, y: 0.18, branch: 'feature', label: 'pushed', isHead: true },
  { id: 'pr', x: 0.94, y: 0.18, branch: 'feature', label: 'PR #42' },
];

const ALL_EDGES: BranchEdge[] = [
  { from: 'm1', to: 'm2', branch: 'main' },
  { from: 'm2', to: 'm3', branch: 'main' },
  { from: 'm3', to: 'b0', branch: 'feature', curve: 'split' },
  { from: 'b0', to: 'b1', branch: 'feature' },
  { from: 'b1', to: 'b2', branch: 'feature' },
  { from: 'b2', to: 'pr', branch: 'feature' },
];

function BeatRow({ beat }: { beat: Beat }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const [run, setRun] = useState(false);
  useEffect(() => {
    if (inView) setRun(true);
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      className={styles.step}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className={styles.stepCopy}>
        <span className={`${styles.stepNum} ${styles[beat.tone]}`}>0{beat.num}</span>
        <h3 className={styles.stepTitle}>{beat.title}</h3>
        <p className={styles.stepBody}>{beat.body}</p>
      </div>
      <Terminal title={`step ${beat.num} / 5`} steps={beat.steps} start={run} loop />
    </motion.div>
  );
}

export default function Chapter8() {
  return (
    <>
      <Section eyebrow="08 / The capstone" title={<>Take the Button to a <span style={{ color: 'var(--green)' }}>real PR</span>.</>}>
        <div className="prose">
          <p>
            Everything in chapters 1–7, applied. The starting state: you just used the Figma-MCP
            workflow to generate <code>src/components/atoms/Button/</code> in your design-system
            repo. The ending state: a pull request open against <b>main</b>, ready for review.
            Five steps. Scroll through them — each terminal animates as it enters view.
          </p>
        </div>
      </Section>

      <Section width="wide" eyebrow="repo graph" title={<>Where we&apos;re <span style={{ color: 'var(--green)' }}>headed</span></>}>
        <RepoGraph commits={ALL_COMMITS} edges={ALL_EDGES} height={220} />
      </Section>

      <Section width="wide" eyebrow="the sequence">
        <div className={styles.flow}>
          {BEATS.map((b) => (
            <BeatRow key={b.num} beat={b} />
          ))}
        </div>
      </Section>

      <ShaderDivider palette="green" />

      <Section eyebrow="What you just did" title={<>That&apos;s the <span style={{ color: 'var(--green)' }}>whole loop</span>.</>}>
        <div className={styles.summary}>
          <span className={styles.summaryHead}>// loop</span>
          <p className={styles.summaryBody}>
            Generate a component → cut a branch → stage it → commit with a Conventional message →
            push → open a PR. Repeat for every component. The first Button is the demo. The next
            twenty Buttons (and Inputs, Cards, Dialogs, Tabs, Selects…) are the work — and now
            you have the muscle memory to ship them.
          </p>
        </div>

        <CalloutGrid>
          <Callout label="next: workshop section 6">
            With main accumulating squash-merged commits, the publish workflow takes over.
            <code>pnpm version</code> + a tag triggers GitHub Actions to publish the package.
            Consumers <code>pnpm add @yourname/your-package</code> and import the Button.
          </Callout>
          <Callout label="if you remember one thing" tone="blue">
            Git is just a state machine over your folder. GitHub adds a multiplayer layer on top.
            Everything else is vocabulary.
          </Callout>
        </CalloutGrid>
      </Section>
    </>
  );
}
