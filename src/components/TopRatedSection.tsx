import type { CatalogItem } from '../types/catalog';
import { ItemIcon } from './ItemIcon';

interface TopRatedSectionProps {
  items: CatalogItem[];
  onSelectItem: (item: CatalogItem) => void;
}

export function TopRatedSection({ items, onSelectItem }: TopRatedSectionProps) {
  return (
    <section id="top-rated" className="section-block" aria-labelledby="top-rated-heading">
      <div className="container">
        <div className="section-header">
          <div>
            <p className="section-kicker">04 // HIGHEST TRUST RANKING (STATIC DEMO)</p>
            <h2 id="top-rated-heading" className="section-title">
              Top Rated List
            </h2>
          </div>
          <p className="section-desc">সর্বোচ্চ নমুনা রেটিং ও রিভিউয়ের ভিত্তিতে শীর্ষ ডেমো অ্যাপ ও ওয়েবসাইট।</p>
        </div>

        <div className="top-rated-list">
          {items.map((item, idx) => (
            <article key={item.id} className="glass-panel top-rated-row">
              <div className="top-rated-row__left">
                <span className="rank-num">#{String(idx + 1).padStart(2, '0')}</span>
                <ItemIcon glyph={item.iconGlyph} />
                <div style={{ minWidth: 0 }}>
                  <div className="item-card__badges" style={{ marginBottom: '0.2rem' }}>
                    <span className="cyber-badge cyber-badge--muted">
                      {item.type === 'app' ? 'ANDROID APP' : 'WEBSITE'}
                    </span>
                    <span className="cyber-badge cyber-badge--muted">{item.categoryLabel}</span>
                  </div>
                  <h3 className="item-card__title" style={{ marginBottom: 0 }}>
                    {item.name}
                  </h3>
                  <p className="category-card__desc">{item.tagline}</p>
                </div>
              </div>

              <div className="top-rated-row__right">
                <span className="rating-pill">
                  <span className="rating-star" aria-hidden="true">★</span>
                  {item.rating.toFixed(1)}
                  <span className="rating-count">({item.reviewCount} demo)</span>
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ minHeight: '40px', padding: '0.45rem 0.9rem', fontSize: '0.84rem' }}
                  onClick={() => onSelectItem(item)}
                >
                  Inspect
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
