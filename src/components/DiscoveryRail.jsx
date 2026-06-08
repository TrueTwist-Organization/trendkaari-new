import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ProductImage from './ProductImage';
import ProductDiscountChip from './ProductDiscountChip';
import './DiscoveryRail.css';

export default function DiscoveryRail({
  title,
  hook,
  products = [],
  onSelectProduct,
  onSeeAll,
  tone = 'default',
  compact = false,
}) {
  const trackRef = useRef(null);

  if (!products.length) return null;

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75 * dir;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className={`discovery-rail discovery-rail--${tone}${compact ? ' discovery-rail--compact' : ''}`}>
      <div className="discovery-rail__head">
        <div className="discovery-rail__titles">
          <h2 className="discovery-rail__title">{title}</h2>
          {hook ? <p className="discovery-rail__hook">{hook}</p> : null}
        </div>
        <div className="discovery-rail__actions">
          {onSeeAll ? (
            <button type="button" className="discovery-rail__see-all" onClick={onSeeAll}>
              See all
              <Sparkles size={14} aria-hidden />
            </button>
          ) : null}
          <button type="button" className="discovery-rail__nav" onClick={() => scrollBy(-1)} aria-label="Scroll left">
            <ChevronLeft size={18} />
          </button>
          <button type="button" className="discovery-rail__nav" onClick={() => scrollBy(1)} aria-label="Scroll right">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="discovery-rail__track" ref={trackRef}>
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            className="discovery-rail__card"
            onClick={() => onSelectProduct?.(product)}
          >
            <div className="discovery-rail__img-wrap hover-zoom-container">
              <ProductImage
                src={product.image}
                alt={product.title}
                className="discovery-rail__img hover-zoom-img"
              />
              <span className="discovery-rail__tap-hint">Tap to explore</span>
            </div>
            <div className="discovery-rail__meta">
              <span className="discovery-rail__cat">{product.subCategory || product.category}</span>
              <h3 className="discovery-rail__name">{product.title}</h3>
              <div className="discovery-rail__price-row">
                <span className="discovery-rail__price">₹{product.price}</span>
                <ProductDiscountChip product={product} className="product-discount-chip--compact" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
