import PlacedAdSlot from './PlacedAdSlot';
import { getAdCode } from '../utils/resolveAdCode';

/** Show the first configured ad from a priority list — one promo break per zone. */
export default function PdpAdZone({ adCodes, placements = [], variant = 'pdp', className = '' }) {
  const hit = placements.find((key) => getAdCode(adCodes, key));
  if (!hit) return null;

  return (
    <div className={`pdp-ad-zone${className ? ` ${className}` : ''}`}>
      <PlacedAdSlot adCodes={adCodes} placement={hit} variant={variant} />
    </div>
  );
}
