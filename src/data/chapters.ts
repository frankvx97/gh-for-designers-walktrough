export interface ChapterMeta {
  num: number;
  slug: string;
  title: string;
  blurb: string;
  duration: string;
}

export const CHAPTERS: ChapterMeta[] = [
  {
    num: 1,
    slug: 'git-vs-github',
    title: 'Git is not GitHub',
    blurb: 'The two words get used interchangeably. They aren\'t the same thing — and confusing them confuses every conversation that follows.',
    duration: '3 min',
  },
  {
    num: 2,
    slug: 'four-states',
    title: 'The Four States of a File',
    blurb: 'Untracked, staged, committed, pushed. Every file in your repo is in exactly one. Once you see them, git stops feeling like magic.',
    duration: '4 min',
  },
  {
    num: 3,
    slug: 'designer-toolkit',
    title: 'Ten Commands You Actually Need',
    blurb: 'Git has hundreds of commands. Designers can ship with about ten. Here they are, in plain English.',
    duration: '5 min',
  },
  {
    num: 4,
    slug: 'branches',
    title: 'Branches — Parallel Universes',
    blurb: 'main is the canonical timeline. A branch is a parallel universe where your edits live until they\'re proven and merged back.',
    duration: '4 min',
  },
  {
    num: 5,
    slug: 'pull-requests',
    title: 'PRs — The Design Review of Code',
    blurb: 'A pull request is the closest analog to a Figma design review. Same etiquette, same craft — different artifact.',
    duration: '4 min',
  },
  {
    num: 6,
    slug: 'conventional-commits',
    title: 'Commits That Trigger Releases',
    blurb: 'Your commit message prefix isn\'t decoration. It tells release tooling whether to bump patch, minor, or major.',
    duration: '3 min',
  },
  {
    num: 7,
    slug: 'five-habits',
    title: 'Habits That Pay Off',
    blurb: 'Five small rituals that compound. Adopt them on day one and your future self will thank you.',
    duration: '3 min',
  },
  {
    num: 8,
    slug: 'ship-the-button',
    title: 'Ship the Button',
    blurb: 'Everything you just learned, applied: take a Button component to a pull request on a real design system repo.',
    duration: '5 min',
  },
];

export function chapterBySlug(slug: string | undefined): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function nextChapter(slug: string): ChapterMeta | null {
  const i = CHAPTERS.findIndex((c) => c.slug === slug);
  return i >= 0 && i < CHAPTERS.length - 1 ? CHAPTERS[i + 1] : null;
}

export function prevChapter(slug: string): ChapterMeta | null {
  const i = CHAPTERS.findIndex((c) => c.slug === slug);
  return i > 0 ? CHAPTERS[i - 1] : null;
}
