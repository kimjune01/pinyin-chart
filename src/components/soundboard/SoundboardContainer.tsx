/**
 * SoundboardContainer - Wrapper component managing tone state
 *
 * Coordinates ToneSelector and PinyinGrid with shared state
 */

import { useState } from 'react';
import ToneSelector from './ToneSelector';
import PinyinGrid from './PinyinGrid';

export default function SoundboardContainer() {
  const [selectedTone, setSelectedTone] = useState<number>(1);

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
        onToneChange={setSelectedTone}
      />
      <PinyinGrid
        selectedTone={selectedTone}
      />
    </div>
  );
}
