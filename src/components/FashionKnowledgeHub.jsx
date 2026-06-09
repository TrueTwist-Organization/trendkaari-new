import React, { useMemo, useEffect, useState } from 'react';
import { ArrowRight, BookMarked } from 'lucide-react';
import PageBackButton from './PageBackButton';
import PageShell from './PageShell';
import ProductImage from './ProductImage';
import DiscoveryLoopSection from './DiscoveryLoopSection';
import { getKnowledgeTopics } from '../data/fashionKnowledge';
import { fetchKnowledgePages } from '../utils/editorialContentData';
import { ensureUniqueGuideImages } from '../utils/guideImages';
import './FashionKnowledge.css';

function KnowledgeCard({ page, topic, onOpenPage }) {
  return (
    <button
      type="button"
      className="knowledge-card"
      onClick={() => onOpenPage?.(page.slug)}
      style={{ '--know-accent': topic?.accent || '#600b45' }}
    >
      <div className="knowledge-card__media">
        <ProductImage src={page.image} alt={page.title} className="knowledge-card__img" />
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
  onStartQuiz,
  onNavigate,
}) {
  const topics = getKnowledgeTopics();
  const [allPages, setAllPages] = useState([]);

  useEffect(() => {
    fetchKnowledgePages().then(setAllPages);
  }, []);

  const featured = useMemo(() => {
    const featuredList = allPages.filter((p) => p.featured);
    const rest = allPages.filter((p) => !p.featured);
    return ensureUniqueGuideImages([...featuredList, ...rest].slice(0, 8), 4);
  }, [allPages]);

  const featuredIds = useMemo(() => new Set(featured.map((p) => p.id)), [featured]);

  const topicMap = useMemo(
    () => Object.fromEntries(topics.map((t) => [t.slug, t])),
    [topics],
  );

  const loopGuides = useMemo(
    () => featured.map((p) => p.slug).slice(0, 6),
    [featured],
  );

  return (
    <PageShell
      className="fashion-knowledge fashion-knowledge--hub"
      variant="hub"
      eyebrow="Style guides"
      title="Fashion Knowledge"
      subtitle="Expert guides on fabrics, fits, occasions, and how to shop smarter."
      top={
        <div className="container fashion-knowledge__body">
          <PageBackButton onClick={onBack} label="Home" />
        </div>
      }
    >
      <div className="container fashion-knowledge__body">
        <section className="fashion-knowledge__section fashion-knowledge__section--featured">
          <div className="fashion-knowledge__section-head">
            <BookMarked size={18} aria-hidden />
            <div>
              <h2>Start here</h2>
              <p>Most-read reference guides — pick any card to begin.</p>
            </div>
          </div>
          <div className="fashion-knowledge__grid fashion-knowledge__grid--featured">
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
          const pages = ensureUniqueGuideImages(
            allPages.filter((p) => p.topicSlug === topic.slug && !featuredIds.has(p.id)),
            3,
          );
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
              <div className="fashion-knowledge__grid fashion-knowledge__grid--topic">
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
      </div>

      <DiscoveryLoopSection
        sourceContext="knowledge_hub"
        guideSlugs={loopGuides}
        trendSlugs={['festival-fashion', 'wedding-fashion', 'summer-fashion']}
        celebIds={['kiara-festive', 'deepika-airport']}
        quizSlugs={['outfit-finder', 'festival-look']}
        title="Keep exploring"
        subtitle="Trends, celebrity looks, quizzes, and more style guides"
        onNavigate={onNavigate}
        onStartQuiz={onStartQuiz}
        onOpenKnowledgePage={onOpenPage}
      />
    </PageShell>
  );
}
