import { Section, Callout, CalloutGrid, ShaderDivider } from '../components/Section';
import BranchUniverse from '../components/BranchUniverse';

export default function Chapter4() {
  return (
    <>
      <Section eyebrow="04 / Parallel universes" title={<>Branches let you <span style={{ color: 'var(--green)' }}>experiment without</span> breaking <span style={{ color: 'var(--blue)' }}>main</span>.</>}>
        <div className="prose">
          <p>
            <strong>main</strong> is the canonical timeline of the project — the version that&apos;s
            running in production. When you want to try something without risking that, you cut a
            <em> branch</em>. Think of it as a parallel universe where your edits live until they&apos;re
            ready. Make commits there, iterate freely. When the work is reviewed, <em>merge</em> the
            branch back into main and the universe collapses — your commits land on the canonical
            timeline.
          </p>
          <p>
            Why bother? Because production code lives on main. If you experiment on main, every
            commit risks breaking what&apos;s deployed. Branches keep your experiments isolated until
            they&apos;re proven.
          </p>
        </div>
      </Section>

      <Section width="wide" eyebrow="run the simulation" title={<>Click through the <span style={{ color: 'var(--green)' }}>branch / commit / merge</span> sequence</>}>
        <BranchUniverse />
      </Section>

      <ShaderDivider palette="mixed" />

      <Section eyebrow="Naming convention" title={<>How we name branches in the <span style={{ color: 'var(--green)' }}>DS repo</span></>}>
        <div className="prose">
          <ul>
            <li><strong>feat/&lt;name&gt;</strong> — a new feature. <code>feat/button-loading</code></li>
            <li><strong>fix/&lt;name&gt;</strong> — a bug fix. <code>fix/input-focus-color</code></li>
            <li><strong>chore/&lt;name&gt;</strong> — housekeeping (deps, configs). <code>chore/bump-react</code></li>
          </ul>
          <p>
            One branch per unit of work. Open the PR within a day of cutting the branch — long-lived
            branches drift from main and become painful to merge.
          </p>
        </div>
        <CalloutGrid>
          <Callout label="auto-cleanup">
            The DS repo is set to <em>delete branches on merge</em> — you don&apos;t need to clean
            up after yourself.
          </Callout>
          <Callout label="never push to main" tone="amber">
            Direct pushes to main are blocked by branch protection. The release pipeline only runs against
            main and tags — keeping it clean keeps releases reliable.
          </Callout>
        </CalloutGrid>
      </Section>
    </>
  );
}
