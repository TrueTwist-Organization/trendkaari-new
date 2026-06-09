import React, { useMemo, useRef } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  RefreshCw,
  Share2,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';
import ProductImage from './ProductImage';
import ProductDiscountChip from './ProductDiscountChip';
import { buildViralFashionHub, countViralHubClicks } from '../utils/viralFashionEngine';
import EndlessDiscovery from './EndlessDiscovery';
import PlacedAdSlot from './PlacedAdSlot';
import './ViralFashionHub.css';

const SECTION_ICONS = {
  'most-viral-week': Flame,
  'instagram-trending': Share2,
  'celebrity-inspired': Star,
  'best-sellers': Trophy,
  'top-rated': Star,
  'under-499': Zap,
  'under-999': Zap,
};

function ViralSectionHeader({ section, onSeeAll, icon: Icon }) {
  return (
    <div className="viral-hub__section-head">
      <div className="viral-hub__section-titles">
        {Icon ? (
          <span className={`viral-hub__section-icon viral-hub__section-icon--${section.tone}`} aria-hidden>
            <Icon size={18} />
          </span>
        ) : null}
        <div>
          <h2 className="viral-hub__section-title">{section.title}</h2>
          {section.hook ? <p className="viral-hub__section-hook">{section.hook}</p> : null}
        </div>
      </div>
      {onSeeAll ? (
        <button type="button" className="viral-hub__section-cta" onClick={onSeeAll}>
          {section.cta || 'Explore'}
          <ArrowRight size={15} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

function ViralProductRail({ section, onSelectProduct, onSeeAll }) {
  const trackRef = useRef(null);
  const Icon = SECTION_ICONS[section.id];

  if (!section.products?.length) return null;

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.78 * dir, behavior: 'smooth' });
  };

  const getBadge = (product) => {
    if (section.badgeKey && product[section.badgeKey]) return product[section.badgeKey];
    if (section.priceCap) return `Under ₹${section.priceCap}`;
    return null;
  };

  return (
    <section className={`viral-hub__section viral-hub__section--${section.tone}`} id={section.id}>
      <div className="container">
        <ViralSectionHeader
          section={section}
          icon={Icon}
          onSeeAll={onSeeAll ? () => onSeeAll(section.category) : null}
        />

        <div className="viral-hub__rail-wrap">
          <button type="button" className="viral-hub__nav" onClick={() => scrollBy(-1)} aria-label="Scroll left">
            <ChevronLeft size={18} />
          </button>

          <div className="viral-hub__track" ref={trackRef}>
            {section.products.map((product, index) => {
              const badge = getBadge(product);
              const rank = section.rankKey ? product[section.rankKey] : null;

              return (
                <button
                  key={product.id}
                  type="button"
                  className={`viral-hub__card hover-zoom-container${rank && rank <= 3 ? ' viral-hub__card--ranked' : ''}`}
                  onClick={() => onSelectProduct?.(product)}
                >
                  <div className="viral-hub__card-media">
                    {rank ? <span className="viral-hub__rank">#{rank}</span> : null}
                    {badge ? <span className="viral-hub__badge">{badge}</span> : null}
                    <ProductImage
                      src={product.image}
                      alt={product.title}
                      className="viral-hub__card-img hover-zoom-img"
                    />
                    <span className="viral-hub__tap">Tap to open</span>
                  </div>
                  <div className="viral-hub__card-body">
                    <span className="viral-hub__card-cat">{product.subCategory || product.category}</span>
                    <h3 className="viral-hub__card-title">{product.title}</h3>
                    <div className="viral-hub__card-price-row">
                      <span className="viral-hub__card-price">₹{product.price}</span>
                      <ProductDiscountChip product={product} className="product-discount-chip--compact" />
                    </div>
                    {section.showViews && product.viewLabel ? (
                      <span className="viral-hub__card-meta">{product.viewLabel}</span>
                    ) : null}
                    {!section.showViews && index === 0 && section.tone === 'viral-hot' ? (
                      <span className="viral-hub__card-meta viral-hub__card-meta--hot">Most opened today</span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          <button type="button" className="viral-hub__nav" onClick={() => scrollBy(1)} aria-label="Scroll right">
            <ChevronRight size={18} />
          </button>
        </div>

        <button type="button" className="viral-hub__deep-link" onClick={() => onSeeAll?.(section.category)}>
          {section.cta}
          <ArrowRight size={14} aria-hidden />
        </button>
      </div>
    </section>
  );
}

function CelebrityInspiredSection({ section, onSelectCategory, onSelectProduct }) {
  const Icon = SECTION_ICONS[section.id];

  return (
    <section className={`viral-hub__section viral-hub__section--${section.tone}`} id={section.id}>
      <div className="container">
        <ViralSectionHeader
          section={section}
          icon={Icon}
          onSeeAll={() => onSelectCategory?.(section.category)}
        />

        <div className="viral-hub__celebrity-grid">
          {section.looks?.map((look) => (
            <article key={look.id} className="viral-hub__celebrity-block">
              <button
                type="button"
                className="viral-hub__celebrity-hero hover-zoom-container"
                onClick={() => onSelectCategory?.(look.category)}
              >
                <img src={look.image} alt="" className="viral-hub__celebrity-img hover-zoom-img" loading="lazy" />
                <div className="viral-hub__celebrity-overlay" />
                <div className="viral-hub__celebrity-copy">
                  <span className="viral-hub__celebrity-tag">{look.celebrity}</span>
                  <h3>{look.title}</h3>
                  <span className="viral-hub__celebrity-hook">{look.hook}</span>
                </div>
              </button>

              {look.products?.length ? (
                <div className="viral-hub__celebrity-picks">
                  {look.products.slice(0, 3).map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className="viral-hub__celebrity-pick"
                      onClick={() => onSelectProduct?.(product)}
                    >
                      <ProductImage src={product.image} alt={product.title} className="viral-hub__celebrity-pick-img" />
                      <span className="viral-hub__celebrity-pick-price">₹{product.price}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ViralFashionHub({
  products = [],
  onSelectProduct,
  onSelectCategory,
  onBack,
  onOpenArticle,
  onOpenKnowledgePage,
  onStartQuiz,
  adCodes = {},
}) {
  const hub = useMemo(() => buildViralFashionHub(products), [products]);
  const clickCount = useMemo(() => countViralHubClicks(hub), [hub]);

  if (!hub) return null;

  return (
    <div className="viral-hub">
      <header className="viral-hub__hero">
        <div className="container">
          <button type="button" className="viral-hub__back" onClick={onBack}>
            <ChevronLeft size={18} />
            Home
          </button>

          <div className="viral-hub__hero-badges">
            <span className="viral-hub__live">
              <span className="viral-hub__live-dot" aria-hidden />
              Live edit
            </span>
            <span className="viral-hub__refresh">
              <RefreshCw size={13} aria-hidden />
              {hub.refreshLabel}
            </span>
          </div>

          <h1 className="viral-hub__title">
            <Flame size={28} className="viral-hub__title-icon" aria-hidden />
            Viral Fashion Hub
          </h1>
          <p className="viral-hub__subtitle">
            Seven scroll-stopping lanes — viral picks, IG trends, celebrity edits, bestsellers, and budget steals.
            Every section updates from the catalog automatically.
          </p>

          <div className="viral-hub__stats">
            <div className="viral-hub__stat">
              <strong>{clickCount}+</strong>
              <span>clicks waiting</span>
            </div>
            <div className="viral-hub__stat">
              <strong>{hub.sections.length}</strong>
              <span>viral lanes</span>
            </div>
            <div className="viral-hub__stat viral-hub__stat--hot">
              <strong>NEW</strong>
              <span>this week</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <PlacedAdSlot adCodes={adCodes} placement="viral_hub_mid" variant="section" />
      </div>

      <div className="viral-hub__lanes">
        {hub.sections.map((section) => {
          if (section.type === 'celebrity') {
            return (
              <CelebrityInspiredSection
                key={section.id}
                section={section}
                onSelectCategory={onSelectCategory}
                onSelectProduct={onSelectProduct}
              />
            );
          }

          return (
            <ViralProductRail
              key={section.id}
              section={section}
              onSelectProduct={onSelectProduct}
              onSeeAll={onSelectCategory}
            />
          );
        })}
      </div>

      {products.length > 0 ? (
        <div className="container">
          <EndlessDiscovery
            allProducts={products}
            category="lehengas"
            onSelectProduct={onSelectProduct}
            onSelectCategory={onSelectCategory}
            onOpenArticle={onOpenArticle}
            onOpenKnowledgePage={onOpenKnowledgePage}
            onStartQuiz={onStartQuiz}
            variant="browse"
            title="Endless discovery"
            subtitle="Similar products, related collections, articles, quizzes, and trending picks."
            compact
            showAds={false}
          />
        </div>
      ) : null}

      <footer className="viral-hub__finale">
        <div className="container">
          <p>Rankings refresh weekly · product picks update as the catalog grows</p>
          <button type="button" className="viral-hub__finale-btn" onClick={onBack}>
            Back to explore
          </button>
        </div>
      </footer>
    </div>
  );
}
