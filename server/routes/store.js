import { Router } from 'express';
import { readStore, readFreshStore, updateStore, resolveStoreAdSlots } from '../lib/store.js';
import { getContent, getDiscoveryConfig, getHomepageConfig } from '../lib/editorialContent.js';
import { sendOrderConfirmationEmail } from '../lib/orderEmail.js';
import { optionalUser } from '../middleware/userAuth.js';
import { getStoreSettings, getActiveAdSlots } from '../lib/siteConfig.js';
import { getPublicGiftCombos } from '../lib/giftCombos.js';
import { normalizeProductImages } from '../lib/productImages.js';
import { ingestJourneyEvents } from '../lib/journeyAnalytics.js';

const router = Router();

function sortProductsForStorefront(products = []) {
  return [...products].sort((a, b) => {
    const aAdmin = a.adminCreated || a.source === 'admin';
    const bAdmin = b.adminCreated || b.source === 'admin';
    if (aAdmin && !bAdmin) return -1;
    if (!aAdmin && bAdmin) return 1;
    if (aAdmin && bAdmin) {
      return (
        new Date(b.adminCreatedAt || 0).getTime() - new Date(a.adminCreatedAt || 0).getTime()
      );
    }
    return Number(b.id) - Number(a.id);
  });
}

router.get('/products', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  const store = await readFreshStore();
  const products = sortProductsForStorefront(store.products || []).map(normalizeProductImages);
  res.json({
    products,
    updatedAt: store._storeUpdatedAt || null,
    total: products.length,
  });
});

router.get('/coupons', (req, res) => {
  const store = readStore();
  res.json({ coupons: store.coupons });
});

router.get('/settings', (req, res) => {
  const store = readStore();
  res.json({ settings: getStoreSettings(store) });
});

router.get('/ad-slots', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  const placement = req.query.placement || null;
  const adSlots = await resolveStoreAdSlots([]);
  res.json({
    adSlots: getActiveAdSlots({ adSlots }, placement || null),
    updatedAt: adSlots.reduce((max, slot) => {
      const t = Date.parse(slot.updatedAt || '');
      return Number.isFinite(t) && t > max ? t : max;
    }, 0) || null,
  });
});

router.get('/gift-combos', (req, res) => {
  const store = readStore();
  res.json({ giftCombos: getPublicGiftCombos(store) });
});

router.post('/orders', optionalUser, async (req, res) => {
  const orderDetails = req.body;
  if (!orderDetails?.items?.length) {
    return res.status(400).json({ error: 'Order must include items' });
  }

  const store = readStore();
  const user = req.user ? (store.users || []).find((u) => u.id === req.user.id) : null;
  const guestEmail = String(orderDetails.email || '').trim();
  const guestPhone = String(orderDetails.phone || '').trim();

  const hasValidEmail = Boolean(guestEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail));
  const hasValidPhone = guestPhone.replace(/\D/g, '').length >= 10;
  if (!user && !hasValidEmail && !hasValidPhone) {
    return res.status(400).json({ error: 'Email or phone number is required to place your order' });
  }

  const newOrder = {
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    userId: user?.id || null,
    customerName: orderDetails.name || user?.name,
    email: guestEmail || user?.email || '',
    phone: guestPhone || user?.phone,
    address: orderDetails.address,
    items: orderDetails.items,
    subtotal: orderDetails.subtotal,
    discount: orderDetails.discount || 0,
    grandTotal: orderDetails.grandTotal,
    status: 'Pending',
    paymentStatus: 'Paid',
    date: new Date().toLocaleString('en-IN', { hour12: true }),
    createdAt: new Date().toISOString(),
  };

  await updateStore((store) => {
    orderDetails.items.forEach((item) => {
      const prod = store.products.find((p) => p.id === item.id);
      if (!prod) return;
      const qty = item.quantity || 1;
      const size = item.selectedSize;
      if (prod.variants?.length) {
        prod.variants.forEach((v) => {
          if (v.stockBySize?.[size] != null) {
            v.stockBySize[size] = Math.max(0, v.stockBySize[size] - qty);
          }
        });
        prod.stock = prod.variants.reduce(
          (sum, v) =>
            sum + Object.values(v.stockBySize || {}).reduce((a, n) => a + Number(n || 0), 0),
          0
        );
      } else {
        prod.stock = Math.max(0, (prod.stock ?? 15) - qty);
      }
    });
    store.orders = [newOrder, ...store.orders];
    return store;
  });

  const emailResult = await sendOrderConfirmationEmail(
    newOrder,
    orderDetails.email || user?.email
  );

  res.status(201).json({
    message: emailResult.sent
      ? 'Order placed successfully'
      : 'Order saved but confirmation email could not be sent',
    order: newOrder,
    emailSent: emailResult.sent,
  });
});

router.post('/analytics/events', (req, res) => {
  const events = Array.isArray(req.body?.events) ? req.body.events : [];
  if (!events.length) {
    return res.status(400).json({ error: 'events array required' });
  }
  if (events.length > 80) {
    return res.status(413).json({ error: 'Too many events in one batch' });
  }

  const sanitized = events
    .filter((e) => e && e.type && e.sessionId)
    .slice(0, 80)
    .map((e) => ({
      type: String(e.type).slice(0, 20),
      sessionId: String(e.sessionId).slice(0, 64),
      page: String(e.page || '/').slice(0, 200),
      viewMode: String(e.viewMode || '').slice(0, 40),
      label: String(e.label || '').slice(0, 120),
      fromPage: String(e.fromPage || '').slice(0, 200),
      depth: Number(e.depth) || 0,
      durationMs: Number(e.durationMs) || 0,
      maxScrollDepth: Number(e.maxScrollDepth) || 0,
      xPct: Number(e.xPct),
      yPct: Number(e.yPct),
      tag: String(e.tag || '').slice(0, 20),
      href: String(e.href || '').slice(0, 300),
      ts: Number(e.ts) || Date.now(),
    }));

  ingestJourneyEvents(sanitized);
  res.json({ ok: true, accepted: sanitized.length });
});

/** GET /api/store/content?type=celebrity-looks — returns admin-edited content (or empty) */
const CONTENT_TYPE_MAP = {
  'celebrity-looks':  'celebrity_looks',
  'trend-pages':      'trend_pages',
  'knowledge-pages':  'knowledge_pages',
  'quizzes':          'quizzes',
  'homepage-blocks':  'homepage_blocks',
};
router.get('/content', (req, res) => {
  const storeKey = CONTENT_TYPE_MAP[req.query.type];
  if (!storeKey) return res.status(400).json({ error: 'Unknown content type' });
  try {
    const items = getContent(storeKey);
    res.json({ items, hasAdminContent: items.length > 0 });
  } catch {
    res.json({ items: [], hasAdminContent: false });
  }
});

/** GET /api/store/discovery-config — chapter rail labels, polls, trending, etc. */
router.get('/discovery-config', (req, res) => {
  try {
    res.json({ config: getDiscoveryConfig() });
  } catch {
    res.json({ config: null });
  }
});

/** GET /api/store/homepage-config — trust bar, market map, hero, section copy */
router.get('/homepage-config', (req, res) => {
  try {
    res.json({ config: getHomepageConfig() });
  } catch {
    res.json({ config: null });
  }
});

export default router;
