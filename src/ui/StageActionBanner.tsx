// ─────────────────────────────────────────────
//  StageActionBanner.tsx — Sleek Mobile-First Malayalam Action Dock
// ─────────────────────────────────────────────
import type { GamePhase, HeatLevel, IngredientState, KuzhiState, KuzhiId } from '../types/game';
import { audio } from '../audio/AudioManager';

interface StageActionBannerProps {
  phase: GamePhase;
  ingredients: IngredientState;
  onAddAllIngredients: () => void;
  mixProgress: number;
  onFastMix: () => void;
  heatLevel: HeatLevel;
  onSetHeat: (level: HeatLevel) => void;
  onFillAllOil: () => void;
  onFillAllBatter: () => void;
  kuzhiStates: Record<KuzhiId, KuzhiState>;
  onFlipAll: () => void;
  onServeAppam: () => void;
  onAdvance: () => void;
}

export function StageActionBanner({
  phase,
  ingredients,
  onAddAllIngredients,
  mixProgress,
  onFastMix,
  heatLevel,
  onSetHeat,
  onFillAllOil,
  onFillAllBatter,
  kuzhiStates,
  onFlipAll,
  onServeAppam,
  onAdvance,
}: StageActionBannerProps) {
  if (phase === 'INTRO' || phase === 'COUNT_KUZHI' || phase === 'PRANK' || phase === 'RESULT') {
    return null;
  }

  // 1. Ingredients Stage
  if (phase === 'PREPARE_INGREDIENTS') {
    const allAdded = ingredients.banana && ingredients.jaggery && ingredients.cardamom && ingredients.batter;
    return (
      <div className="compact-action-pill">
        {!allAdded ? (
          <button
            className="subtle-btn big-touch-btn"
            onClick={() => {
              audio.playClick();
              audio.triggerHaptic('light');
              onAddAllIngredients();
            }}
          >
            <span className="btn-main-txt">🍌🥥 ചേരുവകൾ എല്ലാം ചേർക്കുക</span>
            <span className="btn-sub-txt">Quick Add All</span>
          </button>
        ) : (
          <button
            className="gold-action-btn pulse-glow big-touch-btn"
            onClick={() => {
              audio.playClick();
              audio.triggerHaptic('medium');
              onAdvance();
            }}
          >
            <span className="btn-main-txt">മാവ് കുഴക്കാൻ തുടങ്ങാം ➔</span>
            <span className="btn-sub-txt">Proceed to Mixing</span>
          </button>
        )}
      </div>
    );
  }

  // 2. Mix Batter Stage
  if (phase === 'MIX_BATTER') {
    const isDone = mixProgress >= 100;
    return (
      <div className="compact-action-pill mix-pill">
        <div className="mini-progress-track">
          <div className="mini-progress-fill" style={{ width: `${mixProgress}%` }}></div>
        </div>
        {!isDone ? (
          <button
            className="subtle-btn big-touch-btn"
            onClick={() => {
              audio.triggerHaptic('light');
              onFastMix();
            }}
          >
            <span className="btn-main-txt">🥄 വേഗത്തിൽ ഇളക്കുക ({Math.round(mixProgress)}%)</span>
            <span className="btn-sub-txt">Quick Stir</span>
          </button>
        ) : (
          <button
            className="gold-action-btn pulse-glow big-touch-btn"
            onClick={() => {
              audio.playClick();
              audio.triggerHaptic('medium');
              onAdvance();
            }}
          >
            <span className="btn-main-txt">മാവ് റെഡി! ചട്ടി ചൂടാക്കാം ➔</span>
            <span className="btn-sub-txt">Batter Ready! Heat Pan</span>
          </button>
        )}
      </div>
    );
  }

  // 3. Heat Pan Stage
  if (phase === 'HEAT_PAN') {
    return (
      <div className="compact-action-pill heat-pill">
        <div className="heat-chips">
          <button
            className={`heat-chip ${heatLevel === 'LOW' ? 'selected' : ''}`}
            onClick={() => {
              audio.triggerHaptic('light');
              onSetHeat('LOW');
            }}
          >
            <span>ചെറുതീ</span>
            <small>Low</small>
          </button>
          <button
            className={`heat-chip ${heatLevel === 'MEDIUM' ? 'selected' : ''}`}
            onClick={() => {
              audio.triggerHaptic('medium');
              onSetHeat('MEDIUM');
            }}
          >
            <span>പാകം ✨</span>
            <small>Medium</small>
          </button>
          <button
            className={`heat-chip ${heatLevel === 'HIGH' ? 'selected' : ''}`}
            onClick={() => {
              audio.triggerHaptic('heavy');
              audio.playWarningBuzzer();
              onSetHeat('HIGH');
            }}
          >
            <span>കൂടിയ തീ 🔥</span>
            <small>High</small>
          </button>
        </div>
        {heatLevel === 'MEDIUM' && (
          <button
            className="gold-action-btn pulse-glow big-touch-btn"
            onClick={() => {
              audio.playClick();
              audio.triggerHaptic('medium');
              onAdvance();
            }}
          >
            <span className="btn-main-txt">എണ്ണ ഒഴിക്കാം ➔</span>
            <span className="btn-sub-txt">Add Coconut Oil</span>
          </button>
        )}
      </div>
    );
  }

  // 4. Add Oil Stage
  if (phase === 'ADD_OIL') {
    const oiledCount = Object.values(kuzhiStates).filter(k => k.fillState !== 'EMPTY').length;
    const allOiled = oiledCount === 15;

    return (
      <div className="compact-action-pill">
        {!allOiled ? (
          <button
            className="subtle-btn big-touch-btn"
            onClick={() => {
              audio.triggerHaptic('light');
              onFillAllOil();
            }}
          >
            <span className="btn-main-txt">🫒 15 കുഴിയിലും വെളിച്ചെണ്ണ ഒഴിക്കുക</span>
            <span className="btn-sub-txt">Fill All Cavities ({oiledCount}/15)</span>
          </button>
        ) : (
          <button
            className="gold-action-btn pulse-glow big-touch-btn"
            onClick={() => {
              audio.playClick();
              audio.triggerHaptic('medium');
              onAdvance();
            }}
          >
            <span className="btn-main-txt">മാവൊഴിക്കാൻ തുടങ്ങാം ➔</span>
            <span className="btn-sub-txt">All Oiled! Pour Batter</span>
          </button>
        )}
      </div>
    );
  }

  // 5. Pour Batter Stage
  if (phase === 'POUR_BATTER') {
    const batterCount = Object.values(kuzhiStates).filter(
      k => k.fillState === 'BATTER' || k.fillState === 'COOKING' || k.fillState === 'READY'
    ).length;
    const allBatter = batterCount === 15;

    return (
      <div className="compact-action-pill">
        {!allBatter ? (
          <button
            className="subtle-btn big-touch-btn"
            onClick={() => {
              audio.triggerHaptic('light');
              onFillAllBatter();
            }}
          >
            <span className="btn-main-txt">🥣 15 കുഴിയിലും മാവൊഴിക്കുക</span>
            <span className="btn-sub-txt">Fill All Cavities ({batterCount}/15)</span>
          </button>
        ) : (
          <button
            className="gold-action-btn pulse-glow big-touch-btn"
            onClick={() => {
              audio.playClick();
              audio.triggerHaptic('medium');
              onAdvance();
            }}
          >
            <span className="btn-main-txt">മൊരിഞ്ഞു വരട്ടെ ➔</span>
            <span className="btn-sub-txt">Start Sizzling</span>
          </button>
        )}
      </div>
    );
  }

  // 6. Cook Stage
  if (phase === 'COOK') {
    return (
      <div className="compact-action-pill">
        <button
          className="gold-action-btn pulse-glow big-touch-btn"
          onClick={() => {
            audio.playClick();
            audio.triggerHaptic('medium');
            onAdvance();
          }}
        >
          <span className="btn-main-txt">മറിച്ചിടാൻ റെഡി ➔</span>
          <span className="btn-sub-txt">Ready to Flip</span>
        </button>
      </div>
    );
  }

  // 7. Flip Stage
  if (phase === 'FLIP') {
    const flippedCount = Object.values(kuzhiStates).filter(k => k.isFlipped).length;
    const allFlipped = flippedCount === 15;

    return (
      <div className="compact-action-pill">
        {!allFlipped ? (
          <button
            className="subtle-btn big-touch-btn"
            onClick={() => {
              audio.triggerHaptic('light');
              onFlipAll();
            }}
          >
            <span className="btn-main-txt">🔄 15 അപ്പങ്ങളും മറിച്ചിടുക</span>
            <span className="btn-sub-txt">Flip All ({flippedCount}/15)</span>
          </button>
        ) : (
          <button
            className="gold-action-btn pulse-glow big-touch-btn"
            onClick={() => {
              audio.playClick();
              audio.triggerHaptic('medium');
              onAdvance();
            }}
          >
            <span className="btn-main-txt">രണ്ടു വശവും മൊരിഞ്ഞു! വിളമ്പാം ➔</span>
            <span className="btn-sub-txt">Crispy Both Sides! Serve</span>
          </button>
        )}
      </div>
    );
  }

  // 8. Serve Stage
  if (phase === 'SERVE') {
    return (
      <div className="compact-action-pill">
        <button
          className="gold-action-btn pulse-glow big-touch-btn"
          onClick={() => {
            audio.playClick();
            audio.triggerHaptic('heavy');
            onServeAppam();
          }}
        >
          <span className="btn-main-txt">🍃 വാഴയിലയിൽ വിളമ്പുക 🎉</span>
          <span className="btn-sub-txt">Serve on Banana Leaf Plate</span>
        </button>
      </div>
    );
  }

  return null;
}
