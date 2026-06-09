import PlacedAdSlot from './PlacedAdSlot';
import { getAdCode } from '../utils/resolveAdCode';

/** Render every filled placement in order — each maps to its admin slot. */
export default function PdpAdZone({ adCodes, placements = [], variant = 'pdp', className = '' }) {
  const hits = placements.filter((key) => getAdCode(adCodes, key));
  if (!hits.length) return null;

  return (
    <div className={`pdp-ad-zone${className ? ` ${className}` : ''}`}>
      {hits.map((placement) => (
        <PlacedAdSlot
          key={placement}
          adCodes={adCodes}
          placement={placement}
          variant={variant}
          ownerKey={placement}
        />
      ))}
    </div>
  );
}
