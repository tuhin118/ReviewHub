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
    title: 'AegisGrid Vault (Demo)',
    type: 'Android App',
    status: 'Approved (Demo)',
    revisionStatus: 'Pending Revision (Demo)',
    views: 4820,
    rating: '4.9',
  },
  {
    id: 'pub-2',
    title: 'PacketGuard DNS (Demo)',
    type: 'Android App',
    status: 'Pending (Demo)',
    revisionStatus: 'Initial Review (Demo)',
    views: 0,
    rating: '—',
  },
];

const SPARKLINE_HEIGHTS = [38, 52, 46, 70, 64, 88, 95];

export default function PublisherDashboardPage() {
  const [activeTab, setActiveTab] = useState<PublisherTab>('deck');
  const [draftTitle, setDraftTitle] = useState('CipherPulse Inspector (Demo Draft)');
  const [draftType, setDraftType] = useState<'app' | 'website'>('app');
  const [draftCategory, setDraftCategory] = useState('Security & Privacy');
  const [draftUrl, setDraftUrl] = useState('https://cipherpulse.example.invalid');
  const [draftTagline, setDraftTagline] = useState(
    'Sample preview description for the Milestone 2A publisher UI shell.',
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
                <span className="hud-chip hud-chip--warn">STATIC UI PREVIEW // API PENDING 2C</span>
              </div>
              <h1 className="foundation-title">Verified Publisher Workspace</h1>
            </div>

            <nav className="pub-tabs" aria-label="Publisher Deck Sections">
              {(
                [
                  ['deck', 'My Listings (Demo)'],
                  ['submit', 'New Submission'],
                  ['revisions', 'Revision Diff (Demo)'],
                  ['analytics', 'Analytics (Demo)'],
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

          <section className="pub-metrics-row sci-stagger" aria-label="Publisher Sample Telemetry">
            <article className="sci-panel sci-panel--interactive pub-metric-card">
              <span className="foundation-box__label">Published Items (Sample)</span>
              <span className="pub-metric-val">
                <AnimatedCounter target={1} />
              </span>
              <span className="section-desc">Static Demo Record</span>
            </article>
            <article className="sci-panel sci-panel--interactive pub-metric-card">
              <span className="foundation-box__label">Pending Queue (Sample)</span>
              <span className="pub-metric-val">
                <AnimatedCounter target={2} />
              </span>
              <span className="section-desc">1 Demo New + 1 Demo Revision</span>
            </article>
            <article className="sci-panel sci-panel--interactive pub-metric-card">
              <span className="foundation-box__label">Sample Views (Demo)</span>
              <span className="pub-metric-val">
                <AnimatedCounter target={4820} />
              </span>
              <span className="section-desc">Placeholder Counter</span>
            </article>
            <article className="sci-panel sci-panel--interactive pub-metric-card">
              <span className="foundation-box__label">Avg Rating (Sample)</span>
              <span className="pub-metric-val">4.9★</span>
              <span className="section-desc">Demo Preview Only</span>
            </article>
          </section>

          {activeTab === 'deck' && (
            <section className="sci-panel admin-table-card sci-reveal" aria-label="Publisher Demo Listings">
              <div className="foundation-card__header">
                <h2 className="section-title">Sample Listings &amp; Approval States (Demo)</h2>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab('submit')}
                >
                  Open Submission Form Preview
                </button>
              </div>
              {DEMO_PUBLISHER_POSTS.map((post) => (
                <div key={post.id} className="admin-row">
                  <div>
                    <strong>{post.title}</strong>
                    <p className="section-desc">
                      {post.type} • Demo Views: {post.views.toLocaleString()} • Demo Rating:{' '}
                      {post.rating}
                    </p>
                  </div>
                  <div className="admin-row__actions">
                    <span
                      className={`hud-chip ${post.status.includes('Pending') ? 'hud-chip--warn' : ''}`}
                    >
                      {post.status}
                    </span>
                    <span className="hud-chip hud-chip--cyan">{post.revisionStatus}</span>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setActiveTab('revisions')}
                    >
                      Preview Revision UI
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {activeTab === 'submit' && (
            <section className="pub-split sci-reveal" aria-label="Listing Submission Studio Preview">
              <form
                className="sci-panel pub-form"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="foundation-card__header">
                  <h2 className="section-title">Submit App / Website (UI Preview)</h2>
                  <span className="hud-chip hud-chip--warn">PLANNED DEFAULT: PENDING</span>
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
                    Sample HTTPS URL
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
                  Local draft preview only. Backend submission API and publisher permission
                  verification will connect in Milestone 2C.
                </p>
              </form>

              <aside className="sci-panel pub-preview-card" aria-label="Local Draft Card Preview">
                <span className="hud-chip">LOCAL DRAFT PREVIEW (NOT SAVED)</span>
                <div className="foundation-box">
                  <span className="cyber-badge cyber-badge--muted">
                    {draftType === 'app' ? 'ANDROID APP' : 'WEBSITE'} • {draftCategory}
                  </span>
                  <h3 className="item-card__title" style={{ marginTop: '0.4rem' }}>
                    {draftTitle || 'Untitled Listing'}
                  </h3>
                  <p className="section-desc">{draftTagline}</p>
                  <span className="telemetry-note">Sample Domain: {draftUrl}</span>
                </div>
                <Link to="/nexora" className="btn btn-secondary">
                  Open NEXORA UI Preview
                </Link>
              </aside>
            </section>
          )}

          {activeTab === 'revisions' && (
            <section className="foundation-grid sci-reveal" aria-label="Sample Revision Comparison">
              <div className="sci-panel pub-preview-card">
                <span className="hud-chip">SAMPLE PUBLIC VERSION (DEMO)</span>
                <h3>AegisGrid Vault v1.0 (Demo)</h3>
                <p className="section-desc">
                  Demonstrates the planned revision behavior: an approved version remains visible to
                  guests until Admin approves the pending edit.
                </p>
              </div>
              <div className="sci-panel pub-preview-card">
                <span className="hud-chip hud-chip--warn">SAMPLE PENDING REVISION (DEMO)</span>
                <h3>AegisGrid Vault v1.1 (Demo Edit)</h3>
                <p className="section-desc">
                  Sample pending edit card. Real revision storage and moderation will connect in
                  Milestone 2C.
                </p>
              </div>
            </section>
          )}

          {activeTab === 'analytics' && (
            <section className="sci-panel admin-table-card sci-reveal" aria-label="Sample Publisher Analytics">
              <div className="foundation-card__header">
                <h2 className="section-title">Sample Velocity Chart (Static Demo)</h2>
                <span className="hud-chip hud-chip--warn">D1 ANALYTICS PENDING 2C</span>
              </div>
              <div className="sparkline-bars" aria-hidden="true">
                {SPARKLINE_HEIGHTS.map((height, idx) => (
                  <div key={idx} className="sparkline-bar" style={{ height: `${height}%` }} />
                ))}
              </div>
              <p className="telemetry-note">
                Placeholder sparkline only. Real per-listing D1 analytics will connect in Milestone
                2C.
              </p>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
