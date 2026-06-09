import React, { useMemo } from 'react';
import {
  ArrowRight,
  BookOpen,
  Flame,
  Leaf,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';
import ProductImage from './ProductImage';
import PageBackButton from './PageBackButton';
import PageShell from './PageShell';
import {
  getMagazineCategories,
} from '../data/fashionMagazine';
import { buildMagazineHubSections } from '../utils/magazineEngine';
import './FashionMagazine.css';
import EndlessDiscovery from './EndlessDiscovery';

const CATEGORY_ICONS = {
  trending: TrendingUp,
  sparkles: Sparkles,
  star: Star,
  leaf: Leaf,
  flame: Flame,
  book: BookOpen,
};

function ArticleCard({ article, category, onOpenArticle }) {
  return (
    <button
      type="button"
      className="magazine-card"
      onClick={() => onOpenArticle?.(category.slug, article.slug)}
      aria-label={`Read ${article.title}`}
      data-journey-label={`Magazine: ${article.title}`}
    >
      <div className="magazine-card__media">
        <ProductImage src={article.image} alt="" className="magazine-card__img" />
        <span className="magazine-card__category">{category.title}</span>
      </div>
      <div className="magazine-card__body">
        <span className="magazine-card__meta">
          {article.readTime} · {article.publishedAt}
        </span>
        <h3 className="magazine-card__title">{article.title}</h3>
        <p className="magazine-card__excerpt">{article.excerpt}</p>
        <span className="magazine-card__cta">
          Read story
          <ArrowRight size={14} aria-hidden />
        </span>
      </div>
    </button>
  );
}

export default function FashionMagazineHub({
  onOpenCategory,
  onOpenArticle,
  onBack,
  products = [],
  onSelectProduct,
  onSelectCategory,
  onOpenKnowledgePage,
  onStartQuiz,
}) {
  const categories = getMagazineCategories();
  const { featured, latest } = useMemo(() => buildMagazineHubSections(), []);

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.slug, c])),
    [categories],
  );

  return (
    <PageShell
      className="fashion-magazine fashion-magazine--hub"
      variant="hub"
      eyebrow="Editorial"
      title="Fashion Magazine"
      subtitle="Trends, styling tips, celebrity looks, and buying guides — curated reads that lead to shop."
      top={
        <div className="container fashion-magazine__body">
          <PageBackButton onClick={onBack} label="Home" />
        </div>
      }
    >
      <div className="container fashion-magazine__body">
        <section className="fashion-magazine__categories">
          <div className="fashion-magazine__section-head">
            <h2>Browse by category</h2>
            <p>Six editorial lanes — pick your rabbit hole.</p>
          </div>
          <div className="fashion-magazine__category-grid">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.icon] || BookOpen;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  className="fashion-magazine__category-card"
                  style={{ '--mag-accent': cat.accent }}
                  onClick={() => onOpenCategory?.(cat.slug)}
                  aria-label={`Explore ${cat.title} — ${cat.tagline}`}
                  data-journey-label={`Magazine category: ${cat.title}`}
                >
                  <span className="fashion-magazine__category-icon">
                    <Icon size={20} aria-hidden />
                  </span>
                  <h3>{cat.title}</h3>
                  <p>{cat.tagline}</p>
                  <span className="fashion-magazine__category-link">
                    Explore
                    <ArrowRight size={14} aria-hidden />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="fashion-magazine__section">
          <div className="fashion-magazine__section-head">
            <h2>Editor&apos;s picks</h2>
            <p>Featured reads across the magazine.</p>
          </div>
          <div className="fashion-magazine__grid fashion-magazine__grid--featured">
            {featured.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                category={categoryMap[article.categorySlug]}
                onOpenArticle={onOpenArticle}
              />
            ))}
          </div>
        </section>

        <section className="fashion-magazine__section">
          <div className="fashion-magazine__section-head">
            <h2>Latest stories</h2>
            <p>Fresh from the editorial desk.</p>
          </div>
          <div className="fashion-magazine__grid fashion-magazine__grid--compact">
            {latest.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                category={categoryMap[article.categorySlug]}
                onOpenArticle={onOpenArticle}
              />
            ))}
          </div>
        </section>

        {products.length > 0 ? (
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
        ) : null}
      </div>
    </PageShell>
  );
}
