import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand-name" style={{ marginBottom: '0.5rem' }}>
              Review<span>Hub</span>
            </div>
            <p className="section-desc" style={{ maxWidth: '42ch' }}>
              Discover. Review. Trust. A reliable intelligence platform for Android apps and
              websites with 1–5 star ratings and community reviews. Guests can browse all public
              content without logging in.
            </p>
          </div>

          <div>
            <h3 className="footer-heading">Explore</h3>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/apps">Android Apps</Link>
              <Link to="/websites">Websites</Link>
              <Link to="/categories">Categories</Link>
              <Link to="/search">Search</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-heading">Platform &amp; Policy</h3>
            <div className="footer-links">
              <Link to="/about">About ReviewHub</Link>
              <Link to="/support">Help &amp; Support</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <span>Phase: Part 01 Foundation</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 ReviewHub. Built with Vite, React &amp; TypeScript.</span>
          <span>Zero-Cost Architecture • Mobile-First Responsive</span>
        </div>
      </div>
    </footer>
  );
}
