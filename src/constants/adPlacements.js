/** Fixed ad placements — admin pastes HTML/JS; storefront injects per slot */

import { CHECKOUT_BASE, CHECKOUT_STEPS } from '../checkout/checkoutSteps.js';
import { DEFAULT_HOMEPAGE_CONFIG } from '../data/homepageConfig.js';
import { DISCOVERY_EXPERIENCE_BLOCKS, DEFAULT_DISCOVERY_CONFIG } from '../data/discoveryExperience.js';

const HOME_SECTIONS = DEFAULT_HOMEPAGE_CONFIG;
const EDITORIAL_FEED_TITLE = HOME_SECTIONS.editorialIntro.title.replace(/\n/g, ' ');

/** Discovery chapter block id → homepage ad placement (storefront wiring) */
export const HOMEPAGE_CHAPTER_AD_BY_BLOCK_ID = {
  'style-quiz': 'homepage_after_style_quiz',
  'bollywood-looks': 'homepage_after_bollywood_looks',
  'occasion-gate': 'homepage_after_occasion_gate',
  'wedding-festive': 'homepage_after_wedding_festive',
  'edit-desk': 'homepage_after_edit_desk',
  'editors-voice': 'homepage_after_editors_voice',
  'style-debate': 'homepage_after_style_debate',
  'trending-india': 'homepage_after_trending_india',
};

const CHAPTER_TITLE_BY_PLACEMENT = Object.fromEntries(
  Object.entries(HOMEPAGE_CHAPTER_AD_BY_BLOCK_ID).map(([blockId, placementKey]) => {
    const block = DISCOVERY_EXPERIENCE_BLOCKS.find((b) => b.id === blockId);
    return [placementKey, block?.title ?? blockId];
  }),
);

const COMMON_SLOTS = [
  {
    key: 'site_common_ad',
    title: 'All Pages — Common Ad',
    description:
      'Paste ad code once — shows below the site header on every page (home, category, product, info). Google Analytics, Snapchat Pixel, and similar tracking scripts are injected into the page <head> automatically.',
    placeholder: 'Paste ad HTML/script (e.g. Google AdSense)…',
  },
];

/** Homepage-only ad slots — titles match live section headings (top → bottom) */
const HOME_SLOTS = [
  {
    key: 'homepage_below_header',
    title: 'Below Header',
    description: 'Homepage — under site header, before hero banner.',
    placeholder: 'Paste ad HTML/script — top of homepage…',
  },
  {
    key: 'homepage_after_hero',
    title: 'Celebrate Every Special Moment',
    description: 'Ad below hero banner.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_after_trust',
    title: 'Why Trendkaari',
    description: 'Ad below trust bar (expertise · arbitrage · editorial · India-first).',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_before_categories',
    title: HOME_SECTIONS.marketMap.title,
    description: `Ad above “${HOME_SECTIONS.marketMap.title}” category rail.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_after_categories',
    title: HOME_SECTIONS.marketMap.title,
    description: `Ad below “${HOME_SECTIONS.marketMap.title}” category rail.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_before_editorial',
    title: EDITORIAL_FEED_TITLE,
    description: `Ad above “${EDITORIAL_FEED_TITLE}” intro and chapter feed.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_after_poster_strip',
    title: DEFAULT_DISCOVERY_CONFIG.stripLabel,
    description: `Ad below “${DEFAULT_DISCOVERY_CONFIG.stripLabel}” chapter poster strip.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_after_style_quiz',
    title: CHAPTER_TITLE_BY_PLACEMENT.homepage_after_style_quiz,
    description: `Ad below “${CHAPTER_TITLE_BY_PLACEMENT.homepage_after_style_quiz}”.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_after_bollywood_looks',
    title: CHAPTER_TITLE_BY_PLACEMENT.homepage_after_bollywood_looks,
    description: `Ad below “${CHAPTER_TITLE_BY_PLACEMENT.homepage_after_bollywood_looks}”.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_after_occasion_gate',
    title: CHAPTER_TITLE_BY_PLACEMENT.homepage_after_occasion_gate,
    description: `Ad below “${CHAPTER_TITLE_BY_PLACEMENT.homepage_after_occasion_gate}”.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_after_wedding_festive',
    title: CHAPTER_TITLE_BY_PLACEMENT.homepage_after_wedding_festive,
    description: `Ad below “${CHAPTER_TITLE_BY_PLACEMENT.homepage_after_wedding_festive}”.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_after_edit_desk',
    title: CHAPTER_TITLE_BY_PLACEMENT.homepage_after_edit_desk,
    description: `Ad below “${CHAPTER_TITLE_BY_PLACEMENT.homepage_after_edit_desk}”.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_after_editors_voice',
    title: CHAPTER_TITLE_BY_PLACEMENT.homepage_after_editors_voice,
    description: `Ad below “${CHAPTER_TITLE_BY_PLACEMENT.homepage_after_editors_voice}”.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_after_style_debate',
    title: CHAPTER_TITLE_BY_PLACEMENT.homepage_after_style_debate,
    description: `Ad below “${CHAPTER_TITLE_BY_PLACEMENT.homepage_after_style_debate}”.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_after_trending_india',
    title: CHAPTER_TITLE_BY_PLACEMENT.homepage_after_trending_india,
    description: `Ad below “${CHAPTER_TITLE_BY_PLACEMENT.homepage_after_trending_india}”.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_before_spotlight',
    title: HOME_SECTIONS.spotlight.title,
    description: `Ad above “${HOME_SECTIONS.spotlight.title}”.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_after_spotlight',
    title: HOME_SECTIONS.spotlight.title,
    description: `Ad below “${HOME_SECTIONS.spotlight.title}”.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_before_finale',
    title: HOME_SECTIONS.finale.title,
    description: `Ad above “${HOME_SECTIONS.finale.title}”.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'homepage_after_finale',
    title: HOME_SECTIONS.finale.title,
    description: `Ad below “${HOME_SECTIONS.finale.title}” — last homepage slot.`,
    placeholder: 'Paste ad HTML/script…',
  },
];

/** Retired shared homepage slots → first matching per-section slot (admin + storefront migration) */
export const RETIRED_HOMEPAGE_AD_ALIASES = {
  homepage_editorial_every_2: 'homepage_after_style_quiz',
  home_editorial_every_2: 'homepage_after_style_quiz',
  homepage_editorial_bottom: 'homepage_after_trending_india',
};

/** Old home_* keys → new homepage_* keys (for saved admin ads) */
export const LEGACY_HOMEPAGE_AD_ALIASES = {
  homepage_below_header: 'home_below_header',
  homepage_after_hero: 'home_after_hero',
  homepage_after_trust: 'home_main',
  homepage_before_categories: 'home_before_categories',
  homepage_after_categories: 'home_between_categories_gift',
  homepage_before_editorial: 'home_after_trends',
  homepage_after_poster_strip: 'home_after_trends',
  homepage_after_trending_india: 'home_editorial_bottom',
  homepage_before_spotlight: 'home_after_gift',
  homepage_after_spotlight: 'home_after_promo',
  homepage_before_finale: 'home_after_reviews',
};

const CATEGORY_SLOTS = [
  {
    key: 'category_top',
    title: 'Category — Top of Page',
    description: '/category listing — above title banner (first slot on page).',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'category_after_banner',
    title: 'Category — After Title Banner',
    description: 'Below category title, tagline & description block.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'category_before_quick_tabs',
    title: 'Category — Before Quick Tabs',
    description: 'Above “Jump to Collection” tabs bar.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'category_after_quick_tabs',
    title: 'Category — After Quick Tabs',
    description: 'Below quick tabs, above filters + product grid.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'category_sidebar_top',
    title: 'Category — Sidebar Top',
    description: 'Filter sidebar — below “Refine Products” header.',
    placeholder: 'Paste ad HTML/script (narrow/sidebar ad)…',
  },
  {
    key: 'category_sidebar_middle',
    title: 'Category — Sidebar Middle',
    description: 'Filter sidebar — after size/color filters.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'category_sidebar_bottom',
    title: 'Category — Sidebar Bottom',
    description: 'Filter sidebar — bottom (above trust strip).',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'category_above_sort',
    title: 'Category — Above Sort Bar',
    description: 'Product area — above “Showing X styles” & sort dropdown.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'category_below_sort',
    title: 'Category — Below Sort Bar',
    description: 'Product area — below sort bar, above product grid.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'ads_every_2_products',
    title: 'Product Grid — Every 2 Products',
    description: 'Main catalog grid only — full-width ad after every 2nd product card (2, 4, 6…).',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'category_after_grid',
    title: 'After Product Grid',
    description: 'Below infinite-scroll product grid, still inside listing column.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'category_before_hub',
    title: 'Before Collection Hub',
    description: 'After filters + product grid workspace — above buying guide & related collections.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'category_after_hub_guide',
    title: 'After Collection Hub Guide',
    description: 'Below buying guide + related collections — above horizontal suggestion rails.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'category_suggestions_every_6',
    title: 'Suggestion Rails — Every 6 Products',
    description:
      'Inside each horizontal suggestion rail — inline ad after every 6th product (6, 12…). Same rhythm as product page.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'category_suggestions_mid',
    title: 'Between Suggestion Rails',
    description: 'Full-width ad after each horizontal suggestion rail (Complete your look, Trending, etc.).',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'category_after_suggestions',
    title: 'After Suggestion Rails',
    description: 'Below all hub suggestion rails.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'category_page_bottom',
    title: 'Page Bottom',
    description: 'Last slot on /category — footer area.',
    placeholder: 'Paste ad HTML/script…',
  },
];

/** Retired product ad keys → new per-rail interval slots */
export const RETIRED_PRODUCT_AD_ALIASES = {
  product_suggestions_every_2: 'product_similar_every_6',
};

const PRODUCT_SLOTS = [
  {
    key: 'product_top',
    title: 'Product — Top (Below Breadcrumb)',
    description: '/product page — below breadcrumb, above image + details.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_gallery_bottom',
    title: 'Product — Below Gallery',
    description: 'Left column — under main product image.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_after_title',
    title: 'Product — After Title',
    description: 'Right column — below product title & SKU.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_after_rating',
    title: 'Product — After Ratings',
    description: 'Below star rating & review count.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_after_price',
    title: 'Product — After Price',
    description: 'Below price box & “inclusive of taxes”.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_after_offers',
    title: 'Product — After Coupons Box',
    description: 'Below “Exclusive Online Offers & Coupons”.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_before_size',
    title: 'Product — Before Size Selector',
    description: 'Above “Select Size” row.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_after_size',
    title: 'Product — After Size Selector',
    description: 'Below size pills, above quantity.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_above_cart',
    title: 'Product — Above Quantity',
    description: 'Above quantity counter.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_below_cart',
    title: 'Product — Below Add to Bag',
    description: 'Below ADD TO BAG / Wishlist buttons.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_before_details',
    title: 'Product — Before Long Details',
    description: 'Above “Product description / About” accordion section.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_after_details',
    title: 'Product — After Long Details',
    description: 'Below description / highlights / size chart block.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_before_trust',
    title: 'Product — Before Trust Strip',
    description: 'Above shipping / returns / original icons.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_after_trust',
    title: 'Product — After Trust Strip',
    description: 'Below trust icons row.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_before_suggestions',
    title: 'More from the Edit — Above Rails',
    description: 'Product page below-fold — above similar / trending suggestion rails.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_similar_every_6',
    title: 'Similar Products — Every 6 Items',
    description:
      'Inside “Similar products” horizontal rail — inline ad after every 6th product (6, 12…).',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_trending_every_6',
    title: 'Trending Picks — Every 6 Items',
    description:
      'Inside bottom “Trending” rail on PDP — inline ad after every 6th product (6, 12…).',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_after_suggestions',
    title: 'More from the Edit — Below Rails',
    description: 'Product page below-fold — after all suggestion rails.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'product_page_bottom',
    title: 'Product — Page Bottom',
    description: 'Last slot on product page (before footer).',
    placeholder: 'Paste ad HTML/script…',
  },
];

const CHECKOUT_STEP_PAGE_SLOTS = CHECKOUT_STEPS.flatMap((step) => [
  {
    key: `checkout_step_${step.id}_top`,
    title: `Checkout — ${step.label} (Top Ad)`,
    description: `${CHECKOUT_BASE}/${step.path} — ad above the checkout card.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: `checkout_step_${step.id}_bottom`,
    title: `Checkout — ${step.label} (Bottom Ad)`,
    description: `${CHECKOUT_BASE}/${step.path} — ad below the card, above Back/Continue.`,
    placeholder: 'Paste ad HTML/script…',
  },
]);

const CHECKOUT_ERROR_PAGE_SLOTS = [
  {
    key: 'checkout_step_error_top',
    title: 'Checkout — Technical Error (Top Ad)',
    description: `${CHECKOUT_BASE}/error — order failed / technical error screen.`,
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'checkout_step_error_bottom',
    title: 'Checkout — Technical Error (Bottom Ad)',
    description: `${CHECKOUT_BASE}/error — bottom ad on technical error page.`,
    placeholder: 'Paste ad HTML/script…',
  },
];

const CHECKOUT_SLOTS = [
  {
    key: 'cart_above_checkout',
    title: 'Cart — Above Checkout Button',
    description: 'Cart drawer — above “Proceed to Checkout”.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'checkout_all_steps_top',
    title: 'Checkout — All Steps (Top)',
    description: 'Optional shared top slot — only used if you wire it on a checkout page; per-step top slots are preferred.',
    placeholder: 'Paste ad HTML/script for checkout top…',
  },
  {
    key: 'checkout_all_steps_bottom',
    title: 'Checkout — All Steps (Bottom)',
    description: 'Optional shared bottom slot — only used if you wire it on a checkout page; per-step bottom slots are preferred.',
    placeholder: 'Paste ad HTML/script for checkout bottom…',
  },
  ...CHECKOUT_STEP_PAGE_SLOTS,
  ...CHECKOUT_ERROR_PAGE_SLOTS,
  {
    key: 'checkout_empty_cart',
    title: 'Checkout — Empty Bag',
    description: `${CHECKOUT_BASE}/bag when the cart is empty.`,
    placeholder: 'Paste ad HTML/script…',
  },
];

const CONTENT_SLOTS = [
  {
    key: 'discover_feed_top',
    title: 'Discover — Top',
    description: '/discover page — below hero, before first product rail.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'discover_feed_mid',
    title: 'Discover — Mid Feed',
    description: '/discover page — once after the 2nd product rail.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'discover_feed_bottom',
    title: 'Discover — Bottom',
    description: '/discover page — end of feed, before footer.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'magazine_article_mid',
    title: 'Magazine Article — Mid',
    description: 'Between article body and “Shop this story” rail.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'magazine_article_bottom',
    title: 'Magazine Article — Bottom',
    description: 'Below recommendation rails, above “Where to go next”.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'quiz_hub_top',
    title: 'Quiz Hub — Top',
    description: '/quiz index — below hero, before featured AI Style Finder card.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'quiz_hub_mid',
    title: 'Quiz Hub — Mid',
    description: 'Between quiz hero and quiz card grid.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'quiz_hub_bottom',
    title: 'Quiz Hub — Bottom',
    description: 'Below quiz grid, above endless discovery.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'quiz_result_mid',
    title: 'Quiz Result — Mid',
    description: 'Between result hero and “Picked for your result” rail.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'quiz_result_bottom',
    title: 'Quiz Result — Bottom',
    description: 'Bottom of quiz result page, above footer.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'quiz_flow_mid',
    title: 'Quiz Flow — Mid',
    description: '/quiz/:slug step flow — below progress, above question.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'quiz_flow_bottom',
    title: 'Quiz Flow — Bottom',
    description: '/quiz/:slug step flow — below next button / discovery.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'game_play_mid',
    title: 'Game Play — Mid',
    description: '/games/:slug play screen — mid-page.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'game_play_bottom',
    title: 'Game Play — Bottom',
    description: '/games/:slug play screen — before endless discovery.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'knowledge_page_mid',
    title: 'Knowledge Guide — Mid',
    description: 'Mid-page on fashion knowledge / styling guides.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'knowledge_page_bottom',
    title: 'Knowledge Guide — Bottom',
    description: 'Bottom of knowledge guide pages.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'content_page_top',
    title: 'Info Pages — Top',
    description: 'Top of static info pages (privacy, returns, shipping, etc.).',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'content_page_bottom',
    title: 'Info Pages — Bottom',
    description: 'Bottom of static info pages, above recommendations.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'viral_hub_mid',
    title: 'Viral Fashion — Mid',
    description: 'Mid-page on viral fashion hub.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'games_hub_top',
    title: 'Games Hub — Top',
    description: '/games index — below hero, before game cards.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'games_hub_mid',
    title: 'Games Hub — Mid',
    description: 'Mid-page on fashion games hub.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'games_hub_bottom',
    title: 'Games Hub — Bottom',
    description: 'Below game cards / discovery, bottom of games hub.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'viral_hub_bottom',
    title: 'Viral Fashion — Bottom',
    description: 'Bottom of viral fashion hub, above footer.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'celebrity_hub_top',
    title: 'Bollywood Style Match — Top',
    description: '/celebrity-match hub — below hero, before look grid.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'celebrity_hub_mid',
    title: 'Bollywood Style Match — Mid',
    description: '/celebrity-match hub — between hero and look grid.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'celebrity_hub_bottom',
    title: 'Bollywood Style Match — Bottom',
    description: '/celebrity-match hub — below look grid.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'celebrity_look_mid',
    title: 'Celebrity Look — Mid',
    description: '/celebrity-match/:id — after hero, before style notes.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'celebrity_look_bottom',
    title: 'Celebrity Look — Bottom',
    description: '/celebrity-match/:id — before endless discovery.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'style_finder_top',
    title: 'AI Style Finder — Top',
    description: '/style-finder flow — below intro hero, above step flow.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'style_finder_mid',
    title: 'AI Style Finder — Mid',
    description: '/style-finder flow — below intro, above quiz steps.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'style_finder_bottom',
    title: 'AI Style Finder — Bottom',
    description: '/style-finder flow — bottom of flow page.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'style_finder_result_mid',
    title: 'AI Style Finder Result — Mid',
    description: '/style-finder/result — after result hero.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'style_finder_result_bottom',
    title: 'AI Style Finder Result — Bottom',
    description: '/style-finder/result — before finale CTA.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'spin_wheel_top',
    title: 'Spin Wheel — Top',
    description: 'Order success spin modal — below headline, above wheel.',
    placeholder: 'Paste ad HTML/script for spin wheel…',
  },
  {
    key: 'spin_wheel_bottom',
    title: 'Spin Wheel — Bottom',
    description: 'Order success spin modal — below result, above continue button.',
    placeholder: 'Paste ad HTML/script for spin wheel…',
  },
  {
    key: 'knowledge_hub_top',
    title: 'Fashion Knowledge Hub — Top',
    description: '/knowledge index — below hero, before featured guides.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'knowledge_hub_mid',
    title: 'Fashion Knowledge Hub — Mid',
    description: '/knowledge index — after featured guides.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'knowledge_hub_bottom',
    title: 'Fashion Knowledge Hub — Bottom',
    description: '/knowledge index — before discovery loop.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'magazine_hub_top',
    title: 'Fashion Magazine Hub — Top',
    description: '/magazine index — below hero, before category cards.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'magazine_hub_mid',
    title: 'Fashion Magazine Hub — Mid',
    description: '/magazine index — after category cards.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'magazine_hub_bottom',
    title: 'Fashion Magazine Hub — Bottom',
    description: '/magazine index — before endless discovery.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'magazine_category_mid',
    title: 'Magazine Category — Mid',
    description: '/magazine/:category — below category hero.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'magazine_category_bottom',
    title: 'Magazine Category — Bottom',
    description: '/magazine/:category — bottom of category listing.',
    placeholder: 'Paste ad HTML/script…',
  },
];

const TREND_SLOTS = [
  {
    key: 'trend_hub_top',
    title: 'Trend Hub — Top',
    description: '/trends — below intro hero, before trend card grid.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'trend_hub_mid',
    title: 'Trend Hub — Mid',
    description: '/trends — between intro and trend card grid.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'trend_hub_bottom',
    title: 'Trend Hub — Bottom',
    description: '/trends — below all trend cards.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'trend_page_top',
    title: 'Trend Report — Top',
    description: '/trends/wedding-fashion (and every /trends/:slug) — below hero, above “The story” editorial.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'trend_page_mid',
    title: 'Trend Report — Mid',
    description: '/trends/:slug — after editorial, before celebrity looks.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'trend_page_after_shop',
    title: 'Trend Report — After Shop',
    description: '/trends/:slug — after “Shop the trend” product rail.',
    placeholder: 'Paste ad HTML/script…',
  },
  {
    key: 'trend_page_bottom',
    title: 'Trend Report — Bottom',
    description: '/trends/:slug — after related trends, before endless discovery.',
    placeholder: 'Paste ad HTML/script…',
  },
];

const OTHER_SLOTS = [
  {
    key: 'global_banner',
    title: 'Global Banner (2nd strip)',
    description:
      'Second strip below header when site_common_ad is also filled. If only this slot is filled, it shows as the main header ad.',
    placeholder: 'Paste ad HTML/script (e.g. Google Tag Manager)…',
  },
];

/** Common → Checkout → Homepage → Category → Product → other */
export const AD_PLACEMENT_DEFINITIONS = [
  ...COMMON_SLOTS,
  ...CHECKOUT_SLOTS,
  ...HOME_SLOTS,
  ...CATEGORY_SLOTS,
  ...PRODUCT_SLOTS,
  ...CONTENT_SLOTS,
  ...TREND_SLOTS,
  ...OTHER_SLOTS,
];

export const COMMON_AD_PLACEMENT_KEYS = COMMON_SLOTS.map((d) => d.key);

export const CHECKOUT_AD_PLACEMENT_KEYS = CHECKOUT_SLOTS.map((d) => d.key);

export const HOME_AD_PLACEMENT_KEYS = HOME_SLOTS.map((d) => d.key);

export const CATEGORY_AD_PLACEMENT_KEYS = CATEGORY_SLOTS.map((d) => d.key);

export const PRODUCT_AD_PLACEMENT_KEYS = PRODUCT_SLOTS.map((d) => d.key);

export const CONTENT_AD_PLACEMENT_KEYS = CONTENT_SLOTS.map((d) => d.key);

export const TREND_AD_PLACEMENT_KEYS = TREND_SLOTS.map((d) => d.key);

export const OTHER_AD_PLACEMENT_KEYS = OTHER_SLOTS.map((d) => d.key);

/** Admin panel section order */
export const AD_PLACEMENT_SECTIONS = [
  { id: 'common', title: 'Common — All Pages', keys: COMMON_AD_PLACEMENT_KEYS },
  { id: 'checkout', title: 'Checkout — Every Page', keys: CHECKOUT_AD_PLACEMENT_KEYS },
  { id: 'home', title: 'Homepage — Ad Slots', keys: HOME_AD_PLACEMENT_KEYS },
  { id: 'category', title: 'Category Page — Ad Slots', keys: CATEGORY_AD_PLACEMENT_KEYS },
  { id: 'product', title: 'Product Page — Ad Slots', keys: PRODUCT_AD_PLACEMENT_KEYS },
  { id: 'content', title: 'Discover · Magazine · Quiz · Guides', keys: CONTENT_AD_PLACEMENT_KEYS },
  { id: 'trends', title: 'Trend Reports — Hub & Detail Pages', keys: TREND_AD_PLACEMENT_KEYS },
  { id: 'other', title: 'Other', keys: OTHER_AD_PLACEMENT_KEYS },
];

export const AD_PLACEMENT_KEYS = AD_PLACEMENT_DEFINITIONS.map((d) => d.key);

/** Saved GPT code for homepage + key pages (one unique ad per section gap). */
export const PRIMARY_AD_PLACEMENT_KEYS = [
  'site_common_ad',
  ...HOME_AD_PLACEMENT_KEYS,
  'category_top',
  'category_page_bottom',
  'product_top',
  'product_page_bottom',
  'cart_above_checkout',
  'checkout_all_steps_top',
  'checkout_all_steps_bottom',
];
