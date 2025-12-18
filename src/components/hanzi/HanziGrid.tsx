/**
 * HanziGrid - Grid display of Chinese characters
 *
 * Features:
 * - CSS Grid layout (responsive columns)
 * - Keyboard navigation (arrows + Enter/Space)
 * - Characters sorted alphabetically by pinyin
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import HanziCard from './HanziCard';
import type { HSKCharacter } from '../../data/hskCharacters';

interface HanziGridProps {
  characters: HSKCharacter[];
  onCharacterSelect?: (character: HSKCharacter) => void;
}

export default function HanziGrid({ characters, onCharacterSelect }: HanziGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const gridRef = useRef<HTMLDivElement>(null);

  // Sort characters by pinyin
  const sortedCharacters = [...characters].sort((a, b) =>
    a.pinyin.localeCompare(b.pinyin)
  );

  const handleSelect = useCallback((character: HSKCharacter) => {
    const index = sortedCharacters.findIndex(c => c.hanzi === character.hanzi);
    setSelectedIndex(index);
    onCharacterSelect?.(character);
  }, [sortedCharacters, onCharacterSelect]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gridRef.current) return;

      // Get current grid columns from computed style
      const gridStyle = window.getComputedStyle(gridRef.current);
      const columns = gridStyle.gridTemplateColumns.split(' ').length;

      let newIndex = selectedIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          newIndex = Math.min(selectedIndex + 1, sortedCharacters.length - 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = Math.max(selectedIndex - 1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newIndex = Math.min(selectedIndex + columns, sortedCharacters.length - 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          newIndex = Math.max(selectedIndex - columns, 0);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < sortedCharacters.length) {
            handleSelect(sortedCharacters[selectedIndex]);
          }
          return;
        default:
          return;
      }

      if (newIndex !== selectedIndex && newIndex >= 0) {
        setSelectedIndex(newIndex);
        // Scroll the new selection into view
        const card = gridRef.current?.children[newIndex] as HTMLElement;
        card?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, sortedCharacters, handleSelect]);

  if (characters.length === 0) {
    return (
      <div className="hanzi-grid-empty">
        <p>No characters found for this level yet.</p>
      </div>
    );
  }

  return (
    <div className="hanzi-grid" ref={gridRef} role="grid" tabIndex={0}>
      {sortedCharacters.map((character, index) => (
        <HanziCard
          key={`${character.hanzi}-${index}`}
          character={character}
          isSelected={index === selectedIndex}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
