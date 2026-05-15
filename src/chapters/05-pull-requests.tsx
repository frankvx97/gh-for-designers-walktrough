import { Section, Callout, CalloutGrid, ShaderDivider } from '../components/Section';
import PrCard from '../components/PrCard';

export default function Chapter5() {
  return (
    <>
      <Section eyebrow="05 / Pull requests" title={<>The <span style={{ color: 'var(--green)' }}>design review</span> of code.</>}>
        <div className="prose">
          <p>
            A <strong>pull request (PR)</strong> is GitHub&apos;s review tool. It bundles together
            everything that changed on a branch, asks teammates to look at it, lets them comment
            line-by-line, and gates merging into main on their approval. It&apos;s the closest analog
            to a Figma design review you&apos;ll find — except the artifact is code instead of mocks.
          </p>
          <p>
            Three things make a good PR (same as a good Figma file you hand off):
            <strong> a clear title</strong> that names the change,
            <strong> a description</strong> that explains the <em>why</em> (the diff already shows
            the <em>what</em>), and <strong>small enough to review in 10 minutes</strong>. A
            45-minute PR gets rubber-stamped, not reviewed.
          </p>
        </div>
      </Section>

      <Section width="wide" eyebrow="anatomy" title={<>Toggle between a <span style={{ color: 'var(--green)' }}>good</span> and a <span style={{ color: 'var(--amber)' }}>rushed</span> PR</>}>
        <PrCard />
      </Section>

      <ShaderDivider palette="blue" />

      <Section eyebrow="What to write" title={<>The good PR <span style={{ color: 'var(--green)' }}>checklist</span></>}>
        <div className="prose">
          <ul>
            <li><strong>What</strong> — one line: &quot;Adds a loading prop to Button.&quot;</li>
            <li><strong>Why</strong> — the motivation, not the diff. &quot;Async actions need consistent feedback.&quot;</li>
            <li><strong>Figma link</strong> — paste the node link so reviewers can compare visually.</li>
            <li><strong>Storybook URL</strong> — local during draft, deploy-preview once CI runs.</li>
            <li><strong>How to review</strong> — three bullets a reviewer can run in 30 seconds.</li>
            <li><strong>Screenshots</strong> — drag a Storybook screenshot in. Front-load the visual.</li>
          </ul>
        </div>
        <CalloutGrid>
          <Callout label="conventional commits">
            On the DS repo we squash-merge, so the PR title <em>becomes</em> the commit message on main.
            Use a Conventional Commit prefix (<code>feat:</code>, <code>fix:</code>, <code>chore:</code>) — it drives semver.
          </Callout>
          <Callout label="don't" tone="amber">
            Don&apos;t commit to your PR after approvals without re-requesting review.
            Reviewers approve a snapshot — new commits invalidate that snapshot.
          </Callout>
        </CalloutGrid>
      </Section>
    </>
  );
}
