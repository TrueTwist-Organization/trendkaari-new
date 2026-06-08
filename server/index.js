import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import app, { startAutoConfirmScheduler } from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const dist = path.join(__dirname, '../dist');
const publicDir = path.join(__dirname, '../public');

// Always serve public/ so uploaded product images (/product-media/*) work
// in every environment — dev, Railway, and self-hosted.
app.use(express.static(publicDir, { index: false }));

if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  // Self-hosted production: serve static files + SPA fallback
  app.use(express.static(dist, { index: false }));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
  });
} else if (!process.env.VERCEL) {
  // Local dev: serve dist/ so catalog product images load via Vite proxy
  app.use(express.static(dist, { index: false }));
}

app.listen(PORT, () => {
  console.log(`trendkaari API running on http://localhost:${PORT}`);
  console.log('Admin panel: /admin');
  startAutoConfirmScheduler();
});
