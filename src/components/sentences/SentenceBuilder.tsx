/**
 * SentenceBuilder - Interactive sentence construction component
 *
 * Teaches Chinese sentence patterns by letting learners:
 * - Select a pattern (e.g., Subject + 很 + Adjective)
 * - Choose words for each slot
 * - Hear the constructed sentence
 * - Understand key grammar rules (是 vs 很)
 */

import { useState, useCallback } from 'react';
import { audioService } from '../../lib/audio/AudioService';
import {
  sentencePatterns,
  type SentencePattern,
  type Word,
} from '../../data/sentencePatterns';

export default function SentenceBuilder() {
  const [selectedPattern, setSelectedPattern] = useState<SentencePattern>(sentencePatterns[0]);
  const [selectedWords, setSelectedWords] = useState<Record<string, Word | null>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);

  // Build the sentence from selected words
  const buildSentence = useCallback(() => {
    const parts: { hanzi: string; pinyin: string; english: string }[] = [];

    for (const slot of selectedPattern.slots) {
      // Add connector if present
      if (slot.connector) {
        parts.push({
          hanzi: slot.connector,
          pinyin: slot.connector === '很' ? 'hěn' :
                  slot.connector === '是' ? 'shì' :
                  slot.connector === '不' ? 'bù' :
                  slot.connector === '不是' ? 'bú shì' :
                  slot.connector === '想去' ? 'xiǎng qù' :
                  slot.connector,
          english: slot.connector === '很' ? 'very' :
                   slot.connector === '是' ? 'is' :
                   slot.connector === '不' ? 'not' :
                   slot.connector === '不是' ? 'is not' :
                   slot.connector === '想去' ? 'want to go' :
                   slot.connector,
        });
      }

      const word = selectedWords[slot.id];
      if (word) {
        parts.push(word);
      }
    }

    // Add 吗 if question toggle is enabled
    if (isQuestion) {
      parts.push({ hanzi: '吗?', pinyin: 'ma', english: '?' });
    }

    return parts;
  }, [selectedPattern, selectedWords, isQuestion]);

  const sentenceParts = buildSentence();
  const isComplete = selectedPattern.slots.every(slot => selectedWords[slot.id]);

  // Generate grammar feedback based on current pattern and selections
  const getGrammarFeedback = useCallback(() => {
    const feedback: { type: 'tip' | 'warning' | 'correct'; message: string }[] = [];

    // Tip: 很 with adjectives (not 是)
    if (selectedPattern.id === 'adj-pattern') {
      feedback.push({
        type: 'tip',
        message: "In Chinese, use 很 (hěn) with adjectives, not 是 (shì). Say \"我很高兴\", not \"我是高兴\".",
      });
    }

    // Tip: 不 with adjectives (not 不是)
    if (selectedPattern.id === 'neg-adj-pattern') {
      feedback.push({
        type: 'tip',
        message: "To negate adjectives, use 不 directly before the adjective, not 不是. Say \"我不累\", not \"我不是累\".",
      });
    }

    // Warning: 有 should use 没有, not 不有
    if (selectedPattern.id === 'neg-verb-pattern') {
      const selectedVerb = selectedWords['verb'];
      if (selectedVerb?.hanzi === '有') {
        feedback.push({
          type: 'warning',
          message: "⚠️ 有 (yǒu) is ALWAYS negated with 没有 (méiyǒu), never 不有! Say \"我没有钱\", not \"我不有钱\".",
        });
      }
    }

    // Tip: 吗 questions
    if (isQuestion) {
      feedback.push({
        type: 'tip',
        message: "Adding 吗 turns any statement into a yes/no question. The word order stays the same!",
      });
    }

    return feedback;
  }, [selectedPattern, selectedWords, isQuestion]);

  const grammarFeedback = getGrammarFeedback();

  // Play the constructed sentence
  const playSentence = useCallback(async () => {
    if (!isComplete || isPlaying) return;

    setIsPlaying(true);
    try {
      const fullSentence = sentenceParts.map(p => p.hanzi).join('');
      await audioService.playVocabulary(fullSentence, true);
    } catch (error) {
      console.error('Error playing sentence:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [isComplete, isPlaying, sentenceParts]);

  // Play individual word
  const playWord = useCallback(async (word: Word) => {
    try {
      await audioService.playVocabulary(word.hanzi, true);
    } catch (error) {
      console.error('Error playing word:', error);
    }
  }, []);

  // Handle pattern change
  const handlePatternChange = (patternId: string) => {
    const pattern = sentencePatterns.find(p => p.id === patternId);
    if (pattern) {
      setSelectedPattern(pattern);
      setSelectedWords({});
    }
  };

  // Handle word selection
  const selectWord = (slotId: string, word: Word) => {
    setSelectedWords(prev => ({ ...prev, [slotId]: word }));
  };

  return (
    <div className="sentence-builder">
      {/* Pattern Selector */}
      <div className="pattern-section">
        <label className="section-label">Choose a pattern:</label>
        <select
          className="pattern-select"
          value={selectedPattern.id}
          onChange={(e) => handlePatternChange(e.target.value)}
        >
          {sentencePatterns.map(pattern => (
            <option key={pattern.id} value={pattern.id}>
              {pattern.name}
            </option>
          ))}
        </select>
        <p className="pattern-description">{selectedPattern.description}</p>
      </div>

      {/* Example */}
      <div className="example-section">
        <span className="example-label">Example:</span>
        <span className="example-chinese">{selectedPattern.example.chinese}</span>
        <span className="example-pinyin">{selectedPattern.example.pinyin}</span>
        <span className="example-english">{selectedPattern.example.english}</span>
      </div>

      {/* Word Selection Slots */}
      <div className="slots-section">
        {selectedPattern.slots.map((slot, index) => (
          <div key={slot.id} className="slot-group">
            {/* Show connector before slot (except for first slot) */}
            {slot.connector && (
              <div className="connector">
                <span className="connector-hanzi">{slot.connector}</span>
                <span className="connector-pinyin">
                  {slot.connector === '很' ? 'hěn' :
                   slot.connector === '是' ? 'shì' :
                   slot.connector === '不' ? 'bù' :
                   slot.connector === '不是' ? 'bú shì' :
                   slot.connector === '想去' ? 'xiǎng qù' :
                   ''}
                </span>
              </div>
            )}

            <div className="slot">
              <label className="slot-label">{slot.label}</label>
              <div className="word-grid">
                {slot.words.map(word => (
                  <button
                    key={word.hanzi}
                    className={`word-btn ${selectedWords[slot.id]?.hanzi === word.hanzi ? 'selected' : ''}`}
                    onClick={() => {
                      selectWord(slot.id, word);
                      playWord(word);
                    }}
                  >
                    <span className="word-hanzi">{word.hanzi}</span>
                    <span className="word-pinyin">{word.pinyin}</span>
                    <span className="word-english">{word.english}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Question toggle */}
        <div className="question-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={isQuestion}
              onChange={(e) => setIsQuestion(e.target.checked)}
            />
            <span className="toggle-switch"></span>
            <span className="toggle-text">
              <span className="toggle-hanzi">吗?</span>
              <span className="toggle-pinyin">ma</span>
            </span>
          </label>
        </div>
      </div>

      {/* Result Sentence */}
      <div className={`result-section ${isComplete ? 'complete' : ''}`}>
        <div className="result-sentence">
          {sentenceParts.length > 0 ? (
            <>
              <div className="result-hanzi">
                {sentenceParts.map((part, i) => (
                  <span key={i} className="result-part">
                    {part.hanzi}
                  </span>
                ))}
              </div>
              <div className="result-pinyin">
                {sentenceParts.map((part, i) => (
                  <span key={i} className="result-part">
                    {part.pinyin}
                  </span>
                ))}
              </div>
              <div className="result-english">
                {sentenceParts.map((part, i) => (
                  <span key={i} className="result-part">
                    {part.english}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <span className="result-placeholder">Select words to build a sentence...</span>
          )}
        </div>

        {isComplete && (
          <button
            className="play-sentence-btn"
            onClick={playSentence}
            disabled={isPlaying}
          >
            {isPlaying ? '🔊 Playing...' : '▶ Play Sentence'}
          </button>
        )}
      </div>

      {/* Grammar Feedback */}
      {grammarFeedback.length > 0 && (
        <div className="grammar-feedback">
          {grammarFeedback.map((item, index) => (
            <div key={index} className={`feedback-item feedback-${item.type}`}>
              {item.message}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .sentence-builder {
          max-width: 800px;
          margin: 0 auto;
        }

        .pattern-section {
          margin-bottom: var(--spacing-xl);
        }

        .section-label {
          display: block;
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--spacing-sm);
          color: var(--color-text);
        }

        .pattern-select {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          font-size: var(--font-size-base);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          color: var(--color-text);
          cursor: pointer;
        }

        .pattern-select:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .pattern-description {
          margin-top: var(--spacing-sm);
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }

        .example-section {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--color-surface);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-xl);
        }

        .example-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }

        .example-chinese {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
        }

        .example-pinyin {
          color: var(--color-primary);
        }

        .example-english {
          color: var(--color-text-secondary);
        }

        .slots-section {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-lg);
          align-items: flex-start;
          margin-bottom: var(--spacing-xl);
        }

        .slot-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .connector {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md) var(--spacing-lg);
          background: rgba(74, 144, 226, 0.1);
          border-radius: var(--radius-lg);
          width: 100%;
        }

        .question-toggle {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md) var(--spacing-lg);
          background: rgba(74, 144, 226, 0.1);
          border-radius: var(--radius-lg);
          width: 100%;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .question-toggle:has(input:not(:checked)) {
          opacity: 0.4;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          cursor: pointer;
        }

        .toggle-label input {
          display: none;
        }

        .toggle-switch {
          width: 48px;
          height: 26px;
          background: var(--color-border);
          border-radius: 13px;
          position: relative;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }

        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s ease;
        }

        .toggle-label input:checked + .toggle-switch {
          background: var(--color-primary);
        }

        .toggle-label input:checked + .toggle-switch::after {
          transform: translateX(22px);
        }

        .toggle-text {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .toggle-hanzi {
          font-size: 4rem;
          font-weight: 300;
          color: var(--color-text);
        }

        .toggle-pinyin {
          font-size: var(--font-size-base);
          color: var(--color-text-secondary);
        }

        .connector-hanzi {
          font-size: 4rem;
          font-weight: 300;
          color: var(--color-text);
        }

        .connector-pinyin {
          font-size: var(--font-size-base);
          color: var(--color-text-secondary);
        }

        .slot {
          flex: 1;
          min-width: 200px;
        }

        .slot-label {
          display: block;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-sm);
        }

        .word-grid {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
        }

        .word-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--spacing-sm);
          background: var(--color-surface);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          min-width: 70px;
        }

        .word-btn:hover {
          border-color: var(--color-primary);
        }

        .word-btn.selected {
          border-color: var(--color-primary);
          background: rgba(74, 144, 226, 0.1);
        }

        .word-hanzi {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
        }

        .word-pinyin {
          font-size: var(--font-size-xs);
          color: var(--color-primary);
        }

        .word-english {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
        }

        .result-section {
          padding: var(--spacing-xl);
          background: var(--color-surface);
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-lg);
          text-align: center;
          margin-bottom: var(--spacing-lg);
        }

        .result-section.complete {
          border-style: solid;
          border-color: var(--color-primary);
          background: rgba(74, 144, 226, 0.05);
        }

        .result-sentence {
          margin-bottom: var(--spacing-md);
        }

        .result-hanzi {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--spacing-sm);
        }

        .result-pinyin {
          font-size: var(--font-size-lg);
          color: var(--color-primary);
          margin-bottom: var(--spacing-xs);
        }

        .result-english {
          font-size: var(--font-size-base);
          color: var(--color-text-secondary);
        }

        .result-part {
          margin: 0 2px;
        }

        .result-placeholder {
          color: var(--color-text-secondary);
          font-style: italic;
        }

        .play-sentence-btn {
          padding: var(--spacing-md) var(--spacing-xl);
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .play-sentence-btn:hover:not(:disabled) {
          background: var(--color-primary-hover);
          transform: translateY(-2px);
        }

        .play-sentence-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .grammar-feedback {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .feedback-item {
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          color: var(--color-text);
        }

        .feedback-tip {
          background: rgba(74, 144, 226, 0.1);
          border-left: 4px solid var(--color-primary);
        }

        .feedback-warning {
          background: rgba(220, 53, 69, 0.1);
          border-left: 4px solid #dc3545;
          font-weight: var(--font-weight-medium);
        }

        .feedback-correct {
          background: rgba(40, 167, 69, 0.1);
          border-left: 4px solid #28a745;
        }

        @media (max-width: 600px) {
          .slots-section {
            flex-direction: column;
          }

          .slot-group {
            width: 100%;
            flex-direction: column;
          }

          .connector {
            padding-top: 0;
            justify-content: center;
          }

          .slot {
            width: 100%;
          }

          .result-hanzi {
            font-size: var(--font-size-2xl);
          }
        }
      `}</style>
    </div>
  );
}
