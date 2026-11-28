import type { FormEvent, RefObject } from 'react';
import type { FilterType } from '../types/catalog';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: FilterType;
  onTypeFilterChange: (filter: FilterType) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  totalDemoItems: number;
  totalDemoReviews: number;
}

export function HeroSection({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  searchInputRef,
  totalDemoItems,
  totalDemoReviews,
}: HeroSectionProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = document.getElementById('featured');
    target?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <section id="top" className="hero-section">
      <div className="container">
        <div className="glass-panel glass-panel--elevated hero-shell">
          <div>
            <div className="cyber-badge hero-eyebrow">
              <span className="live-dot" aria-hidden="true" />
              CYBER COMMAND CENTER // DEMO INDEX
            </div>

            <h1 className="hero-title">
              Verify Apps &amp; Websites with{' '}
              <span className="hero-title__accent">Zero Noise.</span>
            </h1>

            <p className="hero-subtitle">
              Explore Android apps and websites without logging in, compare 1–5 star ratings, and
              read community reviews. Search below to inspect tools immediately.
            </p>

            <form className="search-box" role="search" onSubmit={handleSubmit}>
              <div className="search-input-wrap">
                <span className="search-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </span>
                <label htmlFor="homepage-search" className="sr-only">
                  Search Android apps, websites, or categories
                </label>
                <input
                  id="homepage-search"
                  ref={searchInputRef}
                  type="search"
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search apps, websites, security, AI tools..."
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear"
                    aria-label="Clear Search"
                    onClick={() => onSearchChange('')}
                  >
                    ✕
                  </button>
                )}
              </div>

              <button type="submit" className="btn btn-primary">
                Inspect Results
              </button>
            </form>

            <div className="hero-filter-row" role="group" aria-label="Filter by Platform Type">
              <button
                type="button"
                aria-pressed={typeFilter === 'all'}
                className={`filter-pill ${typeFilter === 'all' ? 'filter-pill--active' : ''}`}
                onClick={() => onTypeFilterChange('all')}
              >
                All Platforms
              </button>
              <button
                type="button"
                aria-pressed={typeFilter === 'app'}
                className={`filter-pill ${typeFilter === 'app' ? 'filter-pill--active' : ''}`}
                onClick={() => onTypeFilterChange('app')}
              >
                Android Apps
              </button>
              <button
                type="button"
                aria-pressed={typeFilter === 'website'}
                className={`filter-pill ${typeFilter === 'website' ? 'filter-pill--active' : ''}`}
                onClick={() => onTypeFilterChange('website')}
              >
                Websites
              </button>
            </div>

            <div className="hero-ctas">
              <a href="#featured" className="btn btn-secondary">
                Browse Featured
              </a>
              <a href="#top-rated" className="btn btn-secondary">
                Top Rated List
              </a>
            </div>
          </div>

          <aside className="hero-telemetry" aria-label="Platform Demo Telemetry">
            <div className="telemetry-head">
              <span>SIGNAL TELEMETRY</span>
              <span>STATIC DEMO</span>
            </div>

            <svg className="hero-wave-svg" viewBox="0 0 280 28" aria-hidden="true">
              <path
                d="M0 19 L34 19 L46 8 L60 22 L76 12 L94 12 L108 5 L124 21 L144 14 L182 14 L196 7 L212 21 L230 12 L280 12"
                fill="none"
                stroke="#20ff9a"
                strokeWidth="1.5"
                strokeOpacity="0.9"
              />
            </svg>

            <div className="telemetry-grid">
              <div className="telemetry-stat">
                <span className="telemetry-stat__value">{totalDemoItems}</span>
                <span className="telemetry-stat__label">Demo Listed Tools</span>
              </div>
              <div className="telemetry-stat">
                <span className="telemetry-stat__value">{totalDemoReviews.toLocaleString()}</span>
                <span className="telemetry-stat__label">Demo Reviews</span>
              </div>
              <div className="telemetry-stat">
                <span className="telemetry-stat__value">100%</span>
                <span className="telemetry-stat__label">Guest Readable UI</span>
              </div>
              <div className="telemetry-stat">
                <span className="telemetry-stat__value">5★</span>
                <span className="telemetry-stat__label">Demo Rating Scale</span>
              </div>
            </div>

            <p className="telemetry-note">
              All listings, ratings, and reviews shown here are Static Demo Data viewable without
              login.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
