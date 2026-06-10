import React, { useMemo } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  Compass,
  FolderOpen,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import DiscoveryRail from './DiscoveryRail';
import RecommendationRails from './RecommendationRails';
import ProductImage from './ProductImage';
import PlacedAdSlot from './PlacedAdSlot';
import {
  getStyleFinderArticles,
  getStyleFinderCollections,
  getStyleFinderProducts,
  resolveStyleProfileFromKey,
} from '../utils/aiStyleEngine';
import './FashionQuiz.css';
import './AiStyleFinder.css';

export default function AiStyleFinderResult({
  resultKey,
  products = [],
  adCodes = {},
  onSelectProduct,
  onSelectCategory,
  onOpenDiscover,
  onRetake,
  onBack,
  onOpenArticle,
  onOpenKnowledgePage,
  onStartQuiz,
}) {
  const profile = useMemo(() => resolveStyleProfileFromKey(resultKey), [resultKey]);
  const curatedProducts = useMemo(
    () => getStyleFinderProducts(products, profile),
    [products, profile],
  );
  const articles = useMemo(() => getStyleFinderArticles(profile), [profile]);
  const collections = useMemo(() => getStyleFinderCollections(profile), [profile]);

  if (!profile) {
    return (
      <div className="fashion-quiz fashion-quiz--result container">
        <p>Style profile not found.</p>
        <button type="button" className="btn btn-primary" onClick={onRetake}>
          Start again
        </button>
      </div>
    );
  }

  return (
    <div className="fashion-quiz fashion-quiz--result ai-style-finder">
      <div className="fashion-quiz-result__hero ai-style-finder__hero">
        <div className="container">
          <button type="button" className="fashion-quiz__back" onClick={onBack}>
            <ChevronLeft size={18} />
            Style finder
          </button>

          <p className="fashion-quiz-result__eyebrow">
            <Sparkles size={14} aria-hidden />
            AI Style Finder · Personalized
          </p>
          <span className="fashion-quiz-result__emoji" aria-hidden>
            {profile.emoji}
          </span>
          <h1 className="fashion-quiz-result__title">{profile.title}</h1>
          <p className="fashion-quiz-result__tagline">{profile.tagline}</p>
          <p className="fashion-quiz-result__desc">{profile.description}</p>

          <div className="ai-style-finder__chips">
            <span className="ai-style-finder__chip">Age: {profile.answers.age.replace('-', '–')}</span>
            <span className="ai-style-finder__chip">Body: {profile.bodyLabel}</span>
            <span className="ai-style-finder__chip">Budget: {profile.budgetLabel}</span>
            <span className="ai-style-finder__chip">Occasion: {profile.occasionLabel}</span>
          </div>

          <div className="fashion-quiz-result__hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onSelectCategory?.(profile.discoverCategory)}
            >
              Shop your edit
              <ArrowRight size={16} aria-hidden />
            </button>
            <button type="button" className="fashion-quiz-result__ghost" onClick={onRetake}>
              <RefreshCw size={16} aria-hidden />
              Refine answers
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <PlacedAdSlot adCodes={adCodes} placement="style_finder_result_mid" variant="section" />
      </div>

      <div className="container fashion-quiz-result__body">
        {curatedProducts.length ? (
          <DiscoveryRail
            title="Your personalized picks"
            hook={`${curatedProducts.length} styles matched to your profile — tap to explore`}
            products={curatedProducts}
            tone="hot"
            onSelectProduct={onSelectProduct}
            onSeeAll={() => onSelectCategory?.(profile.discoverCategory)}
          />
        ) : null}

        <section className="fashion-quiz-result__content-block">
          <div className="fashion-quiz-result__block-head">
            <FolderOpen size={18} aria-hidden />
            <div>
              <h2>Collections for you</h2>
              <p>Curated category lanes based on your occasion and budget.</p>
            </div>
          </div>
          <div className="ai-style-finder__collections">
            {collections.map((col) => (
              <button
                key={col.id}
                type="button"
                className="ai-style-finder__collection-card"
                onClick={() => onSelectCategory?.(col.category)}
              >
                <ProductImage src={col.image} alt="" className="ai-style-finder__collection-img" />
                <div className="ai-style-finder__collection-body">
                  <h3>{col.title}</h3>
                  <span className="ai-style-finder__collection-cta">
                    Open collection
                    <ArrowRight size={14} aria-hidden />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <RecommendationRails
          allProducts={products}
          category={profile.discoverCategory}
          quizResult={profile}
          onSelectProduct={onSelectProduct}
          onSelectCategory={onSelectCategory}
          onOpenArticle={onOpenArticle}
          onOpenKnowledgePage={onOpenKnowledgePage}
          onStartQuiz={onStartQuiz}
          adCodes={adCodes}
          title="Keep exploring"
          subtitle="Similar products, related collections, articles, quizzes, and trending picks."
          variant="browse"
          showAds={false}
          compact
        />

        <section className="fashion-quiz-result__content-block">
          <div className="fashion-quiz-result__block-head">
            <BookOpen size={18} aria-hidden />
            <div>
              <h2>Articles for your profile</h2>
              <p>Styling reads tuned to your age, fit, and occasion.</p>
            </div>
          </div>
          <div className="fashion-quiz-result__guides">
            {articles.map((guide) => (
              <button
                key={guide.id}
                type="button"
                className="fashion-quiz-result__guide-card"
                onClick={() => onSelectCategory?.(guide.category)}
              >
                <ProductImage src={guide.image} alt="" className="fashion-quiz-result__guide-img" />
                <div className="fashion-quiz-result__guide-body">
                  <span className="fashion-quiz-result__guide-time">{guide.readTime}</span>
                  <h3>{guide.title}</h3>
                  <p>{guide.subtitle}</p>
                  <span className="fashion-quiz-result__guide-cta">
                    {guide.hook}
                    <ArrowRight size={14} aria-hidden />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <PlacedAdSlot adCodes={adCodes} placement="style_finder_result_bottom" variant="section" />

        <section className="fashion-quiz-result__finale ai-style-finder__finale">
          <Compass size={22} aria-hidden />
          <h2>Keep discovering</h2>
          <p>Your profile is saved in the URL — share it or jump into the full explore feed.</p>
          <div className="fashion-quiz-result__finale-actions">
            <button type="button" className="btn btn-primary" onClick={onOpenDiscover}>
              Open explore feed
            </button>
            <button type="button" className="fashion-quiz-result__ghost ai-style-finder__finale-ghost" onClick={onRetake}>
              Try different answers
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
