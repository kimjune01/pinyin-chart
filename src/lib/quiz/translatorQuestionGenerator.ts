/**
 * Sentence Translator Question Generator
 *
 * Generates multi-step translation questions from sentence patterns.
 * Each question has constituent steps (guess each word) plus a final structure step.
 */

import type { Word, SentencePattern, PatternSlot } from '../../data/sentencePatterns';
import { sentencePatterns } from '../../data/sentencePatterns';
import type { LevelConfig, QuizOption } from './types';
import type { TranslatorQuestion, TranslatorStep } from './translatorTypes';

// Patterns to use for each level (by difficulty)
const LEVEL_PATTERNS: Record<number, string[]> = {
  0: ['adj-pattern', 'noun-pattern'],  // Basic: "I am happy", "I am a student"
  1: ['adj-pattern', 'noun-pattern', 'verb-pattern', 'have-pattern'],  // Add verbs
  2: ['adj-pattern', 'noun-pattern', 'verb-pattern', 'have-pattern', 'can-pattern', 'want-pattern'],
  3: ['adj-pattern', 'noun-pattern', 'verb-pattern', 'have-pattern', 'can-pattern', 'want-pattern', 'go-pattern', 'location-pattern'],
  4: ['adj-pattern', 'noun-pattern', 'verb-pattern', 'have-pattern', 'can-pattern', 'want-pattern', 'go-pattern', 'location-pattern', 'too-pattern', 'past-pattern'],
  5: [], // All patterns including questions (empty means all)
};

// English template mappings for generating full sentences
const PATTERN_ENGLISH_TEMPLATES: Record<string, (words: Record<string, Word>) => string> = {
  'adj-pattern': (words) => `${words.subject.english} ${words.subject.english === 'I' ? 'am' : words.subject.english === 'you' || words.subject.english === 'we' || words.subject.english === 'they' ? 'are' : 'is'} ${words.adjective.english}`,
  'noun-pattern': (words) => `${words.subject.english} ${words.subject.english === 'I' ? 'am' : words.subject.english === 'you' || words.subject.english === 'we' || words.subject.english === 'they' ? 'are' : 'is'} a ${words.noun.english}`,
  'verb-pattern': (words) => `${words.subject.english} ${words.subject.english === 'I' || words.subject.english === 'you' || words.subject.english === 'we' || words.subject.english === 'they' ? words.verb.english : words.verb.english + 's'} ${words.object.english}`,
  'go-pattern': (words) => `${words.subject.english} want${words.subject.english === 'I' || words.subject.english === 'you' || words.subject.english === 'we' || words.subject.english === 'they' ? '' : 's'} to go to ${words.place.english}`,
  'location-pattern': (words) => `${words.subject.english} ${words.subject.english === 'I' ? 'am' : words.subject.english === 'you' || words.subject.english === 'we' || words.subject.english === 'they' ? 'are' : 'is'} at ${words.place.english}`,
  'have-pattern': (words) => `${words.subject.english} ${words.subject.english === 'I' || words.subject.english === 'you' || words.subject.english === 'we' || words.subject.english === 'they' ? 'have' : 'has'} ${words.object.english}`,
  'can-pattern': (words) => `${words.subject.english} can ${words.skill.english}`,
  'want-pattern': (words) => `${words.subject.english} want${words.subject.english === 'I' || words.subject.english === 'you' || words.subject.english === 'we' || words.subject.english === 'they' ? '' : 's'} to ${words.verb.english}`,
  'too-pattern': (words) => `Too ${words.adjective.english}!`,
  'past-pattern': (words) => `${words.subject.english} ${words.verb.english}`,
  'q-verb-what': (words) => `What do${words.subject.english === 'I' || words.subject.english === 'you' || words.subject.english === 'we' || words.subject.english === 'they' ? '' : 'es'} ${words.subject.english.toLowerCase()} ${words.verb.english}?`,
  'q-who': (words) => `Who ${words.verb.english}s ${words.object.english}?`,
  'q-where': (words) => `Where ${words.subject.english === 'I' ? 'am' : words.subject.english === 'you' || words.subject.english === 'we' || words.subject.english === 'they' ? 'are' : 'is'} ${words.subject.english.toLowerCase()} going?`,
  'q-how-many': (words) => `How much ${words.object.english} do${words.subject.english === 'I' || words.subject.english === 'you' || words.subject.english === 'we' || words.subject.english === 'they' ? '' : 'es'} ${words.subject.english.toLowerCase()} have?`,
  'q-why': (words) => `Why do${words.subject.english === 'I' || words.subject.english === 'you' || words.subject.english === 'we' || words.subject.english === 'they' ? '' : 'es'} ${words.subject.english.toLowerCase()} ${words.verb.english}?`,
  'q-when': (words) => `When ${words.subject.english === 'I' ? 'am' : words.subject.english === 'you' || words.subject.english === 'we' || words.subject.english === 'they' ? 'are' : 'is'} ${words.subject.english.toLowerCase()} ${words.verb.english}ing?`,
  'q-permission': (words) => `May ${words.subject.english.toLowerCase()} ${words.verb.english}?`,
  'q-did-you': (words) => `Did ${words.subject.english.toLowerCase()} ${words.verb.english.replace(/ed$/, '').replace(/drank/, 'drink').replace(/ate/, 'eat').replace(/slept/, 'sleep').replace(/watched/, 'watch').replace(/listened/, 'listen').replace(/bought/, 'buy')}?`,
  'q-how-so': (words) => `How can ${words.subject.english.toLowerCase()} be so ${words.adjective.english}?`,
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get a random item from an array
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random items from an array (without replacement)
 */
function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, count);
}

/**
 * Build a sentence from a pattern and selected words
 */
function buildSentence(
  pattern: SentencePattern,
  selectedWords: Record<string, Word>
): { hanzi: string; pinyin: string; english: string } {
  const parts: { hanzi: string; pinyin: string }[] = [];

  // Sort slots by position
  const sortedSlots = [...pattern.slots].sort((a, b) => a.position - b.position);

  for (const slot of sortedSlots) {
    const word = selectedWords[slot.id];
    if (!word) continue;

    // Add connector if present
    if (slot.connector) {
      parts.push({
        hanzi: slot.connector,
        pinyin: getConnectorPinyin(slot.connector),
      });
    }

    parts.push({
      hanzi: word.hanzi,
      pinyin: word.pinyin,
    });
  }

  // Add pattern-specific suffixes
  if (pattern.id === 'too-pattern') {
    parts.push({ hanzi: '了', pinyin: 'le' });
  } else if (pattern.id === 'past-pattern') {
    parts.push({ hanzi: '了', pinyin: 'le' });
  } else if (pattern.id === 'q-verb-what') {
    parts.push({ hanzi: '?', pinyin: '' });
  } else if (pattern.id === 'q-who') {
    parts.push({ hanzi: '?', pinyin: '' });
  } else if (pattern.id === 'q-where') {
    parts.push({ hanzi: '?', pinyin: '' });
  } else if (pattern.id === 'q-how-many') {
    parts.push({ hanzi: '?', pinyin: '' });
  } else if (pattern.id === 'q-why') {
    parts.push({ hanzi: '?', pinyin: '' });
  } else if (pattern.id === 'q-when') {
    parts.push({ hanzi: '?', pinyin: '' });
  } else if (pattern.id === 'q-permission') {
    parts.push({ hanzi: '吗?', pinyin: 'ma?' });
  } else if (pattern.id === 'q-did-you') {
    parts.push({ hanzi: '?', pinyin: '' });
  } else if (pattern.id === 'q-how-so') {
    parts.push({ hanzi: '?', pinyin: '' });
  }

  const hanzi = parts.map(p => p.hanzi).join('');
  const pinyin = parts.map(p => p.pinyin).filter(p => p).join(' ');

  // Generate English using template
  const englishTemplate = PATTERN_ENGLISH_TEMPLATES[pattern.id];
  const english = englishTemplate
    ? englishTemplate(selectedWords)
    : pattern.example.english;

  return { hanzi, pinyin, english };
}

/**
 * Get pinyin for common connectors
 */
function getConnectorPinyin(connector: string): string {
  const connectorMap: Record<string, string> = {
    '很': 'hěn',
    '是': 'shì',
    '想去': 'xiǎng qù',
    '在': 'zài',
    '有': 'yǒu',
    '会': 'huì',
    '想': 'xiǎng',
    '太': 'tài',
    '可以': 'kěyǐ',
    '怎么这么': 'zěnme zhème',
  };
  return connectorMap[connector] || '';
}

/**
 * Generate distractor options for a slot
 */
function generateDistractors(
  slot: PatternSlot,
  correctWord: Word,
  count: number
): QuizOption[] {
  const otherWords = slot.words.filter(w => w.hanzi !== correctWord.hanzi);
  const distractorWords = randomItems(otherWords, Math.min(count, otherWords.length));

  return distractorWords.map((w, idx) => ({
    id: `distractor-${idx}`,
    label: w.english,
    value: w.english,
    isCorrect: false,
  }));
}

/**
 * Generate structure distractor sentences (variations of the correct sentence)
 */
function generateStructureDistractors(
  pattern: SentencePattern,
  selectedWords: Record<string, Word>,
  correctEnglish: string,
  count: number
): QuizOption[] {
  const distractors: QuizOption[] = [];
  const usedSentences = new Set([correctEnglish.toLowerCase()]);

  // Strategy 1: Same words, different pattern
  const compatiblePatterns = findCompatiblePatterns(pattern, selectedWords);
  for (const altPattern of compatiblePatterns) {
    if (distractors.length >= count) break;
    const template = PATTERN_ENGLISH_TEMPLATES[altPattern.id];
    if (template) {
      try {
        const altEnglish = template(selectedWords);
        if (!usedSentences.has(altEnglish.toLowerCase())) {
          usedSentences.add(altEnglish.toLowerCase());
          distractors.push({
            id: `pattern-${altPattern.id}`,
            label: altEnglish,
            value: altEnglish,
            isCorrect: false,
          });
        }
      } catch {
        // Skip if template doesn't work with these words
      }
    }
  }

  // Strategy 2: Generate grammatical variations
  const variations = generateGrammaticalVariations(pattern, selectedWords, correctEnglish);
  for (const variation of variations) {
    if (distractors.length >= count) break;
    if (!usedSentences.has(variation.toLowerCase())) {
      usedSentences.add(variation.toLowerCase());
      distractors.push({
        id: `variation-${distractors.length}`,
        label: variation,
        value: variation,
        isCorrect: false,
      });
    }
  }

  return distractors.slice(0, count);
}

/**
 * Find patterns that could use the same selected words
 */
function findCompatiblePatterns(
  currentPattern: SentencePattern,
  selectedWords: Record<string, Word>
): SentencePattern[] {
  const slotIds = Object.keys(selectedWords);
  return sentencePatterns.filter(p => {
    if (p.id === currentPattern.id) return false;
    const patternSlotIds = p.slots.map(s => s.id);
    // Check if this pattern has at least some of the same slots
    return slotIds.some(id => patternSlotIds.includes(id));
  }).slice(0, 3);
}

/**
 * Generate grammatical variations of a sentence
 */
function generateGrammaticalVariations(
  pattern: SentencePattern,
  selectedWords: Record<string, Word>,
  correctEnglish: string
): string[] {
  const variations: string[] = [];
  const subject = selectedWords.subject?.english || '';
  const verb = selectedWords.verb?.english || '';
  const adj = selectedWords.adjective?.english || '';
  const noun = selectedWords.noun?.english || '';
  const object = selectedWords.object?.english || '';

  // Tense variations
  if (pattern.id === 'adj-pattern' && subject && adj) {
    variations.push(`${subject} was ${adj}`);
    variations.push(`${subject} will be ${adj}`);
    variations.push(`Is ${subject.toLowerCase()} ${adj}?`);
  }

  if (pattern.id === 'noun-pattern' && subject && noun) {
    variations.push(`${subject} was a ${noun}`);
    variations.push(`${subject} will be a ${noun}`);
    variations.push(`Is ${subject.toLowerCase()} a ${noun}?`);
  }

  if (pattern.id === 'verb-pattern' && subject && verb && object) {
    const pastVerb = verb.endsWith('e') ? verb + 'd' : verb + 'ed';
    variations.push(`${subject} ${pastVerb} ${object}`);
    variations.push(`${subject} will ${verb} ${object}`);
    variations.push(`Does ${subject.toLowerCase()} ${verb} ${object}?`);
  }

  if (pattern.id === 'have-pattern' && subject && object) {
    variations.push(`${subject} had ${object}`);
    variations.push(`${subject} will have ${object}`);
    variations.push(`Does ${subject.toLowerCase()} have ${object}?`);
  }

  if (pattern.id === 'can-pattern' && subject && selectedWords.skill) {
    const skill = selectedWords.skill.english;
    variations.push(`${subject} cannot ${skill}`);
    variations.push(`Can ${subject.toLowerCase()} ${skill}?`);
    variations.push(`${subject} could ${skill}`);
  }

  if (pattern.id === 'want-pattern' && subject && verb) {
    variations.push(`${subject} doesn't want to ${verb}`);
    variations.push(`Does ${subject.toLowerCase()} want to ${verb}?`);
    variations.push(`${subject} wanted to ${verb}`);
  }

  if (pattern.id === 'past-pattern' && subject && verb) {
    // Reverse to present tense
    const presentVerb = verb.replace(/ed$/, '').replace(/ate$/, 'eat').replace(/drank/, 'drink');
    variations.push(`${subject} ${presentVerb}s`);
    variations.push(`${subject} will ${presentVerb}`);
    variations.push(`Did ${subject.toLowerCase()} ${presentVerb}?`);
  }

  return variations.filter(v => v.toLowerCase() !== correctEnglish.toLowerCase());
}

/**
 * Generate translator questions for a level
 */
export async function generateTranslatorQuestions(
  level: LevelConfig,
  count: number
): Promise<TranslatorQuestion[]> {
  const questions: TranslatorQuestion[] = [];
  const recentPatternIds: string[] = [];

  // Get available patterns for this level
  const levelPatterns = LEVEL_PATTERNS[level.id] || [];
  const availablePatterns = levelPatterns.length > 0
    ? sentencePatterns.filter(p => levelPatterns.includes(p.id))
    : sentencePatterns.filter(p => p.category === 'statement'); // Default to statements

  for (let i = 0; i < count; i++) {
    // Pick a pattern (avoid recent repeats)
    let pattern: SentencePattern;
    const eligiblePatterns = availablePatterns.filter(
      p => !recentPatternIds.slice(-3).includes(p.id)
    );
    pattern = randomItem(eligiblePatterns.length > 0 ? eligiblePatterns : availablePatterns);

    // Track recent patterns
    recentPatternIds.push(pattern.id);
    if (recentPatternIds.length > 5) recentPatternIds.shift();

    // Select random words for each slot
    const selectedWords: Record<string, Word> = {};
    for (const slot of pattern.slots) {
      selectedWords[slot.id] = randomItem(slot.words);
    }

    // Build the full sentence
    const { hanzi, pinyin, english } = buildSentence(pattern, selectedWords);

    // Generate steps for each slot (excluding fixed question words)
    const steps: TranslatorStep[] = [];
    const sortedSlots = [...pattern.slots].sort((a, b) => a.position - b.position);

    for (const slot of sortedSlots) {
      // Skip slots with only one word (like question words)
      if (slot.words.length <= 1) continue;

      const correctWord = selectedWords[slot.id];
      const distractors = generateDistractors(slot, correctWord, (level.optionCount || 4) - 1);

      steps.push({
        id: `step-${slot.id}-${i}`,
        slotId: slot.id,
        slotLabel: slot.label,
        correctAnswer: correctWord.english,
        correctWord,
        options: shuffle([
          {
            id: 'correct',
            label: correctWord.english,
            value: correctWord.english,
            isCorrect: true,
          },
          ...distractors,
        ]),
        isStructureStep: false,
      });
    }

    // Add final structure step
    const structureDistractors = generateStructureDistractors(
      pattern,
      selectedWords,
      english,
      (level.optionCount || 4) - 1
    );

    steps.push({
      id: `step-structure-${i}`,
      slotId: 'structure',
      slotLabel: 'Full Sentence',
      correctAnswer: english,
      correctWord: { hanzi: '', pinyin: '', english },
      options: shuffle([
        {
          id: 'correct',
          label: english,
          value: english,
          isCorrect: true,
        },
        ...structureDistractors,
      ]),
      isStructureStep: true,
    });

    questions.push({
      id: `translator-${i}-${Date.now()}`,
      patternId: pattern.id,
      patternName: pattern.name,
      fullHanzi: hanzi,
      fullPinyin: pinyin,
      fullEnglish: english,
      selectedWords,
      steps,
    });
  }

  return questions;
}
