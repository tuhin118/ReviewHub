import type { CatalogItem } from '../types/catalog';
import { ItemIcon } from './ItemIcon';

interface TrendingSectionProps {
  items: CatalogItem[];
  onSelectItem: (item: CatalogItem) => void;
}

export function TrendingSection({ items, onSelectItem }: TrendingSectionProps) {
  return (
    <section id="trending" className="section-block" aria-labelledby="trending-heading">
      <div className="container">
        <div className="section-header">
          <div>
            <p className="section-kicker">01 // VELOCITY INDEX (STATIC DEMO)</p>
            <h2 id="trending-heading" className="section-title">
              Trending Apps &amp; Websites
            </h2>
          </div>
          <p className="section-desc">এই সপ্তাহের নমুনা জনপ্রিয় টুলসমূহ (Static Demo Data)।</p>
        </div>

        <div className="trending-grid">
          {items.map((item) => (
            <article key={item.id} className="glass-panel trending-card">
              <div className="trending-card__top">
                <ItemIcon glyph={item.iconGlyph} />
                {item.trendDelta && <span className="trend-delta">DEMO {item.trendDelta}</span>}
              </div>

              <div>
                <span className="cyber-badge cyber-badge--muted" style={{ marginBottom: '0.45rem' }}>
                  {item.type === 'app' ? 'ANDROID APP' : 'WEBSITE'}
                </span>
                <h3 className="item-card__title">{item.name}</h3>
                <p className="category-card__desc">{item.tagline}</p>
              </div>

              <div className="item-card__footer">
                <span className="rating-pill">
                  <span className="rating-star" aria-hidden="true">★</span>
                  {item.rating.toFixed(1)}
                  <span className="rating-count">({item.reviewCount} demo)</span>
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  aria-label={`${item.name} প্রিভিউ দেখুন`}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
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
