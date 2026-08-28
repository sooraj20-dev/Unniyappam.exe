// ─────────────────────────────────────────────
//  PrankModal.tsx — The Legendary Kerala Meme Reveal Screen with Mocking Meme
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { audio } from '../audio/AudioManager';
import prankMockImg from '../assets/prank_mock.jpg';

interface PrankModalProps {
  onContinueToResult: () => void;
}

export function PrankModal({ onContinueToResult }: PrankModalProps) {
  const [prankStage, setPrankStage] = useState<'checking' | 'verifying' | 'almost' | 'reveal'>('checking');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPrankStage('verifying');
    }, 1200);

    const t2 = setTimeout(() => {
      setPrankStage('almost');
    }, 2400);

    const t3 = setTimeout(() => {
      audio.playPrankSting();
      audio.triggerHaptic('heavy');
      setPrankStage('reveal');
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="game-modal-overlay prank-overlay">
      {prankStage !== 'reveal' ? (
        <div className="game-card suspense-card">
          <div className="mini-spinner"></div>
          <div className="suspense-msg">
            {prankStage === 'checking' && 'വിദഗ്ദ്ധ സമിതി പരിശോധിക്കുന്നു... (Analyzing...)'}
            {prankStage === 'verifying' && 'കണക്കുകൾ തിട്ടപ്പെടുത്തുന്നു... (Verifying Kuzhi Count...)'}
            {prankStage === 'almost' && 'റിസൾട്ട് തയ്യാറാവുന്നു... (Almost Done...)'}
          </div>
        </div>
      ) : (
        <div className="game-card prank-card bounce-in">
          {/* Mocking Character Showcase */}
          <div className="prank-mock-img-wrapper">
            <img
              src={prankMockImg}
              alt="Mocking Malayali Meme"
              className="prank-mock-img"
              loading="eager"
            />
            <div className="prank-mock-badge">
              <span>😂 തനി മടിയൻ സ്പെഷ്യൽ</span>
            </div>
          </div>

          <div className="prank-headline-group">
            <h1 className="prank-malayalam-punch">അപ്പം തിന്നാൽ പോരെ, കുഴി എണ്ണുകയാണോ?!</h1>
            <h2 className="prank-main-punch">Appam thinna pore Kuzhi ennano?!</h2>
          </div>

          <div className="prank-explain-box">
            <p className="prank-explain-text">
              പഴം ഉടച്ച്, ശർക്കര കാച്ചി, ഏലക്ക പൊടിച്ച്, അരിപ്പൊടി കുഴച്ച്, ചട്ടി ചൂടാക്കി, വെളിച്ചെണ്ണയൊഴിച്ച് ഉണ്ണിയപ്പം ഉണ്ടാക്കിയിട്ട്...
            </p>
            <p className="prank-explain-highlight">
              അവസാനം ഒഴിഞ്ഞ ചട്ടിയിലെ കുഴി എണ്ണാൻ ഇരുന്ന ആ മഹാമനസ്കത ഉണ്ടല്ലോ... <strong>അതാണ് അളിയാ അന്തസ്സ്! 🏆</strong>
            </p>
            <p className="prank-explain-footer">
              അപ്പം തണുത്തു പോകും മുമ്പ് എടുത്ത് തിന്ന് പോ മക്കളെ! 🤤☕
            </p>
          </div>

          <button
            className="gold-action-btn big-play-btn"
            onClick={() => {
              audio.playClick();
              audio.triggerHaptic('medium');
              onContinueToResult();
            }}
          >
            <span className="btn-mal">മണ്ടത്തരത്തിന്റെ കണക്കുകൾ കാണൂ ➔</span>
            <span className="btn-eng">View Your Zero Productivity Certificate ➔</span>
          </button>
        </div>
      )}
    </div>
  );
}
