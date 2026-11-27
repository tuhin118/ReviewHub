export function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <div className="glass-panel route-fallback__card">
        <span className="cyber-badge" style={{ justifySelf: 'center' }}>
          LOADING MODULE
        </span>
        <div className="route-fallback__bar" aria-hidden="true" />
        <p className="section-desc">Loading route...</p>
      </div>
    </div>
  );
}
