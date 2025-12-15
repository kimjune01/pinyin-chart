/**
 * SandwichStack - Visual sandwich with stacked ingredient layers
 */

import { addToneMarks } from '../../../lib/utils/pinyinUtils';

type AnimationState = 'idle' | 'building' | 'complete' | 'shipping' | 'falling' | 'reset';

interface SandwichStackProps {
  initial: string | null;
  final: string | null;
  tone: number | null;
  basePinyin?: string;
  animationState: AnimationState;
  onAnimationEnd?: () => void;
}

const TONE_MARKS: Record<number, string> = {
  1: 'ˉ',
  2: 'ˊ',
  3: 'ˇ',
  4: 'ˋ',
};

export default function SandwichStack({
  initial,
  final,
  tone,
  basePinyin,
  animationState,
  onAnimationEnd,
}: SandwichStackProps) {
  const isComplete = initial !== null && final !== null && tone !== null;

  // Get full pinyin with tone mark for display
  const getFullPinyin = (): string => {
    if (basePinyin && tone) {
      return addToneMarks(basePinyin, tone);
    }
    if (initial && final && tone) {
      return addToneMarks(`${initial}${final}`, tone);
    }
    return '';
  };

  const handleAnimationEnd = () => {
    if (onAnimationEnd) {
      onAnimationEnd();
    }
  };

  return (
    <div className="conveyor-container">
      {/* Conveyor belt */}
      <div className={`conveyor-belt ${animationState === 'shipping' ? 'fast' : ''}`}>
        <div className="conveyor-stripes" />
      </div>

      {/* Sandwich station */}
      <div
        className={`sandwich-stack sandwich-${animationState}`}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* Bottom bun (always visible) */}
        <div className="sandwich-layer layer-base">
          <span className="layer-icon">🍞</span>
        </div>

        {/* Initial layer (lettuce) */}
        <div className={`sandwich-layer layer-initial ${initial ? 'visible' : ''}`}>
          <span className="layer-text">{initial || ''}</span>
          <span className="layer-emoji">🥬</span>
        </div>

        {/* Final layer (patty) */}
        <div className={`sandwich-layer layer-final ${final ? 'visible' : ''}`}>
          <span className="layer-text">{final || ''}</span>
          <span className="layer-emoji">🍖</span>
        </div>

        {/* Tone layer (cheese) */}
        <div className={`sandwich-layer layer-tone ${tone ? 'visible' : ''}`}>
          <span className="layer-text">{tone ? TONE_MARKS[tone] : ''}</span>
          <span className="layer-emoji">🧀</span>
        </div>

        {/* Top bun (appears when complete) */}
        <div className={`sandwich-layer layer-top ${isComplete ? 'visible' : ''}`}>
          <span className="layer-icon">🍞</span>
        </div>

        {/* Full pinyin display when complete */}
        {isComplete && animationState !== 'falling' && (
          <div className="sandwich-label">
            {getFullPinyin()}
          </div>
        )}
      </div>

      {/* Rails */}
      <div className="conveyor-rail conveyor-rail-left" />
      <div className="conveyor-rail conveyor-rail-right" />
    </div>
  );
}
