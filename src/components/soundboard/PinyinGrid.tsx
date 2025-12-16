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

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import SyllableButton from './SyllableButton';
import { PINYIN_SYLLABLES, getSyllablesByInitial } from '../../data/pinyinSyllables';
import { INITIALS, INITIAL_GROUPS } from '../../data/pinyinInitials';
import { FINALS, FINAL_GROUPS } from '../../data/pinyinFinals';
import { addToneMarks } from '../../lib/utils/pinyinUtils';
import { audioService } from '../../lib/audio/AudioService';

interface PinyinGridProps {
  selectedTone: number;
  onSyllableSelect?: (pinyin: string) => void;
  selectedSyllable?: string | null;
}

export default function PinyinGrid({ selectedTone, onSyllableSelect, selectedSyllable }: PinyinGridProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

  // Get active finals (rows with at least one syllable)
  const activeFinals = useMemo(() => {
    return FINALS.filter(final => {
      const row = gridData.get(final);
      return row && row.size > 0;
    });
  }, [gridData]);

  // Build a 2D array for keyboard navigation
  const gridMatrix = useMemo(() => {
    return activeFinals.map(final => {
      const row = gridData.get(final)!;
      return activeInitials.map(initial => row.get(initial) || null);
    });
  }, [activeFinals, activeInitials, gridData]);

  // Find first valid cell
  const findFirstValidCell = useCallback(() => {
    for (let row = 0; row < gridMatrix.length; row++) {
      for (let col = 0; col < gridMatrix[row].length; col++) {
        if (gridMatrix[row][col]) {
          return { row, col };
        }
      }
    }
    return { row: 0, col: 0 };
  }, [gridMatrix]);

  // Initialize selection to first syllable on mount
  useEffect(() => {
    if (!selectedSyllable) {
      const first = findFirstValidCell();
      const syllable = gridMatrix[first.row]?.[first.col];
      if (syllable) {
        onSyllableSelect?.(syllable);
      }
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(e.key)) {
        return;
      }

      // Don't handle if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      e.preventDefault();

      // Find current position based on selectedSyllable
      let currentRow = 0;
      let currentCol = 0;

      if (selectedSyllable) {
        for (let r = 0; r < gridMatrix.length; r++) {
          for (let c = 0; c < gridMatrix[r].length; c++) {
            if (gridMatrix[r][c] === selectedSyllable) {
              currentRow = r;
              currentCol = c;
              break;
            }
          }
        }
      }

      // Handle Enter/Space to play sound
      if (e.key === 'Enter' || e.key === ' ') {
        if (selectedSyllable) {
          audioService.play(`${selectedSyllable}${selectedTone}`);
        }
        return;
      }

      // Calculate new position
      let newRow = currentRow;
      let newCol = currentCol;

      const findNextValid = (startRow: number, startCol: number, dRow: number, dCol: number) => {
        let r = startRow + dRow;
        let c = startCol + dCol;

        // Wrap around
        while (r >= 0 && r < gridMatrix.length && c >= 0 && c < gridMatrix[0].length) {
          if (gridMatrix[r][c]) {
            return { row: r, col: c };
          }
          r += dRow;
          c += dCol;
        }
        return null;
      };

      let next: { row: number; col: number } | null = null;

      switch (e.key) {
        case 'ArrowUp':
          next = findNextValid(currentRow, currentCol, -1, 0);
          break;
        case 'ArrowDown':
          next = findNextValid(currentRow, currentCol, 1, 0);
          break;
        case 'ArrowLeft':
          next = findNextValid(currentRow, currentCol, 0, -1);
          break;
        case 'ArrowRight':
          next = findNextValid(currentRow, currentCol, 0, 1);
          break;
      }

      if (next) {
        const syllable = gridMatrix[next.row][next.col];
        if (syllable) {
          onSyllableSelect?.(syllable);
          audioService.play(`${syllable}${selectedTone}`);

          // Scroll cell into view, accounting for sticky headers
          setTimeout(() => {
            const cell = gridRef.current?.querySelector(`[data-syllable="${syllable}"]`) as HTMLElement;
            const scrollContainer = gridRef.current;
            if (cell && scrollContainer) {
              const cellRect = cell.getBoundingClientRect();
              const containerRect = scrollContainer.getBoundingClientRect();

              // Get sticky header dimensions
              const rowHeader = scrollContainer.querySelector('.final-header') as HTMLElement;
              const colHeader = scrollContainer.querySelector('.initial-header') as HTMLElement;
              const rowHeaderWidth = rowHeader?.offsetWidth || 80;
              const colHeaderHeight = colHeader?.offsetHeight || 50;

              // Calculate visible area (excluding sticky headers)
              const visibleLeft = containerRect.left + rowHeaderWidth;
              const visibleTop = containerRect.top + colHeaderHeight;
              const visibleRight = containerRect.right;
              const visibleBottom = containerRect.bottom;

              // Check if cell is outside visible area and scroll if needed
              if (cellRect.left < visibleLeft) {
                // Cell is hidden behind row header - scroll left
                scrollContainer.scrollLeft -= (visibleLeft - cellRect.left + 10);
              } else if (cellRect.right > visibleRight) {
                // Cell is beyond right edge - scroll right
                scrollContainer.scrollLeft += (cellRect.right - visibleRight + 10);
              }

              if (cellRect.top < visibleTop) {
                // Cell is hidden behind column header - scroll up
                scrollContainer.scrollTop -= (visibleTop - cellRect.top + 10);
              } else if (cellRect.bottom > visibleBottom) {
                // Cell is beyond bottom edge - scroll down
                scrollContainer.scrollTop += (cellRect.bottom - visibleBottom + 10);
              }
            }
          }, 0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSyllable, selectedTone, gridMatrix, onSyllableSelect]);

  return (
    <div className="pinyin-grid-container">
      <div className="pinyin-grid-scroll" ref={gridRef}>
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
                            onSelect={onSyllableSelect}
                            isSelected={syllable === selectedSyllable}
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
