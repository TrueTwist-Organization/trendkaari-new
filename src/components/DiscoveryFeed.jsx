import React, { useEffect, useMemo, useRef, useState } from 'react';
import { buildDiscoveryRails } from '../utils/discoveryEngine';
import DiscoveryRail from './DiscoveryRail';
import PlacedAdSlot from './PlacedAdSlot';
import RecommendationRails from './RecommendationRails';
import './DiscoveryFeed.css';

const INITIAL_RAILS = 5;
const RAILS_PER_LOAD = 3;

export default function DiscoveryFeed({
  products = [],
  onSelectProduct,
  onSelectCategory,
  onOpenArticle,
  onOpenKnowledgePage,
  onStartQuiz,
  adCodes = {},
  fullPage = false,
  maxRails = 12,
}) {
  const [visibleRails, setVisibleRails] = useState(INITIAL_RAILS);
  const sentinelRef = useRef(null);

  const rails = useMemo(
    () => buildDiscoveryRails(products, { maxRails }),
    [products, maxRails],
  );

  useEffect(() => {
    setVisibleRails(fullPage ? INITIAL_RAILS + 2 : INITIAL_RAILS);
  }, [products, fullPage]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || visibleRails >= rails.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleRails((n) => Math.min(n + RAILS_PER_LOAD, rails.length));
        }
      },
      { rootMargin: '240px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visibleRails, rails.length]);

  const shown = rails.slice(0, visibleRails);

  if (!shown.length) {
    return (
      <div className="discovery-feed discovery-feed--empty">
        <p>Loading your fashion discovery feed…</p>
      </div>
    );
  }

  return (
    <div className={`discovery-feed${fullPage ? ' discovery-feed--full' : ''}`}>
      {fullPage ? (
        <header className="discovery-feed__hero-text">
          <p className="discovery-feed__eyebrow">Fashion discovery</p>
          <h1 className="discovery-feed__headline">Explore without limits</h1>
          <p className="discovery-feed__sub">
            Scroll through curated edits — every rail leads somewhere new.
          </p>
        </header>
      ) : null}

      {shown.map((rail, index) => (
        <React.Fragment key={rail.id}>
          <DiscoveryRail
            title={rail.title}
            hook={rail.hook}
            products={rail.products}
            tone={rail.tone}
            showHead={!fullPage}
            onSelectProduct={onSelectProduct}
            onSeeAll={
              rail.category
                ? () => onSelectCategory?.(rail.category)
                : undefined
            }
          />
          {(index + 1) % 2 === 0 ? (
            <PlacedAdSlot
              adCodes={adCodes}
              placement="discover_feed_mid"
              ownerKey={`discover_feed_mid-${index}`}
              allowDuplicateSource
              variant="section"
            />
          ) : null}
        </React.Fragment>
      ))}

      {visibleRails < rails.length ? (
        <div className="discovery-feed__loader" ref={sentinelRef} aria-hidden>
          <span className="discovery-feed__loader-dot" />
          <span>Loading more to explore…</span>
        </div>
      ) : (
        <>
          <RecommendationRails
            allProducts={products}
            onSelectProduct={onSelectProduct}
            onSelectCategory={onSelectCategory}
            onOpenArticle={onOpenArticle}
            onOpenKnowledgePage={onOpenKnowledgePage}
            onStartQuiz={onStartQuiz}
            adCodes={adCodes}
            variant="browse"
            title=""
            subtitle=""
            showIntro={false}
            showAds={false}
          />
          {fullPage ? (
            <PlacedAdSlot adCodes={adCodes} placement="discover_feed_bottom" variant="section" />
          ) : null}
          <div className="discovery-feed__end">
            <p>You’ve reached the end — but there’s always another category to open.</p>
            <button
              type="button"
              className="btn btn-outline-dark discovery-feed__shuffle"
              onClick={() => onSelectCategory?.('kurtas')}
            >
              Browse trending kurtas
            </button>
          </div>
        </>
      )}
    </div>
  );
}
