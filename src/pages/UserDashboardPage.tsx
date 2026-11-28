import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { AnimatedCounter } from '../components/scifi/AnimatedCounter';
import { EnvBackdrop } from '../components/scifi/EnvBackdrop';

interface UserDashboardPageProps {
  area: 'dashboard' | 'settings';
}

export default function UserDashboardPage({ area }: UserDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'saved' | 'settings'>(
    area === 'settings' ? 'settings' : 'overview',
  );

  return (
    <>
      <EnvBackdrop variant="user" />
      <Navbar />
      <main className="env-shell">
        <div className="container pub-shell sci-reveal">
          <header className="sci-panel hud-brackets pub-flightbar">
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.35rem' }}>
                <span className="hud-chip">PERSONAL CYBER CONTROL CENTER</span>
                <span className="hud-chip hud-chip--warn">UI PREVIEW // AUTH PENDING</span>
              </div>
              <h1 className="foundation-title">User Intelligence Hub</h1>
            </div>

            <nav className="pub-tabs" aria-label="User Control Center Sections">
              {(
                [
                  ['overview', 'Overview'],
                  ['reviews', 'My Reviews (Demo)'],
                  ['saved', 'Saved (Demo)'],
                  ['settings', 'Account Settings'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`pub-tab ${activeTab === key ? 'pub-tab--active' : ''}`}
                  aria-pressed={activeTab === key}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </nav>
          </header>

          <section className="pub-metrics-row sci-stagger" aria-label="User Sample Telemetry">
            <article className="sci-panel sci-panel--interactive pub-metric-card">
              <span className="foundation-box__label">My Reviews (Sample)</span>
              <span className="pub-metric-val">
                <AnimatedCounter target={3} />
              </span>
              <span className="section-desc">2 Approved • 1 Pending (Demo)</span>
            </article>
            <article className="sci-panel sci-panel--interactive pub-metric-card">
              <span className="foundation-box__label">Saved Tools (Sample)</span>
              <span className="pub-metric-val">
                <AnimatedCounter target={5} />
              </span>
              <span className="section-desc">Private Bookmark List</span>
            </article>
            <article className="sci-panel sci-panel--interactive pub-metric-card">
              <span className="foundation-box__label">Helpful Votes (Sample)</span>
              <span className="pub-metric-val">
                <AnimatedCounter target={24} />
              </span>
              <span className="section-desc">Community Impact</span>
            </article>
            <article className="sci-panel sci-panel--interactive pub-metric-card">
              <span className="foundation-box__label">Account Security</span>
              <span className="pub-metric-val" style={{ color: 'var(--sci-cyan)' }}>
                PENDING
              </span>
              <span className="section-desc">Part 02 Auth Connection</span>
            </article>
          </section>

          <section className="sci-panel admin-table-card sci-reveal">
            {activeTab === 'overview' && (
              <div className="admin-row">
                <div>
                  <strong>Personal Workspace Shell (Demo Preview)</strong>
                  <p className="section-desc">
                    Manage reviews, saved listings, support tickets, and security preferences once
                    backend authentication is connected.
                  </p>
                </div>
                <Link to="/nexora" className="btn btn-primary">
                  Open NEXORA Guide
                </Link>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="admin-row">
                <div>
                  <strong>AegisGrid Vault — 5★ (Demo Sample)</strong>
                  <p className="section-desc">
                    Editing an approved review creates a pending revision while keeping the live
                    review public.
                  </p>
                </div>
                <span className="hud-chip">APPROVED (DEMO)</span>
              </div>
            )}
            {activeTab === 'saved' && (
              <div className="admin-row">
                <div>
                  <strong>EdgePulse Inspector (Demo Saved Listing)</strong>
                  <p className="section-desc">Private saved listings sync per user account.</p>
                </div>
                <span className="hud-chip hud-chip--cyan">PRIVATE LIST (DEMO)</span>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="admin-row">
                <div>
                  <strong>Profile Privacy, Email Change &amp; Session Controls</strong>
                  <p className="section-desc">
                    Password update, email verification, and session revocation connect with backend
                    authentication.
                  </p>
                </div>
                <span className="hud-chip hud-chip--warn">BACKEND PENDING</span>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
