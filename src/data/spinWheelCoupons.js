/** Spin wheel prize codes — merged into storefront coupon list at runtime. */

export const SPIN_WHEEL_COUPONS = [
  { code: 'SPIN5', discount: 5, discountType: 'percent', minPurchase: 499, source: 'spin' },
  { code: 'SPIN10', discount: 10, discountType: 'percent', minPurchase: 799, source: 'spin' },
  { code: 'SPIN15', discount: 15, discountType: 'percent', minPurchase: 999, source: 'spin' },
  { code: 'SPIN50', discount: 50, discountType: 'flat', minPurchase: 799, source: 'spin' },
  { code: 'SPIN75', discount: 75, discountType: 'flat', minPurchase: 599, source: 'spin' },
  { code: 'SPIN100', discount: 100, discountType: 'flat', minPurchase: 1499, source: 'spin' },
  { code: 'SPINFREE', discount: 49, discountType: 'flat', minPurchase: 399, source: 'spin' },
];

export function mergeSpinWheelCoupons(coupons = []) {
  const list = Array.isArray(coupons) ? [...coupons] : [];
  const codes = new Set(list.map((c) => String(c.code || '').toUpperCase()));
  for (const spin of SPIN_WHEEL_COUPONS) {
    if (!codes.has(spin.code)) list.push(spin);
  }
  return list;
}

export function getSpinCouponByCode(code) {
  const key = String(code || '').toUpperCase();
  return SPIN_WHEEL_COUPONS.find((c) => c.code === key) || null;
}
