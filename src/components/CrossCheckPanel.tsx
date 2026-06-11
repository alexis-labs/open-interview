import { getCrossCheckRows } from '../game/engine/discrepancyEngine';
import { useGameStore } from '../game/store/gameStore';

export function CrossCheckPanel() {
  const candidateIndex = useGameStore((s) => s.candidateIndex);
  const candidates = useGameStore((s) => s.candidates);
  const phase = useGameStore((s) => s.phase);

  if (phase !== 'playing') return null;

  const candidate = candidates[candidateIndex];
  if (!candidate) return null;

  const rows = getCrossCheckRows(candidate);

  return (
    <div className="cross-check cross-check--inline">
      <table className="cross-check__table">
        <thead>
          <tr>
            <th>Check</th>
            <th>Application</th>
            <th>ID</th>
            <th>Resume</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{row.application}</td>
              <td>{row.idBadge}</td>
              <td>{row.resume}</td>
              <td>{row.reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
