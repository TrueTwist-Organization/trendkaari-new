/** @deprecated Use discoveryExperience.js — kept for backward-compatible imports. */
export {
  DISCOVERY_HUB_BLOCKS,
  DISCOVERY_EXPERIENCE_BLOCKS,
  getExperienceBlock as getDiscoveryBlock,
} from './discoveryExperience.js';

import { DISCOVERY_HUB_BLOCKS } from './discoveryExperience.js';

export const DISCOVERY_QUIZ_TEASERS = DISCOVERY_HUB_BLOCKS.filter(
  (b) => b.kind === 'quiz' || b.kind === 'match',
);
