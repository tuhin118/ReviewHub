export type EnvVariant =
  | 'apps'
  | 'websites'
  | 'categories'
  | 'search'
  | 'listing-detail'
  | 'public-profile'
  | 'info'
  | 'user'
  | 'publisher'
  | 'admin'
  | 'nexora'
  | 'xelvor'
  | 'not-found';

interface EnvBackdropProps {
  variant: EnvVariant;
}

export function EnvBackdrop({ variant }: EnvBackdropProps) {
  return (
    <div className={`env-backdrop env-backdrop--${variant}`} aria-hidden="true">
      <div className="env-backdrop__glow" />
      <div className="env-backdrop__grid" />
      {(variant === 'apps' ||
        variant === 'websites' ||
        variant === 'publisher' ||
        variant === 'xelvor') && <div className="env-backdrop__streams" />}
      {(variant === 'search' || variant === 'admin') && (
        <div className="env-backdrop__scan" />
      )}
      {(variant === 'xelvor' || variant === 'user' || variant === 'admin') && (
        <svg
          className="env-backdrop__circuit"
          viewBox="0 0 1200 700"
          preserveAspectRatio="none"
        >
          <path
            d="M0 110 H220 L270 160 H620 L670 110 H1200"
            fill="none"
            stroke="#38d9ff"
            strokeOpacity="0.22"
            strokeWidth="1.4"
          />
          <path
            d="M0 550 H350 L400 500 H860 L910 550 H1200"
            fill="none"
            stroke="#20ff9a"
            strokeOpacity="0.2"
            strokeWidth="1.4"
          />
        </svg>
      )}
    </div>
  );
}
