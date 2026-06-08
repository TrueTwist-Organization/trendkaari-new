import React, { useMemo } from 'react';
import { Compass, Sparkles, Star, Shield, Truck, RotateCcw, ArrowRight } from 'lucide-react';
import DiscoveryHero from './DiscoveryHero';
import HomeAdSlot from './HomeAdSlot';
import DiscoveryExperienceFeed from './DiscoveryExperienceFeed';
import ProductImage from './ProductImage';
import { getEditorsVoicePicks } from '../utils/discoveryEngine';
import './ExplorationHomepage.css';
import './DiscoveryExperienceFeed.css';

const QUICK_CATEGORIES = [
  { slug: 'lehengas', label: 'Lehengas', image: '/lehengas/Lehengas/1/040A3523_700x.webp' },
  { slug: 'sarees', label: 'Sarees', image: '/sarees/Sarees/1/0T3A5495_700x.webp' },
  { slug: 'kurtas', label: 'Kurtas', image: '/kurtas/Kurtas/1/LBL101KS612_1_700x.webp' },
  { slug: 'co-ords', label: 'Co-ords', image: '/co-ords/co-ord_set/1/1.webp' },
  { slug: 'suit sets', label: 'Suit Sets', image: '/suit-sets/Suit Sets/9/L12.01.25_1930_700x.webp' },
  { slug: 'tops', label: 'Tops', image: '/tops/4/1.webp' },
];

const TRUST_ITEMS = [
  { icon: Star, label: 'Curated edits', sub: 'Human-picked, not algorithmic' },
  { icon: Shield, label: 'Quality checked', sub: 'Every piece reviewed' },
  { icon: Truck, label: 'Pan-India delivery', sub: 'Fast & tracked shipping' },
  { icon: RotateCcw, label: 'Easy returns', sub: 'Hassle-free exchange' },
];

export default function ExplorationHomepage({
  products = [],
  adCodes = {},
  onSelectProduct,
  onSelectCategory,
  onOpenDiscover,
  onNavigateDiscovery,
  onOpenArticle,
}) {
  const productCount = products.length;

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
      <DiscoveryHero onOpenDiscover={onOpenDiscover} productCount={productCount} />

      <HomeAdSlot adCodes={adCodes} placement="home_after_hero" />

      <section className="home-trust" aria-label="Why Trendkaari">
        <div className="home-trust__inner container">
          {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="home-trust__item">
              <span className="home-trust__icon"><Icon size={18} aria-hidden /></span>
              <div>
                <strong>{label}</strong>
                <span>{sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <HomeAdSlot adCodes={adCodes} placement="home_main" />

      <HomeAdSlot adCodes={adCodes} placement="home_before_categories" />

      <section className="home-categories" aria-label="Shop by category">
        <div className="home-categories__inner container">
          <header className="home-categories__head">
            <p className="home-section-eyebrow">Shop the edit</p>
            <h2 className="home-section-title">Start with a category</h2>
            <p className="home-categories__sub">
              Six starting points — tap one, then scroll into the discovery chapters below.
            </p>
            <button type="button" className="home-section-link" onClick={onOpenDiscover}>
              View all categories
              <ArrowRight size={14} aria-hidden />
            </button>
          </header>

          <div className="home-categories__rail-outer">
            <div className="home-categories__rail" role="list">
              {QUICK_CATEGORIES.map((cat) => (
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
        </div>
      </section>

      <HomeAdSlot adCodes={adCodes} placement="home_between_categories_gift" />

      <main className="exploration-home__main" id="home-chapters">
        <div className="exploration-home__intro container">
          <p className="home-section-eyebrow">The discovery feed</p>
          <h2 className="home-section-title home-section-title--large">
            Nine chapters.<br />One scroll journey.
          </h2>
          <p className="exploration-home__intro-text">
            Tap a chapter below to open its page — style quizzes, Bollywood edits, wedding picks, and what India is searching right now.
          </p>
        </div>

        <HomeAdSlot adCodes={adCodes} placement="home_after_trends" />

        <DiscoveryExperienceFeed
          products={products}
          onNavigate={handleNavigate}
          onSelectProduct={onSelectProduct}
          onSelectCategory={onSelectCategory}
          onOpenArticle={onOpenArticle}
        />
      </main>

      <HomeAdSlot adCodes={adCodes} placement="home_after_gift" />

      {featuredPicks.length > 0 && (
        <>
          <HomeAdSlot adCodes={adCodes} placement="home_after_promo" />
          <section className="home-spotlight" aria-label="Editor spotlight">
          <div className="home-spotlight__inner container">
            <header className="home-spotlight__head">
              <p className="home-section-eyebrow">Fresh on the rack</p>
              <h2 className="home-section-title">Trending picks right now</h2>
              <p className="home-spotlight__sub">
                Human-curated Indian wear moving fast — tap a pick to open the product story.
              </p>
            </header>

            <div className="home-spotlight__stage">
              {leadPick ? (
                <button
                  type="button"
                  className="home-spotlight__hero"
                  onClick={() => onSelectProduct?.(leadPick)}
                  data-journey-label={`Spotlight: ${leadPick.title}`}
                >
                  <span className="home-spotlight__badge">Editor pick</span>
                  <div className="home-spotlight__hero-media">
                    <ProductImage src={leadPick.image} alt={leadPick.title} loading="lazy" />
                    <div className="home-spotlight__hero-overlay" aria-hidden="true" />
                  </div>
                  <div className="home-spotlight__hero-copy">
                    <span className="home-spotlight__cat">
                      {leadPick.category || leadPick.subCategory}
                    </span>
                    <h3>{leadPick.title}</h3>
                    <p className="home-spotlight__price">
                      ₹{Number(leadPick.price || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <ArrowRight size={16} className="home-spotlight__hero-arrow" aria-hidden="true" />
                </button>
              ) : null}

              {spotlightRest.length > 0 ? (
                <div className="home-spotlight__rail">
                  <p className="home-spotlight__rail-label">Also trending</p>
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
                          <p className="home-spotlight__price">
                            ₹{Number(product.price || 0).toLocaleString('en-IN')}
                          </p>
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
          <HomeAdSlot adCodes={adCodes} placement="home_before_reviews" />
        </>
      )}

      <HomeAdSlot adCodes={adCodes} placement="home_after_reviews" />

      <section className="exploration-home__finale">
        <div className="exploration-home__finale-bg" aria-hidden="true" />
        <div className="exploration-home__finale-inner container">
          <Sparkles size={22} aria-hidden />
          <h2>Ready for the deep end?</h2>
          <p>The full explore feed has endless rails when you want to shop — but discovery starts here.</p>
          <div className="exploration-home__finale-actions">
            <button type="button" className="btn btn-primary exploration-home__finale-btn" onClick={onOpenDiscover}>
              <Compass size={16} />
              Open explore feed
            </button>
            <button
              type="button"
              className="exploration-home__finale-ghost"
              onClick={() => handleNavigate('/quiz/personality')}
            >
              Take style quiz
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
