// ─────────────────────────────────────────────
//  AmmachiBubble.tsx — Live Malayalam Ammachi / Chef Commentary Bubble
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { audio } from '../audio/AudioManager';

interface AmmachiBubbleProps {
  currentText: string;
  avatar?: string;
  author?: string;
  onRefreshDialogue?: () => void;
}

export function AmmachiBubble({
  currentText,
  avatar = '👵',
  author = 'അമ്മായി',
  onRefreshDialogue,
}: AmmachiBubbleProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    setIsBouncing(true);
    const t = setTimeout(() => setIsBouncing(false), 500);
    return () => clearTimeout(t);
  }, [currentText]);

  const handleBubbleClick = () => {
    audio.playBoing();
    audio.triggerHaptic('light');
    if (onRefreshDialogue) {
      onRefreshDialogue();
    }
  };

  return (
    <div className={`ammachi-speech-wrapper ${isMinimized ? 'minimized' : ''}`}>
      <div
        className={`ammachi-avatar-btn ${isBouncing ? 'bounce-avatar' : ''}`}
        onClick={() => {
          setIsMinimized(!isMinimized);
          audio.playClick();
          audio.triggerHaptic('light');
        }}
        title={isMinimized ? 'അമ്മായിയുടെ കമന്ററി കാണൂ' : 'ചുരുക്കുക'}
      >
        <span className="avatar-emoji">{avatar}</span>
        <span className="avatar-ping-dot"></span>
      </div>

      {!isMinimized && (
        <div className="ammachi-bubble-card" onClick={handleBubbleClick}>
          <div className="bubble-header">
            <span className="author-badge">{author}യുടെ കമന്ററി</span>
            <button
              className="bubble-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
                audio.playClick();
              }}
            >
              ✕
            </button>
          </div>
          <p className="bubble-dialogue">{currentText}</p>
          <div className="bubble-hint">👆 തൊട്ടാൽ വേറെ കോമഡി കേൾക്കാം!</div>
        </div>
      )}
    </div>
  );
}
