/**
 * SoundboardContainer - Wrapper component managing tone state
 *
 * Coordinates ToneSelector and PinyinGrid with shared state
 */

import { useState, useCallback } from 'react';
import ToneSelector from './ToneSelector';
import PinyinGrid from './PinyinGrid';
import { audioService } from '../../lib/audio/AudioService';
import { getSyllable } from '../../data/pinyinSyllables';

export default function SoundboardContainer() {
  const [selectedTone, setSelectedTone] = useState<number>(1);
  const [lastSelectedSyllable, setLastSelectedSyllable] = useState<string | null>(null);

  const handleToneChange = useCallback((newTone: number) => {
    setSelectedTone(newTone);

    // Play the last selected syllable with the new tone if available
    if (lastSelectedSyllable) {
      const syllable = getSyllable(lastSelectedSyllable);
      if (syllable && syllable.tones.includes(newTone)) {
        audioService.play(`${lastSelectedSyllable}${newTone}`);
      }
    }
  }, [lastSelectedSyllable]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-background)'
    }}>
      <ToneSelector
        selectedTone={selectedTone}
        onToneChange={handleToneChange}
      />
      <PinyinGrid
        selectedTone={selectedTone}
        onSyllableSelect={setLastSelectedSyllable}
        selectedSyllable={lastSelectedSyllable}
      />
    </div>
  );
}
