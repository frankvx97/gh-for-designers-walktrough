import { Section, Callout, CalloutGrid, ShaderDivider } from '../components/Section';
import CommitInput from '../components/CommitInput';

export default function Chapter6() {
  return (
    <>
      <Section eyebrow="06 / Commit messages that ship" title={<>Your prefix isn&apos;t decoration — it <span style={{ color: 'var(--green)' }}>triggers</span> the release.</>}>
        <div className="prose">
          <p>
            On the DS repo, every commit message starts with a type prefix.
            The prefix isn&apos;t decoration — it tells our release tooling whether to bump
            <em> patch</em>, <em>minor</em>, or <em>major</em>. <code>feat:</code> triggers a minor
            bump, <code>fix:</code> triggers a patch, anything with <code>BREAKING CHANGE</code> in
            the body or a <code>!</code> after the type triggers a major.
          </p>
        </div>
      </Section>

      <Section width="wide" eyebrow="try a message" title={<>Type a commit. Watch the <span style={{ color: 'var(--green)' }}>version bump</span> light up.</>}>
        <CommitInput />
      </Section>

      <ShaderDivider palette="green" />

      <Section eyebrow="The cheat sheet" title={<>Six prefixes you&apos;ll <span style={{ color: 'var(--green)' }}>actually use</span></>}>
        <div className="prose">
          <ul>
            <li><strong>feat:</strong> &nbsp; a new feature for users.</li>
            <li><strong>fix:</strong> &nbsp; a bug fix.</li>
            <li><strong>chore:</strong> &nbsp; housekeeping (dependencies, configs).</li>
            <li><strong>docs:</strong> &nbsp; documentation only.</li>
            <li><strong>refactor:</strong> &nbsp; code change that doesn&apos;t change behavior.</li>
            <li><strong>test:</strong> &nbsp; adding or fixing tests.</li>
          </ul>
        </div>
        <CalloutGrid>
          <Callout label="optional scope">
            <code>feat(button): add loading state</code> — the <code>(button)</code> is the scope. It
            tells reviewers which component changed at a glance. Skip it if the change is repo-wide.
          </Callout>
          <Callout label="when to use major" tone="amber">
            If a consumer will need to change <em>any</em> code after upgrading, it&apos;s a major.
            Full stop. &quot;It&apos;s just a rename&quot; is still a major. The 10 seconds saved by
            calling it minor costs every consumer 10 minutes of debugging.
          </Callout>
        </CalloutGrid>
      </Section>
    </>
  );
}
