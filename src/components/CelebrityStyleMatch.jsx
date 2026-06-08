/**
 * CelebrityStyleMatch — hub page at /celebrity-match
 *
 * Each celebrity card navigates to the individual look page
 * (/celebrity-match/:id) instead of dropping users into a generic category.
 */
import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { CELEBRITY_LOOKS, fetchCelebrityLooks } from '../utils/celebrityLooksData';
import ProductImage from './ProductImage';
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
  const [looks, setLooks] = useState(CELEBRITY_LOOKS);

  useEffect(() => {
    fetchCelebrityLooks().then(setLooks).catch(() => setLooks(CELEBRITY_LOOKS));
  }, []);

  const openLook = (look) => {
    if (!look?.id) return;
    onNavigate?.(`/celebrity-match/${encodeURIComponent(look.id)}`);
  };

  return (
    <div className="celebrity-match fashion-quiz">
      <div className="fashion-quiz__hero">
        <div className="container">
          <button type="button" className="fashion-quiz__back" onClick={onBack}>
            <ChevronLeft size={18} aria-hidden />
            Home
          </button>
          <p className="fashion-quiz__eyebrow">Celebrity Style Match</p>
          <h1 className="fashion-quiz__title">Which star vibe is yours?</h1>
          <p className="fashion-quiz__subtitle">
            Tap any look — we&apos;ll show you the styling story, shoppable picks, and a style guide built around it.
          </p>
        </div>
      </div>

      <div className="container">
        <section className="explore-section explore-section--celebrity" id="celebrity-match-grid">
          <div className="explore-celebrity-grid">
            {looks.map((look) => (
              <button
                key={look.id}
                type="button"
                className="explore-celebrity-card hover-zoom-container"
                onClick={() => openLook(look)}
                data-journey-label={`Celebrity look: ${look.celebrity}`}
                aria-label={`${look.celebrity} — ${look.title}`}
              >
                <ProductImage
                  src={look.image}
                  alt=""
                  className="explore-celebrity-card__img hover-zoom-img"
                  loading="lazy"
                />
                <div className="explore-celebrity-card__overlay" aria-hidden="true" />
                <div className="explore-celebrity-card__body">
                  <span className="explore-celebrity-card__tag">{look.context || look.theme}</span>
                  <h3 className="explore-celebrity-card__title">{look.title}</h3>
                  <span className="explore-celebrity-card__hook">{look.hook || look.celebrity}</span>
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
