import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Compass, Sparkles, TrendingUp, Eye, BookOpen, Globe, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import DiscoveryHero from './DiscoveryHero';
import HomeAdSlot from './HomeAdSlot';
import DiscoveryExperienceFeed from './DiscoveryExperienceFeed';
import ProductImage from './ProductImage';
import { getEditorsVoicePicks } from '../utils/discoveryEngine';
import { DEFAULT_HOMEPAGE_CONFIG, mergeHomepageConfig } from '../data/homepageConfig';
import './ExplorationHomepage.css';
import './DiscoveryExperienceFeed.css';

const TRUST_ICON_MAP = {
  TrendingUp,
  Eye,
  BookOpen,
  Globe,
  Sparkles,
  Compass,
};

function TrustItem({ icon, label, sub }) {
  const Icon = TRUST_ICON_MAP[icon] || Sparkles;
  return (
    <div className="home-trust__item">
      <span className="home-trust__icon"><Icon size={17} aria-hidden /></span>
      <div className="home-trust__copy">
        <strong>{label}</strong>
        <span>{sub}</span>
      </div>
    </div>
  );
}

function CategoryRail({ categories, onSelectCategory }) {
  const railRef = useRef(null);

  const scrollRail = (direction) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.72 * direction, behavior: 'smooth' });
  };

  return (
    <div className="home-categories__carousel">
      <button
        type="button"
        className="home-categories__nav home-categories__nav--prev"
        onClick={() => scrollRail(-1)}
        aria-label="Previous categories"
      >
        <ChevronLeft size={20} aria-hidden />
      </button>

      <div className="home-categories__rail-outer" ref={railRef}>
        <div className="home-categories__rail" role="list">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              role="listitem"
              className="home-categories__card"
              onClick={() => onSelectCategory?.(cat.slug)}
              data-journey-label={`Category: ${cat.label}`}
            >
              <div className="home-categories__media">
                <ProductImage src={cat.image} alt="" loading="lazy" />
                <div className="home-categories__shade" aria-hidden="true" />
              </div>
              <span className="home-categories__label">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="home-categories__nav home-categories__nav--next"
        onClick={() => scrollRail(1)}
        aria-label="Next categories"
      >
        <ChevronRight size={20} aria-hidden />
      </button>
    </div>
  );
}

function SectionTitle({ title }) {
  const lines = String(title || '').split('\n');
  return (
    <h2 className="home-section-title home-section-title--large">
      {lines.map((line, index) => (
        <React.Fragment key={line}>
          {index > 0 ? <br /> : null}
          {line}
        </React.Fragment>
      ))}
    </h2>
  );
}

export default function ExplorationHomepage({
  products = [],
  adCodes = {},
  onSelectProduct,
  onSelectCategory,
  onOpenDiscover,
  onNavigateDiscovery,
  onOpenArticle,
}) {
  const [homepageConfig, setHomepageConfig] = useState(null);
  const productCount = products.length;

  useEffect(() => {
    fetch('/api/store/homepage-config')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.config) setHomepageConfig(data.config);
      })
      .catch(() => {});
  }, []);

  const home = useMemo(
    () => mergeHomepageConfig(homepageConfig || DEFAULT_HOMEPAGE_CONFIG),
    [homepageConfig],
  );

  const featuredPicks = useMemo(
    () => getEditorsVoicePicks(products, 4),
    [products],
  );
  const [leadPick, ...spotlightRest] = featuredPicks;

  if (!products.length) {
    return (
      <div className="exploration-home exploration-home--loading">
        <div className="exploration-home__loader">
          <Sparkles size={28} aria-hidden />
          <p>Loading your fashion discovery feed…</p>
        </div>
      </div>
    );
  }

  const handleNavigate = (route) => {
    onNavigateDiscovery?.(route);
  };

  return (
    <div className="exploration-home exploration-home--discovery">
      <DiscoveryHero
        hero={home.hero}
        onShopNow={() => {
          document.querySelector('.home-categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onExploreCollections={() => {
          document.getElementById('home-chapters')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      <HomeAdSlot adCodes={adCodes} placement="homepage_after_hero" />

      <section className="home-trust" aria-label="Why Trendkaari">
        <div className="home-trust__static container">
          {home.trust.items.map((item) => (
            <TrustItem key={item.label} {...item} />
          ))}
        </div>

        <div className="home-trust__marquee">
          <div className="home-trust__fade home-trust__fade--left" aria-hidden="true" />
          <div className="home-trust__fade home-trust__fade--right" aria-hidden="true" />
          <div className="home-trust__viewport">
            <div className="home-trust__track">
              <div className="home-trust__group">
                {home.trust.items.map((item) => (
                  <TrustItem key={item.label} {...item} />
                ))}
              </div>
              <div className="home-trust__group" aria-hidden="true">
                {home.trust.items.map((item) => (
                  <TrustItem key={`dup-${item.label}`} {...item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeAdSlot adCodes={adCodes} placement="homepage_after_trust" />

      <HomeAdSlot adCodes={adCodes} placement="homepage_before_categories" />

      <section className="home-categories" aria-label="Browse by category">
        <div className="home-categories__inner container">
          <header className="home-categories__head">
            <p className="home-section-eyebrow">{home.marketMap.eyebrow}</p>
            <h2 className="home-section-title">{home.marketMap.title}</h2>
            <p className="home-categories__sub">{home.marketMap.subtitle}</p>
            <button type="button" className="home-section-link" onClick={onOpenDiscover}>
              {home.marketMap.linkText}
              <ArrowRight size={14} aria-hidden />
            </button>
          </header>

          <CategoryRail categories={home.marketMap.categories} onSelectCategory={onSelectCategory} />
        </div>
      </section>

      <HomeAdSlot adCodes={adCodes} placement="homepage_after_categories" />

      <main className="exploration-home__main" id="home-chapters">
        <div className="exploration-home__intro container">
          <p className="home-section-eyebrow">{home.editorialIntro.eyebrow}</p>
          <SectionTitle title={home.editorialIntro.title} />
          <p className="exploration-home__intro-text">{home.editorialIntro.text}</p>
        </div>

        <HomeAdSlot adCodes={adCodes} placement="homepage_before_editorial" />

        <DiscoveryExperienceFeed
          products={products}
          onNavigate={handleNavigate}
          onSelectProduct={onSelectProduct}
          onSelectCategory={onSelectCategory}
          onOpenArticle={onOpenArticle}
          adCodes={adCodes}
        />
      </main>

      <HomeAdSlot adCodes={adCodes} placement="homepage_before_spotlight" />

      {featuredPicks.length > 0 && (
        <>
          <section className="home-spotlight" aria-label="Market signals">
          <div className="home-spotlight__inner container">
            <header className="home-spotlight__head">
              <p className="home-section-eyebrow">{home.spotlight.eyebrow}</p>
              <h2 className="home-section-title">{home.spotlight.title}</h2>
              <p className="home-spotlight__sub">{home.spotlight.subtitle}</p>
            </header>

            <div className="home-spotlight__stage">
              {leadPick ? (
                <button
                  type="button"
                  className="home-spotlight__hero"
                  onClick={() => onSelectProduct?.(leadPick)}
                  data-journey-label={`Spotlight: ${leadPick.title}`}
                >
                  <span className="home-spotlight__badge">{home.spotlight.heroBadge}</span>
                  <div className="home-spotlight__hero-media">
                    <ProductImage src={leadPick.image} alt={leadPick.title} loading="lazy" />
                    <div className="home-spotlight__hero-overlay" aria-hidden="true" />
                  </div>
                  <div className="home-spotlight__hero-copy">
                    <span className="home-spotlight__cat">
                      {leadPick.category || leadPick.subCategory}
                    </span>
                    <h3>{leadPick.title}</h3>
                  </div>
                  <ArrowRight size={16} className="home-spotlight__hero-arrow" aria-hidden="true" />
                </button>
              ) : null}

              {spotlightRest.length > 0 ? (
                <div className="home-spotlight__rail">
                  <p className="home-spotlight__rail-label">{home.spotlight.railLabel}</p>
                  <div className="home-spotlight__rail-list">
                    {spotlightRest.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        className="home-spotlight__card"
                        onClick={() => onSelectProduct?.(product)}
                        data-journey-label={`Spotlight: ${product.title}`}
                      >
                        <div className="home-spotlight__media">
                          <ProductImage src={product.image} alt={product.title} loading="lazy" />
                        </div>
                        <div className="home-spotlight__body">
                          <span className="home-spotlight__cat">
                            {product.category || product.subCategory}
                          </span>
                          <h3>{product.title}</h3>
                        </div>
                        <ArrowRight size={14} className="home-spotlight__card-arrow" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
          <HomeAdSlot adCodes={adCodes} placement="homepage_after_spotlight" />
        </>
      )}

      <HomeAdSlot adCodes={adCodes} placement="homepage_before_finale" />

      <section className="exploration-home__finale">
        <div className="exploration-home__finale-bg" aria-hidden="true" />
        <div className="exploration-home__finale-inner container">
          <Sparkles size={22} aria-hidden />
          <h2>{home.finale.title}</h2>
          <p>{home.finale.text}</p>
          <div className="exploration-home__finale-actions">
            <button type="button" className="btn btn-primary exploration-home__finale-btn" onClick={onOpenDiscover}>
              <Compass size={16} />
              {home.finale.primaryLabel}
            </button>
            <button
              type="button"
              className="exploration-home__finale-ghost"
              onClick={() => handleNavigate('/quiz/personality')}
            >
              {home.finale.secondaryLabel}
            </button>
          </div>
        </div>
      </section>

      <HomeAdSlot adCodes={adCodes} placement="homepage_after_finale" />
    </div>
  );
}
