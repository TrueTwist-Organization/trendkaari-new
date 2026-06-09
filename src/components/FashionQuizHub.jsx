import React from 'react';
import { ArrowRight, Sparkles, Shirt, PartyPopper, Heart, ChevronLeft, Wand2, Clock3, ShoppingBag } from 'lucide-react';
import { getAllQuizzes } from '../data/fashionQuizzes';
import './FashionQuiz.css';
import './AiStyleFinder.css';
import EndlessDiscovery from './EndlessDiscovery';
import PlacedAdSlot from './PlacedAdSlot';

const QUIZ_ICONS = {
  personality: Sparkles,
  'outfit-finder': Shirt,
  'festival-look': PartyPopper,
  'wedding-style': Heart,
};

export default function FashionQuizHub({
  onStartQuiz,
  onBack,
  onOpenStyleFinder,
  products = [],
  onSelectProduct,
  onSelectCategory,
  onOpenArticle,
  onOpenKnowledgePage,
  adCodes = {},
}) {
  const quizzes = getAllQuizzes();

  return (
    <div className="fashion-quiz fashion-quiz--hub">
      <header className="fashion-quiz-hub__hero">
        <div className="container fashion-quiz-hub__hero-inner">
          <button type="button" className="fashion-quiz__back" onClick={onBack}>
            <ChevronLeft size={18} />
            Home
          </button>

          <div className="fashion-quiz-hub__hero-copy">
            <p className="fashion-quiz__eyebrow">Fashion Quiz Hub</p>
            <h1 className="fashion-quiz__title">Find your style in minutes</h1>
            <p className="fashion-quiz__subtitle">
              Playful quizzes that end with product picks, styling guides, and your next scroll — tuned to how you dress.
            </p>
          </div>

          <ul className="fashion-quiz-hub__trust" aria-label="Quiz highlights">
            <li>
              <Sparkles size={15} aria-hidden />
              4 style quizzes
            </li>
            <li>
              <ShoppingBag size={15} aria-hidden />
              Curated product picks
            </li>
            <li>
              <Clock3 size={15} aria-hidden />
              ~2 min each
            </li>
          </ul>
        </div>
      </header>

      <div className="container">
        <PlacedAdSlot adCodes={adCodes} placement="quiz_hub_mid" variant="section" />
      </div>

      <section className="fashion-quiz-hub__stage" aria-label="Choose a quiz">
        <div className="container fashion-quiz-hub__stage-inner">
          {onOpenStyleFinder ? (
            <button type="button" className="fashion-quiz-hub__featured" onClick={onOpenStyleFinder}>
              <span className="fashion-quiz-hub__featured-icon" aria-hidden>
                <Wand2 size={22} />
              </span>
              <span className="fashion-quiz-hub__featured-copy">
                <span className="fashion-quiz-hub__featured-badge">New · AI Style Finder</span>
                <span className="fashion-quiz-hub__featured-title">Personalized picks in 4 taps</span>
                <span className="fashion-quiz-hub__featured-sub">
                  Age, body, budget & occasion → products, articles & collections matched to you
                </span>
              </span>
              <span className="fashion-quiz-hub__featured-cta">
                Try now
                <ArrowRight size={18} aria-hidden />
              </span>
            </button>
          ) : null}

          <div className="fashion-quiz-hub__grid">
            {quizzes.map((quiz) => {
              const Icon = QUIZ_ICONS[quiz.slug] || Sparkles;
              return (
                <article
                  key={quiz.slug}
                  className="fashion-quiz-hub__card"
                  style={{ '--quiz-accent': quiz.accent }}
                >
                  <div className="fashion-quiz-hub__card-top">
                    <span className="fashion-quiz-hub__card-icon" aria-hidden>
                      <Icon size={20} />
                    </span>
                    <span className="fashion-quiz-hub__card-meta">
                      {quiz.steps.length} steps · ~2 min
                    </span>
                  </div>
                  <h2 className="fashion-quiz-hub__card-title">{quiz.title}</h2>
                  <p className="fashion-quiz-hub__card-sub">{quiz.subtitle}</p>
                  <button
                    type="button"
                    className="fashion-quiz-hub__card-cta"
                    onClick={() => onStartQuiz?.(quiz.slug)}
                  >
                    Start quiz
                    <ArrowRight size={16} aria-hidden />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container">
        <PlacedAdSlot adCodes={adCodes} placement="quiz_hub_bottom" variant="section" />
      </div>

      {products.length > 0 ? (
        <section className="fashion-quiz-hub__discovery" aria-label="Recommended products">
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
              title="Shop while you browse"
              subtitle="Trending picks, related collections, and more quizzes — keep exploring after you play."
              compact
              showAds={false}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
