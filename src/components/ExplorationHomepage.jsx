import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import DiscoveryHero from './DiscoveryHero';
import HomeAdSlot from './HomeAdSlot';
import DiscoveryExperienceFeed from './DiscoveryExperienceFeed';
import './ExplorationHomepage.css';
import './DiscoveryExperienceFeed.css';

export default function ExplorationHomepage({
  products = [],
  adCodes = {},
  onSelectProduct,
  onSelectCategory,
  onOpenDiscover,
  onNavigateDiscovery,
  onOpenArticle,
}) {
  if (!products.length) {
    return (
      <div className="exploration-home exploration-home--loading">
        <p>Loading your fashion discovery feed…</p>
      </div>
    );
  }

  const handleNavigate = (route) => {
    onNavigateDiscovery?.(route);
  };

  return (
    <div className="exploration-home exploration-home--discovery">
      <DiscoveryHero
        onOpenDiscover={onOpenDiscover}
      />
      <HomeAdSlot adCodes={adCodes} placement="home_after_trends" />

      <DiscoveryExperienceFeed
        products={products}
        onNavigate={handleNavigate}
        onSelectProduct={onSelectProduct}
        onSelectCategory={onSelectCategory}
        onOpenArticle={onOpenArticle}
      />

      <section className="exploration-home__finale">
        <div className="exploration-home__finale-inner">
          <Sparkles size={22} aria-hidden />
          <h2>Ready for the deep end?</h2>
          <p>The full explore feed has endless rails when you want to shop — but discovery starts here.</p>
          <button type="button" className="btn btn-primary exploration-home__finale-btn" onClick={onOpenDiscover}>
            <Compass size={16} />
            Open explore feed
          </button>
        </div>
      </section>
    </div>
  );
}
