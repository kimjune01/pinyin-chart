/**
 * HanziVisualGame - Main game container component
 * Match Hanzi characters to their visual/emoji representations
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { audioService } from '../../../lib/audio/AudioService';
import { addToneMarks } from '../../../lib/utils/pinyinUtils';
import {
  type Topic,
  type TopicItem,
  type GamePhase,
  type GameMode,
  type FeedbackType,
  generateTopicQueue,
  generateEndlessQueue,
  checkAnswer,
  calculateScore,
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
} from './visualGameEngine';
import { topics } from './topics';
import TopicSelector from './TopicSelector';
import GameHUD from './GameHUD';
import EmojiGrid from './layouts/EmojiGrid';
import DirectionDiagram from './layouts/DirectionDiagram';
import FamilyTree from './layouts/FamilyTree';

export default function HanziVisualGame() {
  // Game state
  const [phase, setPhase] = useState<GamePhase>('topic-select');
  const [mode, setMode] = useState<GameMode>('single-topic');
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [currentItem, setCurrentItem] = useState<TopicItem | null>(null);
  const [itemQueue, setItemQueue] = useState<TopicItem[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState<string | number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [completedPositions, setCompletedPositions] = useState<Set<string | number>>(new Set());
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false);

  // Ref for tracking audio play state to avoid re-render loops
  const isPlayingRef = useRef(false);
  const lastPlayedItemRef = useRef<string | null>(null);

  // Convert pinyin with tone numbers (e.g., "mi3fan4") to display format (e.g., "mǐfàn")
  const getPinyinDisplay = (pinyin: string): string => {
    // Match all syllable+tone patterns (e.g., "mi3", "fan4" from "mi3fan4")
    const syllables = pinyin.match(/[a-zA-ZüÜ]+\d/g);
    if (!syllables) return pinyin;

    return syllables.map(syllable => {
      const match = syllable.match(/^([a-zA-ZüÜ]+)(\d)$/);
      if (match) {
        return addToneMarks(match[1], parseInt(match[2], 10));
      }
      return syllable;
    }).join('');
  };

  // Load high score on mount
  useEffect(() => {
    setHighScore(loadFromStorage(STORAGE_KEYS.highScore, 0));
  }, []);

  // Play audio for current item
  const playAudio = useCallback(async () => {
    if (!currentItem || isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlayingAudio(true);
    try {
      // Use playVocabulary for multi-character words (handles TTS fallback)
      // Use play for single characters
      if (currentItem.hanzi.length > 1) {
        await audioService.playVocabulary(currentItem.hanzi);
      } else {
        await audioService.play(currentItem.pinyin);
      }
    } catch (error) {
      console.error('Audio error:', error);
    } finally {
      isPlayingRef.current = false;
      setIsPlayingAudio(false);
    }
  }, [currentItem]);

  // Auto-play audio when current item changes
  useEffect(() => {
    if (currentItem && phase === 'playing') {
      // Only auto-play if this is a new item
      const itemKey = currentItem.hanzi + currentItem.pinyin;
      if (lastPlayedItemRef.current !== itemKey) {
        lastPlayedItemRef.current = itemKey;
        const timer = setTimeout(() => {
          playAudio();
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [currentItem, phase, playAudio]);

  // Spacebar to replay audio
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && phase === 'playing') {
        e.preventDefault();
        playAudio();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, playAudio]);

  // Start game with a specific topic
  const startTopic = useCallback((topic: Topic) => {
    const queue = generateTopicQueue(topic);
    setCurrentTopic(topic);
    setItemQueue(queue.slice(1));
    setCurrentItem(queue[0]);
    setMode('single-topic');
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setSelectedPosition(null);
    setFeedback(null);
    setCompletedPositions(new Set());
    setHadWrongAttempt(false);
    setPhase('playing');
    lastPlayedItemRef.current = null; // Reset to allow auto-play
  }, []);

  // Start endless mode
  const startEndless = useCallback(() => {
    const queue = generateEndlessQueue(topics, 3);
    setCurrentTopic(topics[0]); // Use first topic's layout initially
    setItemQueue(queue.slice(1));
    setCurrentItem(queue[0]);
    setMode('endless');
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setSelectedPosition(null);
    setFeedback(null);
    setCompletedPositions(new Set());
    setHadWrongAttempt(false);
    setPhase('playing');
    lastPlayedItemRef.current = null; // Reset to allow auto-play
  }, []);

  // Handle answer selection
  const handleSelect = useCallback((position: string | number) => {
    if (!currentItem || feedback) return;
    // Don't allow selecting already completed positions
    if (completedPositions.has(position)) return;

    setSelectedPosition(position);
    const isCorrect = checkAnswer(currentItem, position);

    if (isCorrect) {
      setFeedback('correct');
      // Only award points and count as correct if no wrong attempts on this item
      const points = hadWrongAttempt ? 0 : calculateScore(streak + 1);
      if (!hadWrongAttempt) {
        setStreak(prev => prev + 1);
        setScore(prev => prev + points);
        setCorrectAnswers(prev => prev + 1);
      }
      setQuestionsAnswered(prev => prev + 1);
      // Mark this position as completed
      setCompletedPositions(prev => new Set([...prev, position]));

      // Move to next item after feedback delay
      setTimeout(() => {
        if (itemQueue.length > 0) {
          // In endless mode, find the topic for the next item
          if (mode === 'endless') {
            const nextItem = itemQueue[0];
            const nextTopic = topics.find(t =>
              t.items.some(i => i.hanzi === nextItem.hanzi)
            );
            if (nextTopic && nextTopic.id !== currentTopic?.id) {
              setCurrentTopic(nextTopic);
              setCompletedPositions(new Set()); // Reset for new topic
            }
          }
          setCurrentItem(itemQueue[0]);
          setItemQueue(prev => prev.slice(1));
          setSelectedPosition(null);
          setFeedback(null);
          setHadWrongAttempt(false); // Reset for next item
          lastPlayedItemRef.current = null; // Reset to allow auto-play for next item
        } else {
          // Game complete
          if (score + points > highScore) {
            setHighScore(score + points);
            saveToStorage(STORAGE_KEYS.highScore, score + points);
          }
          setPhase('complete');
        }
      }, 1000);
    } else {
      // Wrong answer - allow retry after brief feedback
      setFeedback('incorrect');
      setStreak(0);
      setHadWrongAttempt(true); // Mark that this item had a wrong attempt
      setTimeout(() => {
        setSelectedPosition(null);
        setFeedback(null);
      }, 600);
    }
  }, [currentItem, feedback, itemQueue, mode, score, streak, highScore, completedPositions, currentTopic, hadWrongAttempt]);

  // Return to topic selection
  const returnToTopics = useCallback(() => {
    setPhase('topic-select');
    setCurrentTopic(null);
    setCurrentItem(null);
    setItemQueue([]);
  }, []);

  // Render visual area based on topic layout type
  const renderVisualArea = () => {
    if (!currentTopic || !currentItem) return null;

    const commonProps = {
      items: currentTopic.items,
      onSelect: handleSelect,
      feedback,
      selectedPosition,
      completedPositions,
    };

    switch (currentTopic.layoutType) {
      case 'emoji-grid':
        return (
          <EmojiGrid
            {...commonProps}
            columns={currentTopic.gridColumns || 3}
          />
        );
      case 'direction-diagram':
        return <DirectionDiagram {...commonProps} />;
      case 'family-tree':
        return <FamilyTree {...commonProps} />;
      default:
        return null;
    }
  };

  // Render based on game phase
  if (phase === 'topic-select') {
    return (
      <div className="hanzi-visual-game">
        <TopicSelector
          topics={topics}
          onSelectTopic={startTopic}
          onStartEndless={startEndless}
        />
      </div>
    );
  }

  if (phase === 'complete') {
    const accuracy = questionsAnswered > 0
      ? Math.round((correctAnswers / questionsAnswered) * 100)
      : 0;

    return (
      <div className="hanzi-visual-game">
        <div className="completion-screen">
          <h2>🎉 Complete!</h2>
          <div className="score-summary">
            <div className="final-score">{score}</div>
            <div className="stats-row">
              <span>Correct: {correctAnswers}/{questionsAnswered}</span>
              <span>Accuracy: {accuracy}%</span>
            </div>
            {score >= highScore && score > 0 && (
              <div style={{ marginTop: '1rem', color: 'var(--color-warning)' }}>
                🏆 New High Score!
              </div>
            )}
          </div>
          <div className="action-btns">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => currentTopic && startTopic(currentTopic)}
            >
              Play Again
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={returnToTopics}
            >
              Choose Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing phase
  const totalItems = mode === 'endless'
    ? questionsAnswered + itemQueue.length + 1
    : (currentTopic?.items.length || 0);

  return (
    <div className="hanzi-visual-game">
      {currentItem && (
        <GameHUD
          hanzi={currentItem.hanzi}
          pinyin={getPinyinDisplay(currentItem.pinyin)}
          score={score}
          streak={streak}
          progress={{
            current: questionsAnswered + 1,
            total: totalItems,
          }}
          onPlayAudio={playAudio}
          isPlayingAudio={isPlayingAudio}
        />
      )}

      <div className="visual-area">
        {renderVisualArea()}
      </div>

      {/* Feedback overlay */}
      {feedback === 'correct' && (
        <div className="feedback-overlay correct">
          ✓ Correct!
        </div>
      )}
    </div>
  );
}
