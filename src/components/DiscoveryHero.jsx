/**
 * Discovery Hero — full-width promotional banner.
 */
import React from 'react';
import './DiscoveryHero.css';

export default function DiscoveryHero({ onOpenDiscover }) {
  return (
    <section className="discovery-hero" aria-label="Featured collection">
      <button
        type="button"
        className="discovery-hero__banner"
        onClick={onOpenDiscover}
        aria-label="Shop the collection"
      >
        <picture className="discovery-hero__picture">
          <source
            media="(max-width: 767px)"
            srcSet="/hero/home-hero-banner-mobile.png"
          />
          <img
            src="/hero/home-hero-banner.png"
            alt="Timeless style, modern you — shop the Trendkaari collection"
            className="discovery-hero__img"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width="1024"
            height="483"
          />
        </picture>
      </button>
    </section>
  );
}
