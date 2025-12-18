/**
 * GameHUD - Displays current Hanzi, score, and controls
 */

interface GameHUDProps {
  hanzi: string;
  pinyin?: string;
  score: number;
  streak: number;
  progress: { current: number; total: number };
  onPlayAudio: () => void;
  isPlayingAudio: boolean;
}

export default function GameHUD({
  hanzi,
  pinyin,
  score,
  streak,
  progress,
  onPlayAudio,
  isPlayingAudio,
}: GameHUDProps) {
  return (
    <div className="game-hud">
      <div className="current-hanzi">{hanzi}</div>

      <div className="audio-row">
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
