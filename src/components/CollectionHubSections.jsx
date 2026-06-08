import React, { useMemo } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, FolderOpen } from 'lucide-react';
import ProductImage from './ProductImage';
import DiscoveryRail from './DiscoveryRail';
import { getCategoryDisplayName } from '../utils/categoryFilter';
import { buildCollectionHub, countCollectionHubClicks } from '../utils/collectionHubEngine';
import './CollectionHubSections.css';

export default function CollectionHubSections({
  activeCategory,
  allProducts = [],
  onSelectProduct,
  onSelectCategory,
  onOpenKnowledgePage,
  placement = 'full',
}) {
  const hub = useMemo(
    () => buildCollectionHub(allProducts, activeCategory),
    [allProducts, activeCategory],
  );

  if (!hub) return null;

  const categoryLabel = getCategoryDisplayName(activeCategory);
  const clickCount = countCollectionHubClicks(hub);

  if (placement === 'top') {
    return (
      <section className="collection-hub collection-hub--top">
        <div className="container">
          <header className="collection-hub__head">
            <p className="collection-hub__eyebrow">{clickCount}+ ways to explore this hub</p>
            <h2 className="collection-hub__title">Collection hub · {categoryLabel}</h2>
          </header>

          <div className="collection-hub__intro-grid">
            <article className="collection-hub__guide">
              <div className="collection-hub__guide-head">
                <BookOpen size={18} aria-hidden />
                <h3>{hub.buyingGuide.title}</h3>
              </div>
              <p className="collection-hub__guide-intro">{hub.buyingGuide.intro}</p>
              <ul className="collection-hub__tips">
                {hub.buyingGuide.tips.map((tip) => (
                  <li key={tip.slice(0, 32)}>{tip}</li>
                ))}
              </ul>
              <div className="collection-hub__checklist">
                {hub.buyingGuide.checklist.map((item) => (
                  <span key={item} className="collection-hub__check">
                    <CheckCircle2 size={14} aria-hidden />
                    {item}
                  </span>
                ))}
              </div>
              {hub.buyingGuide.knowledgeSlug && onOpenKnowledgePage ? (
                <button
                  type="button"
                  className="collection-hub__knowledge-link"
                  onClick={() => onOpenKnowledgePage(hub.buyingGuide.knowledgeSlug)}
                >
                  Read full guide
                  <ArrowRight size={14} aria-hidden />
                </button>
              ) : null}
            </article>

            <div className="collection-hub__related">
              <div className="collection-hub__related-head">
                <FolderOpen size={18} aria-hidden />
                <h3>Related collections</h3>
              </div>
              <div className="collection-hub__related-grid">
                {hub.relatedCollections.map((col) => (
                  <button
                    key={col.category}
                    type="button"
                    className="collection-hub__related-card"
                    onClick={() => onSelectCategory?.(col.category)}
                  >
                    <span className="collection-hub__related-label">{col.label}</span>
                    <span className="collection-hub__related-hook">{col.hook}</span>
                    <ArrowRight size={14} className="collection-hub__related-arrow" aria-hidden />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (placement === 'mid' && hub.trending.length >= 4) {
    return (
      <section className="collection-hub collection-hub--mid">
        <div className="container">
          <DiscoveryRail
            title={`Trending in ${categoryLabel}`}
            hook="Top-rated styles shoppers are opening right now"
            products={hub.trending}
            tone="hot"
            onSelectProduct={onSelectProduct}
            onSeeAll={() => onSelectCategory?.(activeCategory)}
          />
        </div>
      </section>
    );
  }

  if (placement === 'bottom') {
    return (
      <section className="collection-hub collection-hub--bottom">
        <div className="container collection-hub__rails">
          {hub.similarStyles.length >= 4 ? (
            <DiscoveryRail
              title="Similar styles"
              hook="Same lane, fresh picks — keep scrolling this edit"
              products={hub.similarStyles}
              tone="similar"
              onSelectProduct={onSelectProduct}
              onSeeAll={() => onSelectCategory?.(activeCategory)}
            />
          ) : null}

          {hub.editorPicks.length >= 4 ? (
            <DiscoveryRail
              title="Editor recommendations"
              hook="Hand-picked favourites — high ratings & standout value"
              products={hub.editorPicks}
              tone="editorial"
              onSelectProduct={onSelectProduct}
              onSeeAll={() => onSelectCategory?.(activeCategory)}
            />
          ) : null}

          {hub.relatedProducts.length >= 4 ? (
            <DiscoveryRail
              title="More in this edit"
              hook="Related products to round out your browse"
              products={hub.relatedProducts}
              tone="related"
              onSelectProduct={onSelectProduct}
              onSeeAll={() => onSelectCategory?.(activeCategory)}
            />
          ) : null}
        </div>
      </section>
    );
  }

  return null;
}
