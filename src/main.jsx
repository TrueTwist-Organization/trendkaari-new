import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/pageLayout.css';
import './styles/responsive.css';
import App from './App.jsx';
import AdminApp from './admin/AdminApp.jsx';
import { adSlotsToCodeMap } from './utils/adSlots';
import { injectTrackingScriptsFromHtml } from './utils/injectTrackingScripts';
import { preloadAdLibraries } from './utils/preloadAds';
import { installScrollRestoration } from './utils/scrollToTop';

const isAdminRoute =
  typeof window !== 'undefined' &&
  (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/'));

async function preloadTrackingAds() {
  try {
    const res = await fetch('/api/store/ad-slots');
    if (res.ok) {
      const data = await res.json();
      const codes = adSlotsToCodeMap(data?.adSlots || []);
      if (codes.site_common_ad) {
        injectTrackingScriptsFromHtml(codes.site_common_ad, 'site_common_ad');
      }
      void preloadAdLibraries(codes);
      return;
    }
  } catch {
    /* fall through */
  }
  void preloadAdLibraries();
}

function bootstrap() {
  if (!isAdminRoute) {
    installScrollRestoration();
    void preloadTrackingAds();
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>{isAdminRoute ? <AdminApp /> : <App />}</StrictMode>,
  );
}

bootstrap();
