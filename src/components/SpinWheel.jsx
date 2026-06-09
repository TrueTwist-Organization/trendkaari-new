import { useMemo, useState } from 'react';
import { Copy, Check, Sparkles, X } from 'lucide-react';
import {
  SPIN_WHEEL_PRIZES,
  pickSpinPrizeIndex,
  saveSpinClaim,
  getSavedSpinForOrder,
  hasClaimedSpinForOrder,
} from '../constants/spinWheel';
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

export default function SpinWheel({ orderId, orderTotal, onClose }) {
  const savedPrize = useMemo(() => getSavedSpinForOrder(orderId), [orderId]);
  const alreadySpun = hasClaimedSpinForOrder(orderId);

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(savedPrize);
  const [copied, setCopied] = useState(false);

  const wheelGradient = useMemo(() => buildWheelGradient(), []);

  const spin = () => {
    if (spinning || prize || alreadySpun) return;

    const index = pickSpinPrizeIndex();
    const selected = SPIN_WHEEL_PRIZES[index];
    const fullTurns = 5 + Math.floor(Math.random() * 3);
    const centerOffset = index * SEGMENT_DEG + SEGMENT_DEG / 2;
    const target = fullTurns * 360 + (360 - centerOffset);

    setSpinning(true);
    setRotation((prev) => prev + target);

    window.setTimeout(() => {
      setSpinning(false);
      setPrize(selected);
      saveSpinClaim(orderId, selected);
    }, 4200);
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

  return (
    <div className="spin-wheel-overlay" role="dialog" aria-modal="true" aria-label="Spin wheel reward">
      <div className="spin-wheel-modal">
        <button type="button" className="spin-wheel-modal__close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="spin-wheel-modal__head">
          <Sparkles size={20} aria-hidden />
          <div>
            <p className="spin-wheel-modal__eyebrow">₹{orderTotal}+ order reward</p>
            <h2 className="spin-wheel-modal__title">Spin &amp; win!</h2>
            <p className="spin-wheel-modal__sub">
              Your order unlocked a bonus spin. Win a coupon for your next purchase.
            </p>
          </div>
        </div>

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
            <p className="spin-wheel-result__sub">{prize.sublabel}</p>
            {prize.code ? (
              <div className="spin-wheel-result__code-row">
                <code>{prize.code}</code>
                <button type="button" onClick={copyCode}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            ) : (
              <p className="spin-wheel-result__note">Place another ₹1000+ order to spin again.</p>
            )}
          </div>
        ) : (
          <p className="spin-wheel-modal__hint">Tap SPIN to reveal your reward</p>
        )}

        <button type="button" className="spin-wheel-modal__done btn btn-primary" onClick={onClose}>
          Continue shopping
        </button>
      </div>
    </div>
  );
}
