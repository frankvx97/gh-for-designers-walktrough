import { Section, Callout, CalloutGrid, ShaderDivider } from '../components/Section';
import FileStateMachine from '../components/FileStateMachine';

export default function Chapter2() {
  return (
    <>
      <Section eyebrow="02 / The state machine" title={<>A file moves through <span style={{ color: 'var(--green)' }}>exactly four states.</span></>}>
        <div className="prose">
          <p>
            Run <code>git status</code> at any moment and git answers a single question:
            <em>which state is each file in right now?</em> Once you can name the four states, half of
            git&apos;s vocabulary suddenly maps to something concrete instead of feeling like incantation.
          </p>
        </div>
      </Section>

      <Section width="wide" eyebrow="interact" title={<>Click <span style={{ color: 'var(--green)' }}>Run</span> to advance the file</>}>
        <FileStateMachine />
      </Section>

      <ShaderDivider palette="blue" />

      <Section eyebrow="Plain English" title={<>What each <span style={{ color: 'var(--green)' }}>command</span> actually does</>}>
        <div className="prose">
          <ul>
            <li>
              <strong>Untracked</strong> — git knows the file <em>exists</em> on disk, but isn&apos;t watching
              it yet. <code>git add</code> changes that.
            </li>
            <li>
              <strong>Staged</strong> — you&apos;ve told git &quot;include this file&apos;s current contents in
              the next snapshot.&quot; The file isn&apos;t saved into history yet — it&apos;s just queued.
            </li>
            <li>
              <strong>Committed</strong> — you took the snapshot. The change is now permanent in
              your local history, with a message attached. Still 100% on your machine.
            </li>
            <li>
              <strong>Pushed</strong> — your committed snapshot is now also on GitHub. Teammates can
              pull it. CI can react to it.
            </li>
          </ul>
        </div>

        <CalloutGrid>
          <Callout label="rule of thumb">
            If you&apos;re ever lost, run <code>git status</code>. It always tells you what state every file is in,
            and what command to run next.
          </Callout>
          <Callout label="why two steps?" tone="blue">
            <em>Staged</em> exists so you can compose a commit out of multiple unrelated edits.
            Add only what belongs together — keep commits focused.
          </Callout>
        </CalloutGrid>
      </Section>
    </>
  );
}
