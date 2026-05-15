import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Section, Callout, CalloutGrid, ShaderDivider } from '../components/Section';
import Terminal from '../components/Terminal';
import styles from './01-git-vs-github.module.css';

export default function Chapter1() {
  const [onCloud, setOnCloud] = useState(false);

  return (
    <>
      <Section eyebrow="01 / The mental model" title={<><span className={styles ? '' : ''}>Two words. </span><span style={{ color: 'var(--green)' }}>One that lives on your computer.</span> One that lives on the internet.</>}>
        <div className="prose">
          <p>
            <strong>Git</strong> is a tool that lives on your computer. It tracks every change
            you make to a folder of files: <em>who</em> changed it, <em>when</em>, and <em>why</em>.
            Think of it as Time Machine for code, except smarter — you can rewind to any specific
            change, branch into a parallel version of the project, and merge that back later.
            It works offline. Nothing leaves your machine until you tell it to.
          </p>
          <p>
            <strong>GitHub</strong> is a cloud platform (owned by Microsoft) that hosts a copy of your git
            folder online. It does three things git can&apos;t do on its own: <em>sharing</em> —
            teammates can pull a copy of your folder; <em>collaboration</em> — they can propose
            changes you review before accepting; <em>automation</em> — every change can trigger a
            pipeline (build, test, publish).
          </p>
        </div>
      </Section>

      <Section eyebrow="Try it" title={<>// PUSH a file from <span className={styles ? '' : ''} style={{ color: 'var(--green)' }}>git</span> to <span style={{ color: 'var(--blue)' }}>github</span></>}>
        <div className={styles.split}>
          <div className={`${styles.side} ${styles.sideLeft}`}>
            <span className={styles.sideLabel}>local · /Users/you/my-design-system</span>
            <span className={styles.sideTitle}>git</span>
            <p className={styles.sideBody}>
              Your computer. The .git folder lives here. Works offline. Tracks every change forever.
            </p>
            <div className={`${styles.fileBox} ${onCloud ? '' : ''}`}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`local-${onCloud}`}
                  initial={{ opacity: 0, x: onCloud ? 12 : -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Button.tsx{onCloud ? ' (committed locally)' : ' (committed locally)'}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className={styles.sideMeta}>
              <span>connection: <b>none required</b></span>
              <span>history: <b>full local</b></span>
            </div>
          </div>

          <div className={styles.bridge}>
            <button className={styles.pushBtn} onClick={() => setOnCloud(true)} disabled={onCloud} type="button">
              git push →
            </button>
            <button className={styles.pullBtn} onClick={() => setOnCloud(false)} disabled={!onCloud} type="button">
              ← git pull
            </button>
          </div>

          <div className={`${styles.side} ${styles.sideRight}`}>
            <span className={styles.sideLabel}>remote · github.com/you/my-design-system</span>
            <span className={styles.sideTitle}>github</span>
            <p className={styles.sideBody}>
              A website. Hosts a copy of your repo. Adds sharing, review, automation. Needs internet.
            </p>
            <div className={`${styles.fileBox} ${!onCloud ? styles.empty : ''}`}>
              <AnimatePresence>
                {onCloud && (
                  <motion.span
                    key="remote-file"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.3 }}
                  >
                    Button.tsx (visible to team)
                  </motion.span>
                )}
              </AnimatePresence>
              {!onCloud && <span>nothing pushed yet</span>}
            </div>
            <div className={styles.sideMeta}>
              <span>connection: <b>required</b></span>
              <span>extras: <b>PRs · CI · pages</b></span>
            </div>
          </div>
        </div>
      </Section>

      <ShaderDivider palette="green" />

      <Section eyebrow="Side-by-side" title={<>What each one <span style={{ color: 'var(--green)' }}>actually</span> does</>}>
        <div className={styles.matrix}>
          <div className={styles.matrixHead}>capability</div>
          <div className={styles.matrixHead}>git</div>
          <div className={styles.matrixHead}>github</div>

          <div>track changes locally</div>
          <div className={styles.matrixYes}>✓</div>
          <div className={styles.matrixNo}>—</div>

          <div>work offline</div>
          <div className={styles.matrixYes}>✓</div>
          <div className={styles.matrixNo}>—</div>

          <div>share with teammates</div>
          <div className={styles.matrixNo}>—</div>
          <div className={styles.matrixYes}>✓</div>

          <div>code review (pull requests)</div>
          <div className={styles.matrixNo}>—</div>
          <div className={styles.matrixYes}>✓</div>

          <div>run pipelines on every push</div>
          <div className={styles.matrixNo}>—</div>
          <div className={styles.matrixYes}>✓</div>

          <div>publish a package</div>
          <div className={styles.matrixNo}>—</div>
          <div className={styles.matrixYes}>✓</div>
        </div>

        <CalloutGrid>
          <Callout label="key takeaway">
            You can use git without GitHub. You <em>cannot</em> use GitHub without git.
            Every command you&apos;ll learn in the next chapters runs locally — push and pull are the
            only two that talk to GitHub.
          </Callout>
          <Callout label="why this matters" tone="blue">
            When something breaks, the first question is <em>local or remote?</em>
            That alone solves half of beginner git pain.
          </Callout>
        </CalloutGrid>
      </Section>

      <ShaderDivider palette="mixed" />

      <Section eyebrow="One-time setup" title={<>Starting git on a folder that <span style={{ color: 'var(--amber)' }}>doesn&apos;t have it yet</span></>}>
        <div className="prose">
          <p>
            Most repos you&apos;ll touch in the workshop already have git set up — someone ran the
            init script for you. But the moment you take this back to your own machine — a
            portfolio site, a sandbox folder, a half-finished prototype — you&apos;ll hit folders
            that aren&apos;t on git yet. Until you initialize git, every <code>git status</code> errors
            out with <em>fatal: not a git repository</em>.
          </p>
          <p>
            The first commit is special — it&apos;s the <em>initial commit</em> that creates a project&apos;s
            history from nothing. You only do this once per project. After that, every change is
            just add → commit → push.
          </p>
        </div>

        <div style={{ marginTop: 'var(--s-4)' }}>
          <Terminal
            title="~/my-project"
            loop
            steps={[
              { command: 'git init -b main', output: 'Initialized empty Git repository in ./.git/' },
              { command: 'git add .' },
              { command: 'git commit -m "chore: initial commit"', output: '[main (root-commit) f3a8b9c] chore: initial commit' },
              { command: 'gh repo create my-project --private --source=. --push', output: 'https://github.com/you/my-project' },
            ]}
          />
        </div>

        <CalloutGrid>
          <Callout label="why -b main" tone="amber">
            The <code>-b main</code> flag sets the default branch to <code>main</code>. Without it
            you may get <code>master</code> or whatever your local git default is — renaming the
            default branch later is a small but annoying cleanup.
          </Callout>
          <Callout label="gh repo create">
            <code>gh repo create … --source=. --push</code> creates the empty repo on GitHub and
            wires it up as <code>origin</code> in one shot. Use <code>--public</code> for open
            work, <code>--private</code> for everything else.
          </Callout>
        </CalloutGrid>
      </Section>
    </>
  );
}
