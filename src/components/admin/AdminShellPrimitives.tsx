import type { ReactNode } from 'react';

interface AdminGlassPanelProps {
  title?: string;
  badge?: string;
  children: ReactNode;
}

export function AdminGlassPanel({ title, badge, children }: AdminGlassPanelProps) {
  return (
    <section className="sci-panel hud-brackets admin-table-card adm-shell-tokens">
      {(title || badge) && (
        <div className="foundation-card__header">
          {title && <h2 className="section-title">{title}</h2>}
          {badge && <span className="hud-chip hud-chip--cyan">{badge}</span>}
        </div>
      )}
      {children}
    </section>
  );
}

interface AdminStatTileProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function AdminStatTile({ label, value, hint }: AdminStatTileProps) {
  return (
    <article className="sci-panel sci-panel--interactive hud-brackets adm-stat-tile">
      <span className="adm-stat-tile__label">{label}</span>
      <span className="adm-stat-tile__value">{value}</span>
      {hint && <span className="section-desc">{hint}</span>}
    </article>
  );
}

interface AdminStatusBadgeProps {
  tone: 'ok' | 'info' | 'warn' | 'danger';
  label: string;
}

export function AdminStatusBadge({ tone, label }: AdminStatusBadgeProps) {
  const toneClass =
    tone === 'info'
      ? 'hud-chip--cyan'
      : tone === 'warn'
        ? 'hud-chip--warn'
        : tone === 'danger'
          ? 'hud-chip--danger'
          : '';
  return <span className={`hud-chip ${toneClass}`}>{label}</span>;
}
