/**
 * TrendPage — serves two routes:
 *
 *  /trends           → trendSlug = null  → hub showing all 5 trend cards
 *  /trends/:slug     → trendSlug = slug  → full editorial trend page
 *
 * Discovery loop each page creates:
 *   Trend page → Celebrity look → /celebrity-match/:id
 *             → Products       → /product/:id
 *             → Quiz           → /quiz/:slug
 *             → Style Guide    → /knowledge/:slug
 *             → More Trends    → /trends/:slug (self-sustaining loop)
 *
 * Mobile first. No JS animations. No heavy dependencies.
 */
import React, { useMemo, useEffect } from 'react';
import { ChevronLeft, ArrowRight, Sparkles, BookOpen, TrendingUp } from 'lucide-react';
import { TREND_PAGES, getTrendPage } from '../data/trendPages';
import { CELEBRITY_LOOKS } from '../data/celebrityLooks';
import ProductImage from './ProductImage';
import { trackTrendPageViewed } from '../utils/ga4';
import EndlessDiscovery from './EndlessDiscovery';
import './TrendPage.css';

/* ─── Shared sub-components ──────────────────────────────────────────────── */

function TrendHeroCard({ trend, onNavigate }) {
  return (
    <button
      type="button"
      className="trend-hub__card"
      onClick={() => onNavigate(`/trends/${trend.slug}`)}
      style={{ '--card-accent': trend.accent }}
      data-journey-label={`Trend: ${trend.title}`}
      aria-label={`Explore ${trend.title}`}
    >
      <div className="trend-hub__card-media">
        <img
          src={trend.heroImage}
          alt=""
          className="trend-hub__card-img"
          loading="lazy"
          decoding="async"
        />
        <div className="trend-hub__card-overlay" aria-hidden="true" />
      </div>
      <div className="trend-hub__card-copy">
        <span className="trend-hub__card-label">{trend.label}</span>
        <p className="trend-hub__card-title">{trend.title}</p>
        <span className="trend-hub__card-cta">
          Explore <ArrowRight size={13} aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}

function CelebCard({ look, onNavigate }) {
  return (
    <button
      type="button"
      className="trend-page__celeb-card"
      onClick={() => onNavigate(`/celebrity-match/${look.id}`)}
      data-journey-label={`Trend celeb: ${look.celebrity}`}
      aria-label={`${look.celebrity} — ${look.title}`}
    >
      <div className="trend-page__celeb-media">
        <img src={look.image} alt="" loading="lazy" decoding="async" className="trend-page__celeb-img" />
        <div className="trend-page__celeb-overlay" aria-hidden="true" />
        <div className="trend-page__celeb-info">
          <span className="trend-page__celeb-context">{look.context}</span>
          <p className="trend-page__celeb-name">{look.celebrity}</p>
          <p className="trend-page__celeb-title">{look.title}</p>
        </div>
      </div>
    </button>
  );
}

function ProductCard({ product, onSelect }) {
  return (
    <button
      type="button"
      className="trend-page__product-card"
      onClick={() => onSelect?.(product)}
      data-journey-label={`Trend product: ${product.title}`}
    >
      <div className="trend-page__product-img-wrap">
        <ProductImage
          src={product.image}
          product={product}
          alt={product.title}
          className="trend-page__product-img"
          loading="lazy"
        />
      </div>
      <p className="trend-page__product-name">{product.title}</p>
      <p className="trend-page__product-price">₹{product.price?.toLocaleString('en-IN')}</p>
    </button>
  );
}

function GoDeeper({ trend, onStartQuiz, onOpenKnowledgePage }) {
  return (
    <section className="trend-page__deeper">
      <p className="trend-page__eyebrow">GO DEEPER</p>
      <h2 className="trend-page__section-title">Style resources for this trend</h2>
      <div className="trend-page__deeper-grid">
        {trend.quizzes.map((quiz) => (
          <button
            key={quiz.slug}
            type="button"
            className="trend-page__deeper-card trend-page__deeper-card--quiz"
            onClick={() => onStartQuiz?.(quiz.slug)}
            data-journey-label={`Trend quiz: ${quiz.slug}`}
          >
            <Sparkles size={20} className="trend-page__deeper-icon" aria-hidden="true" />
            <div className="trend-page__deeper-text">
              <p className="trend-page__deeper-label">Style Quiz</p>
              <p className="trend-page__deeper-title">{quiz.label}</p>
              <p className="trend-page__deeper-desc">{quiz.desc}</p>
            </div>
            <ArrowRight size={15} className="trend-page__deeper-arrow" aria-hidden="true" />
          </button>
        ))}
        {trend.knowledgePages.map((page) => (
          <button
            key={page.slug}
            type="button"
            className="trend-page__deeper-card trend-page__deeper-card--guide"
            onClick={() => onOpenKnowledgePage?.(page.slug)}
            data-journey-label={`Trend guide: ${page.slug}`}
          >
            <BookOpen size={20} className="trend-page__deeper-icon" aria-hidden="true" />
            <div className="trend-page__deeper-text">
              <p className="trend-page__deeper-label">Style Guide</p>
              <p className="trend-page__deeper-title">{page.label}</p>
              <p className="trend-page__deeper-desc">{page.desc}</p>
            </div>
            <ArrowRight size={15} className="trend-page__deeper-arrow" aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}

function MoreTrends({ relatedSlugs, onNavigate }) {
  const relatedTrends = TREND_PAGES.filter((t) => relatedSlugs.includes(t.slug));
  return (
    <section className="trend-page__more">
      <p className="trend-page__eyebrow">KEEP EXPLORING</p>
      <h2 className="trend-page__section-title">More trends to discover</h2>
      <div className="trend-page__more-grid">
        {relatedTrends.map((trend) => (
          <button
            key={trend.slug}
            type="button"
            className="trend-page__more-card"
            onClick={() => onNavigate(`/trends/${trend.slug}`)}
            style={{ '--card-accent': trend.accent }}
            data-journey-label={`More trend: ${trend.title}`}
          >
            <div className="trend-page__more-media">
              <img src={trend.heroImage} alt="" loading="lazy" decoding="async" />
              <div className="trend-page__more-overlay" aria-hidden="true" />
              <div className="trend-page__more-copy">
                <span className="trend-page__more-label">{trend.label}</span>
                <p className="trend-page__more-title">{trend.title}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="trend-page__all-trends"
        onClick={() => onNavigate('/trends')}
        aria-label="View all trend reports"
      >
        View all trend reports
        <ArrowRight size={14} aria-hidden="true" />
      </button>
    </section>
  );
}

/* ─── Trend Hub (index at /trends) ────────────────────────────────────────── */

function TrendHub({ onNavigate, onBack }) {
  return (
    <div className="trend-hub">
      <div className="trend-hub__hero container">
        <button type="button" className="trend-page__back-btn" onClick={onBack}>
          <ChevronLeft size={16} aria-hidden="true" />
          Home
        </button>
        <p className="trend-page__eyebrow">TRENDKAARI · TREND REPORTS</p>
        <h1 className="trend-hub__title">What India is wearing right now.</h1>
        <p className="trend-hub__sub">
          Five editorial trend reports updated with the season. Click any to see the full story, celebrity looks, shoppable picks, and styling guides.
        </p>
      </div>

      <div className="trend-hub__grid container">
        {TREND_PAGES.map((trend) => (
          <TrendHeroCard key={trend.slug} trend={trend} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

/* ─── Individual Trend Page ──────────────────────────────────────────────── */

function TrendPageFull({
  trend,
  products,
  onBack,
  onNavigate,
  onSelectProduct,
  onSelectCategory,
  onOpenArticle,
  onStartQuiz,
  onOpenKnowledgePage,
}) {
  const featuredCelebs = useMemo(
    () => CELEBRITY_LOOKS.filter((l) => trend.celebrityIds.includes(l.id)),
    [trend],
  );

  const relatedProducts = useMemo(() => {
    const cats = trend.categories.map((c) => c.toLowerCase());
    return products
      .filter((p) => {
        const pc = (p.category || p.subcategory || '').toLowerCase();
        return cats.some((cat) => pc.includes(cat) || cat.split(' ').some((w) => pc.includes(w)));
      })
      .slice(0, 8);
  }, [trend, products]);

  return (
    <div className="trend-page" style={{ '--trend-accent': trend.accent, '--trend-accent-light': trend.accentLight }}>

      {/* ─── Hero ────────────────────────────────────────────────────── */}
      <div className="trend-page__hero">
        <button
          type="button"
          className="trend-page__back-btn"
          onClick={onBack}
          aria-label="Back to all trends"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          All trends
        </button>

        <div className="trend-page__hero-media">
          <img
            src={trend.heroImage}
            alt=""
            className="trend-page__hero-img"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="trend-page__hero-overlay" aria-hidden="true" />
          <div className="trend-page__hero-copy">
            <span className="trend-page__hero-eyebrow">{trend.eyebrow}</span>
            <h1 className="trend-page__hero-title">{trend.title}</h1>
            <p className="trend-page__hero-tagline">{trend.tagline}</p>
          </div>
        </div>
      </div>

      <div className="container trend-page__body">

        {/* ─── Editorial ──────────────────────────────────────────────── */}
        <section className="trend-page__editorial">
          <p className="trend-page__eyebrow">THE STORY</p>
          {trend.editorial.map((para, i) => (
            <p key={i} className="trend-page__editorial-para">{para}</p>
          ))}
          <button
            type="button"
            className="trend-page__read-more"
            onClick={() => onOpenArticle?.(trend.magazineCategory)}
            aria-label={`Read more in ${trend.magazineCategory} magazine`}
          >
            <TrendingUp size={15} aria-hidden="true" />
            Read the full editorial in our magazine
          </button>
        </section>

        {/* ─── Celebrity Looks ────────────────────────────────────────── */}
        {featuredCelebs.length > 0 && (
          <section className="trend-page__celebs">
            <p className="trend-page__eyebrow">CELEBRITY LOOKS</p>
            <h2 className="trend-page__section-title">How Bollywood wears this trend</h2>
            <div className="trend-page__celeb-grid">
              {featuredCelebs.map((look) => (
                <CelebCard key={look.id} look={look} onNavigate={onNavigate} />
              ))}
            </div>
            <button
              type="button"
              className="trend-page__all-celebs"
              onClick={() => onNavigate('/celebrity-match')}
            >
              See all celebrity looks
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </section>
        )}

        {/* ─── Shop the Trend ─────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="trend-page__shop">
            <div className="trend-page__shop-head">
              <div>
                <p className="trend-page__eyebrow">SHOP THE TREND</p>
                <h2 className="trend-page__section-title">Products matching this edit</h2>
              </div>
              <button
                type="button"
                className="trend-page__see-all"
                onClick={() => onSelectCategory?.(trend.categories[0])}
              >
                View all <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
            <div className="trend-page__product-rail" role="list">
              {relatedProducts.map((product) => (
                <div key={product.id} role="listitem">
                  <ProductCard product={product} onSelect={onSelectProduct} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Go Deeper ──────────────────────────────────────────────── */}
        <GoDeeper
          trend={trend}
          onStartQuiz={onStartQuiz}
          onOpenKnowledgePage={onOpenKnowledgePage}
        />

        {/* ─── More Trends ────────────────────────────────────────────── */}
        <MoreTrends relatedSlugs={trend.relatedTrends} onNavigate={onNavigate} />

        {/* ─── Endless Discovery ──────────────────────────────────────── */}
        {products.length > 0 && (
          <EndlessDiscovery
            allProducts={products}
            category={trend.categories[0]}
            onSelectProduct={onSelectProduct}
            onSelectCategory={onSelectCategory}
            onOpenArticle={onOpenArticle}
            onStartQuiz={onStartQuiz}
            onOpenKnowledgePage={onOpenKnowledgePage}
            variant="browse"
            title="More to explore"
            subtitle="Products, articles, quizzes — the discovery keeps going."
            compact
            showAds={false}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Root export ────────────────────────────────────────────────────────── */

export default function TrendPage({
  trendSlug = null,
  products = [],
  onBack,
  onNavigate,
  onSelectProduct,
  onSelectCategory,
  onOpenArticle,
  onStartQuiz,
  onOpenKnowledgePage,
}) {
  const trend = useMemo(() => (trendSlug ? getTrendPage(trendSlug) : null), [trendSlug]);

  useEffect(() => {
    if (trendSlug && trend) {
      trackTrendPageViewed(trendSlug, trend.title);
    }
  }, [trendSlug, trend]);

  if (!trendSlug) {
    return (
      <TrendHub
        onNavigate={onNavigate}
        onBack={onBack}
      />
    );
  }

  if (!trend) {
    return (
      <div className="trend-page trend-page--404 container">
        <button type="button" className="trend-page__back-btn" onClick={onBack}>
          <ChevronLeft size={16} aria-hidden="true" /> All trends
        </button>
        <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
          This trend page is not available.
        </p>
      </div>
    );
  }

  return (
    <TrendPageFull
      trend={trend}
      products={products}
      onBack={onBack}
      onNavigate={onNavigate}
      onSelectProduct={onSelectProduct}
      onSelectCategory={onSelectCategory}
      onOpenArticle={onOpenArticle}
      onStartQuiz={onStartQuiz}
      onOpenKnowledgePage={onOpenKnowledgePage}
    />
  );
}
