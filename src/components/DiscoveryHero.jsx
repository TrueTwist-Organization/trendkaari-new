/**
 * Discovery Hero — full-width promotional banner.
 */
import React from 'react';
import { DEFAULT_HOMEPAGE_CONFIG } from '../data/homepageConfig';
import './DiscoveryHero.css';

export default function DiscoveryHero({ onOpenDiscover, hero = DEFAULT_HOMEPAGE_CONFIG.hero }) {
  const desktopImage = hero?.desktopImage || DEFAULT_HOMEPAGE_CONFIG.hero.desktopImage;
  const mobileImage = hero?.mobileImage || DEFAULT_HOMEPAGE_CONFIG.hero.mobileImage;
  const alt = hero?.alt || DEFAULT_HOMEPAGE_CONFIG.hero.alt;

  return (
    <section className="discovery-hero" aria-label="Featured collection">
      <button
        type="button"
        className="discovery-hero__banner"
        onClick={onOpenDiscover}
        aria-label="Explore the collection"
      >
        <picture className="discovery-hero__picture">
          <source media="(max-width: 767px)" srcSet={mobileImage} />
          <img
            src={desktopImage}
            alt={alt}
            className="discovery-hero__img"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width="1024"
            height="576"
          />
        </picture>
      </button>
    </section>
  );
}
