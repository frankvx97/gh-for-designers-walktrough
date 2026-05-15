import { Section, Callout, CalloutGrid, ShaderDivider } from '../components/Section';
import CommandGrid from '../components/CommandPill';

export default function Chapter3() {
  return (
    <>
      <Section eyebrow="03 / The minimum viable git" title={<>Ten commands cover <span style={{ color: 'var(--green)' }}>95%</span> of designer use.</>}>
        <div className="prose">
          <p>
            Git has a sprawling surface area — hundreds of commands, dozens of flags each. None of
            that matters for shipping your first component. The set below is what designers reach
            for daily; the rest you can learn the day you actually need it (you&apos;ll know).
          </p>
        </div>
      </Section>

      <Section width="wide" eyebrow="explore" title={<>Tap a tile to see <span style={{ color: 'var(--green)' }}>plain-English meaning</span> + a live demo</>}>
        <CommandGrid />
      </Section>

      <ShaderDivider palette="green" />

      <Section eyebrow="One outlier" title={<><span style={{ color: 'var(--blue)' }}>gh</span> is not git</>}>
        <div className="prose">
          <p>
            One of the ten — <code>gh pr create</code> — is from <strong>GitHub CLI</strong>, not
            git itself. <code>gh</code> is a separate tool published by GitHub for tasks that
            involve the website: opening pull requests, triaging issues, managing releases. You can
            do all of these in the browser instead — the CLI is just faster once you&apos;re in the
            terminal already.
          </p>
        </div>
        <CalloutGrid>
          <Callout label="install">
            <code>brew install gh</code> on macOS, then <code>gh auth login</code> once. After that,
            <code>gh</code> works alongside git in any repo.
          </Callout>
          <Callout label="when to skip the cli" tone="blue">
            Reviewing other people&apos;s PRs, leaving comments, merging — easier in the browser.
            Opening your own PR right after a push — easier in the terminal with <code>gh pr create</code>.
          </Callout>
        </CalloutGrid>
      </Section>
    </>
  );
}
