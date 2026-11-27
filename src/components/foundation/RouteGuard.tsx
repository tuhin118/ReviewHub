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

  if (ROLE_LEVEL[currentRole] >= ROLE_LEVEL[requiredRole]) {
    return <>{children}</>;
  }

  if (allowUiPreview && previewUnlocked) {
    return (
      <>
        <div
          className="container"
          style={{ paddingTop: '0.85rem' }}
          role="note"
          aria-label="Visual UI Preview Disclaimer"
        >
          <div className="glass-panel active-filters-bar" style={{ marginBottom: 0 }}>
            <span className="cyber-badge">VISUAL UI PREVIEW ONLY</span>
            <span className="section-desc" style={{ fontSize: '0.84rem' }}>
              Not authenticated or authorized. Static demo layout only — no real data or backend
              actions are active.
            </span>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginLeft: 'auto' }}
              onClick={() => setPreviewUnlocked(false)}
            >
              Exit UI Preview
            </button>
          </div>
        </div>
        {children}
      </>
    );
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
            Server-side authentication and RBAC guards will be implemented in Milestones 2B–2C.
          </p>

          {allowUiPreview && (
            <div className="foundation-box">
              <span className="foundation-box__label">Milestone 2A Design Inspection Notice</span>
              <p className="section-desc">
                The UI Preview toggle below is strictly for visual layout inspection. It is NOT
                authentication or authorization, and does not expose real data or actions.
              </p>
            </div>
          )}

          <div className="foundation-actions">
            {allowUiPreview && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setPreviewUnlocked(true)}
              >
                Open Visual UI Preview (Not Auth — Demo Only)
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
