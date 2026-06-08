import EndlessDiscovery from './EndlessDiscovery';

/** @deprecated Use EndlessDiscovery directly */
export default function ProductDiscoveryRails(props) {
  return (
    <EndlessDiscovery
      {...props}
      variant="product"
      title=""
      subtitle=""
      showIntro={false}
      showAds
      compact
    />
  );
}
