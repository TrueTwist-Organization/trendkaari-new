/**
 * GA4 Custom Event Tracker — Trendkaari
 *
 * Setup:
 *   1. Replace G-XXXXXXXXXX in index.html with your real Measurement ID.
 *   2. Optionally set VITE_GA4_ID=G-XXXXXXXXXX in .env — used only for
 *      the console warning when the ID is missing.
 *
 * All functions are safe to call before GA4 loads (events queue via
 * dataLayer). They silently no-op when window.gtag is not yet defined,
 * never throwing or breaking the UI.
 *
 * Event naming follows GA4 recommended schema:
 *   snake_case names, string/number params only.
 *
 * Custom dimensions to register in GA4 Console → Admin → Custom definitions:
 *   quiz_id, quiz_name, result_key, result_name
 *   look_id, celebrity_name, look_title
 *   trend_id, trend_name
 *   guide_id, guide_name, topic
 *   rec_type, rec_id, rec_title, source_context
 */

/* ── Internal helpers ──────────────────────────────────────────────────── */

/**
 * Safe gtag call. Uses window.gtag if available (injected by GA4 snippet),
 * otherwise pushes directly to dataLayer so events queue until GA4 loads.
 */
function gtag() {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/**
 * Dispatch a GA4 custom event.
 * Silently ignores errors — tracking must never crash the app.
 */
function track(eventName, params = {}) {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else {
      // GA4 not yet initialised — queue via dataLayer
      gtag('event', eventName, params);
    }
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[GA4]', eventName, params);
    }
  } catch {
    // Never surface tracking errors to users
  }
}

/* ── Public event functions ────────────────────────────────────────────── */

/**
 * Fired when a user starts a quiz (QuizFlow mounts).
 * @param {string} quizSlug  - e.g. 'personality'
 * @param {string} quizTitle - e.g. 'Fashion Personality Quiz'
 */
export function trackQuizStarted(quizSlug, quizTitle) {
  track('quiz_started', {
    quiz_id: quizSlug,
    quiz_name: quizTitle,
    content_type: 'quiz',
  });
}

/**
 * Fired when a user lands on the quiz result page.
 * @param {string} quizSlug    - e.g. 'personality'
 * @param {string} quizTitle   - e.g. 'Fashion Personality Quiz'
 * @param {string} resultKey   - e.g. 'modern-minimalist'
 * @param {string} resultTitle - e.g. 'The Modern Minimalist'
 */
export function trackQuizCompleted(quizSlug, quizTitle, resultKey, resultTitle) {
  track('quiz_completed', {
    quiz_id: quizSlug,
    quiz_name: quizTitle,
    result_key: resultKey,
    result_name: resultTitle,
    content_type: 'quiz',
  });
}

/**
 * Fired when a celebrity look detail page loads.
 * @param {string} lookId      - e.g. 'deepika-airport'
 * @param {string} celebrity   - e.g. 'Deepika Padukone'
 * @param {string} lookTitle   - e.g. 'Quiet Luxury Kurta Set'
 * @param {string} category    - e.g. 'kurtas'
 */
export function trackCelebrityPageViewed(lookId, celebrity, lookTitle, category) {
  track('celebrity_page_view', {
    look_id: lookId,
    celebrity_name: celebrity,
    look_title: lookTitle,
    category,
    content_type: 'celebrity_look',
  });
}

/**
 * Fired when an individual trend page loads (not the hub).
 * @param {string} trendSlug  - e.g. 'wedding-fashion'
 * @param {string} trendTitle - e.g. 'Wedding Fashion 2026'
 */
export function trackTrendPageViewed(trendSlug, trendTitle) {
  track('trend_page_view', {
    trend_id: trendSlug,
    trend_name: trendTitle,
    content_type: 'trend',
  });
}

/**
 * Fired when a knowledge/guide page loads.
 * @param {string} guideSlug  - e.g. 'what-is-anarkali'
 * @param {string} guideTitle - e.g. 'What is Anarkali?'
 * @param {string} topicSlug  - e.g. 'silhouettes'
 */
export function trackGuidePageViewed(guideSlug, guideTitle, topicSlug) {
  track('guide_page_view', {
    guide_id: guideSlug,
    guide_name: guideTitle,
    topic: topicSlug,
    content_type: 'knowledge_guide',
  });
}

/**
 * Fired when a user taps a recommendation card in DiscoveryLoopSection,
 * or any other editorial cross-link across the site.
 *
 * @param {string} type          - 'trend' | 'celeb' | 'quiz' | 'guide'
 * @param {string} id            - slug or ID of the destination
 * @param {string} title         - human-readable title
 * @param {string} sourceContext - page that contained the recommendation
 *   e.g. 'product_detail' | 'magazine_article' | 'quiz_result'
 *       | 'celebrity_look' | 'trend_page' | 'knowledge_page'
 */
export function trackRecommendationClicked(type, id, title, sourceContext) {
  track('recommendation_click', {
    rec_type: type,
    rec_id: id,
    rec_title: title,
    source_context: sourceContext,
    content_type: 'recommendation',
  });
}
