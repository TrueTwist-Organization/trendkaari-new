import { useEffect, useMemo, useState } from 'react';
import { Copy, Check, Sparkles, X, Tag } from 'lucide-react';
import {
  SPIN_WHEEL_PRIZES,
  pickSpinPrizeIndex,
  saveSpinClaim,
  getSavedSpinForOrder,
  hasClaimedSpinForOrder,
} from '../constants/spinWheel';
import { getSpinCouponByCode } from '../data/spinWheelCoupons';
import {
  computeCouponDiscountAmount,
  formatCouponDiscountShort,
  getEffectiveDiscountPercent,
} from '../utils/couponDiscount';
import PlacedAdSlot from './PlacedAdSlot';
import './SpinWheel.css';

const SEGMENT_COUNT = SPIN_WHEEL_PRIZES.length;
const SEGMENT_DEG = 360 / SEGMENT_COUNT;

function buildWheelGradient() {
  const stops = SPIN_WHEEL_PRIZES.map((prize, i) => {
    const start = i * SEGMENT_DEG;
    const end = (i + 1) * SEGMENT_DEG;
    return `${prize.color} ${start}deg ${end}deg`;
  });
  return `conic-gradient(from -${SEGMENT_DEG / 2}deg, ${stops.join(', ')})`;
}

export default function SpinWheel({
  orderId,
  orderTotal,
  adCodes = {},
  onClose,
  onShopNow,
  onPrizeWon,
  mode = 'post-order',
  initialPrize = null,
  spinCompleted = false,
}) {
  const isCheckoutMode = mode === 'checkout';
  const savedPrize = useMemo(
    () => (isCheckoutMode ? initialPrize : getSavedSpinForOrder(orderId)),
    [isCheckoutMode, initialPrize, orderId],
  );
  const alreadySpun = isCheckoutMode ? spinCompleted : hasClaimedSpinForOrder(orderId);

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(savedPrize);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isCheckoutMode && initialPrize) {
      setPrize(initialPrize);
    }
  }, [isCheckoutMode, initialPrize]);

  const wheelGradient = useMemo(() => buildWheelGradient(), []);

  const prizeCoupon = useMemo(() => {
    if (!prize?.code) return null;
    return getSpinCouponByCode(prize.code);
  }, [prize]);

  const prizeDiscountAmount = useMemo(() => {
    if (!prizeCoupon || !orderTotal) return 0;
    return computeCouponDiscountAmount(prizeCoupon, orderTotal);
  }, [prizeCoupon, orderTotal]);

  const prizeDiscountPercent = useMemo(() => {
    if (!prizeCoupon || !prizeDiscountAmount) return 0;
    return getEffectiveDiscountPercent(prizeCoupon, orderTotal, prizeDiscountAmount);
  }, [prizeCoupon, orderTotal, prizeDiscountAmount]);

  const finishSpin = (selected) => {
    setSpinning(false);
    setPrize(selected);
    if (isCheckoutMode) {
      onPrizeWon?.(selected);
      return;
    }
    saveSpinClaim(orderId, selected);
  };

  const spin = () => {
    if (spinning || prize || alreadySpun || (isCheckoutMode && spinCompleted)) return;

    const index = pickSpinPrizeIndex();
    const selected = SPIN_WHEEL_PRIZES[index];
    const fullTurns = 5 + Math.floor(Math.random() * 3);
    const centerOffset = index * SEGMENT_DEG + SEGMENT_DEG / 2;
    const target = fullTurns * 360 + (360 - centerOffset);

    setSpinning(true);
    setRotation((prev) => prev + target);

    window.setTimeout(() => finishSpin(selected), 4200);
  };

  const copyCode = async () => {
    if (!prize?.code) return;
    try {
      await navigator.clipboard.writeText(prize.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      alert(`Your code: ${prize.code}`);
    }
  };

  const handlePrimaryAction = () => {
    if (isCheckoutMode) {
      onClose?.();
      return;
    }
    onClose?.();
  };

  return (
    <div className="spin-wheel-overlay" role="dialog" aria-modal="true" aria-label="Spin wheel reward">
      <div className="spin-wheel-modal">
        <button type="button" className="spin-wheel-modal__close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="spin-wheel-modal__head">
          <Sparkles size={20} aria-hidden />
          <div>
            <p className="spin-wheel-modal__eyebrow">
              {isCheckoutMode ? `₹${orderTotal} order — spin before you pay` : `₹${orderTotal}+ order reward`}
            </p>
            <h2 className="spin-wheel-modal__title">Spin &amp; win!</h2>
            <p className="spin-wheel-modal__sub">
              {isCheckoutMode
                ? 'One spin per order. Your reward is applied to this checkout total before you pay.'
                : 'Orders above ₹1000 unlock this spin. Win a discount coupon for your next purchase.'}
            </p>
          </div>
        </div>

        <PlacedAdSlot adCodes={adCodes} placement="spin_wheel_top" variant="inline" />

        <div className="spin-wheel-stage">
          <div className="spin-wheel-pointer" aria-hidden />
          <div
            className={`spin-wheel-disc${spinning ? ' is-spinning' : ''}`}
            style={{
              background: wheelGradient,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {SPIN_WHEEL_PRIZES.map((segment, i) => (
              <span
                key={segment.id}
                className="spin-wheel-disc__label"
                style={{
                  transform: `rotate(${i * SEGMENT_DEG + SEGMENT_DEG / 2}deg)`,
                  color: segment.labelColor || '#fff',
                }}
              >
                {segment.label}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="spin-wheel-disc__hub"
            onClick={spin}
            disabled={spinning || Boolean(prize) || alreadySpun}
          >
            {spinning ? '…' : prize || alreadySpun ? '✓' : 'SPIN'}
          </button>
        </div>

        {prize ? (
          <div className={`spin-wheel-result${prize.code ? '' : ' spin-wheel-result--muted'}`}>
            <p className="spin-wheel-result__label">You won</p>
            <p className="spin-wheel-result__prize">{prize.label}</p>
            {prize.code && prizeDiscountPercent > 0 ? (
              <p className="spin-wheel-result__pct">{prizeDiscountPercent}% discount on this order</p>
            ) : null}
            <p className="spin-wheel-result__sub">{prize.sublabel}</p>
            {prize.code ? (
              <>
                {prizeCoupon ? (
                  <p className="spin-wheel-result__deal">
                    <Tag size={14} aria-hidden />
                    {formatCouponDiscountShort(prizeCoupon)}
                    {prizeDiscountAmount > 0 ? ` · save ₹${prizeDiscountAmount}` : ''}
                  </p>
                ) : null}
                <div className="spin-wheel-result__code-row">
                  <code>{prize.code}</code>
                  <button type="button" onClick={copyCode}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="spin-wheel-result__saved">
                  {isCheckoutMode
                    ? 'Discount applied to this order — pay the reduced total below.'
                    : 'Saved for your next order — discount applies automatically at checkout.'}
                </p>
              </>
            ) : (
              <p className="spin-wheel-result__note">
                {isCheckoutMode
                  ? 'No coupon this time — you can still place your order at full price.'
                  : 'Place another ₹1000+ order to spin again.'}
              </p>
            )}
          </div>
        ) : (
          <p className="spin-wheel-modal__hint">Tap SPIN to reveal your reward</p>
        )}

        <PlacedAdSlot adCodes={adCodes} placement="spin_wheel_bottom" variant="inline" />

        <div className="spin-wheel-modal__actions">
          {prize?.code && onShopNow && !isCheckoutMode ? (
            <button type="button" className="spin-wheel-modal__shop btn btn-primary" onClick={onShopNow}>
              Shop with discount
            </button>
          ) : null}
          <button type="button" className="spin-wheel-modal__done btn btn-primary" onClick={handlePrimaryAction}>
            {isCheckoutMode ? (prize?.code ? 'Pay with discount' : 'Continue to payment') : 'Continue shopping'}
          </button>
        </div>
      </div>
    </div>
  );
}
