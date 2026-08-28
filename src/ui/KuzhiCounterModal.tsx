// ─────────────────────────────────────────────
//  KuzhiCounterModal.tsx — Hilarious Culinary Audit Stage UI
// ─────────────────────────────────────────────
import { audio } from '../audio/AudioManager';

interface KuzhiCounterModalProps {
  count: number;
  onResetCount: () => void;
  onSubmitCount: () => void;
}

export function KuzhiCounterModal({
  count,
  onResetCount,
  onSubmitCount,
}: KuzhiCounterModalProps) {
  const handleReset = () => {
    audio.playClick();
    audio.triggerHaptic('light');
    onResetCount();
  };

  const handleSubmit = () => {
    audio.playClick();
    audio.triggerHaptic('medium');
    onSubmitCount();
  };

  return (
    <div className="inspection-floating-card">
      <div className="inspection-tag">🔍 ഘട്ടം 9 — ഫൈനൽ ഓഡിറ്റിംഗ്</div>
      <h3 className="inspection-title">കുഴി എണ്ണുക! (Count Kuzhi)</h3>
      <p className="inspection-sub">
        അപ്പാച്ചട്ടിയിലെ ഓരോ കുഴിയും തൊട്ട് കൃത്യമായി എണ്ണി ഉറപ്പുവരുത്തൂ!
      </p>

      <div className="count-display-box">
        <span className="count-big-num">{count}</span>
        <span className="count-unit">/ 15 കുഴികൾ</span>
      </div>

      <div className="inspection-note">
        ⚡ <em>ഓഡിറ്റിംഗ് പൂർത്തിയാക്കാതെ ആരും അപ്പം തൊട്ടുപോകരുത്! 👮</em>
      </div>

      <div className="inspection-btn-row">
        <button
          className="subtle-btn"
          onClick={handleReset}
          disabled={count === 0}
        >
          റീസെറ്റ് ↺
        </button>
        <button
          className="gold-action-btn submit-btn"
          onClick={handleSubmit}
        >
          ഓഡിറ്റ് റിപ്പോർട്ട് സമർപ്പിക്കുക ({count}) ➔
        </button>
      </div>
    </div>
  );
}
