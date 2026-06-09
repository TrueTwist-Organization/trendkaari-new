/**
 * DiscoveryLoopSection
 *
 * Universal "Continue Exploring" strip used at the bottom of every destination
 * page. Prevents user exits by offering 8+ curated next-click opportunities
 * across four content types: Trends, Celebrity Looks, Quizzes, Style Guides.
 *
 * Mobile-first. Horizontal scroll on mobile. Grid on desktop.
 * No heavy animations. Zero external dependencies.
 */
import React, { useMemo } from 'react';
import { ArrowRight, TrendingUp, Star, Sparkles, BookOpen } from 'lucide-react';
import ProductImage from './ProductImage';
import { CELEBRITY_LOOKS } from '../data/celebrityLooks';
import { getTrendPage } from '../data/trendPages';
import { FASHION_QUIZZES } from '../data/fashionQuizzes';
import { getKnowledgePageBySlug } from '../data/fashionKnowledge';
import { trackRecommendationClicked } from '../utils/ga4';
import './DiscoveryLoopSection.css';

const TYPE_META = {
  trend: { Icon: TrendingUp, label: 'Trend', color: '#1565c0' },
  celeb: { Icon: Star, label: 'Celebrity Look', color: '#600b45' },
  quiz: { Icon: Sparkles, label: 'Quiz', color: '#880e4f' },
  guide: { Icon: BookOpen, label: 'Style Guide', color: '#e65100' },
};

function LoopCard({ type, image, title, subtitle, onClick }) {
  const { Icon, label, color } = TYPE_META[type];
  const hasImage = Boolean(image);

  return (
    <button
      type="button"
      className={`disc-loop__card disc-loop__card--${type}`}
      onClick={onClick}
      style={{ '--card-accent': color }}
    >
      <div className="disc-loop__card-media">
        {hasImage ? (
          <ProductImage
            src={image}
            alt={title}
            className="disc-loop__card-img"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="disc-loop__card-no-img" aria-hidden="true">
            <Icon size={32} />
          </div>
        )}
        <span className="disc-loop__card-badge">
          <Icon size={10} aria-hidden="true" />
          {label}
        </span>
      </div>
      <div className="disc-loop__card-body">
        <p className="disc-loop__card-title">{title}</p>
        {subtitle && <p className="disc-loop__card-sub">{subtitle}</p>}
        <span className="disc-loop__card-cta">
          Explore
          <ArrowRight size={12} aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}

/**
 * @param {object} props
 * @param {string[]}  props.trendSlugs        — up to 3 trend slugs
 * @param {string[]}  props.celebIds          — up to 3 celebrity look IDs
 * @param {string[]}  props.quizSlugs         — up to 2 quiz slugs
 * @param {string[]}  props.guideSlugs        — up to 2 knowledge guide slugs
 * @param {string}    props.title             — section heading
 * @param {string}    props.subtitle          — section subheading
 * @param {string}    [props.excludeType]     — skip one card type ('trend'|'celeb'|'quiz'|'guide')
 * @param {string}    [props.sourceContext]   — page name for analytics ('product_detail' etc.)
 * @param {Function}  props.onNavigate        — navigates to any internal path
 * @param {Function}  props.onStartQuiz       — launches a quiz by slug
 * @param {Function}  props.onOpenKnowledgePage — opens a knowledge page by slug
 */
export default function DiscoveryLoopSection({
  trendSlugs = [],
  celebIds = [],
  quizSlugs = [],
  guideSlugs = [],
  excludeType = null,
  sourceContext = 'unknown',
  title = 'Continue exploring',
  subtitle = 'Every tap opens a new dimension of your style journey',
  onNavigate,
  onStartQuiz,
  onOpenKnowledgePage,
}) {
  const items = useMemo(() => {
    const result = [];

    if (excludeType !== 'trend') {
      for (const slug of trendSlugs.slice(0, 3)) {
        const trend = getTrendPage(slug);
        if (trend) {
          result.push({
            key: `trend-${slug}`,
            type: 'trend',
            image: trend.heroImage,
            title: trend.title,
            subtitle: trend.tagline,
            onClick: () => {
              trackRecommendationClicked('trend', slug, trend.title, sourceContext);
              onNavigate?.(`/trends/${slug}`);
            },
          });
        }
      }
    }

    if (excludeType !== 'celeb') {
      for (const id of celebIds.slice(0, 3)) {
        const look = CELEBRITY_LOOKS.find((l) => l.id === id);
        if (look) {
          result.push({
            key: `celeb-${id}`,
            type: 'celeb',
            image: look.image,
            title: look.celebrity,
            subtitle: look.title,
            onClick: () => {
              trackRecommendationClicked('celeb', id, look.title, sourceContext);
              onNavigate?.(`/celebrity-match/${id}`);
            },
          });
        }
      }
    }

    if (excludeType !== 'quiz') {
      for (const slug of quizSlugs.slice(0, 2)) {
        const quiz = FASHION_QUIZZES[slug];
        if (quiz) {
          result.push({
            key: `quiz-${slug}`,
            type: 'quiz',
            image: quiz.coverImage || null,
            title: quiz.title,
            subtitle: quiz.subtitle,
            onClick: () => {
              trackRecommendationClicked('quiz', slug, quiz.title, sourceContext);
              onStartQuiz?.(slug);
            },
          });
        }
      }
    }

    if (excludeType !== 'guide') {
      for (const slug of guideSlugs.slice(0, 2)) {
        const guide = getKnowledgePageBySlug(slug);
        if (guide) {
          result.push({
            key: `guide-${slug}`,
            type: 'guide',
            image: guide.image,
            title: guide.title,
            subtitle: guide.dek,
            onClick: () => {
              trackRecommendationClicked('guide', slug, guide.title, sourceContext);
              onOpenKnowledgePage?.(slug);
            },
          });
        }
      }
    }

    return result;
  }, [trendSlugs, celebIds, quizSlugs, guideSlugs, excludeType, sourceContext, onNavigate, onStartQuiz, onOpenKnowledgePage]);

  if (items.length === 0) return null;

  return (
    <section className="disc-loop" aria-label="Continue exploring">
      <div className="container disc-loop__inner">
        <div className="disc-loop__head">
          <h2 className="disc-loop__title">{title}</h2>
          <p className="disc-loop__subtitle">{subtitle}</p>
        </div>
        <div className="disc-loop__rail" role="list" aria-label="Explore more content">
          {items.map(({ key, ...cardProps }) => (
            <div key={key} role="listitem">
              <LoopCard {...cardProps} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
