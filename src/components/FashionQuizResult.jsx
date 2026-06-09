import React, { useMemo, useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  Compass,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import DiscoveryRail from './DiscoveryRail';
import RecommendationRails from './RecommendationRails';
import ProductImage from './ProductImage';
import DiscoveryLoopSection from './DiscoveryLoopSection';
import { getQuizBySlugAsync } from '../utils/editorialContentData';
import { trackQuizCompleted } from '../utils/ga4';
import {
  getQuizRelatedGuides,
  getQuizRelatedLooks,
  getQuizResultProducts,
} from '../utils/quizEngine';
import { getDiscoveryContext } from '../utils/discoveryContext';
import PlacedAdSlot from './PlacedAdSlot';
import './FashionQuiz.css';

export default function FashionQuizResult({
  quizSlug,
  resultKey,
  products = [],
  adCodes = {},
  onSelectProduct,
  onSelectCategory,
  onOpenDiscover,
  onRetake,
  onBackToHub,
  onOpenArticle,
  onOpenKnowledgePage,
  onStartQuiz,
  onNavigate,
}) {
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    if (!quizSlug) {
      setQuiz(null);
      return;
    }
    getQuizBySlugAsync(quizSlug).then(setQuiz);
  }, [quizSlug]);

  const result = quiz?.results?.[resultKey];

  const curatedProducts = useMemo(
    () => getQuizResultProducts(products, result, 12),
    [products, result],
  );

  const curatedProductIds = useMemo(
    () => curatedProducts.map((p) => p.id),
    [curatedProducts],
  );

  const guides = useMemo(() => getQuizRelatedGuides(result), [result]);
  const looks = useMemo(() => getQuizRelatedLooks(result), [result]);

  useEffect(() => {
    if (quiz && result) {
      trackQuizCompleted(quizSlug, quiz.title, resultKey, result.title);
    }
  }, [quizSlug, resultKey, quiz, result]);

  const discoveryCtx = useMemo(
    () => getDiscoveryContext(result?.discoverCategory),
    [result],
  );

  if (!quiz || !result) {
    return (
      <div className="fashion-quiz fashion-quiz--result container">
        <p>Result not found.</p>
        <button type="button" className="btn btn-primary" onClick={onBackToHub}>
          Back to quiz hub
        </button>
      </div>
    );
  }

  return (
    <div
      className="fashion-quiz fashion-quiz--result"
      style={{ '--quiz-accent': quiz.accent }}
    >
      <div className="fashion-quiz-result__hero">
        <div className="container">
          <button type="button" className="fashion-quiz__back" onClick={onBackToHub}>
            <ChevronLeft size={18} />
            Quiz hub
          </button>

          <p className="fashion-quiz-result__eyebrow">{quiz.title} · Your result</p>
          <span className="fashion-quiz-result__emoji" aria-hidden>
            {result.emoji}
          </span>
          <h1 className="fashion-quiz-result__title">{result.title}</h1>
          <p className="fashion-quiz-result__tagline">{result.tagline}</p>
          <p className="fashion-quiz-result__desc">{result.description}</p>

          <div className="fashion-quiz-result__hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onSelectCategory?.(result.discoverCategory)}
            >
              Shop the edit
              <ArrowRight size={16} aria-hidden />
            </button>
            <button type="button" className="fashion-quiz-result__ghost" onClick={onRetake}>
              <RefreshCw size={16} aria-hidden />
              Retake quiz
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <PlacedAdSlot adCodes={adCodes} placement="quiz_result_mid" variant="section" />
      </div>

      <div className="container fashion-quiz-result__body">
        {curatedProducts.length ? (
          <DiscoveryRail
            title="Picked for your result"
            hook="Tap any look to explore — curated from your quiz answers"
            products={curatedProducts}
            tone="hot"
            onSelectProduct={onSelectProduct}
            onSeeAll={() => onSelectCategory?.(result.discoverCategory)}
          />
        ) : null}

        <RecommendationRails
          allProducts={products}
          category={result.discoverCategory}
          quizSlug={quizSlug}
          quizResult={result}
          excludeProductIds={curatedProductIds}
          onSelectProduct={onSelectProduct}
          onSelectCategory={onSelectCategory}
          onOpenArticle={onOpenArticle}
          onOpenKnowledgePage={onOpenKnowledgePage}
          onStartQuiz={onStartQuiz}
          adCodes={adCodes}
          title={`More picks for ${result.title}`}
          subtitle={`Products matched to your ${quiz.title} answers — by category, style, and keywords.`}
          variant="browse"
          showAds={false}
          compact
        />

        <section className="fashion-quiz-result__content-block">
          <div className="fashion-quiz-result__block-head">
            <BookOpen size={18} aria-hidden />
            <div>
              <h2>Related styling guides</h2>
              <p>Editorial reads matched to your result — then shop the category.</p>
            </div>
          </div>
          <div className="fashion-quiz-result__guides">
            {guides.map((guide) => (
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

        <section className="fashion-quiz-result__content-block">
          <div className="fashion-quiz-result__block-head">
            <Sparkles size={18} aria-hidden />
            <div>
              <h2>Celebrity-inspired looks</h2>
              <p>Jump into edits that match your quiz lane.</p>
            </div>
          </div>
          <div className="fashion-quiz-result__looks">
            {looks.map((look) => (
              <button
                key={look.id}
                type="button"
                className="fashion-quiz-result__look-card"
                onClick={() => onNavigate?.(`/celebrity-match/${look.id}`) ?? onSelectCategory?.(look.category)}
              >
                <ProductImage src={look.image} alt="" className="fashion-quiz-result__look-img" />
                <div className="fashion-quiz-result__look-body">
                  <span className="fashion-quiz-result__look-celeb">{look.celebrity}</span>
                  <h3>{look.title}</h3>
                  <span className="fashion-quiz-result__look-cta">
                    {look.hook}
                    <ArrowRight size={14} aria-hidden />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <DiscoveryLoopSection
          sourceContext="quiz_result"
          trendSlugs={discoveryCtx.trendSlugs}
          celebIds={looks.map((l) => l.id)}
          quizSlugs={discoveryCtx.quizSlugs.filter((s) => s !== quizSlug)}
          guideSlugs={discoveryCtx.guideSlugs}
          title="Go deeper into your style"
          subtitle="More destinations matched to your quiz result"
          excludeType="celeb"
          onNavigate={onNavigate}
          onStartQuiz={onStartQuiz}
          onOpenKnowledgePage={onOpenKnowledgePage}
        />

        <section className="fashion-quiz-result__finale">
          <Compass size={22} aria-hidden />
          <h2>Want more rabbit holes?</h2>
          <p>The full discovery feed has endless rails tuned to how you browse.</p>
          <div className="fashion-quiz-result__finale-actions">
            <button type="button" className="btn btn-primary" onClick={onOpenDiscover}>
              Open explore feed
            </button>
            <button type="button" className="fashion-quiz-result__ghost" onClick={onBackToHub}>
              Try another quiz
            </button>
          </div>
        </section>

        <PlacedAdSlot adCodes={adCodes} placement="quiz_result_bottom" variant="section" />
      </div>
    </div>
  );
}
