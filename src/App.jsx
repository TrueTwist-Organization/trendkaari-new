import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import ExplorationHomepage from './components/ExplorationHomepage';
import DiscoveryFeed from './components/DiscoveryFeed';
import SiteTopAdStrip from './components/SiteTopAdStrip';
import Footer from './components/Footer';
import InfoPage from './components/InfoPage';
import { getInfoPage } from './data/footerInfoPages';
import MenuDrawer from './components/MenuDrawer';
import SearchDrawer from './components/SearchDrawer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import { loadWishlist, saveWishlist, isInWishlist } from './utils/wishlistStorage';
import { loadCart, saveCart, clearCartStorage } from './utils/cartStorage';
import UserAuthModal from './components/UserAuthModal';
import AccountDrawer from './components/AccountDrawer';
import QuickViewModal from './components/QuickViewModal';
import MobileNavbar from './components/MobileNavbar';
import {
  fetchStoreAdSlots,
  fetchStoreCoupons,
  fetchStoreProducts,
  fetchStoreSettings,
  fetchStoreGiftCombos,
  submitStoreOrder,
} from './api/storeApi';
import { loadCatalogProducts } from './utils/loadCatalog';
import { CATALOG_VERSION_KEY } from './utils/catalogSync';
import { applySiteSettingsToDocument } from './utils/siteSettings';
import { adSlotsToCodeMap } from './utils/adSlots';
import { AD_SLOTS_VERSION_KEY } from './utils/adSlotsSync';
import { resetAdDedupe } from './utils/adDedupe';
import { injectTrackingScriptsFromHtml } from './utils/injectTrackingScripts';
import { preloadAdLibraries } from './utils/preloadAds';
import { scrollToPageTop } from './utils/scrollToTop';
import { runWhenIdle } from './utils/scheduleAdFit';
import { userMe } from './api/userApi';
import { getUserToken, setUserToken } from './api/client';
import { saveCheckoutState } from './checkout/checkoutStorage';
import { normalizeCheckoutSlug } from './checkout/checkoutRoutes';
import {
  mergeProductForDetail,
  parseRouteFromPath,
  resolveProductPage,
} from './utils/resolveProductPage';
import { categoryPath, normalizeCategoryPathname, slugToCategory } from './utils/categorySlug';
import { isValidCelebrityLookId } from './utils/celebrityLooksData';
import { recordCategoryBrowse, recordProductView } from './utils/viewHistory';
import JourneyTracker from './components/JourneyTracker';
import { isValidQuizResult, isValidQuizSlug, prefetchEditorialContent } from './utils/editorialContentData';
import { isValidStyleFinderResultKey } from './data/aiStyleFinder';
import {
  isValidMagazineArticle,
  isValidMagazineCategorySlug,
} from './data/fashionMagazine';
import { isValidKnowledgePageSlug } from './utils/editorialContentData';
import { isValidGameSlug } from './data/fashionGames';
import './App.css';

const MOOD_TO_CATEGORY = {
  wedding: 'lehengas',
  casual: 'kurtas',
  festive: 'sarees',
  minimal: 'tops',
  premium: 'suit sets',
  value: 'kurtas',
};

const ProductDetailPage = lazy(() => import('./components/ProductDetailPage'));
const CollectionListingPage = lazy(() => import('./components/CollectionListingPage'));
const CheckoutFlow = lazy(() => import('./checkout/CheckoutFlow'));
const FashionQuizHub = lazy(() => import('./components/FashionQuizHub'));
const FashionQuizFlow = lazy(() => import('./components/FashionQuizFlow'));
const FashionQuizResult = lazy(() => import('./components/FashionQuizResult'));
const AiStyleFinderFlow = lazy(() => import('./components/AiStyleFinderFlow'));
const AiStyleFinderResult = lazy(() => import('./components/AiStyleFinderResult'));
const FashionMagazineHub = lazy(() => import('./components/FashionMagazineHub'));
const FashionMagazineCategory = lazy(() => import('./components/FashionMagazineCategory'));
const FashionMagazineArticle = lazy(() => import('./components/FashionMagazineArticle'));
const FashionKnowledgeHub = lazy(() => import('./components/FashionKnowledgeHub'));
const FashionKnowledgePage = lazy(() => import('./components/FashionKnowledgePage'));
const ViralFashionHub = lazy(() => import('./components/ViralFashionHub'));
const CelebrityStyleMatch = lazy(() => import('./components/CelebrityStyleMatch'));
const CelebrityLookPage = lazy(() => import('./components/CelebrityLookPage'));
const TrendPage = lazy(() => import('./components/TrendPage'));
const EndlessDiscovery = lazy(() => import('./components/EndlessDiscovery'));
const FashionGamesHub = lazy(() => import('./components/FashionGamesHub'));
const FashionGamePlay = lazy(() => import('./components/FashionGamePlay'));

function RouteFallback() {
  return <div className="route-loading" aria-hidden="true" />;
}

function resolveAppRoute(pathname, productsList, giftCombos = []) {
  const route = parseRouteFromPath(pathname);
  if (route.viewMode === 'info' && route.infoSlug && !getInfoPage(route.infoSlug)) {
    return {
      viewMode: 'home',
      activeCategory: 'all',
      selectedProduct: null,
      isCategoryPage: false,
      infoSlug: null,
      checkoutSlug: null,
      quizSlug: null,
      quizResultKey: null,
      styleFinderResultKey: null,
    };
  }
  if (route.viewMode === 'style-finder-result' && !isValidStyleFinderResultKey(route.styleFinderResultKey)) {
    return {
      ...route,
      viewMode: 'style-finder',
      styleFinderResultKey: null,
    };
  }
  if (route.viewMode === 'knowledge-page' && !isValidKnowledgePageSlug(route.knowledgePageSlug)) {
    return {
      ...route,
      viewMode: 'knowledge',
      knowledgePageSlug: null,
    };
  }
  if (route.viewMode === 'magazine-category' && !isValidMagazineCategorySlug(route.magazineCategorySlug)) {
    return {
      ...route,
      viewMode: 'magazine',
      magazineCategorySlug: null,
      magazineArticleSlug: null,
    };
  }
  if (
    route.viewMode === 'magazine-article' &&
    (!isValidMagazineCategorySlug(route.magazineCategorySlug) ||
      !isValidMagazineArticle(route.magazineCategorySlug, route.magazineArticleSlug))
  ) {
    return {
      ...route,
      viewMode: 'magazine',
      magazineCategorySlug: null,
      magazineArticleSlug: null,
    };
  }
  if (route.viewMode === 'quiz-flow' && !isValidQuizSlug(route.quizSlug)) {
    return {
      ...route,
      viewMode: 'quiz',
      quizSlug: null,
      quizResultKey: null,
    };
  }
  if (
    route.viewMode === 'quiz-result' &&
    (!isValidQuizSlug(route.quizSlug) || !isValidQuizResult(route.quizSlug, route.quizResultKey))
  ) {
    return {
      ...route,
      viewMode: 'quiz',
      quizSlug: null,
      quizResultKey: null,
    };
  }
  if (route.viewMode === 'game-play' && !isValidGameSlug(route.gameSlug)) {
    return {
      ...route,
      viewMode: 'games',
      gameSlug: null,
    };
  }
  if (route.viewMode === 'celebrity-look' && !isValidCelebrityLookId(route.celebrityLookSlug)) {
    return {
      ...route,
      viewMode: 'celebrity-match',
      celebrityLookSlug: null,
    };
  }
  if (route.viewMode === 'checkout') {
    route.checkoutSlug = normalizeCheckoutSlug(route.checkoutSlug || 'bag');
  }
  if (route.productId) {
    route.selectedProduct = resolveProductPage(route.productId, productsList, giftCombos, {
      preferGiftCombo: true,
    });
  }
  return route;
}

export default function App() {
  // Global synchronized states
  const [productsList, setProductsList] = useState([]);

  const [giftCombos, setGiftCombos] = useState([]);

  const getRouteInfo = () => {
    if (typeof window === 'undefined') {
      return resolveAppRoute('/', [], []);
    }
    return resolveAppRoute(window.location.pathname, productsList, giftCombos);
  };

  const bootRoute =
    typeof window !== 'undefined'
      ? resolveAppRoute(window.location.pathname, [], [])
      : resolveAppRoute('/', [], []);

  const [activeCategory, setActiveCategory] = useState(bootRoute.activeCategory);
  const [selectedProduct, setSelectedProduct] = useState(bootRoute.selectedProduct);
  const [viewMode, setViewMode] = useState(bootRoute.viewMode);
  const [isCategoryPage, setIsCategoryPage] = useState(bootRoute.isCategoryPage);
  const [infoSlug, setInfoSlug] = useState(bootRoute.infoSlug ?? null);
  const [checkoutSlug, setCheckoutSlug] = useState(bootRoute.checkoutSlug ?? 'bag');
  const [quizSlug, setQuizSlug] = useState(bootRoute.quizSlug ?? null);
  const [quizResultKey, setQuizResultKey] = useState(bootRoute.quizResultKey ?? null);
  const [styleFinderResultKey, setStyleFinderResultKey] = useState(bootRoute.styleFinderResultKey ?? null);
  const [magazineCategorySlug, setMagazineCategorySlug] = useState(bootRoute.magazineCategorySlug ?? null);
  const [magazineArticleSlug, setMagazineArticleSlug] = useState(bootRoute.magazineArticleSlug ?? null);
  const [knowledgePageSlug, setKnowledgePageSlug] = useState(bootRoute.knowledgePageSlug ?? null);
  const [gameSlug, setGameSlug] = useState(bootRoute.gameSlug ?? null);
  const [celebrityLookSlug, setCelebrityLookSlug] = useState(bootRoute.celebrityLookSlug ?? null);
  const [trendSlug, setTrendSlug] = useState(bootRoute.trendSlug ?? null);

  const [cartItems, setCartItems] = useState(() => loadCart());
  const [wishlistItems, setWishlistItems] = useState(() => loadWishlist());
  
  // Drawer visibility states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  // Simulated Orders database (synced with API when server running)
  const [orders, setOrders] = useState([
    {
      id: 'ORD-894103',
      customerName: 'Aishwarya Sen',
      email: 'aishwarya@yahoo.com',
      phone: '+91 98845 22912',
      address: 'Apt 2B, Gulmohar Court, Sector 15, Vashi, Navi Mumbai, 400703',
      items: [
        {
          id: 1001,
          title: 'Sage Green Cotton Straight Kurta',
          price: 1499,
          selectedSize: 'M',
          quantity: 1,
          image: '/kurtas/Kurtas/1/040A2925_700x.webp'
        }
      ],
      subtotal: 1499,
      discount: 100,
      grandTotal: 1399,
      status: 'Delivered',
      date: '17/05/2026, 04:32 PM'
    },
    {
      id: 'ORD-304212',
      customerName: 'Priya Mukherjee',
      email: 'priya.m@gmail.com',
      phone: '+91 98302 11985',
      address: 'Flat 502, Prestige Tower, Salt Lake, Kolkata, 700091',
      items: [
        {
          id: 1011,
          title: 'Exquisite Emerald Green Silk Lehenga Set',
          price: 2499,
          selectedSize: 'XL',
          quantity: 1,
          image: '/lehengas/Lehengas/1/040A3523_700x.webp'
        }
      ],
      subtotal: 2499,
      discount: 0,
      grandTotal: 2499,
      status: 'Shipped',
      date: '18/05/2026, 11:15 AM'
    }
  ]);

  // Active Dynamic Coupons database
  const [coupons, setCoupons] = useState([
    { code: 'SALE100', discount: 20, discountType: 'flat', minPurchase: 199 },
    { code: 'FESTIVE50', discount: 50, discountType: 'flat', minPurchase: 499 },
  ]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [adCodes, setAdCodes] = useState({});

  // Router Nav Handlers
  const navigateToRoute = (routePath, isNewTab = false) => {
    if (isNewTab) {
      window.open(routePath, '_blank');
      return;
    }

    window.history.pushState({}, '', routePath);
    
    // Parse new route
    const segments = routePath.split('/').filter(Boolean);
    if (segments[0] === 'discover') {
      setActiveCategory('all');
      setViewMode('discover');
      setSelectedProduct(null);
      setIsCategoryPage(false);
      setInfoSlug(null);
      setQuizSlug(null);
      setQuizResultKey(null);
      setStyleFinderResultKey(null);
      setMagazineCategorySlug(null);
      setMagazineArticleSlug(null);
      setKnowledgePageSlug(null);
      scrollToPageTop();
    } else if (segments[0] === 'category') {
      const cat = slugToCategory(segments[1] || 'all');
      recordCategoryBrowse(cat);
      setActiveCategory(cat);
      setViewMode('home');
      setSelectedProduct(null);
      setIsCategoryPage(true);
      setInfoSlug(null);
      setQuizSlug(null);
      setQuizResultKey(null);
      setStyleFinderResultKey(null);
      setMagazineCategorySlug(null);
      setMagazineArticleSlug(null);
      setKnowledgePageSlug(null);
      scrollToPageTop();
    } else if (segments[0] === 'product') {
      const prodId = parseInt(segments[1], 10);
      const found = resolveProductPage(prodId, productsList, giftCombos, {
        preferGiftCombo: false,
      });
      if (found) recordProductView(found);
      setSelectedProduct(found || null);
      setViewMode('product-detail');
      setIsCategoryPage(false);
      setInfoSlug(null);
      setQuizSlug(null);
      setQuizResultKey(null);
      setStyleFinderResultKey(null);
      setMagazineCategorySlug(null);
      setMagazineArticleSlug(null);
      setKnowledgePageSlug(null);
      scrollToPageTop();
    } else if (segments[0] === 'checkout') {
      const slug = normalizeCheckoutSlug(segments[1] || 'bag');
      if (!segments[1]) {
        window.history.replaceState({}, '', `/checkout/${slug}`);
      }
      setCheckoutSlug(slug);
      setViewMode('checkout');
      setActiveCategory('all');
      setSelectedProduct(null);
      setIsCategoryPage(false);
      setInfoSlug(null);
      setQuizSlug(null);
      setQuizResultKey(null);
      setStyleFinderResultKey(null);
      setMagazineCategorySlug(null);
      setMagazineArticleSlug(null);
      setKnowledgePageSlug(null);
      setIsCartOpen(false);
      scrollToPageTop();
    } else if (segments[0] === 'info' && segments[1]) {
      const slug = decodeURIComponent(segments[1]);
      if (getInfoPage(slug)) {
        setInfoSlug(slug);
        setViewMode('info');
        setActiveCategory('all');
        setSelectedProduct(null);
        setIsCategoryPage(false);
        setQuizSlug(null);
        setQuizResultKey(null);
        setStyleFinderResultKey(null);
      setMagazineCategorySlug(null);
      setMagazineArticleSlug(null);
      setKnowledgePageSlug(null);
        scrollToPageTop();
      } else {
        navigateToRoute('/');
      }
    } else if (segments[0] === 'knowledge') {
      setActiveCategory('all');
      setSelectedProduct(null);
      setIsCategoryPage(false);
      setInfoSlug(null);
      setQuizSlug(null);
      setQuizResultKey(null);
      setStyleFinderResultKey(null);
      setMagazineCategorySlug(null);
      setMagazineArticleSlug(null);

      if (!segments[1]) {
        setViewMode('knowledge');
        setKnowledgePageSlug(null);
      } else {
        const slug = decodeURIComponent(segments[1]);
        if (isValidKnowledgePageSlug(slug)) {
          setViewMode('knowledge-page');
          setKnowledgePageSlug(slug);
        } else {
          window.history.replaceState({}, '', '/knowledge');
          setViewMode('knowledge');
          setKnowledgePageSlug(null);
        }
      }
      scrollToPageTop();
    } else if (segments[0] === 'magazine') {
      setActiveCategory('all');
      setSelectedProduct(null);
      setIsCategoryPage(false);
      setInfoSlug(null);
      setQuizSlug(null);
      setQuizResultKey(null);
      setStyleFinderResultKey(null);
      setKnowledgePageSlug(null);

      if (!segments[1]) {
        setViewMode('magazine');
        setMagazineCategorySlug(null);
        setMagazineArticleSlug(null);
      } else if (segments[2]) {
        const cat = segments[1];
        const art = decodeURIComponent(segments[2]);
        if (isValidMagazineCategorySlug(cat) && isValidMagazineArticle(cat, art)) {
          setViewMode('magazine-article');
          setMagazineCategorySlug(cat);
          setMagazineArticleSlug(art);
        } else {
          window.history.replaceState({}, '', '/magazine');
          setViewMode('magazine');
          setMagazineCategorySlug(null);
          setMagazineArticleSlug(null);
        }
      } else if (isValidMagazineCategorySlug(segments[1])) {
        setViewMode('magazine-category');
        setMagazineCategorySlug(segments[1]);
        setMagazineArticleSlug(null);
      } else {
        window.history.replaceState({}, '', '/magazine');
        setViewMode('magazine');
        setMagazineCategorySlug(null);
        setMagazineArticleSlug(null);
      }
      scrollToPageTop();
    } else if (segments[0] === 'style-finder') {
      setActiveCategory('all');
      setSelectedProduct(null);
      setIsCategoryPage(false);
      setInfoSlug(null);
      setQuizSlug(null);
      setQuizResultKey(null);

      if (segments[1] === 'result' && segments[2]) {
        const key = decodeURIComponent(segments[2]);
        if (isValidStyleFinderResultKey(key)) {
          setViewMode('style-finder-result');
          setStyleFinderResultKey(key);
        } else {
          window.history.replaceState({}, '', '/style-finder');
          setViewMode('style-finder');
          setStyleFinderResultKey(null);
      setMagazineCategorySlug(null);
      setMagazineArticleSlug(null);
      setKnowledgePageSlug(null);
        }
      } else {
        setViewMode('style-finder');
        setStyleFinderResultKey(null);
      setMagazineCategorySlug(null);
      setMagazineArticleSlug(null);
      setKnowledgePageSlug(null);
      }
      scrollToPageTop();
    } else if (segments[0] === 'quiz') {
      setActiveCategory('all');
      setSelectedProduct(null);
      setIsCategoryPage(false);
      setInfoSlug(null);
      setStyleFinderResultKey(null);
      setMagazineCategorySlug(null);
      setMagazineArticleSlug(null);
      setKnowledgePageSlug(null);

      if (!segments[1]) {
        setViewMode('quiz');
        setQuizSlug(null);
        setQuizResultKey(null);
      } else if (segments[2] === 'result' && segments[3]) {
        const slug = segments[1];
        const key = decodeURIComponent(segments[3]);
        if (isValidQuizSlug(slug) && isValidQuizResult(slug, key)) {
          setViewMode('quiz-result');
          setQuizSlug(slug);
          setQuizResultKey(key);
        } else {
          window.history.replaceState({}, '', '/quiz');
          setViewMode('quiz');
          setQuizSlug(null);
          setQuizResultKey(null);
        }
      } else if (isValidQuizSlug(segments[1])) {
        setViewMode('quiz-flow');
        setQuizSlug(segments[1]);
        setQuizResultKey(null);
      } else {
        window.history.replaceState({}, '', '/quiz');
        setViewMode('quiz');
        setQuizSlug(null);
        setQuizResultKey(null);
      }
      scrollToPageTop();
    } else if (segments[0] === 'viral') {
      setActiveCategory('all');
      setSelectedProduct(null);
      setIsCategoryPage(false);
      setInfoSlug(null);
      setQuizSlug(null);
      setQuizResultKey(null);
      setStyleFinderResultKey(null);
      setMagazineCategorySlug(null);
      setMagazineArticleSlug(null);
      setKnowledgePageSlug(null);
      setGameSlug(null);
      setViewMode('viral');
      scrollToPageTop();
    } else if (segments[0] === 'celebrity-match') {
      setActiveCategory('all');
      setSelectedProduct(null);
      setIsCategoryPage(false);
      setInfoSlug(null);
      setQuizSlug(null);
      setQuizResultKey(null);
      setStyleFinderResultKey(null);
      setMagazineCategorySlug(null);
      setMagazineArticleSlug(null);
      setKnowledgePageSlug(null);
      setGameSlug(null);
      if (segments[1]) {
        const slug = decodeURIComponent(segments[1]);
        setCelebrityLookSlug(slug);
        setViewMode(isValidCelebrityLookId(slug) ? 'celebrity-look' : 'celebrity-match');
        if (!isValidCelebrityLookId(slug)) {
          window.history.replaceState({}, '', '/celebrity-match');
        }
      } else {
        setCelebrityLookSlug(null);
        setViewMode('celebrity-match');
      }
      scrollToPageTop();
    } else if (segments[0] === 'games') {
      setActiveCategory('all');
      setSelectedProduct(null);
      setIsCategoryPage(false);
      setInfoSlug(null);
      setQuizSlug(null);
      setQuizResultKey(null);
      setStyleFinderResultKey(null);
      setMagazineCategorySlug(null);
      setMagazineArticleSlug(null);
      setKnowledgePageSlug(null);

      if (!segments[1]) {
        setViewMode('games');
        setGameSlug(null);
      } else if (isValidGameSlug(segments[1])) {
        setViewMode('game-play');
        setGameSlug(segments[1]);
      } else {
        window.history.replaceState({}, '', '/games');
        setViewMode('games');
        setGameSlug(null);
      }
      scrollToPageTop();
    } else if (segments[0] === 'trends') {
      setActiveCategory('all');
      setSelectedProduct(null);
      setIsCategoryPage(false);
      setInfoSlug(null);
      setQuizSlug(null);
      setQuizResultKey(null);
      setStyleFinderResultKey(null);
      setMagazineCategorySlug(null);
      setMagazineArticleSlug(null);
      setKnowledgePageSlug(null);
      setGameSlug(null);
      setCelebrityLookSlug(null);
      if (segments[1]) {
        setTrendSlug(segments[1]);
        setViewMode('trend-page');
      } else {
        setTrendSlug(null);
        setViewMode('trends');
      }
      scrollToPageTop();
    } else {
      setActiveCategory('all');
      setViewMode('home');
      setSelectedProduct(null);
      setIsCategoryPage(false);
      setInfoSlug(null);
      setCheckoutSlug('bag');
      setQuizSlug(null);
      setQuizResultKey(null);
      setStyleFinderResultKey(null);
      setMagazineCategorySlug(null);
      setMagazineArticleSlug(null);
      setKnowledgePageSlug(null);
      setGameSlug(null);
      scrollToPageTop();
    }
  };

  useEffect(() => {
    fetchStoreSettings().then((s) => {
      if (s) setSiteSettings(applySiteSettingsToDocument(s));
    });

    runWhenIdle(() => {
      fetchStoreCoupons().then((list) => {
        if (list?.length) setCoupons(list);
      });
      fetchStoreGiftCombos().then((list) => {
        if (list?.length) setGiftCombos(list);
      });
      prefetchEditorialContent();
    });
  }, []);

  useEffect(() => {
    const refreshAds = () => {
      fetchStoreAdSlots().then((list) => {
        const codes = adSlotsToCodeMap(list || []);
        const trackingHtml = codes.site_common_ad || codes.global_banner;
        if (trackingHtml) {
          injectTrackingScriptsFromHtml(trackingHtml, 'site_common_ad');
        }
        void preloadAdLibraries(codes);
        setAdCodes(codes);
      });
    };

    refreshAds();

    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshAds();
    };
    document.addEventListener('visibilitychange', onVisible);

    const onStorage = (e) => {
      if (e.key === AD_SLOTS_VERSION_KEY) refreshAds();
    };
    window.addEventListener('storage', onStorage);

    const pollId = window.setInterval(() => {
      if (document.visibilityState === 'visible') refreshAds();
    }, 60_000);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('storage', onStorage);
      window.clearInterval(pollId);
    };
  }, []);

  // Load catalog first; refetch when tab visible, admin adds product, or on interval
  useEffect(() => {
    const applyCatalog = (list) => {
      if (list?.length) setProductsList(list);
    };

    const refreshCatalog = () => loadCatalogProducts({ force: true }).then(applyCatalog);

    loadCatalogProducts().then(applyCatalog);

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      refreshCatalog();
    };
    document.addEventListener('visibilitychange', onVisible);

    const onStorage = (e) => {
      if (e.key === CATALOG_VERSION_KEY) refreshCatalog();
    };
    window.addEventListener('storage', onStorage);

    const pollId = window.setInterval(() => {
      if (document.visibilityState === 'visible') refreshCatalog();
    }, 20_000);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('storage', onStorage);
      window.clearInterval(pollId);
    };
  }, []);

  // Resolve PDP after catalog / gift combos load (direct URL, refresh)
  useEffect(() => {
    if (viewMode !== 'product-detail') return;
    const route = parseRouteFromPath(window.location.pathname);
    if (!route.productId) return;
    if (selectedProduct?.id === route.productId) return;
    if (!productsList.length) return;

    const resolved = resolveProductPage(route.productId, productsList, giftCombos, {
      preferGiftCombo: true,
    });
    if (resolved) setSelectedProduct(resolved);
  }, [productsList, giftCombos, viewMode, selectedProduct?.id]);

  // Resolve PDP after catalog loads (direct URL / refresh)
  useEffect(() => {
    if (viewMode !== 'product-detail' || productsList.length) return;
    const route = parseRouteFromPath(window.location.pathname);
    if (!route.productId) return;

    loadCatalogProducts().then((list) => {
      if (!list?.length) return;
      setProductsList(list);
      const resolved = resolveProductPage(route.productId, list, giftCombos, {
        preferGiftCombo: true,
      });
      if (resolved) setSelectedProduct(resolved);
    });
  }, [viewMode, giftCombos, productsList.length]);

  // Restore user session from token
  useEffect(() => {
    if (!getUserToken()) return;
    userMe()
      .then((data) => setUser(data.user))
      .catch(() => setUserToken(null));
  }, []);

  // Clean legacy category URLs (/category/dupatta%20sets → /category/dupatta-sets)
  useEffect(() => {
    const clean = normalizeCategoryPathname(window.location.pathname);
    if (clean === window.location.pathname) return;

    window.history.replaceState({}, '', clean);
    const route = resolveAppRoute(clean, productsList, giftCombos);
    setActiveCategory(route.activeCategory);
    setViewMode(route.viewMode);
    setSelectedProduct(route.selectedProduct);
    setIsCategoryPage(route.isCategoryPage);
    setInfoSlug(route.infoSlug ?? null);
    setCheckoutSlug(route.checkoutSlug ?? 'bag');
    setQuizSlug(route.quizSlug ?? null);
    setQuizResultKey(route.quizResultKey ?? null);
    setStyleFinderResultKey(route.styleFinderResultKey ?? null);
    setMagazineCategorySlug(route.magazineCategorySlug ?? null);
    setMagazineArticleSlug(route.magazineArticleSlug ?? null);
    setKnowledgePageSlug(route.knowledgePageSlug ?? null);
    setGameSlug(route.gameSlug ?? null);
    setCelebrityLookSlug(route.celebrityLookSlug ?? null);
    setTrendSlug(route.trendSlug ?? null);
  }, [productsList, giftCombos]);

  // Listen to popstate event (browser back/forward button clicks)
  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteInfo();
      setActiveCategory(route.activeCategory);
      setViewMode(route.viewMode);
      setSelectedProduct(route.selectedProduct);
      setIsCategoryPage(route.isCategoryPage);
      setInfoSlug(route.infoSlug ?? null);
      setCheckoutSlug(route.checkoutSlug ?? 'bag');
      setQuizSlug(route.quizSlug ?? null);
      setQuizResultKey(route.quizResultKey ?? null);
      setStyleFinderResultKey(route.styleFinderResultKey ?? null);
      setMagazineCategorySlug(route.magazineCategorySlug ?? null);
      setMagazineArticleSlug(route.magazineArticleSlug ?? null);
      setKnowledgePageSlug(route.knowledgePageSlug ?? null);
      setGameSlug(route.gameSlug ?? null);
      setCelebrityLookSlug(route.celebrityLookSlug ?? null);
      setTrendSlug(route.trendSlug ?? null);
      scrollToPageTop();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [productsList, giftCombos]);

  useEffect(() => {
    scrollToPageTop();
  }, [viewMode, isCategoryPage, activeCategory, infoSlug, checkoutSlug, quizSlug, quizResultKey, styleFinderResultKey, magazineCategorySlug, magazineArticleSlug, knowledgePageSlug, gameSlug, celebrityLookSlug, trendSlug, selectedProduct?.id]);

  useEffect(() => {
    document.body.classList.toggle('home-page', viewMode === 'home' && !isCategoryPage);
    document.body.classList.toggle('category-page', isCategoryPage);
    document.body.classList.toggle('discover-page', viewMode === 'discover');
    document.body.classList.toggle('info-page', viewMode === 'info');
    document.body.classList.toggle('checkout-page', viewMode === 'checkout');
    document.body.classList.toggle(
      'quiz-page',
      viewMode === 'quiz' || viewMode === 'quiz-flow' || viewMode === 'quiz-result',
    );
    document.body.classList.toggle(
      'style-finder-page',
      viewMode === 'style-finder' || viewMode === 'style-finder-result',
    );
    document.body.classList.toggle(
      'magazine-page',
      viewMode === 'magazine' || viewMode === 'magazine-category' || viewMode === 'magazine-article',
    );
    document.body.classList.toggle(
      'knowledge-page',
      viewMode === 'knowledge' || viewMode === 'knowledge-page',
    );
    document.body.classList.toggle('viral-page', viewMode === 'viral');
    document.body.classList.toggle(
      'celebrity-match-page',
      viewMode === 'celebrity-match' || viewMode === 'celebrity-look',
    );
    document.body.classList.toggle(
      'games-page',
      viewMode === 'games' || viewMode === 'game-play',
    );
    return () => {
      document.body.classList.remove('home-page');
      document.body.classList.remove('category-page');
      document.body.classList.remove('discover-page');
      document.body.classList.remove('info-page');
      document.body.classList.remove('checkout-page');
      document.body.classList.remove('quiz-page');
      document.body.classList.remove('style-finder-page');
      document.body.classList.remove('magazine-page');
      document.body.classList.remove('knowledge-page');
      document.body.classList.remove('viral-page');
      document.body.classList.remove('celebrity-match-page');
      document.body.classList.remove('games-page');
    };
  }, [isCategoryPage, viewMode]);

  /* Pause top-bar animation while scrolling (reduces visible “shake”) */
  useEffect(() => {
    let scrollEndTimer;
    const onScroll = () => {
      document.body.classList.add('is-scrolling');
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 180);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scrollEndTimer);
      document.body.classList.remove('is-scrolling');
    };
  }, []);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const buildLocalOrder = (orderDetails) => ({
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    customerName: orderDetails.name,
    email: orderDetails.email,
    phone: orderDetails.phone,
    address: orderDetails.address,
    items: orderDetails.items,
    subtotal: orderDetails.subtotal,
    discount: orderDetails.discount ?? 0,
    grandTotal: orderDetails.grandTotal,
    status: 'Pending',
    paymentStatus: orderDetails.paymentMethod === 'cod' ? 'COD' : 'Paid',
    paymentMethod: orderDetails.paymentMethod,
    date: new Date().toLocaleString('en-IN', { hour12: true }),
    createdAt: new Date().toISOString(),
    trackingId: 'TRK' + Math.floor(100000000 + Math.random() * 900000000),
    eta: '3–5 days',
  });

  const handleOpenCheckout = (seed) => {
    if (cartItems.length === 0) return;
    const partial = { step: 0 };
    if (seed?.appliedCoupon) {
      partial.coupon = { code: seed.appliedCoupon.code, applied: seed.appliedCoupon };
    }
    saveCheckoutState(partial);
    setIsCartOpen(false);
    navigateToRoute('/checkout/bag');
  };

  const handleExitCheckout = () => {
    navigateToRoute('/');
  };

  const handleNavigateCheckout = (path) => {
    if (typeof path === 'string' && path.startsWith('/')) {
      navigateToRoute(path);
    }
  };

  const handleCheckoutPlaceOrder = async (orderDetails) => {
    try {
      const result = await submitStoreOrder(orderDetails);
      const newOrder = result?.order;
      if (!newOrder) {
        throw new Error('We could not complete your order due to a technical issue.');
      }

      const orderHasEmail = Boolean(
        orderDetails.email?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderDetails.email.trim())
      );
      if (orderHasEmail && result.emailSent !== true) {
        setOrders((prev) => [newOrder, ...prev]);
        throw new Error(
          'Confirmation email could not be sent. Please try checkout again in a few minutes.'
        );
      }

      setOrders((prev) => [newOrder, ...prev]);
      const refreshed = await fetchStoreProducts();
      if (refreshed?.length) setProductsList(refreshed);
      setCartItems([]);
      clearCartStorage();
      return {
        order: {
          ...newOrder,
          trackingId: newOrder.trackingId || 'TRK' + Math.floor(100000000 + Math.random() * 900000000),
          eta: newOrder.eta || '3–5 days',
        },
        emailSent: true,
      };
    } catch (err) {
      if (err?.status === 401) {
        setPendingCheckout(true);
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
        throw new Error(err?.message || 'Please sign in to place your order.');
      }
      throw new Error(
        err?.message || 'We could not complete your order due to a technical issue. Please try again.'
      );
    }
  };

  // Shopper Shopping Bag Actions
  const handleAddToCart = (product, size, qty = 1) => {
    const resolvedSize =
      size || product?.selectedSize || product?.sizes?.[0] || 'M';
    if (!resolvedSize) {
      alert('Please select a size first!');
      return;
    }

    setIsWishlistOpen(false);

    setCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex(
        (item) => item.id === product.id && item.selectedSize === resolvedSize
      );

      if (existingIdx > -1) {
        const updated = [...prevItems];
        updated[existingIdx].quantity += qty;
        return updated;
      } else {
        return [...prevItems, { ...product, selectedSize: resolvedSize, quantity: qty }];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateQty = (productId, size, newQty) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId && item.selectedSize === size
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (productId, size) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === productId && item.selectedSize === size))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
    clearCartStorage();
  };

  const handleSelectCategory = (category) => {
    if (category === 'home') {
      navigateToRoute('/');
      return;
    }
    if (category === 'all') {
      recordCategoryBrowse('all');
      navigateToRoute(categoryPath('all'));
      return;
    }
    recordCategoryBrowse(category);
    navigateToRoute(categoryPath(category));
  };

  const handleSelectMood = (moodId) => {
    const category = MOOD_TO_CATEGORY[moodId] || 'kurtas';
    handleSelectCategory(category);
  };

  const handleOpenDiscover = () => {
    navigateToRoute('/discover');
  };

  const handleOpenViralHub = () => {
    navigateToRoute('/viral');
  };

  const handleOpenGamesHub = () => {
    navigateToRoute('/games');
  };

  const handleStartGame = (slug) => {
    navigateToRoute(`/games/${slug}`);
  };

  const handleOpenQuizHub = () => {
    navigateToRoute('/quiz');
  };

  const handleOpenStyleFinder = () => {
    navigateToRoute('/style-finder');
  };

  const handleOpenMagazine = () => {
    navigateToRoute('/magazine');
  };

  const handleOpenMagazineCategory = (categorySlug) => {
    navigateToRoute(`/magazine/${categorySlug}`);
  };

  const handleOpenMagazineArticle = (categorySlug, articleSlug) => {
    navigateToRoute(`/magazine/${categorySlug}/${encodeURIComponent(articleSlug)}`);
  };

  const handleOpenKnowledge = () => {
    navigateToRoute('/knowledge');
  };

  const handleOpenKnowledgePage = (slug) => {
    navigateToRoute(`/knowledge/${encodeURIComponent(slug)}`);
  };

  const handleOpenQuickView = (payload) => {
    const id = payload?.id ?? payload?.productId;
    if (!id) return;

    const merged = mergeProductForDetail(payload, productsList);
    if (merged) {
      setSelectedProduct(merged);
      setViewMode('product-detail');
      setIsCategoryPage(false);
      setInfoSlug(null);
      setActiveCategory('all');
      window.history.pushState({}, '', `/product/${id}`);
      scrollToPageTop();
      return;
    }

    navigateToRoute(`/product/${id}`);
  };

  const handleCloseQuickView = () => {
    setSelectedProduct(null);
    setIsQuickViewOpen(false);
  };

  const handleUserLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    if (pendingCheckout) {
      setPendingCheckout(false);
      navigateToRoute('/checkout/bag');
    }
  };

  const handleOpenProfile = () => {
    if (user) {
      setIsAccountOpen(true);
    } else {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const handleRequireLogin = () => {
    setPendingCheckout(true);
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleUserLogout = () => {
    setUser(null);
  };

  const handleAddToWishlist = (product, selectedSize) => {
    if (!product?.id) return;
    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        setIsWishlistOpen(true);
        return prev;
      }
      const next = [
        ...prev,
        {
          ...product,
          selectedSize: selectedSize || product.sizes?.[0] || null,
          savedAt: Date.now(),
        },
      ];
      saveWishlist(next);
      return next;
    });
    setIsWishlistOpen(true);
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlistItems((prev) => {
      const next = prev.filter((item) => item.id !== productId);
      saveWishlist(next);
      return next;
    });
  };

  const handleOpenWishlist = () => {
    setIsWishlistOpen(true);
  };

  const handleNavigateInfoPage = (slug) => {
    navigateToRoute(`/info/${encodeURIComponent(slug)}`);
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      return;
    }
    navigateToRoute('/');
  };

  const handleScrollToSection = (sectionId) => {
    const scroll = () =>
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (viewMode === 'home' && !isCategoryPage) {
      scroll();
      return;
    }

    navigateToRoute('/');
    setTimeout(scroll, 350);
  };

  const adPageKey =
    viewMode === 'checkout'
      ? `checkout-${checkoutSlug}`
      : viewMode === 'product-detail'
        ? `product-${selectedProduct?.id || 'none'}`
        : isCategoryPage
          ? `category-${activeCategory}`
          : viewMode === 'info'
            ? `info-${infoSlug}`
            : viewMode === 'quiz' || viewMode === 'quiz-flow' || viewMode === 'quiz-result'
              ? `quiz-${quizSlug || 'hub'}-${quizResultKey || 'flow'}`
              : viewMode === 'style-finder' || viewMode === 'style-finder-result'
                ? `style-finder-${styleFinderResultKey || 'flow'}`
                : viewMode === 'magazine' || viewMode === 'magazine-category' || viewMode === 'magazine-article'
                  ? `magazine-${magazineCategorySlug || 'hub'}-${magazineArticleSlug || 'list'}`
                  : viewMode === 'knowledge' || viewMode === 'knowledge-page'
                    ? `knowledge-${knowledgePageSlug || 'hub'}`
                    : viewMode === 'viral'
                      ? 'viral-hub'
                      : viewMode === 'celebrity-match'
                        ? 'celebrity-match'
                        : viewMode === 'games' || viewMode === 'game-play'
                        ? `games-${gameSlug || 'hub'}`
            : 'home';
  resetAdDedupe(adPageKey);

  return (
    <div className="app-container">
      <JourneyTracker
        routeContext={{
          viewMode,
          isCategoryPage,
          activeCategory,
          selectedProductId: selectedProduct?.id,
          infoSlug,
          checkoutSlug,
          quizSlug,
          quizResultKey,
          styleFinderResultKey,
          magazineCategorySlug,
          magazineArticleSlug,
          knowledgePageSlug,
          gameSlug,
          selectedProduct,
        }}
      />

      {/* Sticky Header */}
      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlistItems.length}
        user={user}
        solidHeader={viewMode === 'home' || viewMode === 'product-detail' || isCategoryPage || viewMode === 'info' || viewMode === 'discover' || viewMode === 'viral' || viewMode === 'celebrity-match' || viewMode === 'celebrity-look' || viewMode === 'trends' || viewMode === 'trend-page' || viewMode === 'games' || viewMode === 'game-play' || viewMode === 'quiz' || viewMode === 'quiz-flow' || viewMode === 'quiz-result' || viewMode === 'style-finder' || viewMode === 'style-finder-result' || viewMode === 'magazine' || viewMode === 'magazine-category' || viewMode === 'magazine-article' || viewMode === 'knowledge' || viewMode === 'knowledge-page'}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={handleOpenWishlist}
        onOpenProfile={handleOpenProfile}
        onLogoClick={() => {
          navigateToRoute('/');
        }}
      />

      {viewMode !== 'checkout' && (
        <>
          <SiteTopAdStrip
            code={adCodes.site_common_ad || adCodes.global_banner}
            slotKey="site_common_ad"
          />
          {adCodes.site_common_ad && adCodes.global_banner ? (
            <SiteTopAdStrip code={adCodes.global_banner} slotKey="global_banner" />
          ) : null}
          {viewMode === 'home' && !isCategoryPage ? (
            <SiteTopAdStrip code={adCodes.homepage_below_header || adCodes.home_below_header} slotKey="homepage_below_header" />
          ) : null}
        </>
      )}

      {/* Main Page Layout */}
      <main className={`main-content ${viewMode === 'checkout' ? 'main-content--checkout' : ''}`}>
        <Suspense fallback={<RouteFallback />}>
        {viewMode === 'info' ? (
          <InfoPage
            slug={infoSlug}
            adCodes={adCodes}
            onBack={handleGoBack}
            onBackToHome={() => navigateToRoute('/')}
            onOpenAccount={handleOpenProfile}
            products={productsList}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenArticle={handleOpenMagazineArticle}
            onOpenKnowledgePage={handleOpenKnowledgePage}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
          />
        ) : viewMode === 'checkout' ? null : viewMode === 'discover' ? (
          <DiscoveryFeed
            products={productsList}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenArticle={handleOpenMagazineArticle}
            onOpenKnowledgePage={handleOpenKnowledgePage}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            adCodes={adCodes}
            fullPage
            maxRails={14}
          />
        ) : viewMode === 'viral' ? (
          <ViralFashionHub
            products={productsList}
            adCodes={adCodes}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenArticle={handleOpenMagazineArticle}
            onOpenKnowledgePage={handleOpenKnowledgePage}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            onBack={() => navigateToRoute('/discover')}
          />
        ) : viewMode === 'celebrity-match' ? (
          <Suspense fallback={<RouteFallback />}>
            <CelebrityStyleMatch
              products={productsList}
              adCodes={adCodes}
              onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
              onSelectCategory={handleSelectCategory}
              onOpenArticle={handleOpenMagazineArticle}
              onOpenKnowledgePage={handleOpenKnowledgePage}
              onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
              onNavigate={navigateToRoute}
              onBack={() => navigateToRoute('/')}
            />
          </Suspense>
        ) : viewMode === 'celebrity-look' ? (
          <Suspense fallback={<RouteFallback />}>
            <CelebrityLookPage
              lookId={celebrityLookSlug}
              products={productsList}
              adCodes={adCodes}
              onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
              onSelectCategory={handleSelectCategory}
              onOpenArticle={handleOpenMagazineArticle}
              onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
              onOpenKnowledgePage={handleOpenKnowledgePage}
              onNavigate={navigateToRoute}
              onBack={() => navigateToRoute('/celebrity-match')}
            />
          </Suspense>
        ) : viewMode === 'trends' || viewMode === 'trend-page' ? (
          <Suspense fallback={<RouteFallback />}>
            <TrendPage
              trendSlug={viewMode === 'trend-page' ? trendSlug : null}
              products={productsList}
              adCodes={adCodes}
              onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
              onSelectCategory={handleSelectCategory}
              onOpenArticle={handleOpenMagazineArticle}
              onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
              onOpenKnowledgePage={handleOpenKnowledgePage}
              onNavigate={navigateToRoute}
              onBack={() => navigateToRoute('/trends')}
            />
          </Suspense>
        ) : viewMode === 'games' ? (
          <FashionGamesHub
            products={productsList}
            adCodes={adCodes}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenArticle={handleOpenMagazineArticle}
            onOpenKnowledgePage={handleOpenKnowledgePage}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            onStartGame={handleStartGame}
            onBack={() => navigateToRoute('/')}
          />
        ) : viewMode === 'game-play' ? (
          <FashionGamePlay
            gameSlug={gameSlug}
            products={productsList}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenArticle={handleOpenMagazineArticle}
            onOpenKnowledgePage={handleOpenKnowledgePage}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            onBackToHub={handleOpenGamesHub}
            onBackToHome={() => navigateToRoute('/')}
          />
        ) : viewMode === 'knowledge' ? (
          <FashionKnowledgeHub
            onOpenPage={handleOpenKnowledgePage}
            onBack={() => navigateToRoute('/')}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            onNavigate={navigateToRoute}
            adCodes={adCodes}
          />
        ) : viewMode === 'knowledge-page' ? (
          <FashionKnowledgePage
            pageSlug={knowledgePageSlug}
            products={productsList}
            adCodes={adCodes}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenArticle={handleOpenMagazineArticle}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            onOpenPage={handleOpenKnowledgePage}
            onBackToHub={handleOpenKnowledge}
            onBackToHome={() => navigateToRoute('/')}
            onNavigate={navigateToRoute}
          />
        ) : viewMode === 'magazine' ? (
          <FashionMagazineHub
            products={productsList}
            adCodes={adCodes}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenKnowledgePage={handleOpenKnowledgePage}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            onOpenCategory={handleOpenMagazineCategory}
            onOpenArticle={handleOpenMagazineArticle}
            onBack={() => navigateToRoute('/')}
          />
        ) : viewMode === 'magazine-category' ? (
          <FashionMagazineCategory
            categorySlug={magazineCategorySlug}
            products={productsList}
            adCodes={adCodes}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenKnowledgePage={handleOpenKnowledgePage}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            onOpenArticle={handleOpenMagazineArticle}
            onOpenCategory={handleOpenMagazineCategory}
            onBackToHub={handleOpenMagazine}
            onBackToHome={() => navigateToRoute('/')}
          />
        ) : viewMode === 'magazine-article' ? (
          <FashionMagazineArticle
            categorySlug={magazineCategorySlug}
            articleSlug={magazineArticleSlug}
            products={productsList}
            adCodes={adCodes}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenKnowledgePage={handleOpenKnowledgePage}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            onOpenArticle={handleOpenMagazineArticle}
            onOpenCategory={handleOpenMagazineCategory}
            onBackToCategory={() => handleOpenMagazineCategory(magazineCategorySlug)}
            onBackToHub={handleOpenMagazine}
            onBackToHome={() => navigateToRoute('/')}
            onNavigate={navigateToRoute}
          />
        ) : viewMode === 'style-finder' ? (
          <AiStyleFinderFlow
            products={productsList}
            adCodes={adCodes}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenArticle={handleOpenMagazineArticle}
            onOpenKnowledgePage={handleOpenKnowledgePage}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            onComplete={(key) => navigateToRoute(`/style-finder/result/${encodeURIComponent(key)}`)}
            onBack={() => navigateToRoute('/')}
            onExit={() => navigateToRoute('/')}
          />
        ) : viewMode === 'style-finder-result' ? (
          <AiStyleFinderResult
            resultKey={styleFinderResultKey}
            products={productsList}
            adCodes={adCodes}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenArticle={handleOpenMagazineArticle}
            onOpenKnowledgePage={handleOpenKnowledgePage}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            onOpenDiscover={handleOpenDiscover}
            onRetake={() => navigateToRoute('/style-finder')}
            onBack={() => navigateToRoute('/style-finder')}
          />
        ) : viewMode === 'quiz' ? (
          <FashionQuizHub
            products={productsList}
            adCodes={adCodes}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenArticle={handleOpenMagazineArticle}
            onOpenKnowledgePage={handleOpenKnowledgePage}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            onBack={() => navigateToRoute('/')}
            onOpenStyleFinder={handleOpenStyleFinder}
          />
        ) : viewMode === 'quiz-flow' ? (
          <FashionQuizFlow
            quizSlug={quizSlug}
            products={productsList}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenArticle={handleOpenMagazineArticle}
            onOpenKnowledgePage={handleOpenKnowledgePage}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            onComplete={(resultKey) => navigateToRoute(`/quiz/${quizSlug}/result/${resultKey}`)}
            onBack={() => navigateToRoute('/quiz')}
            onExit={() => navigateToRoute('/')}
          />
        ) : viewMode === 'quiz-result' ? (
          <FashionQuizResult
            quizSlug={quizSlug}
            resultKey={quizResultKey}
            products={productsList}
            adCodes={adCodes}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenArticle={handleOpenMagazineArticle}
            onOpenKnowledgePage={handleOpenKnowledgePage}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            onOpenDiscover={handleOpenDiscover}
            onRetake={() => navigateToRoute(`/quiz/${quizSlug}`)}
            onBackToHub={() => navigateToRoute('/quiz')}
            onNavigate={navigateToRoute}
          />
        ) : viewMode === 'home' ? (
          <>
            {isCategoryPage ? (
              <CollectionListingPage
                adCodes={adCodes}
                activeCategory={activeCategory}
                onSelectCategory={handleSelectCategory}
                onAddToCart={handleAddToCart}
                onOpenQuickView={handleOpenQuickView}
                onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
                onBack={handleGoBack}
                onBackToHome={() => navigateToRoute('/')}
                products={productsList}
                onOpenKnowledgePage={handleOpenKnowledgePage}
                onOpenArticle={handleOpenMagazineArticle}
                onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
              />
            ) : (
              <ExplorationHomepage
                products={productsList}
                adCodes={adCodes}
                onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
                onSelectCategory={handleSelectCategory}
                onOpenDiscover={handleOpenDiscover}
                onNavigateDiscovery={navigateToRoute}
                onOpenArticle={handleOpenMagazineArticle}
                onSelectMood={handleSelectMood}
              />
            )}
          </>
        ) : viewMode === 'product-detail' && !selectedProduct ? (
          !productsList.length ? (
            <RouteFallback />
          ) : (
          <div className="product-not-found container">
            <h1>Product not found</h1>
            <p>This item may have been removed or the link is incorrect.</p>
            <button type="button" className="btn btn-primary" onClick={() => navigateToRoute('/')}>
              Back to home
            </button>
            <EndlessDiscovery
              allProducts={productsList}
              onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
              onSelectCategory={handleSelectCategory}
              onOpenArticle={handleOpenMagazineArticle}
              onOpenKnowledgePage={handleOpenKnowledgePage}
              onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
              variant="browse"
              title="Keep exploring"
              subtitle="Similar products, related collections, articles, quizzes, and trending picks."
              compact
              showAds={false}
            />
          </div>
          )
        ) : (
          <ProductDetailPage
            product={selectedProduct}
            adCodes={adCodes}
            onBack={handleGoBack}
            onBackToHome={() => {
              if (activeCategory && activeCategory !== 'all') {
                navigateToRoute(categoryPath(activeCategory));
              } else {
                navigateToRoute('/');
              }
            }}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            isInWishlist={selectedProduct ? isInWishlist(wishlistItems, selectedProduct.id) : false}
            allProducts={productsList}
            onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
            onSelectCategory={handleSelectCategory}
            onOpenArticle={handleOpenMagazineArticle}
            onOpenKnowledgePage={handleOpenKnowledgePage}
            onStartQuiz={(slug) => navigateToRoute(`/quiz/${slug}`)}
            onNavigate={navigateToRoute}
            coupons={coupons}
          />
        )}

        </Suspense>
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenAccount={handleOpenProfile}
        onScrollToSection={handleScrollToSection}
        onNavigateInfoPage={handleNavigateInfoPage}
        onOpenMagazine={handleOpenMagazine}
        onOpenKnowledge={handleOpenKnowledge}
        onOpenViralHub={handleOpenViralHub}
        onOpenGamesHub={handleOpenGamesHub}
        siteSettings={siteSettings}
      />

      {/* Slide-out Drawers & Overlay views */}
      
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectCategory={handleSelectCategory}
        onOpenDiscover={handleOpenDiscover}
        onOpenQuizHub={handleOpenQuizHub}
        onOpenStyleFinder={handleOpenStyleFinder}
        onOpenMagazine={handleOpenMagazine}
        onOpenKnowledge={handleOpenKnowledge}
        onOpenViralHub={handleOpenViralHub}
        onOpenGamesHub={handleOpenGamesHub}
        onOpenCelebrityMatch={() => navigateToRoute('/celebrity-match')}
        onOpenTrends={() => navigateToRoute('/trends')}
        onNavigateInfoPage={handleNavigateInfoPage}
        onScrollToSection={handleScrollToSection}
      />

      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenQuickView={handleOpenQuickView}
        onSelectCategory={handleSelectCategory}
        products={productsList}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        coupons={coupons}
        onOpenCheckout={handleOpenCheckout}
        user={user}
        adAboveCheckout={adCodes.cart_above_checkout}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        allProducts={productsList}
        onRemoveItem={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
      />

      <Suspense fallback={null}>
      <CheckoutFlow
        isOpen={viewMode === 'checkout'}
        stepSlug={checkoutSlug}
        onNavigateCheckout={handleNavigateCheckout}
        onClose={handleExitCheckout}
        cartItems={cartItems}
        coupons={coupons}
        user={user}
        adCodes={adCodes}
        onUserLogin={handleUserLoginSuccess}
        onPlaceOrder={handleCheckoutPlaceOrder}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onContinueShopping={() => {
          handleExitCheckout();
          navigateToRoute('/');
        }}
        onReviewCart={() => {
          handleExitCheckout();
          setIsCartOpen(true);
        }}
        allProducts={productsList}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
      />
      </Suspense>

      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingCheckout(false);
        }}
        onSuccess={handleUserLoginSuccess}
        initialMode={authModalMode}
      />

      <AccountDrawer
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        onLogout={handleUserLogout}
      />

      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        isInWishlist={selectedProduct ? isInWishlist(wishlistItems, selectedProduct.id) : false}
        allProducts={productsList}
        onSelectProduct={(p) => navigateToRoute(`/product/${p.id}`)}
        coupons={coupons}
      />

      {/* Mobile Bottom sticky bar */}
      <MobileNavbar
        activeCategory={activeCategory}
        viewMode={viewMode}
        onSelectCategory={handleSelectCategory}
        onOpenDiscover={handleOpenDiscover}
        onOpenWishlist={handleOpenWishlist}
        onOpenProfile={handleOpenProfile}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        isCartOpen={isCartOpen}
      />

    </div>
  );
}
