/**
 * Restore GPT ad placements from server/lib/gptAdInventory.js (unique unit per slot).
 *
 * Usage:
 *   node scripts/restore-ad-slots.js
 *   BLOB_READ_WRITE_TOKEN=... node scripts/restore-ad-slots.js --push
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDefaultAdSlots } from '../server/lib/defaultAdSlots.js';
import { savePersistedAdSlots } from '../server/lib/adSlotsPersistence.js';
import { saveAdSlotsToSqlite } from '../server/lib/sqliteDb.js';
import { PLACEMENT_GPT_UNIT } from '../server/lib/gptAdInventory.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, '../server/data/ad-slots.json');

const slots = getDefaultAdSlots();

fs.writeFileSync(OUT_PATH, JSON.stringify(slots, null, 2), 'utf8');
console.log(`Wrote ${slots.length} ad slots → ${OUT_PATH}`);
console.log('Placements:', Object.keys(PLACEMENT_GPT_UNIT).join(', '));

if (process.env.USE_SQLITE === 'true') {
  await saveAdSlotsToSqlite(slots);
  console.log('Synced ad slots into SQLite.');
}

if (process.argv.includes('--push')) {
  await savePersistedAdSlots(slots, { allowEmpty: false });
  console.log('Pushed ad slots to remote persistence (Blob/Redis).');
}
