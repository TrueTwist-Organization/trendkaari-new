import React from 'react';

export default class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('[RouteErrorBoundary]', error);
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div className="route-error container">
          <h1>Something went wrong loading this page</h1>
          <p>Try refreshing, or go back to the homepage.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Back to home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
