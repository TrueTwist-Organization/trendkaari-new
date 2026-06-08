import React, { useMemo } from 'react';
import { ArrowRight, BookOpen, FolderOpen, HelpCircle, Sparkles } from 'lucide-react';
import ProductImage from './ProductImage';
import DiscoveryRail from './DiscoveryRail';
import PlacedAdSlot from './PlacedAdSlot';
import {
  buildEndlessDiscovery,
  countEndlessDiscoveryClicks,
  MIN_ENDLESS_CLICKS,
} from '../utils/endlessDiscoveryEngine';
import './EndlessDiscovery.css';
import './RecommendationRails.css';

export default function EndlessDiscovery({
  allProducts = [],
  product = null,
  category = null,
  article = null,
  knowledgePage = null,
  quizSlug = null,
  quizResult = null,
  onSelectProduct,
  onSelectCategory,
  onOpenArticle,
  onOpenKnowledgePage,
  onStartQuiz,
  adCodes = {},
  title = 'Keep exploring',
  subtitle = 'Similar picks, related collections, articles, quizzes, and trending — never a dead end.',
  variant = 'default',
  showIntro = true,
  showAds = true,
  compact = false,
  productsPerRail,
}) {
  const discovery = useMemo(
    () =>
      buildEndlessDiscovery({
        allProducts,
        product,
        category,
        article,
        knowledgePage,
        quizSlug,
        quizResult,
        productsPerRail: productsPerRail || (compact ? 8 : 10),
      }),
    [
      allProducts,
      product,
      category,
      article,
      knowledgePage,
      quizSlug,
      quizResult,
      productsPerRail,
      compact,
    ],
  );

  const clickCount = useMemo(() => countEndlessDiscoveryClicks(discovery), [discovery]);

  if (!discovery || clickCount < MIN_ENDLESS_CLICKS) return null;

  const handleReadingClick = (item) => {
    if (item.type === 'magazine') {
      if (onOpenArticle) onOpenArticle(item.categorySlug, item.slug);
      return;
    }
    if (onOpenKnowledgePage) onOpenKnowledgePage(item.slug);
  };

  return (
    <section className={`endless-discovery endless-discovery--${variant} recommendation-rails recommendation-rails--${variant}`}>
      {showIntro ? (
        <header className="recommendation-rails__intro endless-discovery__intro">
          <div>
            <p className="recommendation-rails__eyebrow endless-discovery__eyebrow">
              {clickCount}+ next clicks · no dead ends
            </p>
            <h2 className="recommendation-rails__title">{title}</h2>
            {subtitle ? <p className="recommendation-rails__sub">{subtitle}</p> : null}
          </div>
        </header>
      ) : null}

      <DiscoveryRail
        title={discovery.similarProducts.title}
        hook={discovery.similarProducts.hook}
        products={discovery.similarProducts.products}
        tone={discovery.similarProducts.tone}
        compact={compact}
        onSelectProduct={onSelectProduct}
        onSeeAll={() => onSelectCategory?.(discovery.similarProducts.category)}
      />

      <DiscoveryRail
        title={discovery.similarStyles.title}
        hook={discovery.similarStyles.hook}
        products={discovery.similarStyles.products}
        tone={discovery.similarStyles.tone}
        compact={compact}
        onSelectProduct={onSelectProduct}
        onSeeAll={() => onSelectCategory?.(discovery.similarStyles.category)}
      />

      {showAds && variant === 'product' ? (
        <PlacedAdSlot adCodes={adCodes} placement="product_before_suggestions" variant="pdp" />
      ) : null}

      <section className="endless-discovery__block endless-discovery__block--collections">
        <div className="endless-discovery__block-head">
          <span className="endless-discovery__block-icon" aria-hidden>
            <FolderOpen size={18} />
          </span>
          <div>
            <h3 className="endless-discovery__block-title">Related Collections</h3>
            <p className="endless-discovery__block-hook">
              Jump lanes — each collection opens a new rabbit hole
            </p>
          </div>
        </div>
        <div className="endless-discovery__collections-grid">
          {discovery.relatedCollections.map((col) => (
            <button
              key={col.category}
              type="button"
              className="endless-discovery__collection-card"
              onClick={() => onSelectCategory?.(col.category)}
            >
              <span className="endless-discovery__collection-label">{col.label}</span>
              <span className="endless-discovery__collection-hook">{col.hook}</span>
              <ArrowRight size={14} aria-hidden />
            </button>
          ))}
        </div>
      </section>

      <section className="endless-discovery__block endless-discovery__block--reading">
        <div className="endless-discovery__block-head">
          <span className="endless-discovery__block-icon" aria-hidden>
            <BookOpen size={18} />
          </span>
          <div>
            <h3 className="endless-discovery__block-title">Related Articles</h3>
            <p className="endless-discovery__block-hook">
              Read a story, shop the edit — knowledge that leads to more clicks
            </p>
          </div>
        </div>
        <div className="endless-discovery__reading-grid">
          {discovery.relatedReading.map((item) => (
            <button
              key={item.id}
              type="button"
              className="endless-discovery__reading-card"
              onClick={() => handleReadingClick(item)}
            >
              <div className="endless-discovery__reading-media">
                <ProductImage src={item.image} alt="" className="endless-discovery__reading-img" />
                <span className="endless-discovery__reading-tag">
                  {item.type === 'magazine' ? 'Magazine' : 'Guide'}
                </span>
              </div>
              <div className="endless-discovery__reading-body">
                <span className="endless-discovery__reading-meta">{item.readTime || '5 min read'}</span>
                <h4>{item.title}</h4>
                <p>{item.excerpt}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="endless-discovery__block endless-discovery__block--quizzes">
        <div className="endless-discovery__block-head">
          <span className="endless-discovery__block-icon" aria-hidden>
            <HelpCircle size={18} />
          </span>
          <div>
            <h3 className="endless-discovery__block-title">Related Quizzes</h3>
            <p className="endless-discovery__block-hook">
              Two minutes → personalized picks and your next scroll
            </p>
          </div>
        </div>
        <div className="endless-discovery__quiz-grid">
          {discovery.relatedQuizzes.map((quiz) => (
            <button
              key={quiz.slug}
              type="button"
              className="endless-discovery__quiz-card"
              style={{ '--quiz-accent': quiz.accent }}
              onClick={() => onStartQuiz?.(quiz.slug)}
            >
              <Sparkles size={16} aria-hidden />
              <span className="endless-discovery__quiz-title">{quiz.title}</span>
              <span className="endless-discovery__quiz-sub">{quiz.subtitle}</span>
              <span className="endless-discovery__quiz-meta">{quiz.steps} steps</span>
            </button>
          ))}
        </div>
      </section>

      {showAds && variant === 'product' ? (
        <PlacedAdSlot
          adCodes={adCodes}
          placement="product_suggestions_every_2"
          variant="pdp-suggestions-full"
        />
      ) : null}

      <DiscoveryRail
        title={discovery.trendingProducts.title}
        hook={discovery.trendingProducts.hook}
        products={discovery.trendingProducts.products}
        tone={discovery.trendingProducts.tone}
        compact={compact}
        onSelectProduct={onSelectProduct}
        onSeeAll={() => onSelectCategory?.(discovery.trendingProducts.category)}
      />

      {showAds && variant === 'product' ? (
        <PlacedAdSlot adCodes={adCodes} placement="product_after_suggestions" variant="pdp" />
      ) : null}
      {showAds && variant === 'category' ? (
        <PlacedAdSlot adCodes={adCodes} placement="category_after_grid" variant="container" />
      ) : null}
    </section>
  );
}
