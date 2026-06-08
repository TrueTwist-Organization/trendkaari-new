import React from 'react';
import EndlessDiscovery from './EndlessDiscovery';

/** Unified endless discovery — wraps EndlessDiscovery for backward compatibility. */
export default function RecommendationRails(props) {
  return <EndlessDiscovery {...props} />;
}
