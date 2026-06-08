/**
 * Discovery Hero — editorial full-bleed opener.
 * Mobile: stacked overlay · Desktop: cinematic split feel
 */
import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import './DiscoveryHero.css';

export default function DiscoveryHero({ onOpenDiscover, productCount = 0 }) {
  const scrollToChapters = () => {
    document.getElementById('home-chapters')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const countLabel = productCount > 0 ? `${productCount.toLocaleString('en-IN')}+ styles` : '1000+ styles';

  return (
    <section className="discovery-hero">
      <div className="discovery-hero__visual" aria-hidden="true">
        <img
          src="/sarees/Sarees/1/0T3A5495_700x.webp"
          alt=""
          className="discovery-hero__img"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="700"
          height="933"
        />
        <div className="discovery-hero__overlay" aria-hidden="true" />
        <div className="discovery-hero__grain" aria-hidden="true" />
      </div>

      <div className="discovery-hero__inner container">
        <div className="discovery-hero__copy">
          <div className="discovery-hero__badge">
            <Sparkles size={12} aria-hidden />
            <span>TRENDKAARI · THIS WEEK&apos;S EDIT</span>
          </div>

          <h1 className="discovery-hero__title">
            <span className="discovery-hero__title-line">Indian fashion,</span>
            <em className="discovery-hero__title-accent">discovered.</em>
          </h1>

          <p className="discovery-hero__sub">
            Celebrity looks, style quizzes, wedding edits, and what India is wearing right now — curated like a fashion magazine, not a product grid.
          </p>

          <div className="discovery-hero__stats">
            <div className="discovery-hero__stat">
              <strong>9</strong>
              <span>Chapters</span>
            </div>
            <div className="discovery-hero__stat-divider" aria-hidden="true" />
            <div className="discovery-hero__stat">
              <strong>{countLabel.split('+')[0]}+</strong>
              <span>Styles</span>
            </div>
            <div className="discovery-hero__stat-divider" aria-hidden="true" />
            <div className="discovery-hero__stat">
              <strong>5</strong>
              <span>Min quiz</span>
            </div>
          </div>

          <div className="discovery-hero__actions">
            <button
              type="button"
              className="discovery-hero__cta discovery-hero__cta--primary"
              onClick={scrollToChapters}
            >
              Explore this edit
            </button>
            <button
              type="button"
              className="discovery-hero__cta discovery-hero__cta--ghost"
              onClick={onOpenDiscover}
            >
              Shop all styles
            </button>
          </div>
        </div>

        <button
          type="button"
          className="discovery-hero__scroll"
          onClick={scrollToChapters}
          aria-label="Scroll to chapters"
        >
          <span>Scroll</span>
          <ArrowDown size={16} aria-hidden />
        </button>
      </div>
    </section>
  );
}
