import { Section, Callout, CalloutGrid, ShaderDivider } from '../components/Section';
import HabitGrid from '../components/HabitCard';

export default function Chapter7() {
  return (
    <>
      <Section eyebrow="07 / Habits" title={<>Five small rituals that <span style={{ color: 'var(--green)' }}>compound</span> over a career.</>}>
        <div className="prose">
          <p>
            Every git horror story you&apos;ll hear traces back to one of five missed habits. Adopt
            them now — none take more than a few extra seconds — and you skip the entire genre of
            problems they prevent.
          </p>
        </div>
      </Section>

      <Section width="wide" eyebrow="flip a card" title={<>Each card&apos;s back shows the <span style={{ color: 'var(--amber)' }}>failure mode</span> it prevents</>}>
        <HabitGrid />
      </Section>

      <ShaderDivider palette="green" />

      <Section eyebrow="One bonus" title={<>Pull <span style={{ color: 'var(--green)' }}>before</span> you push</>}>
        <div className="prose">
          <p>
            If you and a teammate both edited the repo, pulling first lets git fold their changes in
            cleanly. Skip this and you&apos;ll see <code>error: failed to push some refs</code> — git&apos;s
            polite way of saying &quot;you&apos;re behind, catch up first.&quot; The fix is one command:
            <code>git pull --rebase origin main</code>, then push again.
          </p>
        </div>
        <CalloutGrid>
          <Callout label="if you only remember one">
            Commit messages are gifts to your future self. Three months from now, you&apos;ll be
            grateful for any extra context past-you bothered to write.
          </Callout>
          <Callout label="ask for help" tone="blue">
            Stuck on a git error? Paste the full output into your team channel before guessing.
            The error usually names the exact command to run next — read it, don&apos;t panic.
          </Callout>
        </CalloutGrid>
      </Section>
    </>
  );
}
