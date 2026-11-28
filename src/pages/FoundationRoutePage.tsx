import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { ItemIcon } from '../components/ItemIcon';
import { Navbar } from '../components/Navbar';
import { EnvBackdrop, type EnvVariant } from '../components/scifi/EnvBackdrop';
import { DEMO_CATALOG_ITEMS, DEMO_CATEGORIES } from '../data/homepageDemoData';
import { ApiClientError, apiRequest } from '../lib/apiClient';
import type { HealthCheckData } from '../types/api';

type FoundationMode =
  | 'apps'
  | 'websites'
  | 'categories'
  | 'search'
  | 'listing-detail'
  | 'public-profile'
  | 'about'
  | 'support'
  | 'privacy'
  | 'terms';

interface FoundationRoutePageProps {
  mode: FoundationMode;
}

const MODE_META: Record<
  FoundationMode,
  { variant: EnvVariant; badge: string; title: string; subtitle: string }
> = {
  apps: {
    variant: 'apps',
    badge: 'APPLICATION DISCOVERY ENVIRONMENT',
    title: 'Android Applications Matrix',
    subtitle: 'Compact demo catalog of Android tools. Live D1 pagination connects in upcoming phases.',
  },
  websites: {
    variant: 'websites',
    badge: 'DIGITAL WEB EXPLORATION ENVIRONMENT',
    title: 'Web Platforms Matrix',
    subtitle: 'Compact demo catalog of web utilities and security inspectors.',
  },
  categories: {
    variant: 'categories',
    badge: 'HOLOGRAPHIC DATA CLASSIFICATION',
    title: 'Taxonomy Classification Grid',
    subtitle: 'Structured app and website sectors (Static Demo Taxonomy).',
  },
  search: {
    variant: 'search',
    badge: 'FUTURISTIC SCANNING ENVIRONMENT',
    title: 'Intelligence Search Scanner',
    subtitle: 'Scan static demo apps, websites, categories, and verified publisher labels.',
  },
  'listing-detail': {
    variant: 'listing-detail',
    badge: 'LISTING BLUEPRINT VIEW',
    title: 'Listing Details Shell',
    subtitle: 'Compact layout for full product intelligence, rating distribution, and approved reviews.',
  },
  'public-profile': {
    variant: 'public-profile',
    badge: 'PUBLIC IDENTITY MATRIX',
    title: 'User Public Profile Shell',
    subtitle: 'Displays user-approved public bio, joined telemetry, and public contributions.',
  },
  about: {
    variant: 'info',
    badge: 'SYSTEM DOSSIER // ABOUT',
    title: 'About ReviewHub',
    subtitle: 'Discover. Review. Trust. Zero-cost free-tier-first intelligence platform.',
  },
  support: {
    variant: 'info',
    badge: 'HELP & SUPPORT NODE',
    title: 'Support Command Center',
    subtitle: 'Submit support inquiries or escalate unresolved NEXORA troubleshooting.',
  },
  privacy: {
    variant: 'info',
    badge: 'PRIVACY PROTOCOL',
    title: 'Privacy Policy',
    subtitle: 'Zero covert fingerprinting, HttpOnly session security, and strict secret redaction.',
  },
  terms: {
    variant: 'info',
    badge: 'GOVERNANCE // TERMS',
    title: 'Terms of Service',
    subtitle: 'Moderation standards, publisher verification policies, and community guidelines.',
  },
};

function ModeEmblem({ mode }: { mode: FoundationMode }) {
  if (mode === 'search') {
    return (
      <svg className="env-svg-emblem" viewBox="0 0 64 56" fill="none" aria-hidden="true">
        <circle cx="28" cy="26" r="16" stroke="currentColor" strokeWidth="1.8" strokeDasharray="4 3" />
        <circle cx="28" cy="26" r="8" stroke="#38d9ff" strokeWidth="1.5" />
        <path d="M40 38L54 50" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (mode === 'categories') {
    return (
      <svg className="env-svg-emblem" viewBox="0 0 64 56" fill="none" aria-hidden="true">
        <rect x="6" y="6" width="22" height="18" rx="4" stroke="currentColor" strokeWidth="1.6" />
        <rect x="36" y="6" width="22" height="18" rx="4" stroke="#38d9ff" strokeWidth="1.6" />
        <rect x="21" y="32" width="22" height="18" rx="4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M17 24v4h30v-4M32 28v4" stroke="#38d9ff" strokeWidth="1.4" />
      </svg>
    );
  }
  return (
    <svg className="env-svg-emblem" viewBox="0 0 64 56" fill="none" aria-hidden="true">
      <path d="M32 6L54 16v14c0 11-9 18-22 21C19 48 10 41 10 30V16L32 6Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M23 28l6 6 12-12" stroke="#38d9ff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function FoundationRoutePage({ mode }: FoundationRoutePageProps) {
  const params = useParams();
  const [query, setQuery] = useState('');
  const [healthResult, setHealthResult] = useState<string | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  const meta = MODE_META[mode];

  const catalogItems = useMemo(() => {
    if (mode === 'apps') return DEMO_CATALOG_ITEMS.filter((i) => i.type === 'app');
    if (mode === 'websites') return DEMO_CATALOG_ITEMS.filter((i) => i.type === 'website');
    if (mode === 'search') {
      const q = query.trim().toLowerCase();
      if (!q) return DEMO_CATALOG_ITEMS;
      return DEMO_CATALOG_ITEMS.filter((i) =>
        `${i.name} ${i.tagline} ${i.categoryLabel} ${i.publisherName}`.toLowerCase().includes(q),
      );
    }
    return [];
  }, [mode, query]);

  const handleCheckApiHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await apiRequest<HealthCheckData>('/health');
      setHealthResult(`API OK (${res.data.environment}) • ID: ${res.requestId}`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setHealthResult(`API Status [${err.code}]: ${err.message}`);
      } else {
        setHealthResult('API endpoint is inactive in static-only preview mode.');
      }
    } finally {
      setHealthLoading(false);
    }
  };

  return (
    <>
      <EnvBackdrop variant={meta.variant} />
      <Navbar />
      <main className="env-shell">
        <div className="container env-page-wrap sci-reveal">
          <header className="sci-panel hud-brackets env-hero-banner env-hero-banner--split">
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.4rem' }}>
                <span className="hud-chip hud-chip--cyan">{meta.badge}</span>
                <span className="hud-chip">STATIC DEMO SHELL</span>
              </div>
              <h1 className="foundation-title">{meta.title}</h1>
              <p className="foundation-subtitle">{meta.subtitle}</p>
            </div>
            <ModeEmblem mode={mode} />
          </header>

          {(params.slug || params.username) && (
            <div className="sci-panel foundation-box">
              <span className="foundation-box__label">Route Parameter</span>
              <span>
                {params.slug ? `Listing Slug: ${params.slug}` : `Username: ${params.username}`}
              </span>
            </div>
          )}

          {mode === 'search' && (
            <div className="sci-panel" style={{ padding: '0.85rem' }}>
              <label htmlFor="env-search-input" className="sr-only">
                Search demo apps and websites
              </label>
              <input
                id="env-search-input"
                type="search"
                className="sci-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Scan demo catalog by name, category, or publisher..."
              />
            </div>
          )}

          {(mode === 'apps' || mode === 'websites' || mode === 'search') && (
            <section className="env-compact-grid sci-stagger" aria-label="Compact Catalog Results">
              {catalogItems.map((item) => (
                <article key={item.id} className="sci-panel sci-panel--interactive item-card">
                  <div className="item-card__header">
                    <ItemIcon glyph={item.iconGlyph} />
                    <div className="item-card__meta">
                      <div className="item-card__badges">
                        <span className="hud-chip">{item.type === 'app' ? 'APP' : 'WEB'}</span>
                        <span className="hud-chip hud-chip--cyan">{item.categoryLabel}</span>
                      </div>
                      <h2 className="item-card__title">{item.name}</h2>
                      <span className="item-card__publisher">✓ Verified Publisher (Demo)</span>
                    </div>
                  </div>
                  <p className="item-card__desc">{item.tagline}</p>
                  <div className="item-card__footer">
                    <span className="rating-pill">
                      <span className="rating-star" aria-hidden="true">★</span>
                      {item.rating.toFixed(1)}
                      <span className="rating-count">({item.reviewCount} demo)</span>
                    </span>
                    <Link to={`/listings/${item.slug}`} className="btn btn-secondary">
                      Details Shell
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          )}

          {mode === 'categories' && (
            <section className="env-compact-grid sci-stagger" aria-label="Classification Sectors">
              {DEMO_CATEGORIES.map((cat) => (
                <article key={cat.id} className="sci-panel sci-panel--interactive category-card">
                  <span className="category-card__head">
                    <span className="category-card__code">{cat.code}</span>
                    <span className="hud-chip hud-chip--cyan">SECTOR</span>
                  </span>
                  <h2 className="category-card__title">{cat.name}</h2>
                  <p className="category-card__desc">{cat.description}</p>
                  <span className="category-card__counts">
                    <span>{cat.appCount} Demo Apps</span>
                    <span>{cat.websiteCount} Demo Web</span>
                  </span>
                </article>
              ))}
            </section>
          )}

          <section className="foundation-grid">
            <div className="sci-panel foundation-box">
              <span className="foundation-box__label">API Connectivity Probe</span>
              <p className="section-desc">
                Verify same-origin <code>/api/v1/health</code> availability.
              </p>
              <div className="foundation-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={healthLoading}
                  onClick={handleCheckApiHealth}
                >
                  {healthLoading ? 'Scanning...' : 'Check /api/v1/health'}
                </button>
              </div>
              {healthResult && (
                <p className="section-desc" aria-live="polite">
                  {healthResult}
                </p>
              )}
            </div>

            <div className="sci-panel foundation-box">
              <span className="foundation-box__label">Quick Navigation</span>
              <p className="section-desc">
                Explore the Command Homepage or open NEXORA assistance.
              </p>
              <div className="foundation-actions">
                <Link to="/" className="btn btn-primary">
                  Command Homepage
                </Link>
                <Link to="/nexora" className="btn btn-secondary">
                  NEXORA Guide
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
