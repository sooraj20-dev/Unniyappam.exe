// ─────────────────────────────────────────────
//  ResultScreen.tsx — Official Kerala Zero Productivity Certificate & Meme Chef
// ─────────────────────────────────────────────
import { useMemo } from 'react';
import { audio } from '../audio/AudioManager';
import { FUNNY_TITLES } from '../utils/malayalamContent';
import chefMemeImg from '../assets/chef_meme.jpg';

interface ResultScreenProps {
  timeElapsedMs: number;
  kuzhiCounted: number;
  onReplay: () => void;
}

export function ResultScreen({
  timeElapsedMs,
  kuzhiCounted,
  onReplay,
}: ResultScreenProps) {
  const totalSeconds = Math.max(1, Math.floor(timeElapsedMs / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  // Pick a title based on time / random seed
  const funnyTitle = useMemo(() => {
    const idx = Math.floor(Math.random() * FUNNY_TITLES.length);
    return FUNNY_TITLES[idx] || FUNNY_TITLES[0];
  }, []);

  const handleReplay = () => {
    audio.playSuccessChime();
    audio.triggerHaptic('medium');
    onReplay();
  };

  const handleShareWhatsApp = () => {
    audio.playClick();
    const shareText = `ഞാൻ ഇപ്പൊ 15 കുഴി എണ്ണി ചൂട് ഉണ്ണിയപ്പം ഉണ്ടാക്കി! 😂\n\n"അപ്പം തിന്നാൽ പോരെ കുഴി എണ്ണണോ?!"\n\nഎന്റെ നേട്ടം: ${funnyTitle.title} (${funnyTitle.sub})\nസമയം: ${minutes}:${seconds}\nനിങ്ങളും ഉണ്ണിയപ്പം ഉണ്ടാക്കി നോക്കൂ! 🫓☕`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="game-modal-overlay">
      <div className="game-card result-card">
        <div className="card-top-tag">📜 OFFICIAL KERALA CERTIFICATE 📜</div>

        {/* Certificate Header */}
        <div className="certificate-header">
          <span className="cert-seal-icon">🥇</span>
          <h2 className="result-heading">ഔദ്യോഗിക കുഴി എണ്ണൽ സർട്ടിഫിക്കറ്റ്</h2>
          <div className="cert-subtitle">Certificate of Zero Productivity & Culinary Excellence</div>
        </div>

        {/* Meme Chef Showcase Section */}
        <div className="meme-chef-container">
          <div className="meme-chef-frame">
            <img
              src={chefMemeImg}
              alt="Meme Kerala Master Chef"
              className="meme-chef-img"
              loading="eager"
            />
            <div className="chef-stamp-badge">
              <span>തനി നാടൻ</span>
              <strong>APPROVED ✓</strong>
            </div>
          </div>
          <div className="meme-chef-caption">
            <span className="chef-caption-title">ഷെഫ് ഉണ്ണി നമ്പൂതിരി 👨‍🍳</span>
            <span className="chef-caption-sub">"അപ്പം തിന്നാൽ പോരെ കുഴി എണ്ണണോ?!" ഇൻസ്പെക്ഷൻ സമിതി ചെയർമാൻ</span>
          </div>
        </div>

        {/* Assigned Funny Title */}
        <div className="user-title-badge">
          <div className="user-title-name">{funnyTitle.title}</div>
          <div className="user-title-eng">{funnyTitle.sub}</div>
          <div className="user-title-desc">"{funnyTitle.desc}"</div>
        </div>

        {/* Stats Grid */}
        <div className="compact-stats-list">
          <div className="stat-line">
            <span>ഉണ്ണിയപ്പം ക്രിസ്പിനെസ്സ് (Crispiness)</span>
            <strong className="c-green">100% ✨</strong>
          </div>
          <div className="stat-line">
            <span>മാവ് കുഴച്ച മെയ്‌വഴക്കം (Mixing)</span>
            <strong className="c-green">99% 🥣</strong>
          </div>
          <div className="stat-line">
            <span>അമ്മായിയമ്മ അപ്രൂവൽ (Ammayi Approval)</span>
            <strong className="c-green">99.9% 👵</strong>
          </div>
          <div className="stat-line">
            <span>കുഴി എണ്ണിയ കൃത്യത (Kuzhi Counted)</span>
            <strong className="c-orange">{kuzhiCounted} / 15 ({Math.round((kuzhiCounted / 15) * 100)}%)</strong>
          </div>
          <div className="stat-line highlight-zero">
            <span>യഥാർത്ഥ പ്രയോജനം (Usefulness)</span>
            <strong className="c-red">0% (പൂജ്യം) 😂</strong>
          </div>
          <div className="stat-line">
            <span>പാഴാക്കിയ സമയം (Time Wasted)</span>
            <strong className="c-gold">{minutes} മിനുട്ട് {seconds} സെക്കൻഡ്</strong>
          </div>
          <div className="stat-line">
            <span>ഉണ്ടാക്കിയ ഉണ്ണിയപ്പം (Total Appams)</span>
            <strong className="c-gold">15 എണ്ണം 🫓</strong>
          </div>
        </div>

        <p className="result-closing-quote">
          "അഭിനന്ദനങ്ങൾ! ഈ ഉദ്യമത്തിലൂടെ നിങ്ങൾ വിലപ്പെട്ട കുറച്ചു സമയം വിജയകരമായി പാഴാക്കിയിരിക്കുന്നു. ഇനി ചായ കുടിക്ക്!" ☕
        </p>

        <div className="result-actions-row">
          <button className="whatsapp-share-btn" onClick={handleShareWhatsApp}>
            📲 WhatsApp-ൽ ഷെയർ ചെയ്യൂ
          </button>
          <button className="gold-action-btn" onClick={handleReplay}>
            🫓 വീണ്ടും ഉണ്ടാക്കാം (Replay) ➔
          </button>
        </div>
      </div>
    </div>
  );
}
