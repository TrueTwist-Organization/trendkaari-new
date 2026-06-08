import EndlessDiscovery from './EndlessDiscovery';

/** @deprecated Use EndlessDiscovery directly */
export default function ProductDiscoveryRails(props) {
  return (
    <EndlessDiscovery
      {...props}
      variant="product"
      title="Keep exploring"
      subtitle="Similar products, related collections, articles, quizzes, and trending — at least 10 next clicks."
      showIntro
      showAds
      compact
    />
  );
}
