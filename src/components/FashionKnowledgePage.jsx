import React, { useMemo, useEffect } from 'react';
import { ArrowRight, ChevronRight, FolderOpen, ShoppingBag, Sparkles, TrendingUp, Star } from 'lucide-react';
import PageBackButton from './PageBackButton';
import ProductImage from './ProductImage';
import DiscoveryRail from './DiscoveryRail';
import PlacedAdSlot from './PlacedAdSlot';
import RecommendationRails from './RecommendationRails';
import {
  getKnowledgePageBySlug,
  getKnowledgeTopics,
  getTopicBySlug,
} from '../data/fashionKnowledge';
import {
  getKnowledgeCollections,
  getKnowledgePageProducts,
  getRelatedKnowledgePages,
} from '../utils/knowledgeEngine';
import { CELEBRITY_LOOKS } from '../data/celebrityLooks';
import { getTrendPage } from '../data/trendPages';
import { FASHION_QUIZZES } from '../data/fashionQuizzes';
import { trackGuidePageViewed, trackRecommendationClicked } from '../utils/ga4';
import './FashionKnowledge.css';

function ContentBlock({ block }) {
  if (block.type === 'paragraph') {
    return <p className="knowledge-page__paragraph">{block.text}</p>;
  }
  if (block.type === 'heading') {
    return <h2 className="knowledge-page__heading">{block.text}</h2>;
  }
  if (block.type === 'list') {
    return (
      <ul className="knowledge-page__list">
        {block.items.map((item) => (
          <li key={item.slice(0, 40)}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === 'tip') {
    return (
      <aside className="knowledge-page__tip">
        <strong>{block.title}</strong>
        <p>{block.text}</p>
      </aside>
    );
  }
  return null;
}

export default function FashionKnowledgePage({
  pageSlug,
  products = [],
  adCodes = {},
  onSelectProduct,
  onSelectCategory,
  onOpenPage,
  onBackToHub,
  onBackToHome,
  onOpenArticle,
  onStartQuiz,
  onNavigate,
}) {
  const page = getKnowledgePageBySlug(pageSlug);
  const topic = getTopicBySlug(page?.topicSlug);

  const shopProducts = useMemo(
    () => getKnowledgePageProducts(products, page),
    [products, page],
  );
  const collections = useMemo(() => getKnowledgeCollections(page), [page]);
  const related = useMemo(() => getRelatedKnowledgePages(page, 3), [page]);

  useEffect(() => {
    if (page) trackGuidePageViewed(page.slug, page.title, page.topicSlug);
  }, [pageSlug, page]);

  const relatedTrends = useMemo(
    () => (page?.relatedTrends || []).map((slug) => getTrendPage(slug)).filter(Boolean),
    [page],
  );
  const relatedCelebs = useMemo(
    () =>
      (page?.relatedCelebrityIds || [])
        .map((id) => CELEBRITY_LOOKS.find((l) => l.id === id))
        .filter(Boolean),
    [page],
  );
  const relatedQuizzes = useMemo(
    () =>
      (page?.relatedQuizSlugs || [])
        .map((slug) => FASHION_QUIZZES[slug])
        .filter(Boolean),
    [page],
  );

  if (!page) {
    return (
      <div className="fashion-knowledge container">
        <p>Guide not found.</p>
        <button type="button" className="btn btn-primary" onClick={onBackToHub}>
          Back to knowledge hub
        </button>
      </div>
    );
  }

  return (
    <div
      className="fashion-knowledge fashion-knowledge--page"
      style={{ '--know-accent': topic?.accent || '#600b45' }}
    >
      <div className="container fashion-knowledge__page-wrap">
        <div className="fashion-knowledge__page-top">
          <PageBackButton onClick={onBackToHub} />
        </div>

        <nav className="fashion-knowledge__breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={onBackToHome}>Home</button>
          <ChevronRight size={14} aria-hidden />
          <button type="button" onClick={onBackToHub}>Fashion Knowledge</button>
          <ChevronRight size={14} aria-hidden />
          <button type="button" onClick={onBackToHub}>{topic?.title || 'Guides'}</button>
          <ChevronRight size={14} aria-hidden />
          <span>{page.title}</span>
        </nav>

        <div className="knowledge-page__layout">
          <div className="knowledge-page__main">
            <header className="knowledge-page__intro">
              <p className="fashion-knowledge__eyebrow">{topic?.title || 'Guide'}</p>
              <h1 className="knowledge-page__title">{page.title}</h1>
              <p className="knowledge-page__dek">{page.dek}</p>
              <p className="knowledge-page__meta">{page.readTime}</p>
              {page.tags?.length ? (
                <div className="knowledge-page__tags" aria-label="Guide tags">
                  {page.tags.map((tag) => (
                    <span key={tag} className="knowledge-page__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>

            <figure className="knowledge-page__figure">
              <ProductImage src={page.image} alt={page.title} className="knowledge-page__hero-img" />
            </figure>

            <article className="knowledge-page__content">
              {page.sections.map((section, index) => (
                <ContentBlock key={`${section.type}-${index}`} block={section} />
              ))}

              <section className="knowledge-page__collections">
                <div className="knowledge-page__collections-head">
                  <FolderOpen size={18} aria-hidden />
                  <div>
                    <h2>Explore related collections</h2>
                    <p>Shop the categories this guide references.</p>
                  </div>
                </div>
                <div className="knowledge-page__collection-grid">
                  {collections.map((col) => (
                    <button
                      key={`${col.category}-${col.label}`}
                      type="button"
                      className="knowledge-page__collection-card"
                      onClick={() => onSelectCategory?.(col.category)}
                    >
                      <span className="knowledge-page__collection-label">{col.label}</span>
                      <span className="knowledge-page__collection-cta">
                        Open collection
                        <ArrowRight size={14} aria-hidden />
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <div className="knowledge-page__shop-cta">
                <ShoppingBag size={18} aria-hidden />
                <div>
                  <strong>Shop picks for this guide</strong>
                  <p>Products matched to {page.title.toLowerCase()}.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onSelectCategory?.(page.shopCategory)}
                >
                  Browse {page.shopCategory}
                  <ArrowRight size={16} aria-hidden />
                </button>
              </div>
            </article>
          </div>

          <aside className="knowledge-page__sidebar">
            <div className="knowledge-page__sidebar-card">
              <h3>Related guides</h3>
              {related.map((rel) => {
                const relTopic = getTopicBySlug(rel.topicSlug);
                return (
                  <button
                    key={rel.id}
                    type="button"
                    className="knowledge-page__related"
                    onClick={() => onOpenPage?.(rel.slug)}
                  >
                    <ProductImage src={rel.image} alt={rel.title} className="knowledge-page__related-img" />
                    <div>
                      <span className="knowledge-page__related-topic">{relTopic?.title}</span>
                      <span className="knowledge-page__related-title">{rel.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="knowledge-page__sidebar-card">
              <h3>Topics</h3>
              <div className="knowledge-page__topic-links">
                {getKnowledgeTopics().map((t) => (
                  <button
                    key={t.slug}
                    type="button"
                    className={`knowledge-page__topic-link${t.slug === page.topicSlug ? ' is-active' : ''}`}
                    onClick={onBackToHub}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
              <button type="button" className="fashion-knowledge__back" onClick={onBackToHub}>
                View all guides
              </button>
            </div>
          </aside>
        </div>
      </div>

      <div className="container">
        <PlacedAdSlot adCodes={adCodes} placement="knowledge_page_mid" variant="section" />
      </div>

      {relatedTrends.length > 0 ? (
        <div className="container knowledge-discover-section">
          <div className="knowledge-discover-section__head">
            <TrendingUp size={18} aria-hidden />
            <div>
              <h2 className="knowledge-discover-section__title">Trending right now</h2>
              <p className="knowledge-discover-section__sub">
                See how this guide plays out in current fashion trends
              </p>
            </div>
          </div>
          <div className="knowledge-trends-grid">
            {relatedTrends.map((trend) => (
              <button
                key={trend.slug}
                type="button"
                className="knowledge-trend-card"
                onClick={() => {
                  trackRecommendationClicked('trend', trend.slug, trend.title, 'knowledge_page');
                  onNavigate?.(`/trends/${trend.slug}`);
                }}
              >
                <div className="knowledge-trend-card__img-wrap">
                  <img
                    src={trend.heroImage}
                    alt={trend.title}
                    className="knowledge-trend-card__img"
                    loading="lazy"
                    decoding="async"
                    width="300"
                    height="200"
                  />
                  <div
                    className="knowledge-trend-card__badge"
                    style={{ background: trend.accent || '#600b45' }}
                  >
                    Trending
                  </div>
                </div>
                <div className="knowledge-trend-card__body">
                  <p className="knowledge-trend-card__title">{trend.title}</p>
                  <p className="knowledge-trend-card__sub">{trend.subtitle}</p>
                  <span className="knowledge-trend-card__cta">
                    Explore trend <ArrowRight size={13} aria-hidden />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {relatedCelebs.length > 0 ? (
        <div className="container knowledge-discover-section">
          <div className="knowledge-discover-section__head">
            <Star size={18} aria-hidden />
            <div>
              <h2 className="knowledge-discover-section__title">See it in action</h2>
              <p className="knowledge-discover-section__sub">
                Celebrity looks that bring this guide to life
              </p>
            </div>
          </div>
          <div className="knowledge-celeb-grid">
            {relatedCelebs.map((look) => (
              <button
                key={look.id}
                type="button"
                className="knowledge-celeb-card"
                onClick={() => {
                  trackRecommendationClicked('celeb', look.id, look.title, 'knowledge_page');
                  onNavigate?.(`/celebrity-match/${look.id}`);
                }}
              >
                <div className="knowledge-celeb-card__img-wrap">
                  <img
                    src={look.image}
                    alt={look.celebrity}
                    className="knowledge-celeb-card__img"
                    loading="lazy"
                    decoding="async"
                    width="260"
                    height="340"
                  />
                </div>
                <div className="knowledge-celeb-card__body">
                  <p className="knowledge-celeb-card__name">{look.celebrity}</p>
                  <p className="knowledge-celeb-card__title">{look.title}</p>
                  <p className="knowledge-celeb-card__ctx">{look.context}</p>
                  <span className="knowledge-celeb-card__cta">
                    View look <ArrowRight size={12} aria-hidden />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {relatedQuizzes.length > 0 ? (
        <div className="container knowledge-discover-section">
          <div className="knowledge-discover-section__head">
            <Sparkles size={18} aria-hidden />
            <div>
              <h2 className="knowledge-discover-section__title">Test your knowledge</h2>
              <p className="knowledge-discover-section__sub">
                Quick quizzes built around this guide&apos;s topics
              </p>
            </div>
          </div>
          <div className="knowledge-quiz-grid">
            {relatedQuizzes.map((quiz) => (
              <button
                key={quiz.slug}
                type="button"
                className="knowledge-quiz-card"
                onClick={() => {
                  trackRecommendationClicked('quiz', quiz.slug, quiz.title, 'knowledge_page');
                  onStartQuiz?.(quiz.slug);
                }}
              >
                <Sparkles size={22} className="knowledge-quiz-card__icon" aria-hidden />
                <p className="knowledge-quiz-card__title">{quiz.title}</p>
                <p className="knowledge-quiz-card__sub">{quiz.subtitle}</p>
                <span className="knowledge-quiz-card__cta">
                  Start quiz <ArrowRight size={13} aria-hidden />
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {shopProducts.length ? (
        <div className="container knowledge-page__shop-rail">
          <DiscoveryRail
            title="Products for this guide"
            hook="Hand-picked from categories mentioned above — tap to explore"
            products={shopProducts}
            tone="editorial"
            onSelectProduct={onSelectProduct}
            onSeeAll={() => onSelectCategory?.(page.shopCategory)}
          />
        </div>
      ) : null}

      {products.length ? (
        <RecommendationRails
          allProducts={products}
          category={page.shopCategory}
          knowledgePage={page}
          onSelectProduct={onSelectProduct}
          onSelectCategory={onSelectCategory}
          onOpenArticle={onOpenArticle}
          onOpenKnowledgePage={onOpenPage}
          onStartQuiz={onStartQuiz}
          adCodes={adCodes}
          variant="browse"
          title="Keep exploring"
          subtitle="Similar products, related collections, articles, quizzes, and trending picks."
          compact
          showAds={false}
        />
      ) : null}

      <div className="container">
        <PlacedAdSlot adCodes={adCodes} placement="knowledge_page_bottom" variant="section" />
      </div>
    </div>
  );
}
