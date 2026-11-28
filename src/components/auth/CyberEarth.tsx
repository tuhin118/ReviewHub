import { useId } from 'react';

interface CyberEarthProps {
  mode: 'login' | 'register' | 'forgot-password';
}

function ContinentTrackSvg() {
  return (
    <svg
      className="earth-map-svg"
      viewBox="0 0 400 220"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Detailed Glowing Holographic Continents */}
      <path
        className="earth-land"
        d="M24 44 L56 34 L88 42 L98 62 L84 82 L58 92 L38 82 L20 64 Z
           M64 102 L92 108 L108 134 L94 174 L74 186 L62 152 L56 122 Z
           M148 38 L194 30 L226 44 L220 66 L186 74 L154 64 Z
           M158 80 L206 76 L232 102 L216 150 L188 172 L168 144 L154 106 Z
           M234 36 L316 28 L358 52 L348 88 L302 106 L254 98 L230 70 Z
           M296 122 L346 118 L366 146 L344 170 L306 164 L292 142 Z"
      />

      {/* Inner Landmass Detail Lines */}
      <path
        className="earth-land-detail"
        d="M36 56 L74 54 L66 78 M74 122 L90 144 L78 168 M168 50 L206 48 M174 98 L208 106 L192 146 M252 54 L328 52 L308 86 M312 134 L344 142"
      />

      {/* Network Connection Arcs */}
      <path
        className="earth-network-arc"
        d="M58 62 Q122 30 186 56 T298 66 M84 134 Q146 100 198 114 T328 142"
      />

      {/* Glowing City / Intelligence Nodes */}
      <circle className="earth-node earth-node--green" cx="62" cy="62" r="2.4" />
      <circle className="earth-node earth-node--cyan" cx="186" cy="56" r="2.5" />
      <circle className="earth-node earth-node--green" cx="298" cy="66" r="2.6" />
      <circle className="earth-node earth-node--cyan" cx="84" cy="134" r="2.1" />
      <circle className="earth-node earth-node--green" cx="198" cy="114" r="2.4" />
      <circle className="earth-node earth-node--cyan" cx="328" cy="142" r="2.3" />
      <circle className="earth-node earth-node--green" cx="268" cy="82" r="2" />
    </svg>
  );
}

export function CyberEarth({ mode }: CyberEarthProps) {
  const uid = useId();
  const gridClipId = `earth-grid-${uid}`;
  const statusLabel =
    mode === 'login' ? 'AUTH' : mode === 'register' ? 'ENROLL' : 'RECOVERY';

  return (
    <div className="earth-stage" data-auth-mode={statusLabel} aria-hidden="true">
      <div className="earth-corona" />
      <div className="earth-beam" />

      {/* Restrained 3D Tilted Orbital Rings */}
      <div className="earth-orbit earth-orbit--primary">
        <span className="earth-satellite" />
      </div>
      <div className="earth-orbit earth-orbit--secondary">
        <span className="earth-satellite earth-satellite--cyan" />
      </div>

      {/* 3D Spherical Holographic Globe */}
      <div className="earth-sphere">
        <div className="earth-ocean" />

        {/* Curved Latitude & Longitude Wireframe */}
        <svg className="earth-wireframe" viewBox="0 0 240 240">
          <defs>
            <clipPath id={gridClipId}>
              <circle cx="120" cy="120" r="118" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${gridClipId})`} fill="none" strokeWidth="0.75">
            <ellipse cx="120" cy="120" rx="118" ry="26" className="earth-grid-line" />
            <ellipse cx="120" cy="120" rx="118" ry="62" className="earth-grid-line" />
            <ellipse cx="120" cy="120" rx="118" ry="96" className="earth-grid-line" />
            <ellipse cx="120" cy="120" rx="34" ry="118" className="earth-grid-line earth-grid-line--cyan" />
            <ellipse cx="120" cy="120" rx="76" ry="118" className="earth-grid-line" />
            <line x1="2" y1="120" x2="238" y2="120" className="earth-grid-line earth-grid-line--cyan" />
          </g>
        </svg>

        {/* Seamless 200% Width Rotating Continents */}
        <div className="earth-surface-rotator">
          <ContinentTrackSvg />
          <ContinentTrackSvg />
        </div>

        {/* 3D Lighting, Terminator & Fresnel Glow */}
        <div className="earth-lighting" />
      </div>

      {/* Glowing Hologram Pedestal Base */}
      <div className="earth-pedestal">
        <span className="earth-pedestal__ring earth-pedestal__ring--top" />
        <span className="earth-pedestal__ring earth-pedestal__ring--base" />
      </div>
    </div>
  );
}
