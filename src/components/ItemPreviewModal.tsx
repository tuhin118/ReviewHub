import { useEffect } from 'react';
import type { CatalogItem } from '../types/catalog';
import { ItemIcon } from './ItemIcon';

interface ItemPreviewModalProps {
  item: CatalogItem | null;
  onClose: () => void;
}

export function ItemPreviewModal({ item, onClose }: ItemPreviewModalProps) {
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-item-title"
      onClick={onClose}
    >
      <div className="glass-panel glass-panel--elevated modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="item-card__header">
            <ItemIcon glyph={item.iconGlyph} />
            <div>
              <div className="item-card__badges">
                <span className="cyber-badge">
                  {item.type === 'app' ? 'ANDROID APP' : 'WEBSITE'}
                </span>
                <span className="cyber-badge cyber-badge--muted">{item.categoryLabel}</span>
              </div>
              <h3 id="modal-item-title" className="item-card__title">
                {item.name}
              </h3>
              <span className="item-card__publisher">
                {item.verifiedPublisher && (
                  <span className="verified-dot">✓ Demo Verified Publisher</span>
                )}
                <span>• {item.publisherName}</span>
                <span>• Demo Domain (Not a Real Website): {item.officialDomain}</span>
              </span>
            </div>
          </div>

          <button type="button" className="icon-btn-sm" aria-label="Close Preview" onClick={onClose}>
            ✕
          </button>
        </div>

        <p className="item-card__desc">{item.description}</p>

        <div className="item-card__footer" style={{ paddingTop: '0.6rem' }}>
          <span className="rating-pill">
            <span className="rating-star" aria-hidden="true">★</span>
            {item.rating.toFixed(1)} Demo Avg
            <span className="rating-count">({item.reviewCount} demo reviews)</span>
          </span>
          <span className="cyber-badge cyber-badge--muted">STATIC DEMO PREVIEW</span>
        </div>

        <div>
          <h4 className="footer-heading" style={{ marginBottom: '0.5rem' }}>
            Sample Approved Reviews (Static Demo)
          </h4>
          <div className="review-preview-list">
            {item.sampleReviews.map((review) => (
              <div key={review.id} className="review-preview-item">
                <div className="review-preview-item__top">
                  <strong>{review.author}</strong>
                  <span className="rating-pill" style={{ fontSize: '0.78rem' }}>
                    <span className="rating-star" aria-hidden="true">★</span>
                    {review.rating}/5 • {review.date}
                  </span>
                </div>
                <p className="item-card__desc" style={{ fontSize: '0.86rem' }}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
