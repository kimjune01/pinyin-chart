/**
 * Topic Registry - All available topics for Hanzi Visual Game
 */

import type { Topic } from '../visualGameEngine';
import { animalsTopic } from './animals';
import { weatherTopic } from './weather';
import { fruitsTopic } from './fruits';
import { directionsTopic } from './directions';
import { familyTopic } from './family';
import { numbersTopic } from './numbers';
import { colorsTopic } from './colors';
import { bodyTopic } from './body';
import { transportTopic } from './transport';
import { sportsTopic } from './sports';
import { natureTopic } from './nature';
import { emotionsTopic } from './emotions';
import { timeTopic } from './time';

// All available topics
export const topics: Topic[] = [
  // Difficulty 1 (easiest)
  animalsTopic,
  numbersTopic,
  colorsTopic,
  weatherTopic,
  fruitsTopic,
  bodyTopic,
  transportTopic,
  natureTopic,
  // Difficulty 2
  directionsTopic,
  familyTopic,
  sportsTopic,
  emotionsTopic,
  timeTopic,
];

// Get topic by ID
export function getTopicById(id: string): Topic | undefined {
  return topics.find(t => t.id === id);
}

// Get topics by difficulty
export function getTopicsByDifficulty(difficulty: 1 | 2 | 3): Topic[] {
  return topics.filter(t => t.difficulty === difficulty);
}

// Get topics by layout type
export function getTopicsByLayout(layoutType: Topic['layoutType']): Topic[] {
  return topics.filter(t => t.layoutType === layoutType);
}
