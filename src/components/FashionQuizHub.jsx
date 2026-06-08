import React from 'react';
import { ArrowRight, Sparkles, Shirt, PartyPopper, Heart, ChevronLeft, Wand2 } from 'lucide-react';
import { getAllQuizzes } from '../data/fashionQuizzes';
import './FashionQuiz.css';
import './AiStyleFinder.css';
import EndlessDiscovery from './EndlessDiscovery';

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
}) {
  const quizzes = getAllQuizzes();

  return (
    <div className="fashion-quiz fashion-quiz--hub">
      <div className="fashion-quiz__hero">
        <button type="button" className="fashion-quiz__back" onClick={onBack}>
          <ChevronLeft size={18} />
          Home
        </button>
        <p className="fashion-quiz__eyebrow">Fashion Quiz Hub</p>
        <h1 className="fashion-quiz__title">Find your style in minutes</h1>
        <p className="fashion-quiz__subtitle">
          Four playful quizzes — each one ends with product picks, styling guides, and your next scroll.
        </p>
      </div>

      {onOpenStyleFinder ? (
        <div className="container" style={{ marginTop: '-1rem', marginBottom: '1.25rem' }}>
          <button type="button" className="ai-style-finder__promo" onClick={onOpenStyleFinder}>
            <div className="ai-style-finder__promo-text">
              <span className="ai-style-finder__badge" style={{ marginBottom: '0.5rem' }}>
                <Wand2 size={14} aria-hidden />
                New
              </span>
              <h3>Try AI Style Finder</h3>
              <p>4 inputs → personalized products, articles & collections</p>
            </div>
            <ArrowRight size={20} aria-hidden />
          </button>
        </div>
      ) : null}

      <div className="container fashion-quiz__grid">
        {quizzes.map((quiz) => {
          const Icon = QUIZ_ICONS[quiz.slug] || Sparkles;
          return (
            <article
              key={quiz.slug}
              className="fashion-quiz-card"
              style={{ '--quiz-accent': quiz.accent }}
            >
              <div className="fashion-quiz-card__icon">
                <Icon size={22} aria-hidden />
              </div>
              <h2 className="fashion-quiz-card__title">{quiz.title}</h2>
              <p className="fashion-quiz-card__sub">{quiz.subtitle}</p>
              <p className="fashion-quiz-card__desc">{quiz.description}</p>
              <p className="fashion-quiz-card__meta">{quiz.steps.length} steps · ~2 min</p>
              <button
                type="button"
                className="fashion-quiz-card__cta"
                onClick={() => onStartQuiz?.(quiz.slug)}
              >
                Start quiz
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
            title="Endless discovery"
            subtitle="Similar products, related collections, articles, quizzes, and trending picks."
            compact
            showAds={false}
          />
        </div>
      ) : null}
    </div>
  );
}
