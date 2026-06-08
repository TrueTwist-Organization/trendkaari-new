import React, { useMemo } from 'react';
import { ArrowRight, ChevronLeft, Gamepad2, Star, Swords, Palette } from 'lucide-react';
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

  return (
    <div className="fashion-games fashion-games--hub">
      <header className="fashion-games__hero">
        <div className="container">
          <button type="button" className="fashion-games__back" onClick={onBack}>
            <ChevronLeft size={18} />
            Home
          </button>
          <span className="fashion-games__badge">
            <Gamepad2 size={14} aria-hidden />
            Mini Fashion Games
          </span>
          <h1 className="fashion-games__title">Play, vote, see results</h1>
          <p className="fashion-games__subtitle">
            Three quick games — rate outfits, pick a style lane, or battle looks head-to-head.
            Every vote is saved and community results update instantly.
          </p>
        </div>
      </header>

      <div className="container fashion-games__grid">
        {games.map((game) => {
          const Icon = GAME_ICONS[game.slug] || Gamepad2;
          return (
            <article
              key={game.slug}
              className="fashion-games-card"
              style={{ '--game-accent': game.accent }}
            >
              <div className="fashion-games-card__icon">
                <Icon size={22} aria-hidden />
              </div>
              <p className="fashion-games-card__meta">
                {formatVoteCount(hubStats[game.slug] || 0)} played
              </p>
              <h2 className="fashion-games-card__title">{game.title}</h2>
              <p className="fashion-games-card__sub">{game.subtitle}</p>
              <p className="fashion-games-card__desc">{game.description}</p>
              <button
                type="button"
                className="fashion-games-card__cta"
                onClick={() => onStartGame?.(game.slug)}
              >
                {game.cta}
                <ArrowRight size={16} aria-hidden />
              </button>
            </article>
          );
        })}
      </div>

      {products.length > 0 ? (
        <div className="container">
          <EndlessDiscovery
            allProducts={products}
            category="kurtas"
            onSelectProduct={onSelectProduct}
            onSelectCategory={onSelectCategory}
            onOpenArticle={onOpenArticle}
            onOpenKnowledgePage={onOpenKnowledgePage}
            onStartQuiz={onStartQuiz}
            variant="browse"
            title="Keep exploring"
            subtitle="Similar products, related collections, articles, quizzes, and trending picks."
            compact
            showAds={false}
          />
        </div>
      ) : null}
    </div>
  );
}
