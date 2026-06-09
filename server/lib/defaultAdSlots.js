import { encodeAdCode } from './adSlotCode.js';
import { getGptHtmlForUnit, PLACEMENT_GPT_UNIT } from './gptAdInventory.js';

/** Built-in GPT map — used when persistence is empty and by restore-ad-slots.js */
export function getDefaultAdSlots() {
  const now = new Date().toISOString();
  return Object.entries(PLACEMENT_GPT_UNIT)
    .map(([placement, unit]) => {
      const html = getGptHtmlForUnit(unit);
      if (!html.trim()) return null;
      return {
        placement,
        code: encodeAdCode(html),
        encoded: true,
        updatedAt: now,
      };
    })
    .filter(Boolean);
}
