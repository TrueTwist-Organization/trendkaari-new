/** Default hero/thumbnail image per shop category. */

const CATEGORY_IMAGES = {
  kurtas: '/kurtas/Kurtas/1/LBL101KS612_1_700x.webp',
  'suit sets': '/suit-sets/Suit Sets/9/L12.01.25_1930_700x.webp',
  sarees: '/sarees/Sarees/1/0T3A5495_700x.webp',
  lehengas: '/lehengas/Lehengas/1/040A3523_700x.webp',
  'co-ords': '/co-ords/co-ord_set/9/3.webp',
  tops: '/tops/4/1.webp',
  bottoms: '/bottoms/bottom_wear/9/4.webp',
  dresses: '/dresses/ws/Tops/1/shopping.webp',
  blazers: '/mens/jackets/1/1.webp',
  'dupatta sets': '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp',
};

export function getCategoryImage(category, fallback = '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp') {
  const key = String(category || '').toLowerCase().trim();
  return CATEGORY_IMAGES[key] || fallback;
}
