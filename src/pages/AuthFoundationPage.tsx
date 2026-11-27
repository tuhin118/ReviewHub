import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

interface AuthFoundationPageProps {
  mode: 'login' | 'register' | 'forgot-password';
}

export default function AuthFoundationPage({ mode }: AuthFoundationPageProps) {
  const titleMap = {
    login: 'Login Route Foundation',
    register: 'Registration Route Foundation',
    'forgot-password': 'Password Recovery Foundation',
  };

  return (
    <>
      <Navbar />
      <main className="main-content container foundation-page">
        <div className="glass-panel glass-panel--elevated foundation-card">
          <div className="foundation-card__header">
            <span className="cyber-badge">AUTH FOUNDATION // {mode.toUpperCase()}</span>
            <span className="cyber-badge cyber-badge--muted">SCHEDULED FOR PART 02</span>
          </div>

          <h1 className="foundation-title">{titleMap[mode]}</h1>
          <p className="foundation-subtitle">
            The final UI/UX design for this route (specified by ChatGPT) along with server-side
            authentication, Turnstile, OTP, and session management will be implemented in Part 02.
            Only the route foundation is prepared in Part 01.
          </p>

          <div className="foundation-actions">
            <Link to="/" className="btn btn-primary">
              Browse as Guest on Homepage
            </Link>
            {mode !== 'login' && (
              <Link to="/login" className="btn btn-secondary">
                Login Route
              </Link>
            )}
            {mode !== 'register' && (
              <Link to="/register" className="btn btn-secondary">
                Register Route
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
