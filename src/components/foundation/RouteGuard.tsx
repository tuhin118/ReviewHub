import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { UserRole } from '../../types/api';

interface RouteGuardProps {
  requiredRole: Exclude<UserRole, 'guest'>;
  currentRole?: UserRole;
  children: ReactNode;
}

const ROLE_LEVEL: Record<UserRole, number> = {
  guest: 0,
  user: 1,
  publisher: 2,
  admin: 3,
};

export function RouteGuard({
  requiredRole,
  currentRole = 'guest',
  children,
}: RouteGuardProps) {
  if (ROLE_LEVEL[currentRole] >= ROLE_LEVEL[requiredRole]) {
    return <>{children}</>;
  }

  return (
    <section className="foundation-page">
      <div className="container">
        <div className="glass-panel glass-panel--elevated foundation-card">
          <div className="foundation-card__header">
            <span className="cyber-badge">PROTECTED ROUTE FOUNDATION</span>
            <span className="cyber-badge cyber-badge--muted">
              REQUIRED ROLE: {requiredRole.toUpperCase()}
            </span>
          </div>

          <h1 className="foundation-title">Authentication Required</h1>
          <p className="foundation-subtitle">
            এই সেকশনটি ({requiredRole} access) Part 01-এ শুধুমাত্র রাউট ফাউন্ডেশন হিসেবে প্রস্তুত
            করা হয়েছে। Part 02-তে সম্পূর্ণ Server-side Authentication ও Backend Role Verification
            যুক্ত হলে কেবল অনুমোদিত অ্যাকাউন্ট এখানে প্রবেশ করতে পারবে।
          </p>

          <div className="foundation-actions">
            <Link to="/login" className="btn btn-primary">
              Go to Login Route
            </Link>
            <Link to="/" className="btn btn-secondary">
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
