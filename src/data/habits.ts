export interface Habit {
  num: number;
  rule: string;
  detail: string;
  failure: string;
}

export const HABITS: Habit[] = [
  {
    num: 1,
    rule: 'Commit early, commit often',
    detail: 'Five small commits beat one giant one for both review and rollback.',
    failure: 'Two-day mega-commit nobody can review or revert cleanly.',
  },
  {
    num: 2,
    rule: 'Pull before you push',
    detail: 'If a teammate edited the repo, pulling first folds their changes in cleanly.',
    failure: 'error: failed to push some refs to origin — rejected (non-fast-forward).',
  },
  {
    num: 3,
    rule: 'Never commit secrets',
    detail: '.env files, API keys, tokens. The starter\'s .gitignore blocks the obvious ones — don\'t fight it.',
    failure: 'Token leaked to a public repo. GitHub auto-revokes; your DM\'s blow up.',
  },
  {
    num: 4,
    rule: 'Never force-push to a shared branch',
    detail: 'It rewrites history under your reviewers\' feet. Force-push only on your own feature branch, and only before review.',
    failure: 'Your reviewer\'s local branch points at commits that no longer exist.',
  },
  {
    num: 5,
    rule: 'Commit messages are gifts to future you',
    detail: 'Write the message as if you\'ll read it in three months trying to remember why.',
    failure: 'git log shows 40 commits that all say "fix" or "wip". Useless.',
  },
];
