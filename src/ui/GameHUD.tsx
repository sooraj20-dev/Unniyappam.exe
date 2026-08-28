// ─────────────────────────────────────────────
//  GameHUD.tsx — Mobile-Friendly Creative Kerala HUD
// ─────────────────────────────────────────────
import { useState } from 'react';
import type { GamePhase } from '../types/game';
import { VISIBLE_PHASES } from '../types/game';
import { MALAYALAM_PHASE_CONTENT } from '../utils/malayalamContent';
import { audio } from '../audio/AudioManager';

interface GameHUDProps {
  phase: GamePhase;
  isMuted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
  objectiveMalayalam: string;
  objectiveEnglish: string;
  isOverheating?: boolean;
  onRotateCamera?: (angle: 'iso' | 'close' | 'top' | 'side') => void;
}

export function GameHUD({
  phase,
  isMuted,
  onToggleMute,
  onReset,
  objectiveMalayalam,
  objectiveEnglish,
  isOverheating,
  onRotateCamera,
}: GameHUDProps) {
  const [showCameraMenu, setShowCameraMenu] = useState(false);

  if (phase === 'INTRO' || phase === 'PRANK' || phase === 'RESULT') {
    return null;
  }

  const currentIndex = VISIBLE_PHASES.indexOf(phase);
  const currentStep = currentIndex !== -1 ? currentIndex + 1 : 1;
  const totalSteps = VISIBLE_PHASES.length;
  const phaseContent = MALAYALAM_PHASE_CONTENT[phase] || {
    malayalamTitle: 'ഉണ്ണിയപ്പം',
    englishTitle: 'Cooking',
    tag: '',
  };

  const handleCameraSelect = (angle: 'iso' | 'close' | 'top' | 'side') => {
    audio.playClick();
    audio.triggerHaptic('light');
    onRotateCamera?.(angle);
    setShowCameraMenu(false);
  };

  return (
    <div className="game-hud-overlay">
      {/* ── Top Bar ───────────────────────────────── */}
      <div className="hud-top-bar">
        {/* Top-Left: Mini Title Badge */}
        <div className="mini-badge">
          <span className="badge-emoji">🫓</span>
          <div className="badge-text-col">
            <span className="badge-name">ഉണ്ണിയപ്പം 3D</span>
            <span className="badge-sub">unniyappam.exe</span>
          </div>
        </div>

        {/* Top-Center: Compact Step Progression */}
        <div className="compact-progression">
          <div className="step-dots-row">
            {VISIBLE_PHASES.map((p, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <div
                  key={p}
                  className={`mini-dot ${isCurrent ? 'active' : ''} ${isPast ? 'done' : ''}`}
                  title={`${idx + 1}. ${MALAYALAM_PHASE_CONTENT[p]?.malayalamTitle || p}`}
                >
                  {isPast ? '✓' : idx + 1}
                </div>
              );
            })}
          </div>
          <div className="step-title-text">
            <span className="step-num-pill">{currentStep}/{totalSteps}</span>
            <strong className="step-mal-title">{phaseContent.malayalamTitle}</strong>
            <span className="step-eng-title">({phaseContent.englishTitle})</span>
          </div>
        </div>

        {/* Top-Right: Controls */}
        <div className="mini-controls">
          {onRotateCamera && (
            <div className="camera-control-wrapper">
              <button
                className={`icon-btn camera-toggle-btn ${showCameraMenu ? 'active' : ''}`}
                onClick={() => {
                  audio.playClick();
                  setShowCameraMenu(!showCameraMenu);
                }}
                title="3D ക്യാമറ മാറ്റുക / Camera Angles"
              >
                🎥
              </button>

              {/* Camera Presets Menu (Responsive Dropdown / Floating Row) */}
              {showCameraMenu && (
                <div className="camera-presets-dropdown">
                  <button
                    className="cam-menu-item"
                    onClick={() => handleCameraSelect('iso')}
                  >
                    📐 ഐസോമെട്രിക് (Iso)
                  </button>
                  <button
                    className="cam-menu-item"
                    onClick={() => handleCameraSelect('close')}
                  >
                    🔍 ക്ലോസ് അപ്പ് (Close)
                  </button>
                  <button
                    className="cam-menu-item"
                    onClick={() => handleCameraSelect('top')}
                  >
                    ⬇️ ടോപ്പ് വ്യൂ (Top)
                  </button>
                  <button
                    className="cam-menu-item"
                    onClick={() => handleCameraSelect('side')}
                  >
                    🔄 സൈഡ് വ്യൂ (Side)
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="icon-btn"
            onClick={() => {
              audio.triggerHaptic('light');
              onToggleMute();
            }}
            title={isMuted ? 'ശബ്ദം ഓൺ ചെയ്യുക / Unmute' : 'ശബ്ദം ഓഫ് ചെയ്യുക / Mute'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button
            className="icon-btn"
            onClick={() => {
              audio.playBoing();
              audio.triggerHaptic('medium');
              onReset();
            }}
            title="ആദ്യം മുതൽ തുടങ്ങുക / Restart"
          >
            ↺
          </button>
        </div>
      </div>

      {/* ── Floating Contextual Objective ─────────── */}
      <div className={`floating-objective ${isOverheating ? 'overheat-warning-box' : ''}`}>
        <span className="obj-icon">{isOverheating ? '🔥⚠️' : '💡'}</span>
        <div className="obj-text-wrapper">
          <span className="obj-text-mal">{objectiveMalayalam}</span>
          <span className="obj-text-eng">{objectiveEnglish}</span>
        </div>
        <span className="obj-hint-3d">✦ 3D തിരിക്കാൻ സ്ക്രീനിൽ തൊട്ട് വലിക്കൂ</span>
      </div>
    </div>
  );
}
