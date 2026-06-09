import React, { useState, useEffect, useMemo } from 'react';
import { Star, ShoppingBag, Plus, Minus, Heart, Truck, RefreshCw, ShieldCheck, Banknote, X, Sparkles } from 'lucide-react';
import { getProductDetailContent, getSizeChartForProduct, getSizeChartMeta } from '../utils/productContent';
import ProductDetailsAmazon from './ProductDetailsAmazon';
import ProductDiscoveryRails from './ProductDiscoveryRails';
import './ProductDetailPage.css';
import PageBackButton from './PageBackButton';
import StoreCouponsPromo from './StoreCouponsPromo';
import PdpAdZone from './PdpAdZone';
import ProductImage from './ProductImage';
import { getProductGalleryImages } from '../utils/productImages';
import { scrollToPageTop } from '../utils/scrollToTop';
import { recordProductView } from '../utils/viewHistory';

export default function ProductDetailPage({
  product,
  onBack,
  onBackToHome,
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false,
  allProducts = [],
  onSelectProduct,
  onSelectCategory,
  coupons = [],
  adCodes = {},
  onOpenArticle,
  onOpenKnowledgePage,
  onStartQuiz,
}) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const detailContent = getProductDetailContent(product);
  const sizeChart = getSizeChartForProduct(product);
  const sizeChartMeta = getSizeChartMeta(product);
  const pImages = getProductGalleryImages(product);

  const breadcrumbCategory = (product.subCategory || product.category || 'Shop')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const highlightChips = useMemo(() => {
    const rows = detailContent?.highlights ? Object.entries(detailContent.highlights) : [];
    return rows.slice(0, 4).map(([label, value]) => ({ label, value }));
  }, [detailContent]);

  useEffect(() => {
    scrollToPageTop();
    setActiveImageIndex(0);
    recordProductView(product);
  }, [product?.id]);

  useEffect(() => {
    document.body.classList.add('pdp-page');
    return () => document.body.classList.remove('pdp-page');
  }, []);

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToBag = () => {
    onAddToCart(product, selectedSize, quantity);
  };

  const handleSelectSuggested = (newProduct) => {
    onSelectProduct(newProduct);
    setSelectedSize(newProduct.sizes ? newProduct.sizes[0] : '');
    setQuantity(1);
    setActiveImageIndex(0);
    scrollToPageTop();
  };

  return (
    <div className="pdp-page-shell">
      <div className="product-detail-page-container container">
        <section className="pdp-hero-zone" aria-label="Product overview">
          <nav className="pdp-top-nav" aria-label="Product navigation">
            <PageBackButton onClick={onBack || onBackToHome} className="page-back-btn--minimal" />
            <div className="pdp-breadcrumb">
              <span className="pdp-bread-link" onClick={onBackToHome}>Home</span>
              <span className="pdp-bread-sep">›</span>
              <span className="pdp-bread-link" onClick={onBackToHome}>{breadcrumbCategory}</span>
              <span className="pdp-bread-sep">›</span>
              <span className="pdp-bread-current">{product.title}</span>
            </div>
          </nav>

          <PdpAdZone adCodes={adCodes} placements={['product_top']} />

          <div className="pdp-main-layout product-layout">
            <div className="pdp-gallery-col left-image-section">
              <div className="pdp-gallery-media">
                <div className="pdp-thumbnails-list">
                  {pImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`pdp-thumb-wrapper ${activeImageIndex === idx ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(idx)}
                    >
                      <div className="pdp-thumb-crop">
                        <ProductImage
                          src={imgUrl}
                          alt={`${product.title} view ${idx + 1}`}
                          className="pdp-thumb-img"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pdp-main-display">
                  <span className="pdp-discount-tag-label">{product.discount || 'SPECIAL OFFER'}</span>
                  <span className="pdp-gallery-counter" aria-live="polite">
                    {activeImageIndex + 1} / {pImages.length}
                  </span>
                  <div className="pdp-main-image-viewport">
                    <ProductImage
                      key={pImages[activeImageIndex] || pImages[0]}
                      product={product}
                      src={pImages[activeImageIndex]}
                      images={pImages}
                      alt={product.title}
                      className="pdp-main-img"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>

              <PdpAdZone adCodes={adCodes} placements={['product_gallery_bottom']} variant="pdp-gallery" />
            </div>

            <div className="pdp-details-col right-info-section">
              <div className="pdp-details-panel">
                <section className="pdp-section pdp-section--identity" aria-label="Product summary">
                  <span className="pdp-category-badge">{breadcrumbCategory}</span>
                  <h1 className="pdp-title">{product.title}</h1>
                  {product.isGiftCombo ? (
                    <div className="pdp-combo-meta">
                      <span className="pdp-combo-badge">{product.comboBadge || 'Gift combo'}</span>
                      {product.comboIncludes ? (
                        <p className="pdp-combo-includes">Includes: {product.comboIncludes}</p>
                      ) : null}
                    </div>
                  ) : null}
                  {highlightChips.length > 0 ? (
                    <ul className="pdp-meta-chips" aria-label="Product highlights">
                      {highlightChips.map(({ label, value }) => (
                        <li key={label} className="pdp-meta-chip">
                          <span className="pdp-meta-chip__label">{label}</span>
                          <span className="pdp-meta-chip__value">{value}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="pdp-sku-label">SKU: LIB-{(product.id * 8934).toString(16).toUpperCase()}</p>
                  <div className="pdp-ratings-row">
                    <div className="pdp-stars-pill">
                      <span className="pdp-rating-val">{product.rating}</span>
                      <Star size={13} fill="#600b45" stroke="#600b45" />
                    </div>
                    <span className="pdp-ratings-divider">|</span>
                    <span className="pdp-ratings-count">{product.reviewsCount} Verified Customer Reviews</span>
                  </div>
                </section>

                <section className="pdp-section pdp-section--commerce" aria-label="Pricing and offers">
                  <div className="pdp-pricing-box">
                    <div className="pdp-price-tag-row">
                      <span className="pdp-price-current">₹{product.price}</span>
                      <span className="pdp-price-original">MRP ₹{product.originalPrice}</span>
                    </div>
                    <span className="pdp-discount-percentage">({product.discount || '50% OFF'})</span>
                  </div>
                  <p className="pdp-inclusive-taxes">inclusive of all taxes</p>

                  <div className="pdp-delivery-highlights" aria-label="Delivery benefits">
                    <div className="pdp-delivery-highlight pdp-delivery-highlight--shipping">
                      <span className="pdp-delivery-highlight__badge">Free</span>
                      <span className="pdp-delivery-highlight__icon" aria-hidden>
                        <Truck size={20} strokeWidth={2.25} />
                      </span>
                      <div className="pdp-delivery-highlight__copy">
                        <strong>Free Shipping</strong>
                        <span>On all orders across India</span>
                      </div>
                    </div>
                    <div className="pdp-delivery-highlight pdp-delivery-highlight--cod">
                      <span className="pdp-delivery-highlight__badge">COD</span>
                      <span className="pdp-delivery-highlight__icon" aria-hidden>
                        <Banknote size={20} strokeWidth={2.25} />
                      </span>
                      <div className="pdp-delivery-highlight__copy">
                        <strong>Cash on Delivery</strong>
                        <span>Pay when your order arrives</span>
                      </div>
                    </div>
                  </div>

                  <StoreCouponsPromo coupons={coupons} showFreeShipping={false} />
                </section>

                <PdpAdZone
                  adCodes={adCodes}
                  placements={[
                    'product_after_title',
                    'product_after_rating',
                    'product_after_price',
                    'product_after_offers',
                  ]}
                />

                <section className="pdp-section pdp-section--configure" aria-label="Size and purchase">
                  <div className="pdp-size-selector-section">
                    <div className="pdp-size-header-row">
                      <span className="pdp-section-label">SELECT SIZE</span>
                      <button type="button" className="pdp-size-chart-btn" onClick={() => setShowSizeChart(true)}>
                        SIZE CHART
                      </button>
                    </div>
                    <div className="pdp-sizes-row">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          className={`pdp-size-opt-btn ${selectedSize === sz ? 'selected' : ''}`}
                          onClick={() => setSelectedSize(sz)}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pdp-qty-section">
                    <span className="pdp-section-label">QUANTITY</span>
                    <div className="pdp-qty-counter">
                      <button type="button" className="pdp-qty-btn" onClick={decrementQty} aria-label="Decrease quantity">
                        <Minus size={13} />
                      </button>
                      <span className="pdp-qty-display">{quantity}</span>
                      <button type="button" className="pdp-qty-btn" onClick={incrementQty} aria-label="Increase quantity">
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  <PdpAdZone
                    adCodes={adCodes}
                    placements={['product_before_size', 'product_after_size', 'product_above_cart']}
                  />

                  <div className="pdp-actions-row">
                    <button type="button" className="btn btn-primary pdp-add-to-bag-btn" onClick={handleAddToBag}>
                      <ShoppingBag size={16} className="pdp-btn-icon" />
                      ADD TO BAG
                    </button>
                    <button
                      type="button"
                      className={`btn btn-outline-plum pdp-wishlist-btn ${isInWishlist ? 'saved' : ''}`}
                      onClick={() => onAddToWishlist?.(product, selectedSize)}
                    >
                      <Heart size={16} className="pdp-btn-icon" fill={isInWishlist ? 'currentColor' : 'none'} />
                      {isInWishlist ? 'SAVED' : 'WISHLIST'}
                    </button>
                  </div>
                </section>

                <PdpAdZone adCodes={adCodes} placements={['product_below_cart']} />

                <section className="pdp-section pdp-section--assurance" aria-label="Delivery and returns">
                  <h2 className="pdp-section-heading">Why shop this piece</h2>
                  <div className="pdp-trust-strip">
                    <div className="pdp-trust-item pdp-trust-item--featured">
                      <Truck size={16} className="pdp-trust-icon" />
                      <div className="pdp-trust-text-box">
                        <span className="pdp-trust-title-bold">Free Shipping</span>
                        <span className="pdp-trust-subtitle-small">Pan-India delivery</span>
                      </div>
                    </div>
                    <div className="pdp-trust-item pdp-trust-item--featured">
                      <Banknote size={16} className="pdp-trust-icon" />
                      <div className="pdp-trust-text-box">
                        <span className="pdp-trust-title-bold">Cash on Delivery</span>
                        <span className="pdp-trust-subtitle-small">Pay at your doorstep</span>
                      </div>
                    </div>
                    <div className="pdp-trust-item">
                      <RefreshCw size={16} className="pdp-trust-icon" />
                      <div className="pdp-trust-text-box">
                        <span className="pdp-trust-title-bold">Easy Returns</span>
                        <span className="pdp-trust-subtitle-small">7 days policy</span>
                      </div>
                    </div>
                    <div className="pdp-trust-item">
                      <ShieldCheck size={16} className="pdp-trust-icon" />
                      <div className="pdp-trust-text-box">
                        <span className="pdp-trust-title-bold">100% Original</span>
                        <span className="pdp-trust-subtitle-small">Direct from brand</span>
                      </div>
                    </div>
                  </div>
                </section>

                <PdpAdZone
                  adCodes={adCodes}
                  placements={[
                    'product_before_details',
                    'product_before_trust',
                    'product_after_trust',
                  ]}
                />

                <section className="pdp-section pdp-section--details" aria-label="Product details">
                  <ProductDetailsAmazon product={product} />
                </section>

                <PdpAdZone adCodes={adCodes} placements={['product_after_details']} />
              </div>
            </div>
          </div>
        </section>

        <section className="pdp-below-fold" aria-label="Recommended products">
          <header className="pdp-below-fold__head">
            <div className="pdp-below-fold__head-titles">
              <p className="pdp-below-fold__eyebrow">Complete the look</p>
              <h2 className="pdp-below-fold__title">More from the {breadcrumbCategory} edit</h2>
              <p className="pdp-below-fold__sub">
                Similar co-ords, styling guides, and trending picks — keep exploring after{' '}
                {product.title.split(' ').slice(0, 3).join(' ')}…
              </p>
            </div>
            {onSelectCategory ? (
              <div className="pdp-below-fold__head-actions">
                <button
                  type="button"
                  className="pdp-below-fold__see-all"
                  onClick={() => onSelectCategory(product.subCategory || product.category)}
                >
                  See all
                  <Sparkles size={14} aria-hidden />
                </button>
              </div>
            ) : null}
          </header>
          <ProductDiscoveryRails
            product={product}
            allProducts={allProducts}
            onSelectProduct={handleSelectSuggested}
            onSelectCategory={onSelectCategory}
            onOpenArticle={onOpenArticle}
            onOpenKnowledgePage={onOpenKnowledgePage}
            onStartQuiz={onStartQuiz}
            adCodes={adCodes}
            productsPerRail={6}
          />
        </section>

        <PdpAdZone adCodes={adCodes} placements={['product_page_bottom']} variant="section" />
      </div>

      {showSizeChart ? (
        <div className="pdp-size-chart-modal" role="dialog" aria-modal="true">
          <div className="pdp-size-chart-backdrop" onClick={() => setShowSizeChart(false)} />
          <div className="pdp-size-chart-panel">
            <div className="pdp-size-chart-head">
              <h3>{sizeChartMeta.title}</h3>
              <button type="button" onClick={() => setShowSizeChart(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="pdp-size-chart-table-wrap">
              <table className="pdp-size-chart-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    {sizeChartMeta.columns.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((row) => (
                    <tr key={row.size}>
                      <td><strong>{row.size}</strong></td>
                      {sizeChartMeta.columns.map((col) => (
                        <td key={col.key}>{row[col.key] || '—'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pdp-size-chart-note">
              {sizeChartMeta.note}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
