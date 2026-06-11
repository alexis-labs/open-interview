import { buildReferenceBulletin } from '../game/data/referenceBulletin';
import { getCrossCheckRows } from '../game/engine/discrepancyEngine';
import { useGameStore } from '../game/store/gameStore';

export function VerificationPanel() {
  const candidateIndex = useGameStore((s) => s.candidateIndex);
  const candidates = useGameStore((s) => s.candidates);
  const ruleContext = useGameStore((s) => s.ruleContext);
  const phase = useGameStore((s) => s.phase);

  if (phase !== 'playing') return null;

  const candidate = candidates[candidateIndex];
  if (!candidate) return null;

  const rows = getCrossCheckRows(candidate);
  const bulletin = buildReferenceBulletin(ruleContext.salaryCap);

  return (
    <aside className="verify-col">
      <header className="verify-col__header">
        <span className="verify-col__label">INSPECTOR DESK</span>
        <span className="verify-col__status">RULEBOOK · REFERENCE</span>
      </header>

      <section className="verify-col__section">
        <h3 className="verify-col__title">Cross-Reference</h3>
        <p className="verify-col__hint">Compare values yourself — no auto-verdict.</p>
        <table className="verify-col__table verify-col__table--wide">
          <thead>
            <tr>
              <th>Field</th>
              <th>App</th>
              <th>ID</th>
              <th>CV</th>
              <th>Ref</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className={row.ok ? 'verify-col__row--even' : 'verify-col__row--uneven'}
              >
                <td>{row.label}</td>
                <td>{row.application}</td>
                <td>{row.idBadge}</td>
                <td>{row.resume}</td>
                <td>{row.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="verify-col__section verify-col__section--bulletin">
        <h3 className="verify-col__title">Reference Bulletin</h3>
        <dl className="verify-col__bulletin">
          <div>
            <dt>Today</dt>
            <dd>{bulletin.gameDate}</dd>
          </div>
          <div>
            <dt>Approved roles</dt>
            <dd>{bulletin.approvedRoles.join(' · ')}</dd>
          </div>
          <div>
            <dt>Min experience</dt>
            <dd>
              {bulletin.minExperience.map((e) => `${e.role.split(' ')[0]} ${e.years}+`).join(' · ')}
            </dd>
          </div>
          <div>
            <dt>Salary cap</dt>
            <dd>${bulletin.salaryCap.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Verified refs</dt>
            <dd>{bulletin.verifiedCompanies.join(', ')}</dd>
          </div>
        </dl>
      </section>

      <footer className="verify-col__footer">
        <span>Violations revealed only after you stamp.</span>
      </footer>
    </aside>
  );
}
