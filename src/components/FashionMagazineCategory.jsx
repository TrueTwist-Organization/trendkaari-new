import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductImage from './ProductImage';
import { buildCategoryPageData } from '../utils/magazineEngine';
import './FashionMagazine.css';
import EndlessDiscovery from './EndlessDiscovery';

export default function FashionMagazineCategory({
  categorySlug,
  onOpenArticle,
  onBackToHub,
  onBackToHome,
  products = [],
  onSelectProduct,
  onSelectCategory,
  onOpenKnowledgePage,
  onStartQuiz,
}) {
  const data = buildCategoryPageData(categorySlug);

  if (!data) {
    return (
      <div className="fashion-magazine container">
        <p>Category not found.</p>
        <button type="button" className="btn btn-primary" onClick={onBackToHub}>
          Back to magazine
        </button>
      </div>
    );
  }

  const { category, articles } = data;

  return (
    <div
      className="fashion-magazine fashion-magazine--category"
      style={{ '--mag-accent': category.accent }}
    >
      <header className="fashion-magazine__category-hero">
        <div className="container">
          <nav className="fashion-magazine__breadcrumb" aria-label="Breadcrumb">
            <button type="button" onClick={onBackToHome}>Home</button>
            <ChevronRight size={14} aria-hidden />
            <button type="button" onClick={onBackToHub}>Magazine</button>
            <ChevronRight size={14} aria-hidden />
            <span>{category.title}</span>
          </nav>
          <p className="fashion-magazine__eyebrow">{category.tagline}</p>
          <h1 className="fashion-magazine__title">{category.title}</h1>
          <p className="fashion-magazine__subtitle">{category.description}</p>
          <p className="fashion-magazine__count">{articles.length} stories</p>
        </div>
      </header>

      <div className="container fashion-magazine__body">
        <div className="fashion-magazine__grid">
          {articles.map((article) => (
            <button
              key={article.id}
              type="button"
              className="magazine-card"
              onClick={() => onOpenArticle?.(categorySlug, article.slug)}
            >
              <div className="magazine-card__media">
                <ProductImage src={article.image} alt="" className="magazine-card__img" />
                {article.featured ? (
                  <span className="magazine-card__badge">Featured</span>
                ) : null}
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
          ))}
        </div>

        <aside className="fashion-magazine__category-nav">
          <h3>More categories</h3>
          <div className="fashion-magazine__category-links">
            <button type="button" className="fashion-magazine__back" onClick={onBackToHub}>
              <ChevronLeft size={16} />
              All magazine
            </button>
          </div>
        </aside>

        {products.length > 0 ? (
          <EndlessDiscovery
            allProducts={products}
            category={articles[0]?.shopCategory || 'kurtas'}
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
    </div>
  );
}
