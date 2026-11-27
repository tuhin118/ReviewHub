import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
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

const ROUTE_CONTENT: Record<FoundationMode, { badge: string; title: string; description: string }> = {
  apps: {
    badge: 'PUBLIC ROUTE // APPS',
    title: 'Android Applications Directory',
    description:
      'Route foundation for the Android Apps discovery page. Live D1 catalog listings and filters will be connected in upcoming phases.',
  },
  websites: {
    badge: 'PUBLIC ROUTE // WEBSITES',
    title: 'Websites Directory',
    description:
      'Route foundation for the Websites discovery page. Approved website listings and filters will be connected in upcoming phases.',
  },
  categories: {
    badge: 'PUBLIC ROUTE // CATEGORIES',
    title: 'Taxonomy & Categories',
    description:
      'Foundation route for category and subcategory discovery. Live demo category filtering is currently available on the Homepage.',
  },
  search: {
    badge: 'PUBLIC ROUTE // SEARCH',
    title: 'Intelligence Search',
    description:
      'Global search route foundation. Live search over static demo data is currently active on the Homepage search bar.',
  },
  'listing-detail': {
    badge: 'PUBLIC ROUTE // LISTING DETAILS',
    title: 'Listing Details Foundation',
    description:
      'Foundation route for displaying full app/website details, average rating distribution, and approved user reviews.',
  },
  'public-profile': {
    badge: 'PUBLIC ROUTE // USER PROFILE',
    title: 'Public User Profile Foundation',
    description:
      'Foundation route for displaying a user public profile and contributions with privacy controls.',
  },
  about: {
    badge: 'INFO // ABOUT',
    title: 'About ReviewHub',
    description:
      'ReviewHub — Discover. Review. Trust. A free-tier-first platform for trusted app and website intelligence.',
  },
  support: {
    badge: 'INFO // SUPPORT',
    title: 'Help & Support Center',
    description:
      'Foundation route for user assistance and support ticket workflows (to be connected with the backend in upcoming phases).',
  },
  privacy: {
    badge: 'LEGAL // PRIVACY',
    title: 'Privacy Policy',
    description:
      'Foundation route for ReviewHub user privacy protections, cookie policy, and data handling practices.',
  },
  terms: {
    badge: 'LEGAL // TERMS',
    title: 'Terms of Service',
    description:
      'Foundation route for ReviewHub terms of service, review standards, and content moderation policies.',
  },
};

export default function FoundationRoutePage({ mode }: FoundationRoutePageProps) {
  const params = useParams();
  const [healthResult, setHealthResult] = useState<string | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  const info = ROUTE_CONTENT[mode];

  const handleCheckApiHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await apiRequest<HealthCheckData>('/health');
      setHealthResult(`API OK (${res.data.environment}) • Request ID: ${res.requestId}`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setHealthResult(`API Status [${err.code}]: ${err.message}`);
      } else {
        setHealthResult('API endpoint is not running in static-only preview mode.');
      }
    } finally {
      setHealthLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="main-content container foundation-page">
        <div className="glass-panel glass-panel--elevated foundation-card">
          <div className="foundation-card__header">
            <span className="cyber-badge">{info.badge}</span>
            <span className="cyber-badge cyber-badge--muted">PART 01 FOUNDATION</span>
          </div>

          <h1 className="foundation-title">{info.title}</h1>
          <p className="foundation-subtitle">{info.description}</p>

          {(params.slug || params.username) && (
            <div className="foundation-box">
              <span className="foundation-box__label">Route Parameter</span>
              <span>
                {params.slug ? `Listing Slug: ${params.slug}` : `Username: ${params.username}`}
              </span>
            </div>
          )}

          <div className="foundation-grid">
            <div className="foundation-box">
              <span className="foundation-box__label">API Connectivity Foundation</span>
              <p className="section-desc">
                Test the same-origin <code>/api/v1/health</code> endpoint (responds when Cloudflare
                Pages Functions or Wrangler Pages Dev is active).
              </p>
              <div className="foundation-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={healthLoading}
                  onClick={handleCheckApiHealth}
                >
                  {healthLoading ? 'Checking...' : 'Check /api/v1/health'}
                </button>
              </div>
              {healthResult && (
                <p className="section-desc" aria-live="polite">
                  {healthResult}
                </p>
              )}
            </div>

            <div className="foundation-box">
              <span className="foundation-box__label">Current Demo Preview</span>
              <p className="section-desc">
                Return to the homepage to explore live search, category filtering, and the item
                preview modal with static demo data.
              </p>
              <div className="foundation-actions">
                <Link to="/" className="btn btn-primary">
                  Open Homepage Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
