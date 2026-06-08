import { getProductDetailContent, parseAboutBullet } from '../utils/productContent';
import './ProductDetailsAmazon.css';

function KeyValueTable({ rows }) {
  if (!rows?.length) return null;
  return (
    <dl className="pdp-amazon-kv">
      {rows.map(([label, value]) => (
        <div key={label} className="pdp-amazon-kv__row">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ProductDetailsAmazon({ product }) {
  const content = getProductDetailContent(product);
  if (!content) return null;

  const highlightRows = content.highlights ? Object.entries(content.highlights) : [];
  const additionalRows = content.additionalInfo ? Object.entries(content.additionalInfo) : [];

  return (
    <div className="pdp-product-details" aria-label="Product details">
      <header className="pdp-details-amazon-head">
        <h2 className="pdp-amazon-main-title">Product details</h2>
        <p className="pdp-details-amazon-dek">Fabric, fit, care, and everything else before you add to bag.</p>
      </header>

      {highlightRows.length > 0 && (
        <article className="pdp-detail-card pdp-detail-card--highlights">
          <h3 className="pdp-detail-card__title">Top highlights</h3>
          <KeyValueTable rows={highlightRows} />
        </article>
      )}

      {content.aboutItems?.length > 0 && (
        <article className="pdp-detail-card pdp-detail-card--about">
          <h3 className="pdp-detail-card__title">About this item</h3>
          <ol className="pdp-amazon-bullets pdp-amazon-bullets--numbered">
            {content.aboutItems.map((item, i) => {
              const { label, body } = parseAboutBullet(item);
              return (
                <li key={i}>
                  {label ? (
                    <>
                      <strong>{label}:</strong> {body}
                    </>
                  ) : (
                    item
                  )}
                </li>
              );
            })}
          </ol>
        </article>
      )}

      <article className="pdp-detail-card pdp-detail-card--description">
        <h3 className="pdp-detail-card__title">Product description</h3>
        <div className="pdp-amazon-desc-box">
          <p>{content.descriptionLong || product.description}</p>
        </div>
        <p className="pdp-amazon-model-note">The model (height 170 cm) is wearing a size S.</p>
      </article>

      {additionalRows.length > 0 && (
        <article className="pdp-detail-card pdp-detail-card--extra">
          <h3 className="pdp-detail-card__title">Additional information</h3>
          <KeyValueTable rows={additionalRows} />
        </article>
      )}
    </div>
  );
}
