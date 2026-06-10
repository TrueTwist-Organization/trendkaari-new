import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  Star,
  Trophy,
  Users,
} from 'lucide-react';
import ProductImage from './ProductImage';
import { getGameBySlug } from '../data/fashionGames';
import {
  buildGameSession,
  getChooseStyleResults,
  getLookBattleResults,
  getRateOutfitResults,
} from '../utils/fashionGameEngine';
import {
  recordBattleVote,
  recordProductRating,
  recordStyleVote,
} from '../utils/gameVotesStorage';
import EndlessDiscovery from './EndlessDiscovery';
import PlacedAdSlot from './PlacedAdSlot';
import './FashionGames.css';

function StarRatingInput({ value, onChange }) {
  return (
    <div className="fashion-games-stars" role="radiogroup" aria-label="Rate this outfit">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`fashion-games-stars__btn${value >= star ? ' is-active' : ''}`}
          onClick={() => onChange(star)}
          aria-label={`${star} stars`}
          aria-pressed={value >= star}
        >
          <Star size={28} fill={value >= star ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}

function ResultsBar({ label, percent, accent, isWinner, isUser }) {
  return (
    <div className={`fashion-games-result-row${isWinner ? ' fashion-games-result-row--winner' : ''}`}>
      <div className="fashion-games-result-row__head">
        <span className="fashion-games-result-row__label">
          {label}
          {isUser ? <span className="fashion-games-result-row__you">Your pick</span> : null}
        </span>
        <strong>{percent}%</strong>
      </div>
      <div className="fashion-games-result-row__track">
        <span
          className="fashion-games-result-row__fill"
          style={{ width: `${percent}%`, background: accent }}
        />
      </div>
    </div>
  );
}

const BATTLE_GENDERS = [
  { id: 'women', label: "Women's" },
  { id: 'men', label: "Men's" },
];

export default function FashionGamePlay({
  gameSlug,
  products = [],
  adCodes = {},
  onBackToHub,
  onBackToHome,
  onSelectProduct,
  onSelectCategory,
  onOpenArticle,
  onOpenKnowledgePage,
  onStartQuiz,
  onPlayAgain: _onPlayAgain,
}) {
  const game = getGameBySlug(gameSlug);
  const [battleGender, setBattleGender] = useState('women');
  const session = useMemo(
    () => buildGameSession(gameSlug, products, { gender: battleGender }),
    [gameSlug, products, battleGender],
  );

  const [phase, setPhase] = useState('play');
  const [roundIndex, setRoundIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [sessionRatings, setSessionRatings] = useState([]);
  const [battleWinners, setBattleWinners] = useState([]);
  const [battleProductIds, setBattleProductIds] = useState([]);
  const [resultsKey, setResultsKey] = useState(0);

  if (!game || !session) {
    return (
      <div className="fashion-games container">
        <p>Game not found.</p>
        <button type="button" className="btn btn-primary" onClick={onBackToHub}>
          Back to games
        </button>
      </div>
    );
  }

  const refreshResults = () => setResultsKey((k) => k + 1);

  const finishRateGame = (nextRatings) => {
    setSessionRatings(nextRatings);
    setPhase('results');
    refreshResults();
  };

  const handleRateSubmit = () => {
    if (!rating || !session.rounds[roundIndex]) return;
    const product = session.rounds[roundIndex].product;
    recordProductRating(product.id, rating);
    const nextRatings = [...sessionRatings, { productId: product.id, stars: rating }];

    if (roundIndex >= session.rounds.length - 1) {
      finishRateGame(nextRatings);
      return;
    }

    setRoundIndex((i) => i + 1);
    setRating(0);
  };

  const handleStylePick = (optionId) => {
    recordStyleVote(optionId);
    setPhase('results');
    refreshResults();
  };

  const handleBattleGenderChange = (nextGender) => {
    if (nextGender === battleGender) return;
    setBattleGender(nextGender);
    setPhase('play');
    setRoundIndex(0);
    setBattleWinners([]);
    setBattleProductIds([]);
  };

  const handleBattlePick = (winner, loser) => {
    recordBattleVote(winner.id, loser.id);
    const ids = [winner.id, loser.id];
    const nextIds = [...new Set([...battleProductIds, ...ids])];
    const nextWinners = [...battleWinners, winner.id];
    setBattleProductIds(nextIds);
    setBattleWinners(nextWinners);

    if (roundIndex >= session.battles.length - 1) {
      setPhase('results');
      refreshResults();
      return;
    }

    setRoundIndex((i) => i + 1);
  };

  const rateResults = useMemo(() => {
    if (phase !== 'results' || session.type !== 'rate') return [];
    const ids = sessionRatings.map((r) => r.productId);
    return getRateOutfitResults(ids);
  }, [phase, session.type, sessionRatings, resultsKey]);

  const styleResults = useMemo(() => {
    if (phase !== 'results' || session.type !== 'pick-one') return [];
    return getChooseStyleResults();
  }, [phase, session.type, resultsKey]);

  const battleResults = useMemo(() => {
    if (phase !== 'results' || session.type !== 'battle') return null;
    return getLookBattleResults(battleProductIds);
  }, [phase, session.type, battleProductIds, resultsKey]);

  const renderPlay = () => {
    if (session.type === 'rate') {
      const round = session.rounds[roundIndex];
      if (!round) return null;
      const { product, stats } = round;

      return (
        <div className="fashion-games-play fashion-games-play--rate">
          <p className="fashion-games-play__progress">
            Look {roundIndex + 1} of {session.rounds.length}
          </p>
          <div className="fashion-games-outfit-card">
            <ProductImage src={product.image} alt={product.title} className="fashion-games-outfit-card__img" />
            <div className="fashion-games-outfit-card__body">
              <span className="fashion-games-outfit-card__cat">{product.subCategory || product.category}</span>
              <h2>{product.title}</h2>
              <p className="fashion-games-outfit-card__price">₹{product.price}</p>
              <p className="fashion-games-outfit-card__crowd">
                <Users size={14} aria-hidden />
                Crowd avg {stats.average.toFixed(1)}★ · {stats.count} ratings
              </p>
            </div>
          </div>
          <p className="fashion-games-play__prompt">How would you rate this outfit?</p>
          <StarRatingInput value={rating} onChange={setRating} />
          <button
            type="button"
            className="btn btn-primary fashion-games-play__submit"
            disabled={!rating}
            onClick={handleRateSubmit}
          >
            {roundIndex >= session.rounds.length - 1 ? 'See results' : 'Next look'}
            <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      );
    }

    if (session.type === 'pick-one') {
      return (
        <div className="fashion-games-play fashion-games-play--style">
          <p className="fashion-games-play__prompt">Which style lane is so you?</p>
          <div className="fashion-games-style-grid">
            {session.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className="fashion-games-style-card"
                style={{ '--game-accent': option.accent }}
                onClick={() => handleStylePick(option.id)}
              >
                <ProductImage src={option.image} alt="" className="fashion-games-style-card__img" />
                <div className="fashion-games-style-card__overlay" />
                <div className="fashion-games-style-card__copy">
                  <h3>{option.label}</h3>
                  <p>{option.hook}</p>
                  <span>{option.percent}% of votes</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (session.type === 'battle') {
      if (!session.battles.length) {
        return (
          <div className="fashion-games-play fashion-games-play--battle">
            <p className="fashion-games-play__prompt">Not enough looks for this category yet.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                handleBattleGenderChange(battleGender === 'women' ? 'men' : 'women')
              }
            >
              Try {battleGender === 'women' ? "Men's" : "Women's"} battles
            </button>
          </div>
        );
      }

      const battle = session.battles[roundIndex];
      if (!battle) return null;

      const progressPct = ((roundIndex + 1) / session.battles.length) * 100;
      const activeGender = BATTLE_GENDERS.find((g) => g.id === battleGender) || BATTLE_GENDERS[0];

      return (
        <div className="fashion-games-play fashion-games-play--battle">
          <div className="fashion-games-battle-toolbar">
            <div className="fashion-games-gender-tabs" role="tablist" aria-label="Battle category">
              {BATTLE_GENDERS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={battleGender === option.id}
                  className={`fashion-games-gender-tabs__btn${
                    battleGender === option.id ? ' is-active' : ''
                  }`}
                  onClick={() => handleBattleGenderChange(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="fashion-games-battle-toolbar__meta">
              Battle {roundIndex + 1} of {session.battles.length}
              <span>{activeGender.label} looks</span>
            </p>
          </div>

          <div className="fashion-games-battle-progress" aria-hidden>
            <span
              className="fashion-games-battle-progress__fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <p className="fashion-games-play__prompt">Tap the look that wins</p>

          <div className="fashion-games-battle-arena">
            {[battle.left, battle.right].map((product, idx) => (
              <button
                key={product.id}
                type="button"
                className={`fashion-games-battle-card hover-zoom-container${
                  idx === 0 ? ' fashion-games-battle-card--left' : ' fashion-games-battle-card--right'
                }`}
                onClick={() =>
                  handleBattlePick(product, idx === 0 ? battle.right : battle.left)
                }
              >
                <div className="fashion-games-battle-card__media">
                  <ProductImage
                    src={product.image}
                    alt={product.title}
                    className="fashion-games-battle-card__img hover-zoom-img"
                  />
                </div>
                <div className="fashion-games-battle-card__body">
                  <span>{product.subCategory || product.category}</span>
                  <h3>{product.title}</h3>
                  <strong>₹{product.price}</strong>
                  <span className="fashion-games-battle-card__cta">Pick winner</span>
                </div>
              </button>
            ))}
            <div className="fashion-games-battle-vs" aria-hidden>
              VS
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderResults = () => {
    if (session.type === 'rate') {
      return (
        <div className="fashion-games-results">
          <div className="fashion-games-results__head">
            <Trophy size={20} aria-hidden />
            <div>
              <h2>Your ratings vs the crowd</h2>
              <p>How your stars compare to community averages.</p>
            </div>
          </div>
          <div className="fashion-games-results__list">
            {rateResults.map(({ productId, stats }) => {
              const product = products.find((p) => p.id === productId);
              const yours = sessionRatings.find((r) => r.productId === productId)?.stars;
              if (!product) return null;
              return (
                <button
                  key={productId}
                  type="button"
                  className="fashion-games-rate-result"
                  onClick={() => onSelectProduct?.(product)}
                >
                  <ProductImage src={product.image} alt={product.title} />
                  <div>
                    <h3>{product.title}</h3>
                    <p>
                      You: {yours}★ · Crowd: {stats.average.toFixed(1)}★ ({stats.count} votes)
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (session.type === 'pick-one') {
      const top = styleResults[0];
      return (
        <div className="fashion-games-results">
          <div className="fashion-games-results__head">
            <Trophy size={20} aria-hidden />
            <div>
              <h2>Community style breakdown</h2>
              <p>
                {top ? `${top.label} is leading with ${top.percent}%` : 'Live vote totals'}
              </p>
            </div>
          </div>
          <div className="fashion-games-results__bars">
            {styleResults.map((row) => (
              <ResultsBar
                key={row.id}
                label={row.label}
                percent={row.percent}
                accent={row.accent}
                isWinner={row.id === top?.id}
                isUser={row.isUserChoice}
              />
            ))}
          </div>
        </div>
      );
    }

    if (session.type === 'battle') {
      return (
        <div className="fashion-games-results">
          <div className="fashion-games-results__head">
            <Trophy size={20} aria-hidden />
            <div>
              <h2>Battle leaderboard</h2>
              <p>Win rates from all head-to-head votes.</p>
            </div>
          </div>
          <div className="fashion-games-results__list">
            {battleResults?.leaderboard?.slice(0, 6).map((row, index) => {
              const product = products.find((p) => p.id === row.productId);
              if (!product) return null;
              return (
                <button
                  key={row.productId}
                  type="button"
                  className="fashion-games-battle-result"
                  onClick={() => onSelectProduct?.(product)}
                >
                  <span className="fashion-games-battle-result__rank">#{index + 1}</span>
                  <ProductImage src={product.image} alt={product.title} />
                  <div>
                    <h3>{product.title}</h3>
                    <p>
                      {row.winRate}% win rate · {row.wins} wins / {row.matches} battles
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fashion-games fashion-games--play" style={{ '--game-accent': game.accent }}>
      <div className="container">
        <div className="fashion-games__topbar">
          <button type="button" className="fashion-games__back" onClick={onBackToHub}>
            <ChevronLeft size={18} />
            All games
          </button>
          <button type="button" className="fashion-games__exit" onClick={onBackToHome}>
            Home
          </button>
        </div>

        <header className="fashion-games-play__header">
          <p className="fashion-games-play__eyebrow">{game.subtitle}</p>
          <h1>{game.title}</h1>
        </header>

        <PlacedAdSlot adCodes={adCodes} placement="game_play_mid" variant="section" />

        {phase === 'play' ? renderPlay() : renderResults()}

        {phase === 'results' ? (
          <div className="fashion-games-play__actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setPhase('play');
                setRoundIndex(0);
                setRating(0);
                setSessionRatings([]);
                setBattleWinners([]);
                setBattleProductIds([]);
                setBattleGender('women');
                refreshResults();
              }}
            >
              Play again
            </button>
            <button type="button" className="fashion-games-play__secondary" onClick={onBackToHub}>
              Try another game
            </button>
          </div>
        ) : null}

        <PlacedAdSlot adCodes={adCodes} placement="game_play_bottom" variant="section" />

        {products.length > 0 && phase === 'results' ? (
          <EndlessDiscovery
            allProducts={products}
            category={session.type === 'battle' && battleGender === 'men' ? 'shirts' : 'kurtas'}
            onSelectProduct={onSelectProduct}
            onSelectCategory={onSelectCategory}
            onOpenArticle={onOpenArticle}
            onOpenKnowledgePage={onOpenKnowledgePage}
            onStartQuiz={onStartQuiz}
            variant="browse"
            title="Shop the winning looks"
            subtitle="Similar products, related collections, articles, quizzes, and trending picks."
            compact
            showAds={false}
          />
        ) : null}
      </div>
    </div>
  );
}
