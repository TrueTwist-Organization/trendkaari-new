import React, { useMemo, useState, useEffect } from 'react';
import { ArrowRight, Trophy, Vote } from 'lucide-react';
import ProductImage from './ProductImage';
import { getCategoryBySlug } from '../data/fashionMagazine';
import {
  FASHION_POLLS,
  STYLE_CHALLENGES,
  TRENDING_SEARCHES,
} from '../data/discoveryExperience';
import { castPollVote, getPollResults } from '../utils/pollVotesStorage';
import { buildDiscoveryExperienceFeed } from '../utils/discoveryExperienceEngine';
import './DiscoveryExperienceFeed.css';

/* ─── Shared shell ──────────────────────────────────────────────────────── */

function BlockShell({ block, onNavigate, children, ctaLabel }) {
  const label = ctaLabel ?? block.ctaText ?? 'Explore';
  return (
    <section
      className={`discovery-xp__block${block.dark ? ' discovery-xp__block--dark' : ''}`}
      id={block.id}
      style={{ '--block-accent': block.accent }}
    >
      <div className="discovery-xp__block-head">
        <div>
          <p className="discovery-xp__eyebrow">{block.tagline}</p>
          <h2 className="discovery-xp__title">{block.title}</h2>
          {block.hook ? <p className="discovery-xp__hook">{block.hook}</p> : null}
        </div>
        {block.route && label ? (
          <button
            type="button"
            className="discovery-xp__cta"
            onClick={() => onNavigate?.(block.route)}
            data-journey-label={block.title}
          >
            {label}
            <ArrowRight size={14} aria-hidden />
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/* ─── 1. Style DNA Quiz ─────────────────────────────────────────────────── */

function StyleQuizBlock({ block, onNavigate }) {
  return (
    <BlockShell block={block} onNavigate={onNavigate}>
      <div className="discovery-xp__quiz-split">
        <div className="discovery-xp__quiz-poster">
          {/* First content section — load poster eagerly for perceived performance */}
          <ProductImage src={block.poster} alt="" loading="eager" />
        </div>
        <div className="discovery-xp__quiz-body">
          <p className="discovery-xp__quiz-question">Which vibe feels most like you?</p>
          <div className="discovery-xp__quiz-options">
            {block.previewOptions?.map((opt) => (
              <button
                key={opt.label}
                type="button"
                className="discovery-xp__quiz-option"
                onClick={() => onNavigate?.(block.route)}
                data-journey-label={`Quiz: ${opt.label}`}
              >
                <span className="discovery-xp__quiz-option-label">{opt.label}</span>
                <ArrowRight size={12} aria-hidden />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="discovery-xp__quiz-start"
            onClick={() => onNavigate?.(block.route)}
            data-journey-label="Start style quiz"
          >
            {block.ctaText} →
          </button>
        </div>
      </div>
    </BlockShell>
  );
}

/* ─── 2. Bollywood Looks ────────────────────────────────────────────────── */

function BollywoodLooksBlock({ block, payload, onNavigate }) {
  return (
    <BlockShell block={block} onNavigate={onNavigate}>
      <div className="discovery-xp__bollywood-grid">
        {payload.looks?.map((look, i) => (
          <button
            key={look.id}
            type="button"
            className={`discovery-xp__bollywood-card${i === 0 ? ' discovery-xp__bollywood-card--lead' : ''}`}
            onClick={() => onNavigate?.(`/celebrity-match/${look.id}`)}
            data-journey-label={`Bollywood look: ${look.celebrity}`}
            aria-label={`${look.celebrity} — ${look.title}`}
          >
            <div className="discovery-xp__bollywood-media">
              <img src={look.image} alt="" loading={i > 1 ? 'lazy' : 'eager'} decoding="async" />
              <div className="discovery-xp__bollywood-overlay" />
              <div className="discovery-xp__bollywood-info">
                <span className="discovery-xp__bollywood-context">{look.context}</span>
                <strong className="discovery-xp__bollywood-name">{look.celebrity}</strong>
                <p className="discovery-xp__bollywood-title">{look.title}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </BlockShell>
  );
}

/* ─── 3. This Week in Indian Fashion ───────────────────────────────────── */

function ThisWeekBlock({ block, payload, onNavigate, onSelectProduct }) {
  const [lead, ...rest] = payload.picks || [];
  return (
    <BlockShell block={block} onNavigate={onNavigate}>
      {block.savesCount && (
        <p className="discovery-xp__social-proof">
          <span className="discovery-xp__social-count">{block.savesCount}</span>
          &nbsp;saves this week
        </p>
      )}
      <div className="discovery-xp__viral-layout">
        {lead && (
          <button
            type="button"
            className="discovery-xp__viral-hero"
            onClick={() => onSelectProduct?.(lead)}
            data-journey-label="Viral hero pick"
          >
            <div className="discovery-xp__viral-hero-media">
              <ProductImage src={lead.image} alt={lead.title} />
              <div className="discovery-xp__viral-overlay" />
              <div className="discovery-xp__viral-hero-label">
                <span className="discovery-xp__viral-tag">This week</span>
                <p className="discovery-xp__viral-name">{lead.title}</p>
              </div>
            </div>
          </button>
        )}
        {rest.length > 0 && (
          <div className="discovery-xp__viral-secondary">
            {rest.map((product) => (
              <button
                key={product.id}
                type="button"
                className="discovery-xp__viral-secondary-card"
                onClick={() => onSelectProduct?.(product)}
                data-journey-label="Viral secondary pick"
              >
                <ProductImage src={product.image} alt={product.title} />
                <p className="discovery-xp__viral-secondary-name">{product.title}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </BlockShell>
  );
}

/* ─── 4. Occasion Gate ──────────────────────────────────────────────────── */

function OccasionGateBlock({ block, onNavigate, onSelectCategory }) {
  return (
    <BlockShell block={block} onNavigate={onNavigate}>
      <div className="discovery-xp__occasion-grid">
        {block.occasionChips?.map((chip) => (
          <button
            key={chip.label}
            type="button"
            className="discovery-xp__occasion-tile"
            onClick={() => {
              if (chip.route) onNavigate?.(chip.route);
              else onSelectCategory?.(chip.category);
            }}
            data-journey-label={`Occasion: ${chip.label}`}
          >
            <span className="discovery-xp__occasion-label">{chip.label}</span>
            <ArrowRight size={12} className="discovery-xp__occasion-arrow" aria-hidden />
          </button>
        ))}
      </div>
    </BlockShell>
  );
}

/* ─── 5. Wedding & Festive Edit ─────────────────────────────────────────── */

function WeddingFestiveBlock({ block, payload, onNavigate, onSelectCategory }) {
  return (
    <BlockShell block={block} onNavigate={onNavigate}>
      <div className="discovery-xp__festive-chips">
        {block.festiveChips?.map((chip) => (
          <button
            key={chip}
            type="button"
            className="discovery-xp__festive-chip"
            onClick={() => onSelectCategory?.('lehengas')}
            data-journey-label={`Festive: ${chip}`}
          >
            {chip}
          </button>
        ))}
      </div>
      {payload.products?.length > 0 && (
        <div className="discovery-xp__festive-grid">
          {payload.products.map((product) => (
            <button
              key={product.id}
              type="button"
              className="discovery-xp__festive-card"
              onClick={() => onNavigate?.(block.route)}
              data-journey-label="Festive pick"
            >
              <ProductImage src={product.image} alt={product.title} />
              <p className="discovery-xp__festive-card-name">{product.title}</p>
            </button>
          ))}
        </div>
      )}
    </BlockShell>
  );
}

/* ─── 6. The Edit Desk (Articles) ───────────────────────────────────────── */

function EditDeskBlock({ block, payload, onNavigate, onOpenArticle }) {
  const [lead, ...secondary] = payload.articles || [];
  return (
    <BlockShell block={block} onNavigate={onNavigate}>
      <div className="discovery-xp__editdesk">
        {lead && (() => {
          const cat = getCategoryBySlug(lead.categorySlug);
          return (
            <button
              type="button"
              className="discovery-xp__editdesk-lead"
              onClick={() =>
                onOpenArticle
                  ? onOpenArticle(lead.categorySlug, lead.slug)
                  : onNavigate?.(block.route)
              }
              data-journey-label={lead.title}
            >
              <div className="discovery-xp__editdesk-lead-media">
                <ProductImage src={lead.image} alt="" />
              </div>
              <div className="discovery-xp__editdesk-lead-body">
                <p className="discovery-xp__eyebrow">{cat?.title}</p>
                <h3 className="discovery-xp__editdesk-headline">{lead.title}</h3>
                <p className="discovery-xp__editdesk-excerpt">{lead.excerpt}</p>
                <span className="discovery-xp__editdesk-read">Read the story →</span>
              </div>
            </button>
          );
        })()}
        {secondary.length > 0 && (
          <div className="discovery-xp__editdesk-secondary">
            {secondary.map((article) => {
              const cat = getCategoryBySlug(article.categorySlug);
              return (
                <button
                  key={article.id}
                  type="button"
                  className="discovery-xp__editdesk-sec"
                  onClick={() =>
                    onOpenArticle
                      ? onOpenArticle(article.categorySlug, article.slug)
                      : onNavigate?.(block.route)
                  }
                  data-journey-label={article.title}
                >
                  <div className="discovery-xp__editdesk-sec-media">
                    <ProductImage src={article.image} alt="" />
                  </div>
                  <div className="discovery-xp__editdesk-sec-body">
                    <p className="discovery-xp__eyebrow">{cat?.title}</p>
                    <h4>{article.title}</h4>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </BlockShell>
  );
}

/* ─── 7. Editor's Voice ─────────────────────────────────────────────────── */

function EditorsVoiceBlock({ block, payload, onSelectProduct, onNavigate }) {
  return (
    <section
      className="discovery-xp__block"
      id={block.id}
      style={{ '--block-accent': block.accent }}
    >
      <div className="discovery-xp__editors-header">
        <p className="discovery-xp__eyebrow">{block.tagline}</p>
        <h2 className="discovery-xp__editors-quote">&ldquo;{block.editorQuote}&rdquo;</h2>
        {block.route && (
          <button
            type="button"
            className="discovery-xp__cta"
            onClick={() => onNavigate?.(block.route)}
            data-journey-label={block.title}
          >
            {block.ctaText}
            <ArrowRight size={14} aria-hidden />
          </button>
        )}
      </div>
      <div className="discovery-xp__editors-row">
        {payload.picks?.map(({ product, note }, i) => (
          <button
            key={product.id}
            type="button"
            className={`discovery-xp__editors-card discovery-xp__editors-card--${i + 1}`}
            onClick={() => onSelectProduct?.(product)}
            data-journey-label="Editor pick"
          >
            <div className="discovery-xp__editors-media">
              <ProductImage src={product.image} alt={product.title} />
            </div>
            <div className="discovery-xp__editors-body">
              <p className="discovery-xp__editors-note">&ldquo;{note}&rdquo;</p>
              <h4 className="discovery-xp__editors-name">{product.title}</h4>
              <span className="discovery-xp__editors-price">₹{product.price}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ─── 8. Style Debate ───────────────────────────────────────────────────── */

function StyleDebateBlock({ block, onNavigate }) {
  const [pollState, setPollState] = useState(() =>
    FASHION_POLLS.map((poll) => ({
      ...poll,
      results: getPollResults(
        poll.id,
        poll.options.map((o) => o.id),
      ),
    })),
  );
  const [activePoll, setActivePoll] = useState(0);

  const handleVote = (pollId, optionId, optionIds) => {
    const results = castPollVote(pollId, optionId, optionIds);
    setPollState((prev) =>
      prev.map((p) => (p.id === pollId ? { ...p, results } : p)),
    );
  };

  const poll = pollState[activePoll];

  return (
    <BlockShell block={block} onNavigate={onNavigate}>
      <div className="discovery-xp__debate">
        {/* Poll tabs */}
        <div className="discovery-xp__debate-tabs">
          {pollState.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              className={`discovery-xp__debate-tab${idx === activePoll ? ' discovery-xp__debate-tab--active' : ''}`}
              onClick={() => setActivePoll(idx)}
            >
              {`Debate ${idx + 1}`}
            </button>
          ))}
        </div>

        {/* Active poll */}
        <div className="discovery-xp__debate-poll">
          <p className="discovery-xp__debate-question">{poll.question}</p>
          {poll.subtext && (
            <p className="discovery-xp__debate-subtext">{poll.subtext}</p>
          )}
          <div className="discovery-xp__debate-options">
            {poll.options.map((opt) => {
              const count = poll.results.counts[opt.id] || 0;
              const pct = poll.results.total
                ? Math.round((count / poll.results.total) * 100)
                : 0;
              const voted = poll.results.userVote === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`discovery-xp__debate-opt${voted ? ' discovery-xp__debate-opt--voted' : ''}`}
                  onClick={() =>
                    handleVote(poll.id, opt.id, poll.options.map((o) => o.id))
                  }
                  data-journey-label={`Debate: ${opt.label}`}
                >
                  <span
                    className="discovery-xp__debate-bar"
                    style={{ width: `${pct}%` }}
                    aria-hidden
                  />
                  <span className="discovery-xp__debate-opt-inner">
                    <span>{opt.emoji} {opt.label}</span>
                    {poll.results.total > 0 && (
                      <span className="discovery-xp__debate-pct">{pct}%</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Challenges */}
        <div className="discovery-xp__challenge-links">
          {STYLE_CHALLENGES.map((ch) => (
            <button
              key={ch.id}
              type="button"
              className="discovery-xp__challenge-link"
              onClick={() => onNavigate?.(ch.route)}
              data-journey-label={ch.title}
            >
              <Trophy size={14} aria-hidden />
              <span className="discovery-xp__challenge-link-title">{ch.title}</span>
              <span className="discovery-xp__challenge-link-hook">{ch.hook}</span>
              <ArrowRight size={14} aria-hidden />
            </button>
          ))}
        </div>
      </div>
    </BlockShell>
  );
}

/* ─── 9. Trending in India ──────────────────────────────────────────────── */

function TrendingIndiaBlock({ block, onNavigate, onSelectCategory }) {
  return (
    <BlockShell block={block} ctaLabel={null}>
      <div className="discovery-xp__trending-index">
        {TRENDING_SEARCHES.map((item, i) => (
          <button
            key={item.label}
            type="button"
            className="discovery-xp__trending-term"
            onClick={() => {
              if (item.route) onNavigate?.(item.route);
              else if (item.category) onSelectCategory?.(item.category);
            }}
            data-journey-label={`Trending: ${item.label}`}
          >
            <span className="discovery-xp__trending-rank">{String(i + 1).padStart(2, '0')}</span>
            <span className="discovery-xp__trending-label">{item.label}</span>
            <ArrowRight size={12} aria-hidden />
          </button>
        ))}
      </div>
    </BlockShell>
  );
}

/* ─── Poster strip ("This Edit" chapter rail) ───────────────────────────── */

function PosterStrip({ posters, onNavigate }) {
  return (
    <div className="discovery-xp__strip-wrap">
      <div className="discovery-xp__strip-head">
        <p className="discovery-xp__strip-label">THIS EDIT</p>
        <p className="discovery-xp__strip-sub">Tap any chapter to open it</p>
      </div>
      <div className="discovery-xp__strip" role="list">
        {posters.map((block, i) => (
          <button
            key={block.id}
            type="button"
            role="listitem"
            className={`discovery-xp__poster${block.dark ? ' discovery-xp__poster--dark' : ''}`}
            onClick={() => onNavigate?.(block.route)}
            data-journey-label={`Chapter: ${block.title}`}
            aria-label={block.title}
          >
            <div className="discovery-xp__poster-media">
              {/* First 3 posters are near fold — load eagerly; rest lazy */}
              <ProductImage
                src={block.poster}
                alt=""
                className="discovery-xp__poster-img"
                loading={i < 3 ? 'eager' : 'lazy'}
              />
              <div className="discovery-xp__poster-glow" aria-hidden="true" />
              <span className="discovery-xp__poster-tag">{block.tagline.split('·')[0].trim()}</span>
            </div>
            <span className="discovery-xp__poster-title">{block.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Block router ──────────────────────────────────────────────────────── */

function ExperienceBlock({ item, handlers }) {
  const { block, payload } = item;
  const props = { block, payload, ...handlers };

  switch (block.id) {
    case 'style-quiz':
      return <StyleQuizBlock {...props} />;
    case 'bollywood-looks':
      return <BollywoodLooksBlock {...props} />;
    case 'this-week':
      return <ThisWeekBlock {...props} />;
    case 'occasion-gate':
      return <OccasionGateBlock {...props} />;
    case 'wedding-festive':
      return <WeddingFestiveBlock {...props} />;
    case 'edit-desk':
      return <EditDeskBlock {...props} />;
    case 'editors-voice':
      return <EditorsVoiceBlock {...props} />;
    case 'style-debate':
      return <StyleDebateBlock {...props} />;
    case 'trending-india':
      return <TrendingIndiaBlock {...props} />;
    default:
      return null;
  }
}

/* ─── Root export ───────────────────────────────────────────────────────── */

export default function DiscoveryExperienceFeed({
  products = [],
  onNavigate,
  onSelectProduct,
  onSelectCategory,
  onOpenArticle,
}) {
  const [dynamicBlocks, setDynamicBlocks] = useState(null);

  useEffect(() => {
    fetch('/api/store/content?type=homepage-blocks')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (Array.isArray(data?.items) && data.items.length) {
          setDynamicBlocks(data.items);
        }
      })
      .catch(() => {});
  }, []);

  const { posterRow, feed } = useMemo(
    () => buildDiscoveryExperienceFeed(products, dynamicBlocks),
    [products, dynamicBlocks],
  );

  const handlers = { onNavigate, onSelectProduct, onSelectCategory, onOpenArticle };

  return (
    <div className="discovery-xp">
      <PosterStrip posters={posterRow} onNavigate={onNavigate} />
      {feed.map((item) => (
        <ExperienceBlock key={item.id} item={item} handlers={handlers} />
      ))}
    </div>
  );
}
