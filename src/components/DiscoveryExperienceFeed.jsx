import React, { useMemo, useState, useEffect } from 'react';
import { ArrowRight, Trophy, Vote } from 'lucide-react';
import ProductImage from './ProductImage';
import { getCategoryBySlug } from '../data/fashionMagazine';
import {
  FASHION_POLLS,
  STYLE_CHALLENGES,
  TRENDING_SEARCHES,
  DEFAULT_DISCOVERY_CONFIG,
  resolveOccasionChipImage,
  normalizeFestiveChips,
} from '../data/discoveryExperience';
import { castPollVote, getPollResults } from '../utils/pollVotesStorage';
import { buildDiscoveryExperienceFeed } from '../utils/discoveryExperienceEngine';
import './DiscoveryExperienceFeed.css';

/* ─── Shared shell ──────────────────────────────────────────────────────── */

function BlockShell({ block, onNavigate, children, ctaLabel, hideHeaderCta = false }) {
  const label = ctaLabel ?? block.ctaText ?? 'Explore';
  return (
    <section
      className={`discovery-xp__block${block.dark ? ' discovery-xp__block--dark' : ''}`}
      id={block.id}
      style={{ '--block-accent': block.accent }}
    >
      <div className="discovery-xp__block-head">
        <p className="discovery-xp__eyebrow">{block.tagline}</p>
        <h2 className="discovery-xp__title">{block.title}</h2>
        {block.hook ? <p className="discovery-xp__hook">{block.hook}</p> : null}
        {!hideHeaderCta && block.route && label ? (
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
    <BlockShell block={block} onNavigate={onNavigate} hideHeaderCta>
      <div className="discovery-xp__quiz-split">
        <div className="discovery-xp__quiz-poster">
          <ProductImage src={block.poster} alt="" loading="eager" />
        </div>
        <div className="discovery-xp__quiz-body">
          <p className="discovery-xp__quiz-question">{block.quizQuestion || 'Which vibe feels most like you?'}</p>
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
            className="discovery-xp__quiz-primary"
            onClick={() => onNavigate?.(block.route)}
            data-journey-label="Start style quiz"
          >
            {block.ctaText}
            <ArrowRight size={14} aria-hidden />
          </button>
        </div>
      </div>
    </BlockShell>
  );
}

/* ─── 2. Bollywood Looks ────────────────────────────────────────────────── */

function BollywoodLooksBlock({ block, payload, onNavigate }) {
  const looks = payload.looks?.slice(0, 4) ?? [];

  return (
    <BlockShell block={block} onNavigate={onNavigate}>
      <div className="discovery-xp__bollywood-wrap">
        <div className="discovery-xp__bollywood-grid">
          {looks.map((look, i) => (
            <button
              key={look.id}
              type="button"
              className="discovery-xp__bollywood-card"
              onClick={() => onNavigate?.(`/celebrity-match/${look.id}`)}
              data-journey-label={`Bollywood look: ${look.celebrity}`}
              aria-label={`${look.celebrity} — ${look.title}`}
            >
              <div className="discovery-xp__bollywood-media">
                <ProductImage
                  src={look.image}
                  alt=""
                  loading={i < 2 ? 'eager' : 'lazy'}
                  className="discovery-xp__bollywood-img"
                />
                <div className="discovery-xp__bollywood-overlay" aria-hidden="true" />
                <div className="discovery-xp__bollywood-info">
                  <span className="discovery-xp__bollywood-context">{look.context}</span>
                  <strong className="discovery-xp__bollywood-name">{look.celebrity}</strong>
                  <p className="discovery-xp__bollywood-title">{look.title}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </BlockShell>
  );
}

/* ─── 3. This Week in Indian Fashion ───────────────────────────────────── */

function ThisWeekBlock({ block, payload, onNavigate, onSelectProduct }) {
  const [lead, ...rest] = payload.picks || [];

  return (
    <BlockShell block={block} onNavigate={onNavigate}>
      <div className="discovery-xp__viral-wrap">
        {block.savesCount ? (
          <p className="discovery-xp__viral-saves">
            <span className="discovery-xp__viral-saves-count">{block.savesCount}</span>
            saves this week
          </p>
        ) : null}

        <div className="discovery-xp__viral-layout">
          {lead ? (
            <button
              type="button"
              className="discovery-xp__viral-hero"
              onClick={() => onSelectProduct?.(lead)}
              data-journey-label="Viral hero pick"
            >
              <div className="discovery-xp__viral-hero-media">
                <ProductImage src={lead.image} alt={lead.title} />
                <div className="discovery-xp__viral-overlay" aria-hidden="true" />
                <div className="discovery-xp__viral-hero-label">
                  <span className="discovery-xp__viral-tag">Editor pick</span>
                  <p className="discovery-xp__viral-name">{lead.title}</p>
                </div>
              </div>
            </button>
          ) : null}

          {rest.length > 0 ? (
            <div className="discovery-xp__viral-secondary">
              {rest.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="discovery-xp__viral-secondary-card"
                  onClick={() => onSelectProduct?.(product)}
                  data-journey-label="Viral secondary pick"
                >
                  <div className="discovery-xp__viral-secondary-media">
                    <ProductImage src={product.image} alt={product.title} />
                    <div className="discovery-xp__viral-overlay" aria-hidden="true" />
                    <p className="discovery-xp__viral-secondary-name">{product.title}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </BlockShell>
  );
}

/* ─── 4. Occasion Gate ──────────────────────────────────────────────────── */

function OccasionGateBlock({ block, onNavigate, onSelectCategory }) {
  return (
    <BlockShell block={block} onNavigate={onNavigate}>
      <div className="discovery-xp__occasion-showcase">
        <div className="discovery-xp__occasion-hero" aria-hidden="true">
          <ProductImage src={block.poster} alt="" loading="lazy" />
          <div className="discovery-xp__occasion-hero-overlay" />
          <div className="discovery-xp__occasion-hero-copy">
            <span className="discovery-xp__occasion-hero-kicker">6 life moments</span>
            <p>One quiz builds the full look — not just a product grid.</p>
          </div>
        </div>

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
              <ProductImage
                src={resolveOccasionChipImage(chip, block.poster)}
                alt=""
                loading="lazy"
              />
              <div className="discovery-xp__occasion-tile-overlay" aria-hidden="true" />
              <span className="discovery-xp__occasion-label">{chip.label}</span>
              <ArrowRight size={14} className="discovery-xp__occasion-arrow" aria-hidden />
            </button>
          ))}
        </div>
      </div>
    </BlockShell>
  );
}

/* ─── 5. Wedding & Festive Edit ─────────────────────────────────────────── */

function WeddingFestiveBlock({ block, payload, onNavigate, onSelectProduct, onSelectCategory }) {
  const chips = useMemo(
    () => normalizeFestiveChips(block.festiveChips, block.poster),
    [block.festiveChips, block.poster],
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const activeChip = chips[activeIdx] || chips[0];
  const heroImage = activeChip?.image || block.poster;

  return (
    <BlockShell block={block} onNavigate={onNavigate}>
      <div className="discovery-xp__festive-showcase">
        <div className="discovery-xp__festive-hero">
          <ProductImage src={heroImage} alt={activeChip?.label || ''} loading="lazy" />
          <div className="discovery-xp__festive-hero-overlay" aria-hidden="true" />
          <div className="discovery-xp__festive-hero-label">
            <span className="discovery-xp__festive-hero-kicker">Now showing</span>
            <p>{activeChip?.label || 'Festive edit'}</p>
          </div>
          <div className="discovery-xp__festive-chips">
            {chips.map((chip, index) => (
              <button
                key={chip.label}
                type="button"
                className={`discovery-xp__festive-chip${index === activeIdx ? ' is-active' : ''}`}
                onClick={() => {
                  setActiveIdx(index);
                  onSelectCategory?.(chip.category);
                }}
                data-journey-label={`Festive: ${chip.label}`}
                aria-pressed={index === activeIdx}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="discovery-xp__festive-thumb-grid">
          {chips.map((chip, index) => (
            <button
              key={`thumb-${chip.label}`}
              type="button"
              className={`discovery-xp__festive-thumb${index === activeIdx ? ' is-active' : ''}`}
              onClick={() => {
                setActiveIdx(index);
                onSelectCategory?.(chip.category);
              }}
              aria-label={`View ${chip.label} edit`}
              aria-pressed={index === activeIdx}
            >
              <ProductImage src={chip.image} alt="" loading="lazy" />
              <span className="discovery-xp__festive-thumb-label">{chip.label}</span>
            </button>
          ))}
        </div>

        {payload.products?.length > 0 ? (
          <div className="discovery-xp__festive-grid">
            {payload.products.map((product) => (
              <button
                key={product.id}
                type="button"
                className="discovery-xp__festive-card"
                onClick={() => onSelectProduct?.(product)}
                data-journey-label="Festive pick"
              >
                <div className="discovery-xp__festive-card-media">
                  <ProductImage src={product.image} alt={product.title} loading="lazy" />
                  <div className="discovery-xp__festive-card-overlay" aria-hidden="true" />
                  <p className="discovery-xp__festive-card-name">{product.title}</p>
                  <span className="discovery-xp__festive-card-price">
                    ₹{Number(product.price || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </div>
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

function StyleDebateBlock({ block, onNavigate, fashionPolls = FASHION_POLLS, styleChallenges = STYLE_CHALLENGES }) {
  const [pollState, setPollState] = useState(() =>
    fashionPolls.map((poll) => ({
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
          {styleChallenges.map((ch) => (
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

function TrendingIndiaBlock({ block, onNavigate, onSelectCategory, trendingSearches = TRENDING_SEARCHES }) {
  return (
    <BlockShell block={block} ctaLabel={null}>
      <div className="discovery-xp__trending-index">
        {trendingSearches.map((item, i) => (
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

function PosterCard({ block, index, onClick, loading = 'lazy' }) {
  return (
    <button
      type="button"
      role="listitem"
      className={`discovery-xp__poster${block.dark ? ' discovery-xp__poster--dark' : ''}`}
      onClick={onClick}
      data-journey-label={`Chapter: ${block.title}`}
      aria-label={block.title}
    >
      <span className="discovery-xp__poster-index">{String(index + 1).padStart(2, '0')}</span>
      <div className="discovery-xp__poster-media">
        <ProductImage
          src={block.poster}
          alt=""
          className="discovery-xp__poster-img"
          loading={loading}
        />
        <div className="discovery-xp__poster-glow" aria-hidden="true" />
        <span className="discovery-xp__poster-tag">{block.tagline.split('·')[0].trim()}</span>
      </div>
      <span className="discovery-xp__poster-title">{block.title}</span>
    </button>
  );
}

function PosterStrip({ posters, onNavigate, stripLabel = 'THIS EDIT', stripSub = 'Tap any chapter to open it' }) {
  const scrollToChapter = (block) => {
    const el = document.getElementById(block.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    onNavigate?.(block.route);
  };

  const renderGroup = (keyPrefix, hidden = false) => (
    <div
      className="discovery-xp__strip-group"
      role="list"
      aria-hidden={hidden || undefined}
    >
      {posters.map((block, i) => (
        <PosterCard
          key={`${keyPrefix}-${block.id}`}
          block={block}
          index={i}
          loading={!hidden && i < 3 ? 'eager' : 'lazy'}
          onClick={() => scrollToChapter(block)}
        />
      ))}
    </div>
  );

  return (
    <div className="discovery-xp__strip-wrap" id="home-chapter-rail">
      <div className="discovery-xp__strip-head container">
        <div className="discovery-xp__strip-titles">
          <p className="discovery-xp__strip-label">{stripLabel}</p>
          <p className="discovery-xp__strip-sub">{stripSub}</p>
        </div>
        <span className="discovery-xp__strip-count">{posters.length} chapters</span>
      </div>

      <div className="discovery-xp__strip-marquee">
        <div className="discovery-xp__strip-fade discovery-xp__strip-fade--left" aria-hidden="true" />
        <div className="discovery-xp__strip-fade discovery-xp__strip-fade--right" aria-hidden="true" />
        <div className="discovery-xp__strip-viewport">
          <div className="discovery-xp__strip-track">
            {renderGroup('a')}
            {renderGroup('b', true)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Block router ──────────────────────────────────────────────────────── */

function ExperienceBlock({ item, handlers, discoveryConfig }) {
  const { block, payload } = item;
  const props = {
    block,
    payload,
    ...handlers,
    fashionPolls: discoveryConfig?.fashionPolls,
    styleChallenges: discoveryConfig?.styleChallenges,
    trendingSearches: discoveryConfig?.trendingSearches,
  };

  switch (block.kind || block.id) {
    case 'quiz':
    case 'style-quiz':
      return <StyleQuizBlock {...props} />;
    case 'celebrity':
    case 'bollywood-looks':
      return <BollywoodLooksBlock {...props} />;
    case 'viral':
    case 'this-week':
      return <ThisWeekBlock {...props} />;
    case 'occasion':
    case 'occasion-gate':
      return <OccasionGateBlock {...props} />;
    case 'festive':
    case 'wedding-festive':
      return <WeddingFestiveBlock {...props} />;
    case 'articles':
    case 'edit-desk':
      return <EditDeskBlock {...props} />;
    case 'editorial':
    case 'editors-voice':
      return <EditorsVoiceBlock {...props} />;
    case 'debate':
    case 'style-debate':
      return <StyleDebateBlock {...props} />;
    case 'search':
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
  const [discoveryConfig, setDiscoveryConfig] = useState(null);

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

  useEffect(() => {
    fetch('/api/store/discovery-config')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.config) setDiscoveryConfig(data.config);
      })
      .catch(() => {});
  }, []);

  const activeConfig = discoveryConfig || DEFAULT_DISCOVERY_CONFIG;

  const { posterRow, feed } = useMemo(
    () => buildDiscoveryExperienceFeed(products, dynamicBlocks, activeConfig),
    [products, dynamicBlocks, activeConfig],
  );

  const handlers = { onNavigate, onSelectProduct, onSelectCategory, onOpenArticle };

  return (
    <div className="discovery-xp">
      <PosterStrip
        posters={posterRow}
        onNavigate={onNavigate}
        stripLabel={activeConfig.stripLabel}
        stripSub={activeConfig.stripSub}
      />
      {feed.map((item, index) => (
        <div
          key={item.id}
          className={`discovery-xp__section discovery-xp__section--${index % 2 === 0 ? 'light' : 'cream'}`}
        >
          <div className="discovery-xp__chapter-marker" aria-hidden="true">
            <span className="discovery-xp__chapter-num">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <ExperienceBlock
            item={item}
            handlers={handlers}
            discoveryConfig={activeConfig}
          />
        </div>
      ))}
    </div>
  );
}
