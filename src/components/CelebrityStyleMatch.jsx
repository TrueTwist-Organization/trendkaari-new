/**
 * CelebrityStyleMatch — hub page at /celebrity-match
 *
 * Each celebrity card navigates to the individual look page
 * (/celebrity-match/:id) instead of dropping users into a generic category.
 * This creates a proper exploration loop:
 *   Hub → Individual Look → Products → Style Guide → More Looks → Hub
 */
import { ChevronLeft } from 'lucide-react';
import { CELEBRITY_LOOKS } from '../data/celebrityLooks';
import EndlessDiscovery from './EndlessDiscovery';
import './FashionQuiz.css';
import './ExplorationHomepage.css';

export default function CelebrityStyleMatch({
  products = [],
  onSelectProduct,
  onSelectCategory,
  onOpenArticle,
  onOpenKnowledgePage,
  onStartQuiz,
  onNavigate,
  onBack,
}) {
  return (
    <div className="celebrity-match">
      <div className="celebrity-match__hero">
        <button type="button" className="fashion-quiz__back" onClick={onBack}>
          <ChevronLeft size={18} />
          Home
        </button>
        <p className="fashion-quiz__eyebrow">Celebrity Style Match</p>
        <h1 className="fashion-quiz__title">Which star vibe is yours?</h1>
        <p className="fashion-quiz__subtitle">
          Tap any look — we&apos;ll show you the styling story, shoppable picks, and a style guide built around it.
        </p>
      </div>

      <div className="container">
        <section className="explore-section explore-section--celebrity" id="celebrity-match-grid">
          <div className="explore-celebrity-grid">
            {CELEBRITY_LOOKS.map((look) => (
              <button
                key={look.id}
                type="button"
                className="explore-celebrity-card hover-zoom-container"
                onClick={() => onNavigate?.(`/celebrity-match/${look.id}`)}
                data-journey-label={`Celebrity look: ${look.celebrity}`}
                aria-label={`${look.celebrity} — ${look.title}`}
              >
                <img
                  src={look.image}
                  alt=""
                  className="explore-celebrity-card__img hover-zoom-img"
                  loading="lazy"
                  decoding="async"
                />
                <div className="explore-celebrity-card__overlay" aria-hidden="true" />
                <div className="explore-celebrity-card__body">
                  <span className="explore-celebrity-card__tag">{look.theme}</span>
                  <h3 className="explore-celebrity-card__title">{look.title}</h3>
                  <span className="explore-celebrity-card__hook">{look.hook}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {products.length > 0 ? (
          <EndlessDiscovery
            allProducts={products}
            category="lehengas"
            onSelectProduct={onSelectProduct}
            onSelectCategory={onSelectCategory}
            onOpenArticle={onOpenArticle}
            onOpenKnowledgePage={onOpenKnowledgePage}
            onStartQuiz={onStartQuiz}
            variant="browse"
            title="Shop celebrity-inspired picks"
            subtitle="Similar products, related collections, articles, and quizzes — keep the scroll going."
            compact
            showAds={false}
          />
        ) : null}
      </div>
    </div>
  );
}
