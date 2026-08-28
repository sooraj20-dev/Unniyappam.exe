// ─────────────────────────────────────────────
//  IntroModal.tsx — Creative Kerala Culinary Welcome Modal
// ─────────────────────────────────────────────
import { audio } from '../audio/AudioManager';

interface IntroModalProps {
  onStart: () => void;
}

export function IntroModal({ onStart }: IntroModalProps) {
  const handleStart = () => {
    audio.playClick();
    audio.triggerHaptic('medium');
    audio.startBGM();
    onStart();
  };

  return (
    <div className="game-modal-overlay">
      <div className="game-card intro-card">
        <div className="card-top-tag">🌴 KERALA CULINARY SIMULATOR 3D 🌴</div>
        
        <div className="title-section">
          <div className="hero-appam-icon">🫓✨</div>
          <h1 className="game-title">ഉണ്ണിയപ്പം 3D</h1>
          <div className="malayalam-sub">Unniyappam 3D — നാടൻ തനിമയോടെ!</div>
        </div>

        <p className="intro-text">
          നല്ല നാടൻ പാളയംകോടൻ പഴവും, ശർക്കരപ്പാവും, വറുത്ത അരിപ്പൊടിയും വെളിച്ചെണ്ണയും ചേർത്ത് മൊരിഞ്ഞ <strong>ചൂട് ഉണ്ണിയപ്പം</strong> ഉണ്ടാക്കാം!
        </p>

        <div className="ingredients-pill-row">
          <span>🍌 പഴം (Banana)</span>
          <span>🥥 ശർക്കര (Jaggery)</span>
          <span>🌿 ഏലയ്ക്ക (Cardamom)</span>
          <span>🍚 അരിപ്പൊടി (Flour)</span>
          <span>🫕 അപ്പാച്ചട്ടി (Pan)</span>
        </div>

        <div className="funny-intro-quote">
          ⚠️ <em>മുന്നറിയിപ്പ്: ഇത് കളിക്കുമ്പോൾ ചായ കുടിക്കാൻ കൊതി വന്നാൽ കമ്പനി ഉത്തരവാദിയല്ല! ☕</em>
        </div>

        <button className="gold-action-btn big-play-btn" onClick={handleStart}>
          <span className="btn-mal">അടുക്കളയിലേക്ക് കടക്കാം!</span>
          <span className="btn-eng">Enter Kitchen & Start Cooking ➔</span>
        </button>
      </div>
    </div>
  );
}
