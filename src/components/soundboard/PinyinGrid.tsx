/**
 * PinyinGrid - Main pinyin soundboard grid
 *
 * Pivot table layout:
 * - Columns: Initials (consonants)
 * - Rows: Finals (vowels/rhymes)
 * - Cells: Valid syllable combinations
 *
 * Features:
 * - Responsive horizontal and vertical scrolling
 * - Row/column headers
 * - Highlight row/column on hover
 * - Empty cells for invalid combinations
 */

import { useState, useMemo } from 'react';
import SyllableButton from './SyllableButton';
import { PINYIN_SYLLABLES, getSyllablesByInitial } from '../../data/pinyinSyllables';
import { INITIALS, INITIAL_GROUPS } from '../../data/pinyinInitials';
import { FINALS, FINAL_GROUPS } from '../../data/pinyinFinals';
import { addToneMarks } from '../../lib/utils/pinyinUtils';

interface PinyinGridProps {
  selectedTone: number;
}

export default function PinyinGrid({ selectedTone }: PinyinGridProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);

  // Build grid data structure
  const gridData = useMemo(() => {
    const grid = new Map<string, Map<string, string>>();

    // Initialize all rows (finals)
    FINALS.forEach(final => {
      grid.set(final, new Map());
    });

    // Fill in valid syllables
    PINYIN_SYLLABLES.forEach(syllable => {
      if (syllable.tones.includes(selectedTone)) {
        const row = grid.get(syllable.final);
        if (row) {
          row.set(syllable.initial, syllable.pinyin);
        }
      }
    });

    return grid;
  }, [selectedTone]);

  // Get unique initials that have at least one syllable for this tone
  const activeInitials = useMemo(() => {
    return INITIALS.filter(initial => {
      return PINYIN_SYLLABLES.some(s =>
        s.initial === initial && s.tones.includes(selectedTone)
      );
    });
  }, [selectedTone]);

  return (
    <div className="pinyin-grid-container">
      <div className="pinyin-grid-scroll">
        <table className="pinyin-grid">
          <thead>
            <tr>
              <th className="corner-cell">
                <div className="corner-labels">
                  <span className="corner-initial">Initials →</span>
                  <span className="corner-final">Finals ↓</span>
                </div>
              </th>
              {activeInitials.map((initial) => (
                <th
                  key={initial}
                  className={`initial-header ${hoveredCol === initial ? 'highlighted' : ''}`}
                  onMouseEnter={() => setHoveredCol(initial)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  <span className="initial-label">{initial || '∅'}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FINALS.map((final) => {
              const row = gridData.get(final);
              if (!row || row.size === 0) return null; // Skip empty rows

              return (
                <tr
                  key={final}
                  className={hoveredRow === final ? 'highlighted' : ''}
                  onMouseEnter={() => setHoveredRow(final)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <th className="final-header">
                    <span className="final-label">{final}</span>
                  </th>
                  {activeInitials.map((initial) => {
                    const syllable = row.get(initial);

                    if (syllable) {
                      const displayPinyin = addToneMarks(syllable, selectedTone);
                      return (
                        <td
                          key={`${final}-${initial}`}
                          className={`syllable-cell ${
                            hoveredRow === final || hoveredCol === initial ? 'highlighted' : ''
                          }`}
                        >
                          <SyllableButton
                            pinyin={syllable}
                            tone={selectedTone}
                            displayPinyin={displayPinyin}
                          />
                        </td>
                      );
                    }

                    return (
                      <td key={`${final}-${initial}`} className="syllable-cell empty">
                        <div className="empty-cell">—</div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
