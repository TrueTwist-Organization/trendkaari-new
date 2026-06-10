/**
 * Discovery Hero — coded split banner (copy left, models right).
 * Uses the hero artwork cropped to the models panel only — no duplicate text.
 */
import React from 'react';
import { ArrowRight, Award, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { DEFAULT_HOMEPAGE_CONFIG } from '../data/homepageConfig';
import './DiscoveryHero.css';

const TRUST_ICONS = { Award, Leaf, ShieldCheck };

function HeroMarigold({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
      <g fill="currentColor">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <ellipse
            key={deg}
            cx="60"
            cy="38"
            rx="14"
            ry="26"
            opacity="0.85"
            transform={`rotate(${deg} 60 60)`}
          />
        ))}
        <circle cx="60" cy="60" r="14" opacity="0.95" />
        <circle cx="60" cy="60" r="7" fill="var(--hero-plum-deep, #2a0618)" opacity="0.35" />
      </g>
    </svg>
  );
}

function HeroLotus({ className }) {
  return (
    <svg className={className} viewBox="0 0 160 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M80 72 C62 58 48 42 52 28 C58 18 72 22 80 34 C88 22 102 18 108 28 C112 42 98 58 80 72Z" opacity="0.7" />
        <path d="M80 72 C68 52 64 32 80 24 C96 32 92 52 80 72Z" opacity="0.55" />
        <path d="M80 72 C58 64 42 50 44 36 C50 26 64 30 80 40" opacity="0.45" />
        <path d="M80 72 C102 64 118 50 116 36 C110 26 96 30 80 40" opacity="0.45" />
        <path d="M80 78 L80 88" strokeLinecap="round" />
        <path d="M68 86 C74 82 86 82 92 86" strokeLinecap="round" opacity="0.6" />
      </g>
    </svg>
  );
}

function HeroVine({ className }) {
  return (
    <svg className={className} viewBox="0 0 420 320" aria-hidden="true" fill="none">
      <path
        d="M20 280 C120 220 180 120 280 80 C340 58 380 42 400 24"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M280 80 C300 110 318 150 330 190"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
      {[80, 140, 200, 260].map((x, i) => (
        <g key={x} transform={`translate(${60 + i * 70}, ${240 - i * 45})`} opacity={0.5 - i * 0.06}>
          <circle cx="0" cy="0" r="5" fill="currentColor" />
          <ellipse cx="0" cy="-12" rx="8" ry="14" fill="currentColor" opacity="0.65" />
          <ellipse cx="10" cy="-6" rx="7" ry="12" fill="currentColor" opacity="0.5" transform="rotate(35)" />
          <ellipse cx="-10" cy="-6" rx="7" ry="12" fill="currentColor" opacity="0.5" transform="rotate(-35)" />
        </g>
      ))}
    </svg>
  );
}

function HeroFlorals() {
  const petals = [
    { style: { top: '12%', left: '58%', animationDelay: '0s' } },
    { style: { top: '28%', left: '72%', animationDelay: '1.2s' } },
    { style: { top: '52%', left: '64%', animationDelay: '2.4s' } },
    { style: { top: '18%', left: '84%', animationDelay: '0.8s' } },
    { style: { top: '62%', left: '78%', animationDelay: '3s' } },
    { style: { top: '38%', left: '48%', animationDelay: '1.8s' } },
  ];

  return (
    <div className="discovery-hero__florals">
      <div className="discovery-hero__floral-pattern" aria-hidden="true" />
      <HeroVine className="discovery-hero__vine" />
      <HeroMarigold className="discovery-hero__flower discovery-hero__flower--lg discovery-hero__flower--tr" />
      <HeroMarigold className="discovery-hero__flower discovery-hero__flower--md discovery-hero__flower--mid" />
      <HeroMarigold className="discovery-hero__flower discovery-hero__flower--sm discovery-hero__flower--br" />
      <HeroLotus className="discovery-hero__lotus discovery-hero__lotus--center" />
      <HeroLotus className="discovery-hero__lotus discovery-hero__lotus--edge" />
      {petals.map((petal, index) => (
        <span
          key={index}
          className="discovery-hero__petal"
          style={petal.style}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function HeroArch() {
  return (
    <svg className="discovery-hero__arch" viewBox="0 0 280 420" aria-hidden="true">
      <path
        d="M140 20 C70 20 24 90 24 180 L24 400 L256 400 L256 180 C256 90 210 20 140 20 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M140 48 C88 48 52 102 52 176 L52 372 L228 372 L228 176 C228 102 192 48 140 48 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.55"
      />
    </svg>
  );
}

export default function DiscoveryHero({
  hero = DEFAULT_HOMEPAGE_CONFIG.hero,
  onShopNow,
  onExploreCollections,
}) {
  const config = { ...DEFAULT_HOMEPAGE_CONFIG.hero, ...hero };
  const backgroundImage = config.backgroundImage || '';
  const backgroundImageMobile = config.backgroundImageMobile || backgroundImage;
  const mobileHeroArtwork = Boolean(config.mobileHeroArtwork && backgroundImageMobile);
  const modelsImage = config.modelsImage || config.desktopImage || DEFAULT_HOMEPAGE_CONFIG.hero.desktopImage;
  const mobileModelsImage =
    config.mobileModelsImage || config.mobileImage || DEFAULT_HOMEPAGE_CONFIG.hero.mobileImage;
  const alt = config.alt || DEFAULT_HOMEPAGE_CONFIG.hero.alt;

  const titleLine1 = config.titleLine1 || 'Celebrate Every';
  const titleLine2 = config.titleLine2 || 'Special Moment';
  const subtitle =
    config.subtitle ||
    'Curated Indian ethnic & contemporary wear for festivals, weddings, and everyday style.';
  const mobileHeroBakedCopy = Boolean(config.mobileHeroBakedCopy);
  const subtitleMobile =
    config.subtitleMobile || 'Indian ethnic & contemporary wear for every occasion.';
  const secondaryCtaMobile = config.secondaryCtaMobile || 'Explore';
  const primaryCta = config.primaryCta || 'Shop Now';
  const secondaryCta = config.secondaryCta || 'Explore Collections';
  const trustBadges = config.trustBadges || DEFAULT_HOMEPAGE_CONFIG.hero.trustBadges;

  const scrollToCategories = () => {
    document.querySelector('.home-categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToChapters = () => {
    document.getElementById('home-chapters')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleShopNow = () => {
    if (onShopNow) {
      onShopNow();
      return;
    }
    scrollToCategories();
  };

  const handleExplore = () => {
    if (onExploreCollections) {
      onExploreCollections();
      return;
    }
    scrollToChapters();
  };

  return (
    <section
      className={`discovery-hero${backgroundImage ? ' discovery-hero--photo-bg' : ''}${mobileHeroArtwork ? ' discovery-hero--mobile-artwork' : ''}${mobileHeroBakedCopy ? ' discovery-hero--mobile-baked' : ''}`}
      aria-label="Featured collection"
    >
      {backgroundImage ? (
        <div className="discovery-hero__photo" aria-hidden="true">
          <picture>
            <source media="(max-width: 767px)" srcSet={backgroundImageMobile} />
            <img
              src={backgroundImage}
              alt=""
              className="discovery-hero__photo-img"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div className="discovery-hero__photo-scrim" />
        </div>
      ) : (
        <HeroFlorals />
      )}
      <div className="discovery-hero__shell">
        <div className="discovery-hero__copy">
          <Sparkles size={18} className="discovery-hero__ornament" aria-hidden="true" />

          <h1 className="discovery-hero__title">
            <span className="discovery-hero__title-line">{titleLine1}</span>
            <span className="discovery-hero__title-accent">{titleLine2}</span>
          </h1>

          <div className="discovery-hero__divider" aria-hidden="true">
            <span />
            <span className="discovery-hero__divider-gem" />
            <span />
          </div>

          <p className="discovery-hero__subtitle discovery-hero__subtitle--desktop">{subtitle}</p>
          <p className="discovery-hero__subtitle discovery-hero__subtitle--mobile">{subtitleMobile}</p>

          <div className="discovery-hero__actions">
            <button
              type="button"
              className="discovery-hero__btn discovery-hero__btn--primary"
              onClick={handleShopNow}
            >
              {primaryCta}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="discovery-hero__btn discovery-hero__btn--ghost"
              onClick={handleExplore}
            >
              <span className="discovery-hero__btn-text discovery-hero__btn-text--long">{secondaryCta}</span>
              <span className="discovery-hero__btn-text discovery-hero__btn-text--short">{secondaryCtaMobile}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>

          <ul className="discovery-hero__trust" aria-label="Shopping highlights">
            {trustBadges.map((badge) => {
              const Icon = TRUST_ICONS[badge.icon] || Award;
              return (
                <li key={badge.label}>
                  <Icon size={15} aria-hidden="true" />
                  <span>{badge.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {!backgroundImage ? (
          <div className="discovery-hero__visual" aria-hidden="true">
            <div className="discovery-hero__stars" />
            <HeroArch />
            <picture className="discovery-hero__picture">
              <source media="(max-width: 767px)" srcSet={mobileModelsImage} />
              <img
                src={modelsImage}
                alt=""
                className="discovery-hero__models"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>
        ) : null}
      </div>

      <span className="visually-hidden">{alt}</span>
    </section>
  );
}
