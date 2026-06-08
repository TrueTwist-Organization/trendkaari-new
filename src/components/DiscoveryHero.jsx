/**
 * Discovery Hero — Mobile First.
 *
 * Performance requirements:
 *  - Zero JavaScript (no setInterval, no useState for animation)
 *  - Single LCP image with fetchpriority="high"
 *  - One CTA — no competing entry points
 *  - No mood chips (occasion navigation lives in the Occasion section)
 *  - Explicit width/height on image → zero CLS
 *
 * Layout:
 *  Mobile : image stacked above copy (no JS, fast paint)
 *  Desktop: image right, copy left — editorial split
 */
import React from 'react';
import './DiscoveryHero.css';

export default function DiscoveryHero({ onOpenDiscover }) {
  return (
    <section className="discovery-hero">
      {/* LCP element — eager, high priority, explicit dimensions → zero CLS */}
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
      </div>

      <div className="discovery-hero__copy container">
        <p className="discovery-hero__eyebrow">TRENDKAARI · THIS WEEK'S EDIT</p>
        <h1 className="discovery-hero__title">
          Indian fashion,<br />
          discovered.
        </h1>
        <p className="discovery-hero__sub">
          Celebrity looks, style quizzes, and this week's biggest trends — one scroll away.
        </p>
        <button
          type="button"
          className="discovery-hero__cta"
          onClick={onOpenDiscover}
          aria-label="Start exploring fashion discovery"
        >
          Start exploring
        </button>
      </div>
    </section>
  );
}
