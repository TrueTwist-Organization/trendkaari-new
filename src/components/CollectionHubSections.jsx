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
  excludeProductIds = [],
  onSelectProduct,
  onSelectCategory,
  onOpenKnowledgePage,
  placement = 'full',
}) {
  const hub = useMemo(
    () => buildCollectionHub(allProducts, activeCategory, { excludeProductIds }),
    [allProducts, activeCategory, excludeProductIds],
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

  if (placement === 'bottom') {
    if (!hub.rails?.length) return null;

    return (
      <section className="collection-hub collection-hub--bottom" aria-label={`${categoryLabel} suggestions`}>
        <div className="container collection-hub__rails">
          {hub.rails.map((rail) => (
            <DiscoveryRail
              key={rail.id}
              title={rail.title}
              hook={rail.hook}
              products={rail.products}
              tone={rail.tone}
              onSelectProduct={onSelectProduct}
              onSeeAll={rail.seeAllCategory ? () => onSelectCategory?.(rail.seeAllCategory) : undefined}
            />
          ))}
        </div>
      </section>
    );
  }

  return null;
}
