import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { AnimatedCounter } from '../components/scifi/AnimatedCounter';
import { EnvBackdrop } from '../components/scifi/EnvBackdrop';

type PublisherTab = 'deck' | 'submit' | 'revisions' | 'analytics';

const DEMO_PUBLISHER_POSTS = [
  {
    id: 'pub-1',
    title: 'AegisGrid Vault',
    type: 'Android App',
    status: 'Approved',
    revisionStatus: 'Pending Revision',
    views: 4820,
    rating: '4.9',
  },
  {
    id: 'pub-2',
    title: 'PacketGuard DNS',
    type: 'Android App',
    status: 'Pending',
    revisionStatus: 'Initial Review',
    views: 0,
    rating: '—',
  },
];

const SPARKLINE_HEIGHTS = [38, 52, 46, 70, 64, 88, 95];

export default function PublisherDashboardPage() {
  const [activeTab, setActiveTab] = useState<PublisherTab>('deck');
  const [draftTitle, setDraftTitle] = useState('CipherPulse Inspector');
  const [draftType, setDraftType] = useState<'app' | 'website'>('app');
  const [draftCategory, setDraftCategory] = useState('Security & Privacy');
  const [draftUrl, setDraftUrl] = useState('https://cipherpulse.example.org');
  const [draftTagline, setDraftTagline] = useState(
    'Zero-telemetry network header & certificate verifier.',
  );

  return (
    <>
      <EnvBackdrop variant="publisher" />
      <Navbar />
      <main className="env-shell">
        <div className="container pub-shell sci-reveal">
          <header className="sci-panel pub-flightbar">
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.45rem' }}>
                <span className="hud-chip">ORBITAL SUBMISSION DECK</span>
                <span className="hud-chip hud-chip--warn">UI PREVIEW // API PENDING 2C</span>
              </div>
              <h1 className="foundation-title">Verified Publisher Workspace</h1>
            </div>

            <nav className="pub-tabs" aria-label="Publisher Deck Sections">
              {(
                [
                  ['deck', 'My Listings'],
                  ['submit', 'New Submission'],
                  ['revisions', 'Revision Diff'],
                  ['analytics', 'Content Analytics'],
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

          <section className="pub-metrics-row sci-stagger" aria-label="Publisher Telemetry">
            <article className="sci-panel sci-panel--interactive pub-metric-card">
              <span className="foundation-box__label">Published Items (Demo)</span>
              <span className="pub-metric-val">
                <AnimatedCounter target={1} />
              </span>
              <span className="section-desc">Admin Approved &amp; Live</span>
            </article>
            <article className="sci-panel sci-panel--interactive pub-metric-card">
              <span className="foundation-box__label">Pending Queue (Demo)</span>
              <span className="pub-metric-val">
                <AnimatedCounter target={2} />
              </span>
              <span className="section-desc">1 New + 1 Pending Revision</span>
            </article>
            <article className="sci-panel sci-panel--interactive pub-metric-card">
              <span className="foundation-box__label">Total Views (Demo)</span>
              <span className="pub-metric-val">
                <AnimatedCounter target={4820} />
              </span>
              <span className="section-desc">Last 30 Days Sample</span>
            </article>
            <article className="sci-panel sci-panel--interactive pub-metric-card">
              <span className="foundation-box__label">Avg Rating (Demo)</span>
              <span className="pub-metric-val">4.9★</span>
              <span className="section-desc">Approved Reviews Only</span>
            </article>
          </section>

          {activeTab === 'deck' && (
            <section className="sci-panel admin-table-card sci-reveal" aria-label="Publisher Listings">
              <div className="foundation-card__header">
                <h2 className="section-title">Submitted Listings &amp; Approval Status</h2>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab('submit')}
                >
                  Open Submission Deck
                </button>
              </div>
              {DEMO_PUBLISHER_POSTS.map((post) => (
                <div key={post.id} className="admin-row">
                  <div>
                    <strong>{post.title}</strong>
                    <p className="section-desc">
                      {post.type} • Views: {post.views.toLocaleString()} • Rating: {post.rating}
                    </p>
                  </div>
                  <div className="admin-row__actions">
                    <span className={`hud-chip ${post.status === 'Pending' ? 'hud-chip--warn' : ''}`}>
                      {post.status}
                    </span>
                    <span className="hud-chip hud-chip--cyan">{post.revisionStatus}</span>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setActiveTab('revisions')}
                    >
                      Inspect Revision
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {activeTab === 'submit' && (
            <section className="pub-split sci-reveal" aria-label="Listing Submission Studio">
              <form
                className="sci-panel pub-form"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="foundation-card__header">
                  <h2 className="section-title">Submit App / Website</h2>
                  <span className="hud-chip hud-chip--warn">DEFAULT STATUS: PENDING</span>
                </div>
                <div className="pub-field">
                  <label className="pub-label" htmlFor="pub-title">
                    Listing Title
                  </label>
                  <input
                    id="pub-title"
                    className="sci-input"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                  />
                </div>
                <div className="foundation-grid">
                  <div className="pub-field">
                    <label className="pub-label" htmlFor="pub-type">
                      Platform Type
                    </label>
                    <select
                      id="pub-type"
                      className="sci-select"
                      value={draftType}
                      onChange={(e) => setDraftType(e.target.value as 'app' | 'website')}
                    >
                      <option value="app">Android App</option>
                      <option value="website">Website</option>
                    </select>
                  </div>
                  <div className="pub-field">
                    <label className="pub-label" htmlFor="pub-cat">
                      Category
                    </label>
                    <input
                      id="pub-cat"
                      className="sci-input"
                      value={draftCategory}
                      onChange={(e) => setDraftCategory(e.target.value)}
                    />
                  </div>
                </div>
                <div className="pub-field">
                  <label className="pub-label" htmlFor="pub-url">
                    Official HTTPS URL
                  </label>
                  <input
                    id="pub-url"
                    className="sci-input"
                    value={draftUrl}
                    onChange={(e) => setDraftUrl(e.target.value)}
                  />
                </div>
                <div className="pub-field">
                  <label className="pub-label" htmlFor="pub-tagline">
                    Short Description
                  </label>
                  <textarea
                    id="pub-tagline"
                    className="sci-textarea"
                    value={draftTagline}
                    onChange={(e) => setDraftTagline(e.target.value)}
                  />
                </div>
                <p className="telemetry-note">
                  Backend submission API &amp; verified publisher permission checks connect in
                  Milestone 2C.
                </p>
              </form>

              <aside className="sci-panel pub-preview-card" aria-label="Live Orbital Card Preview">
                <span className="hud-chip">LIVE HOLOGRAPHIC PREVIEW</span>
                <div className="foundation-box">
                  <span className="cyber-badge cyber-badge--muted">
                    {draftType === 'app' ? 'ANDROID APP' : 'WEBSITE'} • {draftCategory}
                  </span>
                  <h3 className="item-card__title" style={{ marginTop: '0.4rem' }}>
                    {draftTitle || 'Untitled Listing'}
                  </h3>
                  <p className="section-desc">{draftTagline}</p>
                  <span className="telemetry-note">Target: {draftUrl}</span>
                </div>
                <Link to="/nexora" className="btn btn-secondary">
                  Ask NEXORA About Submission Rules
                </Link>
              </aside>
            </section>
          )}

          {activeTab === 'revisions' && (
            <section className="foundation-grid sci-reveal" aria-label="Revision Comparison">
              <div className="sci-panel pub-preview-card">
                <span className="hud-chip">CURRENTLY PUBLIC (APPROVED)</span>
                <h3>AegisGrid Vault v1.0</h3>
                <p className="section-desc">
                  This live version stays visible to Guest users until Admin approves your pending
                  edit revision.
                </p>
              </div>
              <div className="sci-panel pub-preview-card">
                <span className="hud-chip hud-chip--warn">PENDING REVISION</span>
                <h3>AegisGrid Vault v1.1 (Draft Edit)</h3>
                <p className="section-desc">
                  Updated changelog and security notes queued for Admin Approval Center review.
                </p>
              </div>
            </section>
          )}

          {activeTab === 'analytics' && (
            <section className="sci-panel admin-table-card sci-reveal" aria-label="Publisher Analytics">
              <div className="foundation-card__header">
                <h2 className="section-title">Listing Velocity &amp; Rating Telemetry (Demo)</h2>
                <span className="hud-chip">OWN LISTINGS ONLY</span>
              </div>
              <div className="sparkline-bars" aria-hidden="true">
                {SPARKLINE_HEIGHTS.map((height, idx) => (
                  <div
                    key={idx}
                    className="sparkline-bar"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <p className="telemetry-note">
                Real per-listing views, rating distribution, and D1 analytics connect in Milestone 2C.
              </p>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
