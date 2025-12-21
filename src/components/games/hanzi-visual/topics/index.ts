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
import { placesTopic } from './places';
import { jobsTopic } from './jobs';
import { clothingTopic } from './clothing';
import { actionsTopic } from './actions';
import { objectsTopic } from './objects';
import { zodiacTopic } from './zodiac';
import { drinksTopic } from './drinks';
import { roomsTopic } from './rooms';
import { toolsTopic } from './tools';
import { holidaysTopic } from './holidays';
import { musicTopic } from './music';
import { countriesTopic } from './countries';
import { schoolTopic } from './school';
import { officeTopic } from './office';
import { vegetablesTopic } from './vegetables';
import { gesturesTopic } from './gestures';
import { spaceTopic } from './space';
import { insectsTopic } from './insects';
import { sealifeTopic } from './sealife';
import { birdsTopic } from './birds';
import { dessertsTopic } from './desserts';
import { fastfoodTopic } from './fastfood';
import { wildanimalsTopic } from './wildanimals';
import { flowersTopic } from './flowers';
import { electronicsTopic } from './electronics';
import { medicalTopic } from './medical';
import { cleaningTopic } from './cleaning';
import { fantasyTopic } from './fantasy';
import { jewelryTopic } from './jewelry';
import { campingTopic } from './camping';
import { beachTopic } from './beach';
import { reptilesTopic } from './reptiles';
import { babyTopic } from './baby';
import { positionsTopic } from './positions';
import { oppositesTopic } from './opposites';
import { greetingsTopic } from './greetings';
import { seasonsTopic } from './seasons';
import { shoppingTopic } from './shopping';
import { pronounsTopic } from './pronouns';
import { cookingTopic } from './cooking';
import { mathTopic } from './math';
import { plantsTopic } from './plants';

// All available topics
export const topics: Topic[] = [
  // Difficulty 1 (easiest)
  animalsTopic,
  numbersTopic,
  colorsTopic,
  weatherTopic,
  fruitsTopic,
  vegetablesTopic,
  bodyTopic,
  transportTopic,
  natureTopic,
  clothingTopic,
  objectsTopic,
  drinksTopic,
  roomsTopic,
  schoolTopic,
  gesturesTopic,
  dessertsTopic,
  fastfoodTopic,
  cleaningTopic,
  babyTopic,
  greetingsTopic,
  shoppingTopic,
  pronounsTopic,
  plantsTopic,
  // Difficulty 2
  directionsTopic,
  positionsTopic,
  oppositesTopic,
  familyTopic,
  sportsTopic,
  emotionsTopic,
  timeTopic,
  placesTopic,
  jobsTopic,
  actionsTopic,
  toolsTopic,
  holidaysTopic,
  musicTopic,
  countriesTopic,
  officeTopic,
  spaceTopic,
  insectsTopic,
  sealifeTopic,
  birdsTopic,
  wildanimalsTopic,
  flowersTopic,
  electronicsTopic,
  medicalTopic,
  fantasyTopic,
  jewelryTopic,
  campingTopic,
  beachTopic,
  reptilesTopic,
  seasonsTopic,
  cookingTopic,
  mathTopic,
  // Difficulty 3
  zodiacTopic,
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
