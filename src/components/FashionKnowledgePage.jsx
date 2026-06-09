import React, { useMemo, useEffect } from 'react';
import {
  ArrowRight,
  Banknote,
  ChevronRight,
  FolderOpen,
  RotateCcw,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import PageBackButton from './PageBackButton';
import ProductImage from './ProductImage';
import DiscoveryRail from './DiscoveryRail';
import DiscoveryLoopSection from './DiscoveryLoopSection';
import PlacedAdSlot from './PlacedAdSlot';
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
import { trackGuidePageViewed } from '../utils/ga4';
import './FashionKnowledge.css';

function ContentBlock({ block, isLead }) {
  if (block.type === 'paragraph') {
    return (
      <p className={`knowledge-page__paragraph${isLead ? ' knowledge-page__paragraph--lead' : ''}`}>
        {block.text}
      </p>
    );
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
  onStartQuiz,
  onNavigate,
}) {
  const page = getKnowledgePageBySlug(pageSlug);
  const topic = getTopicBySlug(page?.topicSlug);

  const shopProducts = useMemo(
    () => getKnowledgePageProducts(products, page).slice(0, 10),
    [products, page],
  );
  const collections = useMemo(() => getKnowledgeCollections(page), [page]);
  const related = useMemo(() => getRelatedKnowledgePages(page, 4), [page]);

  const loopGuides = useMemo(
    () => related.map((rel) => rel.slug).filter((slug) => slug !== page?.slug),
    [related, page?.slug],
  );

  useEffect(() => {
    if (page) trackGuidePageViewed(page.slug, page.title, page.topicSlug);
  }, [pageSlug, page]);

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

  const firstParagraphIndex = page.sections.findIndex((s) => s.type === 'paragraph');

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
                <ContentBlock
                  key={`${section.type}-${index}`}
                  block={section}
                  isLead={section.type === 'paragraph' && index === firstParagraphIndex}
                />
              ))}

              <div className="knowledge-page__trust" aria-label="Shopping benefits">
                <div className="knowledge-page__trust-item">
                  <span className="knowledge-page__trust-icon" aria-hidden>
                    <Truck size={18} strokeWidth={2.25} />
                  </span>
                  <div>
                    <strong>Free Shipping</strong>
                    <span>On all orders across India</span>
                  </div>
                </div>
                <div className="knowledge-page__trust-item">
                  <span className="knowledge-page__trust-icon knowledge-page__trust-icon--cod" aria-hidden>
                    <Banknote size={18} strokeWidth={2.25} />
                  </span>
                  <div>
                    <strong>Cash on Delivery</strong>
                    <span>Pay when your order arrives</span>
                  </div>
                </div>
                <div className="knowledge-page__trust-item">
                  <span className="knowledge-page__trust-icon" aria-hidden>
                    <RotateCcw size={18} strokeWidth={2.25} />
                  </span>
                  <div>
                    <strong>Easy Returns</strong>
                    <span>Hassle-free exchange policy</span>
                  </div>
                </div>
              </div>

              <section className="knowledge-page__collections">
                <div className="knowledge-page__collections-head">
                  <FolderOpen size={18} aria-hidden />
                  <div>
                    <h2>Shop related collections</h2>
                    <p>Categories referenced in this guide.</p>
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
            </article>
          </div>

          <aside className="knowledge-page__sidebar">
            <div className="knowledge-page__sidebar-card knowledge-page__sidebar-card--shop">
              <ProductImage src={page.image} alt="" className="knowledge-page__sidebar-preview" />
              <h3>Shop this guide</h3>
              <p>Browse {page.shopCategory} picks inspired by {page.title.toLowerCase()}.</p>
              <button
                type="button"
                className="btn btn-primary knowledge-page__sidebar-shop-btn"
                onClick={() => onSelectCategory?.(page.shopCategory)}
              >
                <ShoppingBag size={16} aria-hidden />
                Browse {page.shopCategory}
              </button>
            </div>

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

            {collections.length > 0 ? (
              <div className="knowledge-page__sidebar-card">
                <h3>Quick shop</h3>
                <div className="knowledge-page__sidebar-collections">
                  {collections.map((col) => (
                    <button
                      key={`sidebar-${col.category}`}
                      type="button"
                      className="knowledge-page__sidebar-collection"
                      onClick={() => onSelectCategory?.(col.category)}
                    >
                      {col.label}
                      <ArrowRight size={13} aria-hidden />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

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

      <div className="knowledge-page__below-fold">
        <div className="container">
          <PlacedAdSlot adCodes={adCodes} placement="knowledge_page_mid" variant="section" />
        </div>

        {shopProducts.length ? (
          <div className="container knowledge-page__shop-rail">
            <DiscoveryRail
              title={`Shop ${page.title.replace(/^What is /i, '').replace(/\?$/, '') || page.title}`}
              hook={`Curated ${page.shopCategory} — hand-picked for this guide`}
              products={shopProducts}
              tone="editorial"
              compact
              onSelectProduct={onSelectProduct}
              onSeeAll={() => onSelectCategory?.(page.shopCategory)}
            />
          </div>
        ) : null}

        <DiscoveryLoopSection
          sourceContext="knowledge_page"
          trendSlugs={page.relatedTrends || []}
          celebIds={page.relatedCelebrityIds || []}
          quizSlugs={page.relatedQuizSlugs || []}
          guideSlugs={loopGuides}
          title="Where to go next"
          subtitle="Trends, celebrity looks, quizzes, and guides connected to this topic"
          onNavigate={onNavigate}
          onStartQuiz={onStartQuiz}
          onOpenKnowledgePage={onOpenPage}
        />

        <div className="container">
          <PlacedAdSlot adCodes={adCodes} placement="knowledge_page_bottom" variant="section" />
        </div>
      </div>
    </div>
  );
}
