/**
 * Sentence Display
 *
 * Displays the Chinese sentence being translated with:
 * - Full sentence or partially revealed based on progress
 * - Two audio playback buttons (syllables / full sentence)
 * - Different modes: visual+audio, audio-only, visual-only
 */

import React from 'react';
import type { TranslatorQuestion } from '../../lib/quiz/translatorTypes';
import type { SentenceDisplayMode } from '../../lib/quiz/translatorTypes';

interface SentenceDisplayProps {
  question: TranslatorQuestion;
  revealedSlots: string[];
  displayMode: SentenceDisplayMode;
  onPlaySentence: () => void;
  onPlaySyllables: () => void;
  isPlaying?: boolean;
  playingMode?: 'sentence' | 'syllables' | null;
}

export function SentenceDisplay({
  question,
  revealedSlots,
  displayMode,
  onPlaySentence,
  onPlaySyllables,
  isPlaying = false,
  playingMode = null,
}: SentenceDisplayProps) {
  const showVisual = displayMode !== 'audio-only';

  // Build the revealed sentence parts
  const buildRevealedSentence = () => {
    const parts: { text: string; pinyin: string; revealed: boolean }[] = [];

    // Get the pattern's slot order
    const stepSlots = question.steps
      .filter(s => !s.isStructureStep)
      .map(s => s.slotId);

    // For each slot, check if it's revealed
    for (const slotId of stepSlots) {
      const word = question.selectedWords[slotId];
      if (!word) continue;

      const isRevealed = revealedSlots.includes(slotId);

      // Add connector if present (these are always shown)
      const step = question.steps.find(s => s.slotId === slotId);
      if (step) {
        const pattern = getPatternConnector(question.patternId, slotId);
        if (pattern.connector) {
          parts.push({
            text: pattern.connector,
            pinyin: pattern.connectorPinyin,
            revealed: true, // Connectors are always visible
          });
        }
      }

      parts.push({
        text: word.hanzi,
        pinyin: word.pinyin,
        revealed: isRevealed,
      });
    }

    // Add pattern-specific suffixes
    const suffix = getPatternSuffix(question.patternId);
    if (suffix.text) {
      parts.push({
        text: suffix.text,
        pinyin: suffix.pinyin,
        revealed: true,
      });
    }

    return parts;
  };

  const sentenceParts = buildRevealedSentence();
  const allRevealed = question.steps
    .filter(s => !s.isStructureStep)
    .every(s => revealedSlots.includes(s.slotId));

  return (
    <div className="sentence-display">
      {/* Audio buttons */}
      <div className="sentence-audio-buttons">
        <button
          className={`sentence-audio-btn ${isPlaying && playingMode === 'syllables' ? 'playing' : ''}`}
          onClick={onPlaySyllables}
          disabled={isPlaying}
          aria-label="Play syllable by syllable"
          title="Play syllable by syllable"
        >
          <span className="audio-icon">{isPlaying && playingMode === 'syllables' ? '🔊' : '▶'}</span>
          <span className="audio-label">Syllables</span>
        </button>
        <button
          className={`sentence-audio-btn ${isPlaying && playingMode === 'sentence' ? 'playing' : ''}`}
          onClick={onPlaySentence}
          disabled={isPlaying}
          aria-label="Play full sentence"
          title="Play full sentence"
        >
          <span className="audio-icon">{isPlaying && playingMode === 'sentence' ? '🔊' : '▶'}</span>
          <span className="audio-label">Sentence</span>
        </button>
      </div>

      {/* Sentence content */}
      <div className="sentence-content">
        {showVisual ? (
          <>
            {/* Hanzi row */}
            <div className="sentence-hanzi">
              {allRevealed ? (
                // Show full sentence when all parts revealed
                <span className="hanzi-text">{question.fullHanzi}</span>
              ) : (
                // Show partial sentence with blanks
                sentenceParts.map((part, idx) => (
                  <span
                    key={idx}
                    className={`hanzi-part ${part.revealed ? 'revealed' : 'hidden'}`}
                  >
                    {part.revealed ? part.text : '___'}
                  </span>
                ))
              )}
            </div>

            {/* Pinyin row */}
            <div className="sentence-pinyin">
              {allRevealed ? (
                <span className="pinyin-text">{question.fullPinyin}</span>
              ) : (
                sentenceParts.map((part, idx) => (
                  <span
                    key={idx}
                    className={`pinyin-part ${part.revealed ? 'revealed' : 'hidden'}`}
                  >
                    {part.revealed ? part.pinyin : '___'}
                  </span>
                ))
              )}
            </div>
          </>
        ) : (
          // Audio-only mode - show message
          <div className="audio-only-message">
            <p>Listen to the sentence and identify the meaning</p>
            <p className="audio-hint">Press spacebar to play sentence</p>
          </div>
        )}
      </div>

      {/* Show full English after all steps complete */}
      {allRevealed && revealedSlots.includes('structure') && (
        <div className="sentence-english">
          {question.fullEnglish}
        </div>
      )}
    </div>
  );
}

/**
 * Get connector for a pattern slot
 */
function getPatternConnector(patternId: string, slotId: string): { connector: string; connectorPinyin: string } {
  const connectors: Record<string, Record<string, { connector: string; connectorPinyin: string }>> = {
    'adj-pattern': {
      adjective: { connector: '很', connectorPinyin: 'hěn' },
    },
    'noun-pattern': {
      noun: { connector: '是', connectorPinyin: 'shì' },
    },
    'go-pattern': {
      place: { connector: '想去', connectorPinyin: 'xiǎng qù' },
    },
    'location-pattern': {
      place: { connector: '在', connectorPinyin: 'zài' },
    },
    'have-pattern': {
      object: { connector: '有', connectorPinyin: 'yǒu' },
    },
    'can-pattern': {
      skill: { connector: '会', connectorPinyin: 'huì' },
    },
    'want-pattern': {
      verb: { connector: '想', connectorPinyin: 'xiǎng' },
    },
    'too-pattern': {
      adjective: { connector: '太', connectorPinyin: 'tài' },
    },
  };

  return connectors[patternId]?.[slotId] || { connector: '', connectorPinyin: '' };
}

/**
 * Get suffix for a pattern
 */
function getPatternSuffix(patternId: string): { text: string; pinyin: string } {
  const suffixes: Record<string, { text: string; pinyin: string }> = {
    'too-pattern': { text: '了', pinyin: 'le' },
    'past-pattern': { text: '了', pinyin: 'le' },
    'q-verb-what': { text: '?', pinyin: '' },
    'q-who': { text: '?', pinyin: '' },
    'q-where': { text: '?', pinyin: '' },
    'q-how-many': { text: '?', pinyin: '' },
    'q-why': { text: '?', pinyin: '' },
    'q-when': { text: '?', pinyin: '' },
    'q-permission': { text: '吗?', pinyin: 'ma?' },
    'q-did-you': { text: '?', pinyin: '' },
    'q-how-so': { text: '?', pinyin: '' },
  };

  return suffixes[patternId] || { text: '', pinyin: '' };
}
