import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import app, { startAutoConfirmScheduler } from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const dist = path.join(__dirname, '../dist');

// Always serve product images from dist (needed by Vite dev proxy too)
app.use(express.static(dist, { index: false }));

if (process.env.NODE_ENV === 'production') {
  app.get('*', (_req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`trendkaari API running on http://localhost:${PORT}`);
  console.log('Admin panel: /admin');
  startAutoConfirmScheduler();
});
