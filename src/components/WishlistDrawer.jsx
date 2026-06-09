import { useEffect, useMemo, useState } from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { mergeProductForDetail } from '../utils/resolveProductPage';
import './WishlistDrawer.css';

function resolveWishlistProduct(item, allProducts) {
  return mergeProductForDetail(item, allProducts) || item;
}

function resolveWishlistSize(item, product, sizeById) {
  const sizes = product?.sizes || [];
  const picked = sizeById[item.id] || item.selectedSize || sizes[0] || 'M';
  if (sizes.length && !sizes.includes(picked)) {
    return sizes[0];
  }
  return picked;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems = [],
  allProducts = [],
  onRemoveItem,
  onAddToCart,
  onSelectProduct,
}) {
  const [sizeById, setSizeById] = useState({});

  const enrichedItems = useMemo(
    () =>
      wishlistItems.map((item) => {
        const product = resolveWishlistProduct(item, allProducts);
        const sizes = product?.sizes || [];
        const selectedSize = resolveWishlistSize(item, product, sizeById);
        return { item, product, sizes, selectedSize };
      }),
    [wishlistItems, allProducts, sizeById],
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleAddToBag = (product, size) => {
    if (!product) return;
    onAddToCart?.(product, size, 1);
    onClose?.();
  };

  return (
    <div className={`wishlist-drawer-overlay ${isOpen ? 'active' : ''}`}>
      <div className="wishlist-backdrop" onClick={onClose} aria-hidden />
      <div className="drawer drawer-right active">
        <div className="drawer-header">
          <div className="wishlist-title-row">
            <Heart size={18} className="wishlist-header-icon" fill="currentColor" />
            <span className="drawer-title">MY WISHLIST</span>
            <span className="wishlist-items-count">({wishlistItems.length})</span>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close wishlist">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          {wishlistItems.length === 0 ? (
            <div className="wishlist-empty">
              <Heart size={64} className="wishlist-empty-icon" />
              <h4 className="wishlist-empty-title">YOUR WISHLIST IS EMPTY</h4>
              <p className="wishlist-empty-sub">Save outfits you love — tap the heart on any product.</p>
              <button type="button" className="btn btn-primary" onClick={onClose}>
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className="wishlist-items-scroller">
              {enrichedItems.map(({ item, product, sizes, selectedSize }) => (
                <article key={item.id} className="wishlist-item-row">
                  <button
                    type="button"
                    className="wishlist-item-thumb-btn"
                    onClick={() => {
                      onSelectProduct?.(product);
                      onClose();
                    }}
                  >
                    <img src={product.image || item.image} alt={product.title || item.title} className="wishlist-item-thumb" />
                  </button>

                  <div className="wishlist-item-details">
                    <button
                      type="button"
                      className="wishlist-item-title-btn"
                      onClick={() => {
                        onSelectProduct?.(product);
                        onClose();
                      }}
                    >
                      {product.title || item.title}
                    </button>
                    <div className="wishlist-item-price-row">
                      <span className="wishlist-price">₹{product.price ?? item.price}</span>
                      {(product.originalPrice ?? item.originalPrice) > (product.price ?? item.price) && (
                        <span className="wishlist-price-orig">₹{product.originalPrice ?? item.originalPrice}</span>
                      )}
                    </div>

                    {sizes.length > 1 ? (
                      <div className="wishlist-size-picker" role="group" aria-label="Select size">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            className={`wishlist-size-pill${selectedSize === size ? ' is-active' : ''}`}
                            onClick={() => setSizeById((prev) => ({ ...prev, [item.id]: size }))}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    ) : selectedSize ? (
                      <span className="wishlist-size-tag">Size: {selectedSize}</span>
                    ) : null}

                    <button
                      type="button"
                      className="btn btn-primary wishlist-add-bag-btn"
                      onClick={() => handleAddToBag(product, selectedSize)}
                    >
                      <ShoppingBag size={14} />
                      ADD TO BAG
                    </button>
                  </div>

                  <button
                    type="button"
                    className="wishlist-remove-btn"
                    onClick={() => onRemoveItem?.(item.id)}
                    aria-label={`Remove ${product.title || item.title} from wishlist`}
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
