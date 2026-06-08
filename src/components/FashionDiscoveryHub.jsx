import { ArrowRight, BookOpen, GraduationCap, HelpCircle, Sparkles, Star } from 'lucide-react';
import ProductImage from './ProductImage';
import { DISCOVERY_HUB_BLOCKS } from '../data/fashionDiscoveryHub';
import './FashionDiscoveryHub.css';

const KIND_LABELS = {
  quiz: 'Quiz',
  match: 'Match',
  articles: 'Magazine',
  guides: 'Guides',
};

export function DiscoveryTeaser({ block, onNavigate }) {
  if (!block) return null;

  const Icon =
    block.kind === 'articles'
      ? BookOpen
      : block.kind === 'guides'
        ? GraduationCap
        : block.kind === 'match'
          ? Star
          : HelpCircle;

  return (
    <section className="discovery-teaser container" id={`teaser-${block.id}`}>
      <button
        type="button"
        className="discovery-teaser__banner"
        style={{ '--teaser-accent': block.accent }}
        onClick={() => onNavigate?.(block.route)}
        data-journey-label={block.title}
      >
        <div className="discovery-teaser__copy">
          <span className="discovery-teaser__meta">
            <Icon size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            {KIND_LABELS[block.kind] || 'Discover'}
            {block.steps ? ` · ${block.steps} steps` : ''}
          </span>
          <h3>{block.title}</h3>
          <p>{block.hook}</p>
        </div>
        <span className="discovery-teaser__arrow" aria-hidden>
          <ArrowRight size={22} />
        </span>
      </button>
    </section>
  );
}

export default function FashionDiscoveryHub({ onNavigate }) {
  return (
    <section className="fashion-discovery-hub container" id="fashion-discovery-hub">
      <div className="fashion-discovery-hub__head">
        <p className="fashion-discovery-hub__eyebrow">
          <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Fashion Discovery Hub
        </p>
        <h2 className="fashion-discovery-hub__title">Six doors into your next obsession</h2>
        <p className="fashion-discovery-hub__sub">
          Quizzes, outfit finders, celebrity edits, articles & guides — each opens a dedicated rabbit hole.
        </p>
      </div>

      <div className="fashion-discovery-hub__grid">
        {DISCOVERY_HUB_BLOCKS.map((block) => (
          <button
            key={block.id}
            type="button"
            className="fashion-discovery-hub__card hover-zoom-container"
            style={{ '--hub-accent': block.accent }}
            onClick={() => onNavigate?.(block.route)}
            data-journey-label={block.title}
          >
            <div className="fashion-discovery-hub__card-media">
              <ProductImage
                src={block.image}
                alt=""
                className="fashion-discovery-hub__card-img hover-zoom-img"
              />
              <span className="fashion-discovery-hub__card-badge">
                {KIND_LABELS[block.kind] || 'Explore'}
              </span>
            </div>
            <div className="fashion-discovery-hub__card-body">
              <h3 className="fashion-discovery-hub__card-title">{block.title}</h3>
              <p className="fashion-discovery-hub__card-hook">{block.hook}</p>
              <span className="fashion-discovery-hub__card-cta">
                {block.cta}
                <ArrowRight size={14} aria-hidden />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
