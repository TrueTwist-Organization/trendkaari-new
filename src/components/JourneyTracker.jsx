import { useEffect, useRef } from 'react';
import {
  drainEventQueue,
  getOrCreateSession,
  peekEventQueue,
  restoreEventQueue,
  SCROLL_MILESTONES,
  trackClick,
  trackPageExit,
  trackPageView,
  trackScrollDepth,
} from '../utils/journeyTracker';
import { submitJourneyEvents } from '../api/storeApi';

function buildPageLabel(ctx) {
  const { viewMode, activeCategory, selectedProduct, infoSlug, quizSlug, gameSlug, knowledgePageSlug, magazineArticleSlug } = ctx;
  if (viewMode === 'product-detail' && selectedProduct?.title) return selectedProduct.title;
  if (viewMode === 'product-detail' && selectedProduct?.id) return `Product ${selectedProduct.id}`;
  if (ctx.isCategoryPage && activeCategory) return `Category: ${activeCategory}`;
  if (viewMode === 'quiz-flow' && quizSlug) return `Quiz: ${quizSlug}`;
  if (viewMode === 'game-play' && gameSlug) return `Game: ${gameSlug}`;
  if (viewMode === 'knowledge-page' && knowledgePageSlug) return `Guide: ${knowledgePageSlug}`;
  if (viewMode === 'magazine-article' && magazineArticleSlug) return `Article: ${magazineArticleSlug}`;
  if (viewMode === 'info' && infoSlug) return `Info: ${infoSlug}`;
  return viewMode || 'page';
}

function getClickLabel(target) {
  if (!target || !(target instanceof Element)) return '';
  const el = target.closest('[data-journey-label], a, button, [role="button"]') || target;
  const explicit = el.getAttribute?.('data-journey-label');
  if (explicit) return explicit;
  const aria = el.getAttribute?.('aria-label');
  if (aria) return aria;
  const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
  if (text) return text.slice(0, 80);
  return el.tagName?.toLowerCase() || 'click';
}

function computeScrollDepth() {
  const doc = document.documentElement;
  const scrollTop = window.scrollY || doc.scrollTop || 0;
  const viewport = window.innerHeight || doc.clientHeight || 0;
  const height = Math.max(doc.scrollHeight, doc.offsetHeight, doc.clientHeight) - viewport;
  if (height <= 0) return 100;
  return Math.min(100, Math.round((scrollTop / height) * 100));
}

export default function JourneyTracker({ routeContext }) {
  const pageStartRef = useRef(Date.now());
  const maxScrollRef = useRef(0);
  const hitScrollRef = useRef(new Set());
  const lastPageRef = useRef(null);
  const flushTimerRef = useRef(null);
  const routeRef = useRef(routeContext);

  routeRef.current = routeContext;

  const flushEvents = async () => {
    const batch = drainEventQueue();
    if (!batch.length) return;
    try {
      await submitJourneyEvents(batch);
    } catch {
      restoreEventQueue(batch);
    }
  };

  useEffect(() => {
    const page = typeof window !== 'undefined' ? window.location.pathname : '/';
    const ctx = routeRef.current;
    const label = buildPageLabel(ctx);

    trackPageView({
      page,
      viewMode: ctx.viewMode,
      label,
      fromPage: lastPageRef.current,
    });

    pageStartRef.current = Date.now();
    maxScrollRef.current = 0;
    hitScrollRef.current = new Set();
    lastPageRef.current = page;

    return () => {
      trackPageExit({
        page,
        viewMode: ctx.viewMode,
        durationMs: Date.now() - pageStartRef.current,
        maxScrollDepth: maxScrollRef.current,
      });
      void flushEvents();
    };
  }, [
    routeContext.viewMode,
    routeContext.isCategoryPage,
    routeContext.activeCategory,
    routeContext.infoSlug,
    routeContext.checkoutSlug,
    routeContext.quizSlug,
    routeContext.quizResultKey,
    routeContext.styleFinderResultKey,
    routeContext.magazineCategorySlug,
    routeContext.magazineArticleSlug,
    routeContext.knowledgePageSlug,
    routeContext.gameSlug,
    routeContext.selectedProductId,
  ]);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        const depth = computeScrollDepth();
        if (depth > maxScrollRef.current) maxScrollRef.current = depth;

        const page = window.location.pathname;
        const viewMode = routeRef.current.viewMode;
        for (const milestone of SCROLL_MILESTONES) {
          if (depth >= milestone && !hitScrollRef.current.has(milestone)) {
            hitScrollRef.current.add(milestone);
            trackScrollDepth({ page, viewMode, depth: milestone });
          }
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[data-journey-ignore]')) return;

      const page = window.location.pathname;
      const viewMode = routeRef.current.viewMode;
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const xPct = (e.clientX / vw) * 100;
      const yPct = (e.clientY / vh) * 100;
      const anchor = target.closest('a');
      trackClick({
        page,
        viewMode,
        xPct,
        yPct,
        label: getClickLabel(target),
        tag: target.tagName?.toLowerCase() || '',
        href: anchor?.getAttribute('href') || '',
      });
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    getOrCreateSession();

    flushTimerRef.current = window.setInterval(() => {
      if (peekEventQueue().length) void flushEvents();
    }, 20000);

    const onHide = () => {
      const page = window.location.pathname;
      trackPageExit({
        page,
        viewMode: routeRef.current.viewMode,
        durationMs: Date.now() - pageStartRef.current,
        maxScrollDepth: maxScrollRef.current,
      });
      void flushEvents();
    };

    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') onHide();
    });

    return () => {
      if (flushTimerRef.current) window.clearInterval(flushTimerRef.current);
      window.removeEventListener('pagehide', onHide);
    };
  }, []);

  return null;
}
