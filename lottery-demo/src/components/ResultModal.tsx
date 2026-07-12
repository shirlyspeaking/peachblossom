import type { DrawPhase, Person } from '../lib/types';

type Props = {
  open: boolean;
  phase: DrawPhase;
  winners: Person[];
  onClose: () => void;
};

export function ResultModal({ open, phase, winners, onClose }: Props) {
  if (!open || winners.length === 0) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="result-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="result-eyebrow">{phase === 'finished' ? '本輪中選' : '揭曉中'}</p>
        <h2 id="result-title" className="result-title">
          {winners.map((w) => w.name).join('、')}
        </h2>
        <ul className="result-list">
          {winners.map((w) => (
            <li key={w.id}>{w.name}</li>
          ))}
        </ul>
        <button type="button" className="btn btn-primary" onClick={onClose}>
          知道了
        </button>
      </div>
    </div>
  );
}
