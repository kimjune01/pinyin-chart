/**
 * HanziChart - Main container for Chinese character learning
 *
 * Features:
 * - HSK level tabs (1-6)
 * - Search/filter functionality
 * - Character count display
 * - Responsive layout
 */

import { useState, useMemo } from 'react';
import HanziGrid from './HanziGrid';
import {
  getCharactersByLevel,
  getAvailableLevels,
  searchCharacters,
} from '../../data/hskCharacters';
import '../../styles/hanzi.css';

interface HanziChartProps {
  initialLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export default function HanziChart({ initialLevel = 1 }: HanziChartProps) {
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | 4 | 5 | 6>(initialLevel);
  const [searchQuery, setSearchQuery] = useState('');

  const availableLevels = getAvailableLevels();

  // Get characters for current view
  const characters = useMemo(() => {
    if (searchQuery.trim()) {
      return searchCharacters(searchQuery);
    }
    return getCharactersByLevel(selectedLevel);
  }, [selectedLevel, searchQuery]);

  const handleLevelChange = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    setSelectedLevel(level);
    setSearchQuery('');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="hanzi-chart">
      {/* Search bar */}
      <div className="hanzi-header">
        <div className="hanzi-search">
          <input
            type="text"
            placeholder="Search by character, pinyin, or meaning..."
            value={searchQuery}
            onChange={handleSearch}
            className="hanzi-search-input"
            aria-label="Search characters"
          />
          {searchQuery && (
            <button
              className="hanzi-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Level tabs */}
      {!searchQuery && (
        <div className="hanzi-level-tabs" role="tablist">
          {([1, 2, 3, 4, 5, 6] as const).map((level) => {
            const hasData = availableLevels.includes(level);
            const count = hasData ? getCharactersByLevel(level).length : 0;

            return (
              <button
                key={level}
                role="tab"
                aria-selected={selectedLevel === level}
                className={`hanzi-level-tab ${selectedLevel === level ? 'active' : ''} ${!hasData ? 'disabled' : ''}`}
                onClick={() => hasData && handleLevelChange(level)}
                disabled={!hasData}
              >
                <span className="tab-level">HSK {level}</span>
                <span className="tab-count">{count > 0 ? count : '—'}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Character grid */}
      <div className="hanzi-grid-container">
        <HanziGrid characters={characters} />
      </div>

      {/* Keyboard hint */}
      <div className="hanzi-keyboard-hint">
        <span>Arrow keys to navigate</span>
        <span>Enter or Space to play audio</span>
      </div>
    </div>
  );
}
