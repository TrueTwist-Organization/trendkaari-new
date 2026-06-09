import React, { useMemo } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  Gamepad2,
  Star,
  Swords,
  Palette,
  Users,
  Zap,
  Trophy,
} from 'lucide-react';
import { getAllGames } from '../data/fashionGames';
import { getGameHubStats } from '../utils/gameVotesStorage';
import { formatVoteCount } from '../utils/fashionGameEngine';
import EndlessDiscovery from './EndlessDiscovery';
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
}) {
  const games = getAllGames();
  const hubStats = useMemo(() => getGameHubStats(), []);
  const totalVotes = useMemo(
    () => Object.values(hubStats).reduce((sum, count) => sum + (count || 0), 0),
    [hubStats],
  );

  return (
    <div className="fashion-games fashion-games--hub">
      <header className="fashion-games-hub__hero">
        <div className="container fashion-games-hub__hero-inner">
          <button type="button" className="fashion-games__back" onClick={onBack}>
            <ChevronLeft size={18} />
            Home
          </button>

          <div className="fashion-games-hub__hero-copy">
            <span className="fashion-games__badge">
              <Gamepad2 size={14} aria-hidden />
              Mini Fashion Games
            </span>
            <h1 className="fashion-games__title">Play, vote, see results</h1>
            <p className="fashion-games__subtitle">
              Rate outfits, pick a style lane, or battle looks head-to-head. Every vote is saved and
              community results update instantly.
            </p>
          </div>

          <ul className="fashion-games-hub__trust" aria-label="Game highlights">
            <li>
              <Zap size={15} aria-hidden />
              3 quick games
            </li>
            <li>
              <Users size={15} aria-hidden />
              {formatVoteCount(totalVotes)} played
            </li>
            <li>
              <Trophy size={15} aria-hidden />
              Live community scores
            </li>
          </ul>
        </div>
      </header>

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
    </div>
  );
}
