export interface CommandRow {
  cmd: string;
  short: string;
  english: string;
  example?: { prompt: string; out?: string }[];
  setup?: {
    headline: string;
    error: { command?: string; output?: string; prompt?: string }[];
    body: string;
    fix: { command?: string; output?: string; prompt?: string }[];
  };
  extension?: {
    eyebrow: string;
    headline: string;
    body: string;
    terms: {
      title: string;
      steps: { command?: string; output?: string; prompt?: string }[];
    }[];
  };
  tone: 'green' | 'blue' | 'amber';
}

export const COMMANDS: CommandRow[] = [
  {
    cmd: 'git status',
    short: 'status',
    english: 'What state is each file in right now?',
    example: [
      { prompt: '$ git status' },
      { prompt: '', out: 'On branch feat/button-component\nUntracked files:\n  src/components/atoms/Button/' },
    ],
    setup: {
      headline: 'No git yet? Initialize it first.',
      error: [
        { command: 'git status', output: 'fatal: not a git repository (or any of the parent directories): .git' },
      ],
      body: 'If git status returns this error, the folder isn\'t tracked yet. Run git init with main as the default branch — once per project.',
      fix: [
        { command: 'git init -b main', output: 'Initialized empty Git repository in ./.git/' },
      ],
    },
    tone: 'green',
  },
  {
    cmd: 'git add <file>',
    short: 'add',
    english: 'Include this file in my next snapshot.',
    example: [
      { prompt: '$ git add src/components/atoms/Button' },
    ],
    tone: 'green',
  },
  {
    cmd: 'git add .',
    short: 'add .',
    english: 'Include every change in my next snapshot.',
    example: [
      { prompt: '$ git add .' },
    ],
    tone: 'amber',
  },
  {
    cmd: 'git commit -m "msg"',
    short: 'commit',
    english: 'Take a snapshot. Here\'s what I changed and why.',
    example: [
      { prompt: '$ git commit -m "feat(button): add Button atom"' },
      { prompt: '', out: '[feat/button-component a1b2c3d] feat(button): add Button atom\n 3 files changed, 142 insertions(+)' },
    ],
    tone: 'green',
  },
  {
    cmd: 'git push',
    short: 'push',
    english: 'Send my snapshots to GitHub.',
    example: [
      { prompt: '$ git push -u origin feat/button-component' },
      { prompt: '', out: 'Branch \'feat/button-component\' set up to track remote branch.' },
    ],
    tone: 'blue',
  },
  {
    cmd: 'git pull',
    short: 'pull',
    english: 'Get the latest snapshots from GitHub onto my machine.',
    example: [
      { prompt: '$ git pull --rebase origin main' },
    ],
    tone: 'blue',
  },
  {
    cmd: 'git checkout -b feat/<name>',
    short: 'checkout -b',
    english: 'Cut a new branch called feat/<name> and switch to it.',
    example: [
      { prompt: '$ git checkout -b feat/button-component' },
      { prompt: '', out: 'Switched to a new branch \'feat/button-component\'' },
    ],
    tone: 'green',
  },
  {
    cmd: 'git checkout main',
    short: 'checkout',
    english: 'Switch back to the main branch.',
    example: [
      { prompt: '$ git checkout main' },
    ],
    tone: 'green',
  },
  {
    cmd: 'git log --oneline',
    short: 'log',
    english: 'Show me a list of recent commits, one per line.',
    example: [
      { prompt: '$ git log --oneline' },
      { prompt: '', out: 'a1b2c3d feat(button): add Button atom\n5e6f7g8 chore: scaffold design system\nf3a8b9c initial commit' },
    ],
    tone: 'blue',
  },
  {
    cmd: 'gh pr create',
    short: 'pr create',
    english: 'Open a pull request from my current branch. (GitHub CLI, not git.)',
    example: [
      { prompt: '$ gh pr create --fill' },
      { prompt: '', out: 'https://github.com/yourname/my-design-system/pull/42' },
    ],
    extension: {
      eyebrow: '// after review — merge it',
      headline: 'A PR ends in a merge.',
      body: 'Once reviewers approve, the PR is merged: your branch\'s commits are folded into main and the parallel universe collapses back into the canonical timeline. In the browser, click Merge pull request. From the terminal, use the gh CLI or the raw git commands below.',
      terms: [
        {
          title: '> merge via gh',
          steps: [
            { command: 'gh pr merge 42 --squash --delete-branch' },
            { prompt: '', output: '✓ Squashed and merged pull request #42\n✓ Deleted branch feat/button-component' },
          ],
        },
        {
          title: '> or merge with git',
          steps: [
            { command: 'git checkout main' },
            { command: 'git pull' },
            { command: 'git merge --squash feat/button-component' },
            { command: 'git commit -m "feat(button): add Button atom (#42)"' },
            { command: 'git push' },
          ],
        },
      ],
    },
    tone: 'blue',
  },
];
