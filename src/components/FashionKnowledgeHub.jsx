import React, { useMemo } from 'react';
import { ArrowRight, BookMarked, ChevronLeft, GraduationCap } from 'lucide-react';
import ProductImage from './ProductImage';
import {
  getAllKnowledgePages,
  getFeaturedKnowledgePages,
  getKnowledgeTopics,
  getKnowledgePagesByTopic,
} from '../data/fashionKnowledge';
import './FashionKnowledge.css';
import EndlessDiscovery from './EndlessDiscovery';

function KnowledgeCard({ page, topic, onOpenPage }) {
  return (
    <button type="button" className="knowledge-card" onClick={() => onOpenPage?.(page.slug)}>
      <div className="knowledge-card__media">
        <ProductImage src={page.image} alt="" className="knowledge-card__img" />
        <span className="knowledge-card__topic">{topic?.title}</span>
      </div>
      <div className="knowledge-card__body">
        <span className="knowledge-card__meta">{page.readTime}</span>
        <h3 className="knowledge-card__title">{page.title}</h3>
        <p className="knowledge-card__excerpt">{page.excerpt}</p>
        <span className="knowledge-card__cta">
          Read guide
          <ArrowRight size={14} aria-hidden />
        </span>
      </div>
    </button>
  );
}

export default function FashionKnowledgeHub({
  onOpenPage,
  onBack,
  products = [],
  onSelectProduct,
  onSelectCategory,
  onOpenArticle,
  onStartQuiz,
}) {
  const topics = getKnowledgeTopics();
  const featured = useMemo(() => getFeaturedKnowledgePages(5), []);
  const allPages = getAllKnowledgePages();

  const topicMap = useMemo(
    () => Object.fromEntries(topics.map((t) => [t.slug, t])),
    [topics],
  );

  return (
    <div className="fashion-knowledge fashion-knowledge--hub">
      <header className="fashion-knowledge__hero">
        <div className="container">
          <button type="button" className="fashion-knowledge__back" onClick={onBack}>
            <ChevronLeft size={18} />
            Home
          </button>
          <span className="fashion-knowledge__badge">
            <GraduationCap size={14} aria-hidden />
            Fashion Knowledge
          </span>
          <h1 className="fashion-knowledge__title">Learn before you shop</h1>
          <p className="fashion-knowledge__subtitle">
            Silhouettes, fabrics, garment types, and colour — every guide links naturally to
            products and collections you can explore next.
          </p>
        </div>
      </header>

      <div className="container fashion-knowledge__body">
        <section className="fashion-knowledge__section">
          <div className="fashion-knowledge__section-head">
            <BookMarked size={18} aria-hidden />
            <div>
              <h2>Start here</h2>
              <p>Most-read reference guides.</p>
            </div>
          </div>
          <div className="fashion-knowledge__grid">
            {featured.map((page) => (
              <KnowledgeCard
                key={page.id}
                page={page}
                topic={topicMap[page.topicSlug]}
                onOpenPage={onOpenPage}
              />
            ))}
          </div>
        </section>

        {topics.map((topic) => {
          const pages = getKnowledgePagesByTopic(topic.slug);
          if (!pages.length) return null;
          return (
            <section key={topic.slug} className="fashion-knowledge__section">
              <div
                className="fashion-knowledge__topic-head"
                style={{ '--know-accent': topic.accent }}
              >
                <h2>{topic.title}</h2>
                <p>{topic.description}</p>
              </div>
              <div className="fashion-knowledge__grid fashion-knowledge__grid--compact">
                {pages.map((page) => (
                  <KnowledgeCard
                    key={page.id}
                    page={page}
                    topic={topic}
                    onOpenPage={onOpenPage}
                  />
                ))}
              </div>
            </section>
          );
        })}

        <p className="fashion-knowledge__count">{allPages.length} guides · updated regularly</p>

        {products.length > 0 ? (
          <EndlessDiscovery
            allProducts={products}
            category="kurtas"
            onSelectProduct={onSelectProduct}
            onSelectCategory={onSelectCategory}
            onOpenArticle={onOpenArticle}
            onOpenKnowledgePage={onOpenPage}
            onStartQuiz={onStartQuiz}
            variant="browse"
            title="Endless discovery"
            subtitle="Similar products, related collections, articles, quizzes, and trending picks."
            compact
            showAds={false}
          />
        ) : null}
      </div>
    </div>
  );
}
