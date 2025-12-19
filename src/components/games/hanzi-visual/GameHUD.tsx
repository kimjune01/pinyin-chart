/**
 * GameHUD - Displays current Hanzi or Emoji, score, and controls
 */

import type { GameDirection } from './visualGameEngine';

interface GameHUDProps {
  hanzi: string;
  emoji?: string;
  meaning?: string;
  pinyin?: string;
  score: number;
  streak: number;
  progress: { current: number; total: number };
  onPlayAudio: () => void;
  isPlayingAudio: boolean;
  direction: GameDirection;
  onBack: () => void;
  onReset: () => void;
}

export default function GameHUD({
  hanzi,
  emoji,
  meaning,
  pinyin,
  score,
  streak,
  progress,
  onPlayAudio,
  isPlayingAudio,
  direction,
  onBack,
  onReset,
}: GameHUDProps) {
  const isReverse = direction === 'emoji-to-hanzi';

  return (
    <div className="game-hud">
      <div className="hud-nav">
        <button
          type="button"
          className="nav-btn"
          onClick={onBack}
          aria-label="Back to topics"
        >
          ←
        </button>
        <button
          type="button"
          className="nav-btn"
          onClick={onReset}
          aria-label="Reset game"
        >
          ↺
        </button>
      </div>

      {isReverse ? (
        <div className="current-emoji">{emoji}</div>
      ) : (
        <div className="current-hanzi">{hanzi}</div>
      )}

      <div className="audio-row">
        {isReverse && meaning && <span className="current-meaning">{meaning}</span>}
        <button
          type="button"
          className="audio-btn"
          onClick={onPlayAudio}
          disabled={isPlayingAudio}
          aria-label="Play pronunciation"
        >
          {isPlayingAudio ? '...' : '🔊'}
        </button>
        {pinyin && <span className="current-pinyin">{pinyin}</span>}
      </div>

      <div className="game-stats">
        <div className="stat">
          <span>Score:</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat">
          <span>Streak:</span>
          <span className="stat-value">{streak}🔥</span>
        </div>
        <div className="stat">
          <span>Progress:</span>
          <span className="stat-value">{progress.current}/{progress.total}</span>
        </div>
      </div>
    </div>
  );
}
