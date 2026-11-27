import type { CatalogItem, FilterType } from '../types/catalog';
import { ItemIcon } from './ItemIcon';

interface FeaturedSectionProps {
  items: CatalogItem[];
  searchQuery: string;
  typeFilter: FilterType;
  selectedCategoryLabel: string | null;
  onResetFilters: () => void;
  onSelectItem: (item: CatalogItem) => void;
}

export function FeaturedSection({
  items,
  searchQuery,
  typeFilter,
  selectedCategoryLabel,
  onResetFilters,
  onSelectItem,
}: FeaturedSectionProps) {
  const hasActiveFilters =
    searchQuery.trim().length > 0 || typeFilter !== 'all' || selectedCategoryLabel !== null;

  return (
    <section id="featured" className="section-block" aria-labelledby="featured-heading">
      <div className="container">
        <div className="section-header">
          <div>
            <p className="section-kicker">03 // CURATED BENTO MATRIX (STATIC DEMO)</p>
            <h2 id="featured-heading" className="section-title">
              Featured Apps &amp; Websites
            </h2>
          </div>
          <p className="section-desc" aria-live="polite" aria-atomic="true">
            Showing {items.length} {items.length === 1 ? 'result' : 'results'} (Static Demo Catalog)
          </p>
        </div>

        {hasActiveFilters && (
          <div className="glass-panel active-filters-bar">
            <span className="cyber-badge">ACTIVE FILTERS</span>
            {typeFilter !== 'all' && (
              <span className="cyber-badge cyber-badge--muted">
                {typeFilter === 'app' ? 'Android Apps' : 'Websites'}
              </span>
            )}
            {selectedCategoryLabel && (
              <span className="cyber-badge cyber-badge--muted">{selectedCategoryLabel}</span>
            )}
            {searchQuery.trim() && (
              <span className="cyber-badge cyber-badge--muted">
                Query: &ldquo;{searchQuery.trim()}&rdquo;
              </span>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginLeft: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={onResetFilters}
            >
              Reset Filters
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="glass-panel empty-state">
            <h3>No matches found</h3>
            <p className="section-desc">
              No demo apps or websites matched your search or category filter.
            </p>
            <button type="button" className="btn btn-primary" onClick={onResetFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="featured-grid">
            {items.map((item, index) => {
              const isLead = index === 0 && !hasActiveFilters && items.length >= 4;
              return (
                <article
                  key={item.id}
                  className={`glass-panel item-card ${isLead ? 'featured-card--lead' : ''}`}
                >
                  <div className="item-card__header">
                    <ItemIcon glyph={item.iconGlyph} />
                    <div className="item-card__meta">
                      <div className="item-card__badges">
                        <span className="cyber-badge cyber-badge--muted">
                          {item.type === 'app' ? 'ANDROID APP' : 'WEBSITE'}
                        </span>
                        <span className="cyber-badge cyber-badge--muted">{item.categoryLabel}</span>
                        {item.badgeText && <span className="cyber-badge">DEMO • {item.badgeText}</span>}
                      </div>
                      <h3 className="item-card__title">{item.name}</h3>
                      <span className="item-card__publisher">
                        {item.verifiedPublisher && (
                          <span className="verified-dot" aria-label="Demo Verified Publisher">
                            ✓ Verified Publisher (Demo)
                          </span>
                        )}
                        <span>• {item.publisherName}</span>
                      </span>
                    </div>
                  </div>

                  <p className="item-card__desc">{isLead ? item.description : item.tagline}</p>

                  <div className="item-card__footer">
                    <span className="rating-pill">
                      <span className="rating-star" aria-hidden="true">★</span>
                      {item.rating.toFixed(1)}
                      <span className="rating-count">({item.reviewCount} demo reviews)</span>
                    </span>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.84rem' }}
                      onClick={() => onSelectItem(item)}
                    >
                      View Preview
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
