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
  type GameDirection,
  type FeedbackType,
  generateTopicQueue,
  generateEndlessTopicQueue,
  shuffleGridPositions,
  checkAnswer,
  checkReverseAnswer,
  calculateScore,
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
} from './visualGameEngine';
import { topics } from './topics';
import TopicSelector from './TopicSelector';
import GameHUD from './GameHUD';
import EmojiGrid from './layouts/EmojiGrid';
import HanziGrid from './layouts/HanziGrid';
import DirectionDiagram from './layouts/DirectionDiagram';
import FamilyTree from './layouts/FamilyTree';

export default function HanziVisualGame() {
  // Game state
  const [phase, setPhase] = useState<GamePhase>('topic-select');
  const [mode, setMode] = useState<GameMode>('single-topic');
  const [direction, setDirection] = useState<GameDirection>('hanzi-to-emoji');
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [topicQueue, setTopicQueue] = useState<Topic[]>([]); // For endless mode
  const [endlessTopicPool, setEndlessTopicPool] = useState<Topic[]>([]); // Topics used for endless restart
  const [currentItem, setCurrentItem] = useState<TopicItem | null>(null);
  const [itemQueue, setItemQueue] = useState<TopicItem[]>([]);
  const [selectedHanzi, setSelectedHanzi] = useState<string | null>(null);
  const [completedHanzi, setCompletedHanzi] = useState<Set<string>>(new Set());
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
  const startTopic = useCallback((topic: Topic, gameDirection: GameDirection = direction) => {
    // Shuffle grid positions for emoji-grid layouts to prevent memorization
    const shuffledTopic = shuffleGridPositions(topic);
    const queue = generateTopicQueue(shuffledTopic);
    const firstItem = queue[0];
    setCurrentTopic(shuffledTopic);
    setItemQueue(queue.slice(1));
    setCurrentItem(firstItem);
    setMode('single-topic');
    setDirection(gameDirection);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setSelectedPosition(null);
    setSelectedHanzi(null);
    setFeedback(null);
    setCompletedPositions(new Set());
    setCompletedHanzi(new Set());
    setHadWrongAttempt(false);
    setPhase('playing');
    lastPlayedItemRef.current = null; // Reset to allow auto-play
  }, [direction]);

  // Start endless mode with filtered topics
  const startEndless = useCallback((filteredTopics: Topic[]) => {
    if (filteredTopics.length === 0) return;

    const shuffledTopics = generateEndlessTopicQueue(filteredTopics);
    const firstTopic = shuffleGridPositions(shuffledTopics[0]);
    const itemsQueue = generateTopicQueue(firstTopic);
    const randomDirection: GameDirection = Math.random() < 0.5 ? 'hanzi-to-emoji' : 'emoji-to-hanzi';

    setEndlessTopicPool(filteredTopics); // Store for restart
    setTopicQueue(shuffledTopics.slice(1));
    setCurrentTopic(firstTopic);
    setItemQueue(itemsQueue.slice(1));
    setCurrentItem(itemsQueue[0]);
    setMode('endless');
    setDirection(randomDirection);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setSelectedPosition(null);
    setSelectedHanzi(null);
    setFeedback(null);
    setCompletedPositions(new Set());
    setCompletedHanzi(new Set());
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
          // More items in current topic
          setCurrentItem(itemQueue[0]);
          setItemQueue(prev => prev.slice(1));
          setSelectedPosition(null);
          setFeedback(null);
          setHadWrongAttempt(false);
          lastPlayedItemRef.current = null;
        } else if (mode === 'endless' && topicQueue.length > 0) {
          // Move to next topic in endless mode with random direction
          const nextTopic = shuffleGridPositions(topicQueue[0]);
          const nextItems = generateTopicQueue(nextTopic);
          const nextDirection: GameDirection = Math.random() < 0.5 ? 'hanzi-to-emoji' : 'emoji-to-hanzi';
          setTopicQueue(prev => prev.slice(1));
          setCurrentTopic(nextTopic);
          setItemQueue(nextItems.slice(1));
          setCurrentItem(nextItems[0]);
          setDirection(nextDirection);
          setCompletedPositions(new Set());
          setCompletedHanzi(new Set());
          setSelectedPosition(null);
          setFeedback(null);
          setHadWrongAttempt(false);
          lastPlayedItemRef.current = null;
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
      setHadWrongAttempt(true);
      setTimeout(() => {
        setSelectedPosition(null);
        setFeedback(null);
      }, 600);
    }
  }, [currentItem, feedback, itemQueue, topicQueue, mode, score, streak, highScore, completedPositions, hadWrongAttempt]);

  // Handle Hanzi selection in reverse mode (emoji-to-hanzi)
  const handleHanziSelect = useCallback((hanzi: string) => {
    if (!currentItem || !currentTopic || feedback) return;
    // Don't allow selecting already completed hanzi
    if (completedHanzi.has(hanzi)) return;

    setSelectedHanzi(hanzi);
    const isCorrect = checkReverseAnswer(currentItem, hanzi);

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
      // Mark this hanzi as completed
      setCompletedHanzi(prev => new Set([...prev, hanzi]));

      // Move to next item after feedback delay
      setTimeout(() => {
        if (itemQueue.length > 0) {
          // More items in current topic
          setCurrentItem(itemQueue[0]);
          setItemQueue(prev => prev.slice(1));
          setSelectedHanzi(null);
          setFeedback(null);
          setHadWrongAttempt(false);
          lastPlayedItemRef.current = null;
        } else if (mode === 'endless' && topicQueue.length > 0) {
          // Move to next topic in endless mode with random direction
          const nextTopic = shuffleGridPositions(topicQueue[0]);
          const nextItems = generateTopicQueue(nextTopic);
          const nextDirection: GameDirection = Math.random() < 0.5 ? 'hanzi-to-emoji' : 'emoji-to-hanzi';
          setTopicQueue(prev => prev.slice(1));
          setCurrentTopic(nextTopic);
          setItemQueue(nextItems.slice(1));
          setCurrentItem(nextItems[0]);
          setDirection(nextDirection);
          setCompletedPositions(new Set());
          setCompletedHanzi(new Set());
          setSelectedHanzi(null);
          setFeedback(null);
          setHadWrongAttempt(false);
          lastPlayedItemRef.current = null;
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
      setHadWrongAttempt(true);
      setTimeout(() => {
        setSelectedHanzi(null);
        setFeedback(null);
      }, 600);
    }
  }, [currentItem, currentTopic, feedback, itemQueue, topicQueue, mode, score, streak, highScore, hadWrongAttempt, completedHanzi]);

  // Return to topic selection
  const returnToTopics = useCallback(() => {
    setPhase('topic-select');
    setCurrentTopic(null);
    setCurrentItem(null);
    setItemQueue([]);
  }, []);

  // Reset current game
  const resetGame = useCallback(() => {
    if (mode === 'endless') {
      startEndless(endlessTopicPool);
    } else if (currentTopic) {
      startTopic(currentTopic, direction);
    }
  }, [currentTopic, mode, direction, startTopic, startEndless, endlessTopicPool]);

  // Render visual area based on topic layout type and direction
  const renderVisualArea = () => {
    if (!currentTopic || !currentItem) return null;

    // In reverse mode (emoji-to-hanzi), always show HanziGrid
    if (direction === 'emoji-to-hanzi') {
      return (
        <HanziGrid
          items={currentTopic.items}
          columns={currentTopic.gridColumns || 3}
          onSelect={handleHanziSelect}
          feedback={feedback}
          selectedHanzi={selectedHanzi}
          completedHanzi={completedHanzi}
        />
      );
    }

    // Normal mode (hanzi-to-emoji) - use layout-specific components
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
          direction={direction}
          onDirectionChange={setDirection}
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
              onClick={() => {
                if (mode === 'endless') {
                  startEndless(endlessTopicPool);
                } else if (currentTopic) {
                  startTopic(currentTopic, direction);
                }
              }}
            >
              Play Again
            </button>
            {mode !== 'endless' && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const reverseDirection = direction === 'hanzi-to-emoji' ? 'emoji-to-hanzi' : 'hanzi-to-emoji';
                  if (currentTopic) {
                    startTopic(currentTopic, reverseDirection);
                  }
                }}
              >
                Play Reverse
              </button>
            )}
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
          emoji={currentItem.emoji}
          meaning={currentItem.meaning}
          pinyin={getPinyinDisplay(currentItem.pinyin)}
          score={score}
          streak={streak}
          progress={{
            current: questionsAnswered + 1,
            total: totalItems,
          }}
          onPlayAudio={playAudio}
          isPlayingAudio={isPlayingAudio}
          direction={direction}
          onBack={returnToTopics}
          onReset={resetGame}
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
