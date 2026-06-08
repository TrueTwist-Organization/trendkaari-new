import React, { useMemo } from 'react';
import { ArrowRight, ChevronRight, ShoppingBag } from 'lucide-react';
import PageBackButton from './PageBackButton';
import ProductImage from './ProductImage';
import DiscoveryRail from './DiscoveryRail';
import RecommendationRails from './RecommendationRails';
import DiscoveryLoopSection from './DiscoveryLoopSection';
import {
  getArticleBySlug,
  getCategoryBySlug,
  getMagazineCategories,
} from '../data/fashionMagazine';
import {
  getArticleShopProducts,
  getRelatedArticles,
} from '../utils/magazineEngine';
import { getDiscoveryContext } from '../utils/discoveryContext';
import './FashionMagazine.css';

function ArticleBlock({ block }) {
  if (block.type === 'paragraph') {
    return <p className="magazine-article__paragraph">{block.text}</p>;
  }
  if (block.type === 'heading') {
    return <h2 className="magazine-article__heading">{block.text}</h2>;
  }
  if (block.type === 'list') {
    return (
      <ul className="magazine-article__list">
        {block.items.map((item) => (
          <li key={item.slice(0, 40)}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === 'tip') {
    return (
      <aside className="magazine-article__tip">
        <strong>{block.title}</strong>
        <p>{block.text}</p>
      </aside>
    );
  }
  return null;
}

export default function FashionMagazineArticle({
  categorySlug,
  articleSlug,
  products = [],
  adCodes = {},
  onSelectProduct,
  onSelectCategory,
  onOpenArticle,
  onOpenCategory,
  onBackToCategory,
  onBackToHub,
  onBackToHome,
  onOpenKnowledgePage,
  onStartQuiz,
  onNavigate,
}) {
  const article = getArticleBySlug(categorySlug, articleSlug);
  const category = getCategoryBySlug(categorySlug);

  const shopProducts = useMemo(
    () => getArticleShopProducts(products, article),
    [products, article],
  );
  const related = useMemo(() => getRelatedArticles(article, 3), [article]);
  const discoveryCtx = useMemo(
    () => getDiscoveryContext(article?.shopCategory),
    [article],
  );

  if (!article || !category) {
    return (
      <div className="fashion-magazine container">
        <p>Story not found.</p>
        <button type="button" className="btn btn-primary" onClick={onBackToHub}>
          Back to magazine
        </button>
      </div>
    );
  }

  return (
    <div
      className="fashion-magazine fashion-magazine--article"
      style={{ '--mag-accent': category.accent }}
    >
      <div className="container fashion-magazine__article-wrap">
        <div className="fashion-magazine__article-top">
          <PageBackButton onClick={onBackToCategory || onBackToHub} />
        </div>

        <nav className="fashion-magazine__breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={onBackToHome}>Home</button>
          <ChevronRight size={14} aria-hidden />
          <button type="button" onClick={onBackToHub}>Magazine</button>
          <ChevronRight size={14} aria-hidden />
          <button type="button" onClick={() => onOpenCategory?.(categorySlug)}>
            {category.title}
          </button>
          <ChevronRight size={14} aria-hidden />
          <span>{article.title}</span>
        </nav>

        <header className="magazine-article__hero">
          <p className="fashion-magazine__eyebrow">
            {category.title}
            {article.celebrity ? ` · ${article.celebrity}` : ''}
          </p>
          <h1 className="magazine-article__title">{article.title}</h1>
          <p className="magazine-article__dek">{article.dek}</p>
          <p className="magazine-article__byline">
            {article.author} · {article.publishedAt} · {article.readTime}
          </p>
        </header>

        <figure className="magazine-article__figure">
          <ProductImage src={article.image} alt="" className="magazine-article__hero-img" />
        </figure>

        <div className="magazine-article__layout">
          <article className="magazine-article__content">
            {article.sections.map((section, index) => (
              <ArticleBlock key={`${section.type}-${index}`} block={section} />
            ))}

            <div className="magazine-article__shop-cta">
              <ShoppingBag size={18} aria-hidden />
              <div>
                <strong>Shop this story</strong>
                <p>Browse the {article.shopCategory} edit tied to this piece.</p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onSelectCategory?.(article.shopCategory)}
              >
                Open collection
                <ArrowRight size={16} aria-hidden />
              </button>
            </div>
          </article>

          <aside className="magazine-article__sidebar">
            <div className="magazine-article__sidebar-card">
              <h3>Related reads</h3>
              {related.map((rel) => {
                const relCat = getCategoryBySlug(rel.categorySlug);
                return (
                  <button
                    key={rel.id}
                    type="button"
                    className="magazine-article__related"
                    onClick={() => onOpenArticle?.(rel.categorySlug, rel.slug)}
                  >
                    <ProductImage src={rel.image} alt="" className="magazine-article__related-img" />
                    <div>
                      <span className="magazine-article__related-cat">{relCat?.title}</span>
                      <span className="magazine-article__related-title">{rel.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="magazine-article__sidebar-card">
              <h3>Categories</h3>
              <div className="magazine-article__cat-links">
                {getMagazineCategories().map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => onOpenCategory?.(cat.slug)}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {shopProducts.length ? (
        <div className="container">
          <DiscoveryRail
            title="Shop this story"
            hook={`Hand-picked ${article.shopCategory} from the edit`}
            products={shopProducts}
            tone="editorial"
            onSelectProduct={onSelectProduct}
            onSeeAll={() => onSelectCategory?.(article.shopCategory)}
          />
        </div>
      ) : null}

      {products.length ? (
        <RecommendationRails
          allProducts={products}
          category={article.shopCategory}
          article={article}
          onSelectProduct={onSelectProduct}
          onSelectCategory={onSelectCategory}
          onOpenArticle={onOpenArticle}
          onOpenKnowledgePage={onOpenKnowledgePage}
          onStartQuiz={onStartQuiz}
          adCodes={adCodes}
          variant="browse"
          title="Keep exploring"
          subtitle="Similar products, related collections, articles, quizzes, and trending picks."
          compact
          showAds={false}
        />
      ) : null}

      <DiscoveryLoopSection
        sourceContext="magazine_article"
        trendSlugs={discoveryCtx.trendSlugs}
        celebIds={discoveryCtx.celebIds}
        quizSlugs={discoveryCtx.quizSlugs}
        guideSlugs={discoveryCtx.guideSlugs}
        title="Where to go next"
        subtitle="Trends, celebrity looks, and guides related to this story"
        onNavigate={onNavigate}
        onStartQuiz={onStartQuiz}
        onOpenKnowledgePage={onOpenKnowledgePage}
      />
    </div>
  );
}
