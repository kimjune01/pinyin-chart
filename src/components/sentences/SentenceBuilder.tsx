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
  const [isNegated, setIsNegated] = useState(false);

  // Patterns that support negation toggle
  const supportsNegation = [
    'adj-pattern', 'noun-pattern', 'verb-pattern', 'go-pattern',
    'location-pattern', 'have-pattern', 'can-pattern', 'want-pattern'
  ].includes(selectedPattern.id);

  // Build the sentence from selected words
  const buildSentence = useCallback(() => {
    const parts: { hanzi: string; pinyin: string; english: string }[] = [];

    const connectorMap: Record<string, { pinyin: string; english: string }> = {
      '很': { pinyin: 'hěn', english: 'very' },
      '是': { pinyin: 'shì', english: 'is' },
      '不': { pinyin: 'bù', english: 'not' },
      '不是': { pinyin: 'bú shì', english: 'is not' },
      '想去': { pinyin: 'xiǎng qù', english: 'want to go' },
      '不想去': { pinyin: 'bù xiǎng qù', english: "don't want to go" },
      '去': { pinyin: 'qù', english: 'go to' },
      '有多少': { pinyin: 'yǒu duōshao', english: 'have how many' },
      '为什么': { pinyin: 'wèishénme', english: 'why' },
      '什么时候': { pinyin: 'shénme shíhou', english: 'when' },
      '在': { pinyin: 'zài', english: 'at' },
      '不在': { pinyin: 'bú zài', english: 'not at' },
      '有': { pinyin: 'yǒu', english: 'have' },
      '没有': { pinyin: 'méiyǒu', english: "don't have" },
      '会': { pinyin: 'huì', english: 'can' },
      '不会': { pinyin: 'bú huì', english: "can't" },
      '想': { pinyin: 'xiǎng', english: 'want to' },
      '不想': { pinyin: 'bù xiǎng', english: "don't want to" },
      '太': { pinyin: 'tài', english: 'too' },
      '可以': { pinyin: 'kěyǐ', english: 'may' },
      '怎么这么': { pinyin: 'zěnme zhème', english: 'how so' },
    };

    for (const slot of selectedPattern.slots) {
      // Add connector if present
      if (slot.connector) {
        let connector = slot.connector;

        // Apply negation transformations
        if (isNegated && supportsNegation) {
          if (selectedPattern.id === 'adj-pattern' && connector === '很') {
            connector = '不';
          } else if (selectedPattern.id === 'noun-pattern' && connector === '是') {
            connector = '不是';
          } else if (selectedPattern.id === 'go-pattern' && connector === '想去') {
            connector = '不想去';
          } else if (selectedPattern.id === 'location-pattern' && connector === '在') {
            connector = '不在';
          } else if (selectedPattern.id === 'have-pattern' && connector === '有') {
            connector = '没有'; // Special: 有 uses 没有, not 不有
          } else if (selectedPattern.id === 'can-pattern' && connector === '会') {
            connector = '不会';
          } else if (selectedPattern.id === 'want-pattern' && connector === '想') {
            connector = '不想';
          }
        }

        const info = connectorMap[connector] || { pinyin: connector, english: connector };
        parts.push({
          hanzi: connector,
          pinyin: info.pinyin,
          english: info.english,
        });
      } else if (isNegated && supportsNegation && selectedPattern.id === 'verb-pattern' && slot.id === 'verb') {
        // For verb-pattern, add 不 before the verb (which has no connector)
        parts.push({
          hanzi: '不',
          pinyin: 'bù',
          english: "don't",
        });
      }

      const word = selectedWords[slot.id];
      if (word) {
        parts.push(word);
      }
    }

    // Add 了 suffix for too-pattern
    if (selectedPattern.id === 'too-pattern' && selectedWords['adjective']) {
      parts.push({ hanzi: '了', pinyin: 'le', english: '!' });
    }

    // Add 吗 suffix for permission pattern (it's a yes/no question)
    if (selectedPattern.id === 'q-permission' && selectedWords['verb']) {
      parts.push({ hanzi: '吗?', pinyin: 'ma', english: '?' });
    }

    // Add 吗 if question toggle is enabled (for turning statements into questions)
    if (isQuestion && selectedPattern.id !== 'q-permission') {
      parts.push({ hanzi: '吗?', pinyin: 'ma', english: '?' });
    }

    return parts;
  }, [selectedPattern, selectedWords, isQuestion, isNegated, supportsNegation]);

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

    // Warning: 有 should use 没有, not 不有
    if (isNegated && selectedPattern.id === 'verb-pattern') {
      const selectedVerb = selectedWords['verb'];
      if (selectedVerb?.hanzi === '有') {
        feedback.push({
          type: 'warning',
          message: "⚠️ 有 (yǒu) is ALWAYS negated with 没有 (méiyǒu), never 不有! Say \"我没有钱\", not \"我不有钱\".",
        });
      }
    }

    // Tip: Negation patterns
    if (isNegated && supportsNegation) {
      if (selectedPattern.id === 'adj-pattern') {
        feedback.push({
          type: 'tip',
          message: "To negate adjectives, use 不 directly before the adjective. The 很 is removed.",
        });
      } else if (selectedPattern.id === 'noun-pattern') {
        feedback.push({
          type: 'tip',
          message: "To negate 是, use 不是 (bú shì) meaning \"is not\".",
        });
      } else if (selectedPattern.id === 'verb-pattern') {
        feedback.push({
          type: 'tip',
          message: "To negate most verbs, put 不 before the verb. Exception: 有 uses 没有.",
        });
      } else if (selectedPattern.id === 'go-pattern') {
        feedback.push({
          type: 'tip',
          message: "不想去 means \"don't want to go\". 不 negates 想, not 去.",
        });
      } else if (selectedPattern.id === 'location-pattern') {
        feedback.push({
          type: 'tip',
          message: "不在 means \"not at\" or \"not present\". Use this to say someone isn't somewhere.",
        });
      } else if (selectedPattern.id === 'have-pattern') {
        feedback.push({
          type: 'correct',
          message: "有 is ALWAYS negated with 没有 (méiyǒu), never 不有. This is automatic!",
        });
      } else if (selectedPattern.id === 'can-pattern') {
        feedback.push({
          type: 'tip',
          message: "不会 means \"can't\" or \"don't know how to\". It negates learned abilities.",
        });
      } else if (selectedPattern.id === 'want-pattern') {
        feedback.push({
          type: 'tip',
          message: "不想 means \"don't want to\". Use this to politely decline or express disinterest.",
        });
      }
    }

    // Pattern-specific tips (non-negated)
    if (selectedPattern.id === 'have-pattern' && !isNegated) {
      feedback.push({
        type: 'tip',
        message: "有 (yǒu) expresses possession. Remember: negate with 没有, never 不有!",
      });
    }

    if (selectedPattern.id === 'can-pattern' && !isNegated) {
      feedback.push({
        type: 'tip',
        message: "会 (huì) indicates learned skills or abilities. For physical ability, use 能 (néng).",
      });
    }

    if (selectedPattern.id === 'too-pattern') {
      feedback.push({
        type: 'tip',
        message: "太...了 is an emphatic pattern. It can express \"too much\" or strong emotion (太好了 = Great!).",
      });
    }

    // Tip: 吗 questions
    if (isQuestion) {
      feedback.push({
        type: 'tip',
        message: "Adding 吗 turns any statement into a yes/no question. The word order stays the same!",
      });
    }

    return feedback;
  }, [selectedPattern, selectedWords, isQuestion, isNegated, supportsNegation]);

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

  // Play sentence syllable by syllable
  const playSyllables = useCallback(async () => {
    if (!isComplete || isPlaying) return;

    setIsPlaying(true);
    try {
      for (const part of sentenceParts) {
        await audioService.playVocabulary(part.hanzi, true);
        // Small pause between syllables
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error('Error playing syllables:', error);
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
      setIsNegated(false);
      setIsQuestion(false);
      setIsPlaying(false); // Reset playing state to prevent stuck disabled buttons
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
          <optgroup label="Statements">
            {sentencePatterns
              .filter(pattern => pattern.category === 'statement')
              .map(pattern => (
                <option key={pattern.id} value={pattern.id}>
                  {pattern.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="Questions">
            {sentencePatterns
              .filter(pattern => pattern.category === 'question')
              .map(pattern => (
                <option key={pattern.id} value={pattern.id}>
                  {pattern.name}
                </option>
              ))}
          </optgroup>
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
        {selectedPattern.slots.map((slot, index) => {
          // Determine if negation toggle should appear before this slot
          const showNegationToggle = supportsNegation && (
            // For verb-pattern: show before verb slot
            (selectedPattern.id === 'verb-pattern' && slot.id === 'verb') ||
            // For patterns with connectors that get negated: show at connector position
            (selectedPattern.id === 'adj-pattern' && slot.connector === '很') ||
            (selectedPattern.id === 'noun-pattern' && slot.connector === '是') ||
            (selectedPattern.id === 'go-pattern' && slot.connector === '想去') ||
            (selectedPattern.id === 'location-pattern' && slot.connector === '在') ||
            (selectedPattern.id === 'have-pattern' && slot.connector === '有') ||
            (selectedPattern.id === 'can-pattern' && slot.connector === '会') ||
            (selectedPattern.id === 'want-pattern' && slot.connector === '想')
          );

          // Connector pinyin lookup
          const connectorPinyinMap: Record<string, string> = {
            '很': 'hěn', '是': 'shì', '不': 'bù', '不是': 'bú shì',
            '想去': 'xiǎng qù', '不想去': 'bù xiǎng qù',
            '在': 'zài', '不在': 'bú zài',
            '有': 'yǒu', '没有': 'méiyǒu',
            '会': 'huì', '不会': 'bú huì',
            '想': 'xiǎng', '不想': 'bù xiǎng',
            '太': 'tài', '去': 'qù',
            '有多少': 'yǒu duōshao', '为什么': 'wèishénme', '什么时候': 'shénme shíhou',
            '可以': 'kěyǐ', '怎么这么': 'zěnme zhème',
          };

          // Get the display connector (modified by negation state)
          const getConnectorDisplay = () => {
            if (!slot.connector) return null;

            let hanzi = slot.connector;

            if (isNegated && supportsNegation) {
              if (selectedPattern.id === 'adj-pattern' && slot.connector === '很') {
                hanzi = '不';
              } else if (selectedPattern.id === 'noun-pattern' && slot.connector === '是') {
                hanzi = '不是';
              } else if (selectedPattern.id === 'go-pattern' && slot.connector === '想去') {
                hanzi = '不想去';
              } else if (selectedPattern.id === 'location-pattern' && slot.connector === '在') {
                hanzi = '不在';
              } else if (selectedPattern.id === 'have-pattern' && slot.connector === '有') {
                hanzi = '没有';
              } else if (selectedPattern.id === 'can-pattern' && slot.connector === '会') {
                hanzi = '不会';
              } else if (selectedPattern.id === 'want-pattern' && slot.connector === '想') {
                hanzi = '不想';
              }
            }

            return { hanzi, pinyin: connectorPinyinMap[hanzi] || '' };
          };

          const connectorDisplay = getConnectorDisplay();

          return (
            <div key={slot.id} className="slot-group">
              {/* For verb-pattern: show negation toggle before verb (no connector) */}
              {showNegationToggle && selectedPattern.id === 'verb-pattern' && (
                <div
                  className={`negation-toggle inline ${isNegated ? 'active' : ''}`}
                  onClick={() => setIsNegated(!isNegated)}
                >
                  <span className="connector-hanzi">不</span>
                  <span className="connector-pinyin">bù</span>
                </div>
              )}

              {/* Show connector with integrated negation toggle for other patterns */}
              {slot.connector && (
                <div
                  className={`connector ${showNegationToggle ? 'toggleable' : ''} ${isNegated && showNegationToggle ? 'negated' : ''}`}
                  onClick={showNegationToggle ? () => setIsNegated(!isNegated) : undefined}
                >
                  <span className="connector-hanzi">{connectorDisplay?.hanzi}</span>
                  <span className="connector-pinyin">{connectorDisplay?.pinyin}</span>
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
          );
        })}

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
          <div className="play-buttons">
            <button
              className="play-btn play-syllables-btn"
              onClick={playSyllables}
              disabled={isPlaying}
            >
              ▶ Syllables
            </button>
            <button
              className="play-btn play-sentence-btn"
              onClick={playSentence}
              disabled={isPlaying}
            >
              ▶ Sentence
            </button>
          </div>
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

        /* Inline negation toggle for verb-pattern */
        .negation-toggle.inline {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md) var(--spacing-lg);
          background: var(--color-border);
          border-radius: var(--radius-lg);
          width: 100%;
          cursor: pointer;
          transition: all 0.2s ease;
          opacity: 0.4;
        }

        .negation-toggle.inline:hover {
          opacity: 0.7;
        }

        .negation-toggle.inline.active {
          opacity: 1;
          background: rgba(220, 53, 69, 0.15);
        }

        /* Toggleable connectors */
        .connector.toggleable {
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px dashed transparent;
        }

        .connector.toggleable:hover {
          border-color: var(--color-primary);
        }

        .connector.toggleable.negated {
          background: rgba(220, 53, 69, 0.15);
          border: 2px solid rgba(220, 53, 69, 0.3);
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

        .play-buttons {
          display: flex;
          gap: var(--spacing-sm);
          justify-content: center;
        }

        .play-btn {
          padding: var(--spacing-md) var(--spacing-lg);
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .play-syllables-btn {
          background: var(--color-text-secondary);
        }

        .play-sentence-btn {
          background: var(--color-primary);
        }

        .play-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        .play-btn:disabled {
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
