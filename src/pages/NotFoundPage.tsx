import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { EnvBackdrop } from '../components/scifi/EnvBackdrop';

export default function NotFoundPage() {
  return (
    <>
      <EnvBackdrop variant="not-found" />
      <Navbar />
      <main className="env-shell">
        <div className="container foundation-page sci-reveal">
          <div className="sci-panel hud-brackets foundation-card">
            <div className="foundation-card__header">
              <span className="hud-chip hud-chip--danger">SIGNAL LOST // ERROR 404</span>
              <svg className="env-svg-emblem" viewBox="0 0 64 56" fill="none" aria-hidden="true">
                <path d="M8 40L24 14L38 34L56 12" stroke="#ff4d6d" strokeWidth="2.2" strokeDasharray="4 3" />
                <circle cx="56" cy="12" r="4" fill="#ff4d6d" />
              </svg>
            </div>
            <h1 className="foundation-title">Sector Route Not Found</h1>
            <p className="foundation-subtitle">
              The coordinates you requested could not be located on ReviewHub.
            </p>
            <div className="foundation-actions">
              <Link to="/" className="btn btn-primary">
                Return to Command Homepage
              </Link>
              <Link to="/search" className="btn btn-secondary">
                Open Search Scanner
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
