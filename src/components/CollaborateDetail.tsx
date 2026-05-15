import Terminal from './Terminal';
import GhMockup from './GhMockup';
import { Callout, CalloutGrid } from './Section';
import styles from './CommandPill.module.css';

export default function CollaborateDetail() {
  return (
    <div className={styles.collab}>
      <div className={styles.collabIntro}>
        <div className={styles.detailCmd}>collaborate on github</div>
        <p className={styles.detailEnglish}>
          Two moves that live outside the daily ten — but you&apos;ll do them every time you join a
          new repo. <strong>Clone</strong> pulls a copy of the code onto your laptop;{' '}
          <strong>fork</strong> gives you your own GitHub copy when you don&apos;t have write access
          to the original.
        </p>
      </div>

      <div className={styles.collabBlock}>
        <div className={styles.collabEyebrow}>▸ git clone — copy a repo onto your machine</div>
        <p className={styles.collabBody}>
          Before you can edit anything, you need the repo on your laptop. <code>git clone</code>{' '}
          downloads the full history of a remote repository — every branch, every commit — and sets
          up <code>origin</code> as a pointer back to the GitHub copy. You do this once per repo,
          not once per session.
        </p>
        <Terminal
          title="> clone"
          loop
          steps={[
            { command: 'git clone https://github.com/acme/my-design-system.git' },
            { prompt: '', output: "Cloning into 'my-design-system'...\nReceiving objects: 100% (842/842), 1.2 MiB | 4.1 MiB/s\nResolving deltas: 100% (312/312), done." },
            { command: 'cd my-design-system' },
            { command: 'git status' },
            { prompt: '', output: 'On branch main\nYour branch is up to date with \'origin/main\'.' },
          ]}
        />
        <CalloutGrid>
          <Callout label="ssh vs https">
            HTTPS works everywhere and prompts for a token. SSH (<code>git@github.com:acme/repo.git</code>) is
            slightly faster to set up once and avoids the token prompt — pick one and stick with it.
          </Callout>
          <Callout label="clone ≠ fork" tone="blue">
            Cloning gives you a local copy of someone else&apos;s repo, but you still can&apos;t push to it.
            If you don&apos;t have write access, you fork first, then clone the fork.
          </Callout>
        </CalloutGrid>
      </div>

      <div className={styles.collabBlock}>
        <div className={styles.collabEyebrow}>▸ fork — your own copy on GitHub (UI, not terminal)</div>
        <p className={styles.collabBody}>
          A fork is GitHub&apos;s answer to &quot;I want to contribute to this project but I&apos;m
          not on the team.&quot; It creates a copy of the repo <em>under your account</em> that you
          can freely push to. From there: clone your fork, branch, push, and open a PR back to the
          original. Forking happens in the GitHub UI — there&apos;s no <code>git fork</code> command.
        </p>

        <div className={styles.forkSteps}>
          <div>
            <div className={styles.forkStepLabel}>step 1 — click Fork on the repo page</div>
            <GhMockup
              url="github.com/acme/my-design-system"
              owner="acme"
              repo="my-design-system"
              highlightFork
            />
          </div>
          <div>
            <div className={styles.forkStepLabel}>step 2 — pick your account as the owner, then Create fork</div>
            <GhMockup
              url="github.com/acme/my-design-system/fork"
              owner="acme"
              repo="my-design-system"
              showForkDropdown
              forkTargetOwner="your-username"
            />
          </div>
          <div>
            <div className={styles.forkStepLabel}>step 3 — clone your fork (not the original)</div>
            <Terminal
              title="> clone the fork"
              loop
              steps={[
                { command: 'git clone https://github.com/your-username/my-design-system.git' },
                { command: 'cd my-design-system' },
                { command: 'git remote add upstream https://github.com/acme/my-design-system.git' },
                { command: 'git remote -v' },
                { prompt: '', output: 'origin    https://github.com/your-username/my-design-system.git (push)\nupstream  https://github.com/acme/my-design-system.git (fetch)' },
              ]}
            />
          </div>
        </div>

        <CalloutGrid>
          <Callout label="origin vs upstream" tone="blue">
            <code>origin</code> is your fork — you push here. <code>upstream</code> is the original
            repo — you pull from it to stay in sync. Adding the upstream remote is the one extra step
            forks need that regular clones don&apos;t.
          </Callout>
          <Callout label="when to fork">
            Contributing to open source, or to a repo where you don&apos;t have write access. If
            you&apos;re on the team and can push branches directly, skip the fork — just clone and
            branch.
          </Callout>
        </CalloutGrid>
      </div>
    </div>
  );
}
