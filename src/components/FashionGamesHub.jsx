import React, { useMemo } from 'react';
import {
  ArrowRight,
  Gamepad2,
  Star,
  Swords,
  Palette,
} from 'lucide-react';
import { getAllGames } from '../data/fashionGames';
import { getGameHubStats } from '../utils/gameVotesStorage';
import { formatVoteCount } from '../utils/fashionGameEngine';
import PageBackButton from './PageBackButton';
import PageShell from './PageShell';
import EndlessDiscovery from './EndlessDiscovery';
import PlacedAdSlot from './PlacedAdSlot';
import './FashionGames.css';

const GAME_ICONS = {
  'rate-outfit': Star,
  'choose-style': Palette,
  'look-battle': Swords,
};

export default function FashionGamesHub({
  onStartGame,
  onBack,
  products = [],
  onSelectProduct,
  onSelectCategory,
  onOpenArticle,
  onOpenKnowledgePage,
  onStartQuiz,
  adCodes = {},
}) {
  const games = getAllGames();
  const hubStats = useMemo(() => getGameHubStats(), []);

  return (
    <PageShell
      className="fashion-games fashion-games--hub"
      variant="hub"
      eyebrow="Fashion games"
      title="Play & vote"
      subtitle="Rate outfits, pick a style lane, or battle looks head-to-head — see how your taste compares."
      top={
        <div className="container fashion-games-hub__top">
          <PageBackButton onClick={onBack} label="Home" />
        </div>
      }
    >

      <div className="container">
        <PlacedAdSlot adCodes={adCodes} placement="games_hub_mid" variant="section" />
      </div>

      <section className="fashion-games-hub__stage" aria-label="Choose a game">
        <div className="container fashion-games-hub__stage-inner">
          <div className="fashion-games-hub__grid">
            {games.map((game) => {
              const Icon = GAME_ICONS[game.slug] || Gamepad2;
              return (
                <article
                  key={game.slug}
                  className="fashion-games-hub__card"
                  style={{ '--game-accent': game.accent }}
                >
                  <div className="fashion-games-hub__card-top">
                    <span className="fashion-games-hub__card-icon" aria-hidden>
                      <Icon size={20} />
                    </span>
                    <span className="fashion-games-hub__card-votes">
                      {formatVoteCount(hubStats[game.slug] || 0)}
                    </span>
                  </div>
                  <h2 className="fashion-games-hub__card-title">{game.title}</h2>
                  <p className="fashion-games-hub__card-sub">{game.subtitle}</p>
                  <button
                    type="button"
                    className="fashion-games-hub__card-cta"
                    onClick={() => onStartGame?.(game.slug)}
                  >
                    {game.cta}
                    <ArrowRight size={16} aria-hidden />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {products.length > 0 ? (
        <section className="fashion-games-hub__discovery" aria-label="Style lane picks">
          <div className="container">
            <EndlessDiscovery
              allProducts={products}
              category="kurtas"
              gameHub
              onSelectProduct={onSelectProduct}
              onSelectCategory={onSelectCategory}
              onOpenArticle={onOpenArticle}
              onOpenKnowledgePage={onOpenKnowledgePage}
              onStartQuiz={onStartQuiz}
              variant="browse"
              title="Shop the style lanes"
              subtitle="Minimal, bold, and festive edits — the same vibes you vote on in Choose Your Style."
              compact={false}
              showAds={false}
            />
          </div>
        </section>
      ) : null}

      <div className="container">
        <PlacedAdSlot adCodes={adCodes} placement="games_hub_bottom" variant="section" />
      </div>
    </PageShell>
  );
}
