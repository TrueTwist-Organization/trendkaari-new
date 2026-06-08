import React from 'react';
import { Home, Heart, User, ShoppingBag, Compass } from 'lucide-react';
import { scrollToPageTop } from '../utils/scrollToTop';
import './MobileNavbar.css';

export default function MobileNavbar({
  activeCategory,
  viewMode = 'home',
  onSelectCategory,
  onOpenDiscover,
  onOpenWishlist,
  onOpenProfile,
  onOpenCart,
  cartCount = 0,
  isCartOpen = false,
}) {
  const isHomeActive =
    viewMode === 'home' && activeCategory === 'all' && !isCartOpen;
  const isDiscoverActive = viewMode === 'discover' && !isCartOpen;

  const handleHomeClick = () => {
    onSelectCategory('all');
    scrollToPageTop();
  };

  return (
    <div className="mobile-bottom-navbar">
      <button
        type="button"
        className={`mobile-nav-tab-btn ${isHomeActive ? 'active' : ''}`}
        onClick={handleHomeClick}
      >
        <Home size={20} />
        <span className="mobile-nav-tab-label">Home</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-tab-btn ${isDiscoverActive ? 'active' : ''}`}
        onClick={onOpenDiscover}
      >
        <Compass size={20} />
        <span className="mobile-nav-tab-label">Explore</span>
      </button>

      <button type="button" className="mobile-nav-tab-btn" onClick={onOpenWishlist}>
        <Heart size={20} />
        <span className="mobile-nav-tab-label">Wishlist</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-tab-btn mobile-nav-tab-btn--cart${isCartOpen ? ' active' : ''}`}
        onClick={onOpenCart}
        aria-label={`Shopping bag${cartCount ? `, ${cartCount} items` : ''}`}
      >
        <span className="mobile-nav-cart-icon-wrap">
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="mobile-nav-cart-badge" aria-hidden>
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </span>
        <span className="mobile-nav-tab-label">Bag</span>
      </button>

      <button type="button" className="mobile-nav-tab-btn" onClick={onOpenProfile}>
        <User size={20} />
        <span className="mobile-nav-tab-label">Account</span>
      </button>
    </div>
  );
}
