interface EnvBackdropProps {
  variant: 'publisher' | 'admin' | 'nexora' | 'xelvor';
}

export function EnvBackdrop({ variant }: EnvBackdropProps) {
  return (
    <div className={`env-backdrop env-backdrop--${variant}`} aria-hidden="true">
      <div className="env-backdrop__glow" />
      <div className="env-backdrop__grid" />
      {(variant === 'publisher' || variant === 'xelvor') && (
        <div className="env-backdrop__streams" />
      )}
      {variant === 'admin' && <div className="env-backdrop__scan" />}
      {variant === 'xelvor' && (
        <svg
          className="env-backdrop__circuit"
          viewBox="0 0 1200 700"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120 H240 L290 170 H620 L670 120 H1200"
            fill="none"
            stroke="#38d9ff"
            strokeOpacity="0.22"
            strokeWidth="1.5"
          />
          <path
            d="M0 540 H360 L410 490 H860 L920 550 H1200"
            fill="none"
            stroke="#20ff9a"
            strokeOpacity="0.2"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </div>
  );
}
