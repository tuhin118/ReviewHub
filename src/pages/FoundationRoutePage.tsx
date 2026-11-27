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
      'Android অ্যাপগুলোর ডিসকভারি পেজ রুট ফাউন্ডেশন। পরবর্তী ধাপে লাইভ D1 Catalog API ও ফিল্টার যুক্ত হবে।',
  },
  websites: {
    badge: 'PUBLIC ROUTE // WEBSITES',
    title: 'Websites Directory',
    description:
      'ওয়েবসাইট ডিসকভারি পেজ রুট ফাউন্ডেশন। পরবর্তী ধাপে অনুমোদিত ওয়েবসাইট তালিকা ও ফিল্টার যুক্ত হবে।',
  },
  categories: {
    badge: 'PUBLIC ROUTE // CATEGORIES',
    title: 'Taxonomy & Categories',
    description:
      'ক্যাটাগরি ও সাব-ক্যাটাগরি ডিসকভারির জন্য ফাউন্ডেশন রুট। আপনি হোমপেজের Categories সেকশনে ডেমো ফিল্টারিং দেখতে পারেন।',
  },
  search: {
    badge: 'PUBLIC ROUTE // SEARCH',
    title: 'Intelligence Search',
    description:
      'গ্লোবাল সার্চ ফাউন্ডেশন রুট। এখন হোমপেজের Search বারে Static Demo ডেটায় লাইভ সার্চ চালু আছে।',
  },
  'listing-detail': {
    badge: 'PUBLIC ROUTE // LISTING DETAILS',
    title: 'Listing Details Foundation',
    description:
      'প্রতিটি App/Website-এর বিস্তারিত তথ্য, গড় রেটিং ও Approved রিভিউ দেখানোর রুট ফাউন্ডেশন।',
  },
  'public-profile': {
    badge: 'PUBLIC ROUTE // USER PROFILE',
    title: 'Public User Profile Foundation',
    description:
      'ব্যবহারকারীর পাবলিক প্রোফাইল ও কন্ট্রিবিউশন দেখানোর রুট ফাউন্ডেশন (প্রাইভেসি নিয়ন্ত্রণসহ)।',
  },
  about: {
    badge: 'INFO // ABOUT',
    title: 'About ReviewHub',
    description:
      'ReviewHub — Discover. Review. Trust. এটি একটি Free-Tier-First অ্যাপ ও ওয়েবসাইট রিভিউ প্ল্যাটফর্ম।',
  },
  support: {
    badge: 'INFO // SUPPORT',
    title: 'Help & Support Center',
    description:
      'ব্যবহারকারী সহায়তা ও সাপোর্ট টিকেট সিস্টেমের ফাউন্ডেশন রুট (পরবর্তী ধাপে Backend-এর সাথে যুক্ত হবে)।',
  },
  privacy: {
    badge: 'LEGAL // PRIVACY',
    title: 'Privacy Policy',
    description:
      'ব্যবহারকারীর প্রাইভেসি সুরক্ষা, কুকি নীতি ও নিরাপদ ডেটা ব্যবস্থাপনার ফাউন্ডেশন রুট।',
  },
  terms: {
    badge: 'LEGAL // TERMS',
    title: 'Terms of Service',
    description:
      'ReviewHub ব্যবহারের শর্তাবলি, রিভিউ নীতি ও কন্টেন্ট মডারেশন নির্দেশিকার ফাউন্ডেশন রুট।',
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
                Same-origin <code>/api/v1/health</code> এন্ডপয়েন্ট পরীক্ষা করুন (Wrangler Pages Dev চালু
                থাকলে রেসপন্স দেখাবে)।
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
                হোমপেজে ফিরে গিয়ে Static Demo ডেটার সাথে Search, Category Filter ও Preview Modal ব্যবহার
                করতে পারেন।
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
