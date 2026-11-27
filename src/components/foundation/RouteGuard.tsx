import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { UserRole } from '../../types/api';

interface RouteGuardProps {
  requiredRole: Exclude<UserRole, 'guest'>;
  currentRole?: UserRole;
  allowUiPreview?: boolean;
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
  allowUiPreview = false,
  children,
}: RouteGuardProps) {
  const [previewUnlocked, setPreviewUnlocked] = useState(false);

  if (ROLE_LEVEL[currentRole] >= ROLE_LEVEL[requiredRole] || (allowUiPreview && previewUnlocked)) {
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
            This route requires backend-verified <strong>{requiredRole}</strong> authorization.
            Server-side authentication and RBAC guards will be connected in Milestones 2B–2C.
          </p>

          <div className="foundation-actions">
            {allowUiPreview && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setPreviewUnlocked(true)}
              >
                Inspect Milestone 2A UI Shell (Preview Only)
              </button>
            )}
            <Link to="/login" className="btn btn-secondary">
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
