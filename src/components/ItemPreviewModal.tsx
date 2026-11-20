import { useEffect, useRef } from 'react';
import type { CatalogItem } from '../types/catalog';
import { ItemIcon } from './ItemIcon';

interface ItemPreviewModalProps {
  item: CatalogItem | null;
  onClose: () => void;
}

export function ItemPreviewModal({ item, onClose }: ItemPreviewModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  const isOpen = item !== null;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const getFocusableElements = (): HTMLElement[] => {
      const modalElement = modalRef.current;
      if (!modalElement) return [];

      return Array.from(
        modalElement.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
    };

    const focusTimer = window.requestAnimationFrame(() => {
      const focusableElements = getFocusableElements();
      focusableElements[0]?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const modalElement = modalRef.current;
      if (!modalElement) {
        return;
      }

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (!activeElement || !modalElement.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
        return;
      }

      if (event.shiftKey) {
        if (activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;

      const elementToRestore = previousFocusedElementRef.current;
      previousFocusedElementRef.current = null;
      if (elementToRestore && elementToRestore.isConnected) {
        elementToRestore.focus();
      }
    };
  }, [isOpen]);

  if (!item) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-item-title"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="glass-panel glass-panel--elevated modal-card"
        onClick={(e) => e.stopPropagation()}
      >
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
