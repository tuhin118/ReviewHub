import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="main-content container foundation-page">
        <div className="glass-panel glass-panel--elevated foundation-card">
          <div>
            <span className="cyber-badge">ERROR 404</span>
          </div>
          <h1 className="foundation-title">Route Not Found</h1>
          <p className="foundation-subtitle">
            আপনি যে ঠিকানাটি খুঁজছেন তা ReviewHub-এ পাওয়া যায়নি।
          </p>
          <div className="foundation-actions">
            <Link to="/" className="btn btn-primary">
              Return to Homepage
            </Link>
            <Link to="/search" className="btn btn-secondary">
              Go to Search
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
