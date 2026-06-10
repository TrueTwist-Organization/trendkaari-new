/**
 * CelebrityLookPage — individual celebrity look deep-dive.
 *
 * URL: /celebrity-match/:id
 *
 * Journey this page creates:
 *   Celebrity grid → Look page → Shop category → Product
 *                  ↓              ↓
 *               Style guide     More celeb looks (exploration loop)
 *                  ↓
 *               Style quiz
 *
 * Mobile first. No JS animations. Zero heavy dependencies.
 */
import React, { useMemo, useEffect, useState } from 'react';
import { ChevronLeft, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { CATEGORY_LABELS } from '../data/celebrityLooks';
import {
  CELEBRITY_LOOKS,
  fetchCelebrityLooks,
  getCelebrityLookById,
} from '../utils/celebrityLooksData';
import { filterProductsByCategory } from '../utils/categoryFilter';
import ProductImage from './ProductImage';
import EndlessDiscovery from './EndlessDiscovery';
import DiscoveryLoopSection from './DiscoveryLoopSection';
import PlacedAdSlot from './PlacedAdSlot';
import { getDiscoveryContext } from '../utils/discoveryContext';
import { trackCelebrityPageViewed } from '../utils/ga4';
import './CelebrityLookPage.css';

function ContextChips({ context }) {
  const parts = String(context || '')
    .split('·')
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) return null;

  return (
    <div className="celeb-look__context-row">
      {parts.map((part) => (
        <span key={part} className="celeb-look__context">
          {part}
        </span>
      ))}
    </div>
  );
}

function StyleNote({ note, index }) {
  return (
    <li className="celeb-look__note">
      <span className="celeb-look__note-num" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="celeb-look__note-text">{note}</span>
    </li>
  );
}

function ProductCard({ product, onSelect }) {
  return (
    <button
      type="button"
      className="celeb-look__product-card"
      onClick={() => onSelect?.(product)}
      data-journey-label={`Shop: ${product.title}`}
    >
      <div className="celeb-look__product-img-wrap">
        <ProductImage
          src={product.image}
          product={product}
          alt={product.title}
          className="celeb-look__product-img"
          loading="lazy"
        />
      </div>
      <div className="celeb-look__product-info">
        <p className="celeb-look__product-name">{product.title}</p>
        <p className="celeb-look__product-price">₹{product.price?.toLocaleString('en-IN')}</p>
      </div>
    </button>
  );
}

function MoreLookCard({ look, onNavigate }) {
  return (
    <button
      type="button"
      className="celeb-look__more-card"
      onClick={() => onNavigate(`/celebrity-match/${encodeURIComponent(look.id)}`)}
      data-journey-label={`More look: ${look.celebrity}`}
    >
      <div className="celeb-look__more-img-wrap">
        <ProductImage
          src={look.image}
          alt=""
          className="celeb-look__more-img"
          loading="lazy"
        />
        <div className="celeb-look__more-overlay" aria-hidden="true" />
        <div className="celeb-look__more-info">
          <span className="celeb-look__more-badge">{look.theme}</span>
          <p className="celeb-look__more-name">{look.celebrity}</p>
          <p className="celeb-look__more-title">{look.title}</p>
        </div>
      </div>
    </button>
  );
}

export default function CelebrityLookPage({
  lookId,
  products = [],
  adCodes = {},
  onBack,
  onSelectProduct,
  onSelectCategory,
  onNavigate,
  onOpenArticle,
  onStartQuiz,
  onOpenKnowledgePage,
}) {
  const [looksCatalog, setLooksCatalog] = useState(CELEBRITY_LOOKS);
  const [looksReady, setLooksReady] = useState(false);

  useEffect(() => {
    let active = true;
    fetchCelebrityLooks()
      .then((items) => {
        if (active) setLooksCatalog(items);
      })
      .catch(() => {
        if (active) setLooksCatalog(CELEBRITY_LOOKS);
      })
      .finally(() => {
        if (active) setLooksReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const look = useMemo(
    () => getCelebrityLookById(looksCatalog, lookId),
    [looksCatalog, lookId],
  );

  const otherLooks = useMemo(
    () => looksCatalog.filter((l) => l.id !== look?.id),
    [looksCatalog, look],
  );
  const discoveryCtx = useMemo(
    () => getDiscoveryContext(look?.category),
    [look],
  );

  useEffect(() => {
    if (look) {
      trackCelebrityPageViewed(look.id, look.celebrity, look.title, look.category);
    }
  }, [lookId, look]);

  const relatedProducts = useMemo(() => {
    if (!look || !products.length) return [];
    const matched = filterProductsByCategory(products, look.category);
    if (matched.length) return matched.slice(0, 8);
    return products.slice(0, 8);
  }, [look, products]);

  if (!looksReady) {
    return (
      <div className="celeb-look celeb-look--loading container">
        <p className="celeb-look__404-msg">Loading this Bollywood look…</p>
      </div>
    );
  }

  if (!look) {
    return (
      <div className="celeb-look celeb-look--404 container">
        <button type="button" className="celeb-look__back-btn" onClick={onBack}>
          <ChevronLeft size={16} aria-hidden="true" /> All celebrity looks
        </button>
        <p className="celeb-look__404-msg">This look is no longer available.</p>
        <button type="button" className="celeb-look__all-celebs-cta" onClick={onBack}>
          Browse all celebrity looks
        </button>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[look.category] || look.category;
  const heroSrc = look.heroImage || look.image;
  const isBannerHero = Boolean(look.heroImage);

  return (
    <div className="celeb-look">

      {isBannerHero ? (
        <div className="celeb-look__banner-nav container">
          <button
            type="button"
            className="celeb-look__back-btn"
            onClick={onBack}
            aria-label="Back to all celebrity looks"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            All celebrity looks
          </button>
        </div>
      ) : null}

      <header className={`celeb-look__hero${isBannerHero ? ' celeb-look__hero--banner' : ''}`}>
        {isBannerHero ? (
          <button
            type="button"
            className="celeb-look__banner-hit"
            onClick={() => onSelectCategory?.(look.category)}
            aria-label={`Shop ${categoryLabel}`}
          >
            <img
              src={heroSrc}
              alt={`${look.celebrity} — ${look.title}`}
              className="celeb-look__hero-img"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="1024"
              height="576"
            />
          </button>
        ) : (
          <>
            <div className="celeb-look__hero-visual" aria-hidden="true">
              <ProductImage
                src={heroSrc}
                alt={`${look.celebrity} — ${look.title}`}
                className="celeb-look__hero-img"
                loading="eager"
                decoding="async"
              />
              <div className="celeb-look__hero-overlay" />
            </div>

            <div className="celeb-look__hero-inner container">
              <div className="celeb-look__hero-content">
                <button
                  type="button"
                  className="celeb-look__back-btn"
                  onClick={onBack}
                  aria-label="Back to all celebrity looks"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  All celebrity looks
                </button>

                <ContextChips context={look.context} />
                <h1 className="celeb-look__headline">{look.title}</h1>
                <p className="celeb-look__byline">as seen on {look.celebrity}</p>
                {look.hook ? <p className="celeb-look__hook">{look.hook}</p> : null}
                <div className="celeb-look__hero-actions">
                  <button
                    type="button"
                    className="celeb-look__hero-cta celeb-look__hero-cta--primary"
                    onClick={() => onSelectCategory?.(look.category)}
                  >
                    Shop {categoryLabel}
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                  {look.quizSlug ? (
                    <button
                      type="button"
                      className="celeb-look__hero-cta celeb-look__hero-cta--ghost"
                      onClick={() => onStartQuiz?.(look.quizSlug)}
                    >
                      <Sparkles size={14} aria-hidden="true" />
                      Take style quiz
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {isBannerHero ? (
        <div className="container celeb-look__banner-meta">
          <ContextChips context={look.context} />
          <h1 className="celeb-look__headline">{look.title}</h1>
          <p className="celeb-look__byline">as seen on {look.celebrity}</p>
          <div className="celeb-look__hero-actions">
            <button
              type="button"
              className="celeb-look__hero-cta celeb-look__hero-cta--primary"
              onClick={() => onSelectCategory?.(look.category)}
            >
              Shop {categoryLabel}
              <ArrowRight size={14} aria-hidden="true" />
            </button>
            {look.quizSlug ? (
              <button
                type="button"
                className="celeb-look__hero-cta celeb-look__hero-cta--ghost"
                onClick={() => onStartQuiz?.(look.quizSlug)}
              >
                <Sparkles size={14} aria-hidden="true" />
                Take style quiz
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="container celeb-look__body">

        <PlacedAdSlot adCodes={adCodes} placement="celebrity_look_mid" variant="section" />

        {/* ─── Style Notes ────────────────────────────────────────────── */}
        <section className="celeb-look__notes-section">
          <p className="celeb-look__section-eyebrow">STYLE NOTES</p>
          <h2 className="celeb-look__section-title">How to wear this</h2>
          <ol className="celeb-look__notes-list" aria-label="Styling tips">
            {look.styleNotes.map((note, i) => (
              <StyleNote key={i} note={note} index={i} />
            ))}
          </ol>
        </section>

        {/* ─── Shop the Look ──────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="celeb-look__shop-section">
            <div className="celeb-look__shop-head">
              <div>
                <p className="celeb-look__section-eyebrow">SHOP THE LOOK</p>
                <h2 className="celeb-look__section-title">{categoryLabel} similar to this edit</h2>
              </div>
              <button
                type="button"
                className="celeb-look__see-all"
                onClick={() => onSelectCategory?.(look.category)}
                aria-label={`View all ${categoryLabel}`}
              >
                View all {categoryLabel}
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
            <div className="celeb-look__product-rail" role="list">
              {relatedProducts.map((product) => (
                <div key={product.id} role="listitem">
                  <ProductCard product={product} onSelect={onSelectProduct} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Explore More ───────────────────────────────────────────── */}
        <section className="celeb-look__explore-section">
          <p className="celeb-look__section-eyebrow">EXPLORE MORE</p>
          <h2 className="celeb-look__section-title">Go deeper into this style</h2>
          <div className="celeb-look__explore-cards">
            {look.quizSlug && (
              <button
                type="button"
                className="celeb-look__explore-card celeb-look__explore-card--quiz"
                onClick={() => onStartQuiz?.(look.quizSlug)}
                data-journey-label="Take style quiz"
              >
                <Sparkles size={20} aria-hidden="true" className="celeb-look__explore-icon" />
                <div>
                  <p className="celeb-look__explore-label">Style Quiz</p>
                  <p className="celeb-look__explore-desc">
                    Find out if this aesthetic matches your actual personality
                  </p>
                </div>
                <ArrowRight size={16} className="celeb-look__explore-arrow" aria-hidden="true" />
              </button>
            )}
            {look.knowledgeSlug && (
              <button
                type="button"
                className="celeb-look__explore-card celeb-look__explore-card--guide"
                onClick={() => onOpenKnowledgePage?.(look.knowledgeSlug)}
                data-journey-label="Read style guide"
              >
                <BookOpen size={20} aria-hidden="true" className="celeb-look__explore-icon" />
                <div>
                  <p className="celeb-look__explore-label">Style Guide</p>
                  <p className="celeb-look__explore-desc">
                    The complete guide to wearing {categoryLabel.toLowerCase()} right
                  </p>
                </div>
                <ArrowRight size={16} className="celeb-look__explore-arrow" aria-hidden="true" />
              </button>
            )}
          </div>
        </section>

        {/* ─── More Celebrity Looks ────────────────────────────────────── */}
        <section className="celeb-look__more-section">
          <p className="celeb-look__section-eyebrow">KEEP EXPLORING</p>
          <h2 className="celeb-look__section-title">More looks from Bollywood</h2>
          <div className="celeb-look__more-grid" role="list">
            {otherLooks.map((otherLook) => (
              <div key={otherLook.id} role="listitem">
                <MoreLookCard look={otherLook} onNavigate={onNavigate} />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="celeb-look__all-celebs-cta"
            onClick={onBack}
          >
            View all celebrity looks
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </section>

        <PlacedAdSlot adCodes={adCodes} placement="celebrity_look_bottom" variant="section" />

        {/* ─── Endless Discovery ───────────────────────────────────────── */}
        {products.length > 0 && (
          <EndlessDiscovery
            allProducts={products}
            category={look.category}
            onSelectProduct={onSelectProduct}
            onSelectCategory={onSelectCategory}
            onOpenArticle={onOpenArticle}
            onStartQuiz={onStartQuiz}
            onOpenKnowledgePage={onOpenKnowledgePage}
            variant="browse"
            title="You might also like"
            subtitle="Products, articles, quizzes — keep the exploration going."
            compact
            showAds={false}
          />
        )}
      </div>

      {/* ─── Discovery Loop ──────────────────────────────────────────────── */}
      <DiscoveryLoopSection
        sourceContext="celebrity_look"
        trendSlugs={discoveryCtx.trendSlugs}
        celebIds={otherLooks.slice(0, 2).map((l) => l.id)}
        quizSlugs={
          look.quizSlug
            ? [look.quizSlug, ...discoveryCtx.quizSlugs.filter((s) => s !== look.quizSlug)].slice(0, 2)
            : discoveryCtx.quizSlugs
        }
        guideSlugs={
          look.knowledgeSlug
            ? [look.knowledgeSlug, ...discoveryCtx.guideSlugs.filter((s) => s !== look.knowledgeSlug)].slice(0, 2)
            : discoveryCtx.guideSlugs
        }
        title="Keep exploring"
        subtitle="Trends, looks, quizzes, and guides matched to this style"
        onNavigate={onNavigate}
        onStartQuiz={onStartQuiz}
        onOpenKnowledgePage={onOpenKnowledgePage}
      />
    </div>
  );
}
