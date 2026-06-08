import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { DISCOVERY_STORIES } from '../data/discoveryStories';
import './FashionStoryStrip.css';

export default function FashionStoryStrip({ onSelectCategory, onOpenDiscover }) {
  return (
    <section className="fashion-story-strip section-padding" aria-label="Fashion stories">
      <div className="fashion-story-strip__head container">
        <div>
          <p className="fashion-story-strip__eyebrow">The Style Edit · Magazine</p>
          <h2 className="fashion-story-strip__title">Stories worth opening</h2>
          <p className="fashion-story-strip__sub">
            Pinterest boards meet editorial — each story unlocks a new rabbit hole.
          </p>
        </div>
        {onOpenDiscover ? (
          <button type="button" className="fashion-story-strip__discover-btn" onClick={onOpenDiscover}>
            Open full feed
            <ArrowUpRight size={16} />
          </button>
        ) : null}
      </div>

      <div className="fashion-story-strip__track">
        {DISCOVERY_STORIES.map((story, index) => (
          <button
            key={story.id}
            type="button"
            className={`fashion-story-card fashion-story-card--${index % 3}`}
            onClick={() => onSelectCategory?.(story.category)}
          >
            <div className="fashion-story-card__media hover-zoom-container">
              <img src={story.image} alt="" className="fashion-story-card__img hover-zoom-img" loading="lazy" />
              <div className="fashion-story-card__overlay" />
            </div>
            <div className="fashion-story-card__body">
              <span className="fashion-story-card__tag">{story.subtitle}</span>
              <h3 className="fashion-story-card__title">{story.title}</h3>
              <span className="fashion-story-card__hook">{story.hook}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
