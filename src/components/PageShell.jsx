import React from 'react';
import '../styles/pageLayout.css';

/**
 * Shared storefront page wrapper — consistent top spacing, optional hero header, one h1 per page.
 */
export default function PageShell({
  children,
  className = '',
  variant = 'default',
  eyebrow,
  title,
  subtitle,
  top,
  header,
  warm = false,
}) {
  const shellClass = [
    'page-shell',
    variant !== 'default' ? `page-shell--${variant}` : '',
    warm ? 'page-shell--warm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const headerBlock =
    header ||
    (title ? (
      <header className="page-shell__header">
        {eyebrow ? <p className="page-shell__eyebrow">{eyebrow}</p> : null}
        <h1 className="page-shell__title">{title}</h1>
        {subtitle ? <p className="page-shell__subtitle">{subtitle}</p> : null}
      </header>
    ) : null);

  return (
    <div className={shellClass}>
      {top}
      {headerBlock ? <div className="container page-shell__top">{headerBlock}</div> : null}
      {children}
    </div>
  );
}
