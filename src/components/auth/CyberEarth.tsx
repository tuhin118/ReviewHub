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
      {/* Stylized Continental Silhouettes */}
      <path
        className="earth-land"
        d="M28 46 L68 38 L94 52 L88 76 L62 94 L42 86 L24 68 Z
           M66 106 L96 112 L106 138 L92 174 L74 184 L64 152 Z
           M154 42 L198 34 L224 46 L218 68 L184 74 L158 64 Z
           M162 82 L208 78 L230 104 L214 148 L188 168 L170 142 L158 106 Z
           M238 40 L318 32 L356 54 L346 88 L302 104 L256 98 L234 72 Z
           M298 124 L344 120 L362 146 L342 168 L308 162 L294 142 Z"
      />

      {/* Subtle Ecosystem Network Arcs */}
      <path
        className="earth-network-arc"
        d="M58 64 Q120 34 186 58 T296 68 M84 134 Q145 102 196 114 T326 142"
      />

      {/* Active Network Nodes */}
      <circle className="earth-node earth-node--green" cx="62" cy="64" r="2.2" />
      <circle className="earth-node earth-node--cyan" cx="186" cy="58" r="2.4" />
      <circle className="earth-node earth-node--green" cx="296" cy="68" r="2.5" />
      <circle className="earth-node earth-node--cyan" cx="84" cy="134" r="2" />
      <circle className="earth-node earth-node--green" cx="196" cy="114" r="2.3" />
      <circle className="earth-node earth-node--cyan" cx="326" cy="142" r="2.2" />
      <circle className="earth-node earth-node--green" cx="268" cy="84" r="1.9" />
    </svg>
  );
}

export function CyberEarth({ mode }: CyberEarthProps) {
  const uid = useId();
  const gridClipId = `earth-grid-${uid}`;

  const telemetryTag =
    mode === 'login'
      ? 'NODE SYNC // AUTH GATE'
      : mode === 'register'
        ? 'NODE SYNC // ENROLLMENT'
        : 'NODE SYNC // RECOVERY';

  return (
    <div className="earth-stage" aria-hidden="true">
      <div className="earth-corona" />

      <div className="earth-hud-frame">
        <span className="earth-hud-label earth-hud-label--top">{telemetryTag}</span>
        <span className="earth-hud-label earth-hud-label--bottom">
          GLOBAL TRUST GRID • 3D TELEMETRY
        </span>
      </div>

      {/* Restrained 3D Tilted Orbital Rings */}
      <div className="earth-orbit earth-orbit--primary">
        <span className="earth-satellite" />
      </div>
      <div className="earth-orbit earth-orbit--secondary">
        <span className="earth-satellite earth-satellite--cyan" />
      </div>

      {/* 3D Spherical Globe */}
      <div className="earth-sphere">
        <div className="earth-ocean" />

        {/* Spherical Wireframe Latitude & Longitude Grid */}
        <svg className="earth-wireframe" viewBox="0 0 240 240">
          <defs>
            <clipPath id={gridClipId}>
              <circle cx="120" cy="120" r="118" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${gridClipId})`} fill="none" strokeWidth="0.75">
            <ellipse cx="120" cy="120" rx="118" ry="28" className="earth-grid-line" />
            <ellipse cx="120" cy="120" rx="118" ry="64" className="earth-grid-line" />
            <ellipse cx="120" cy="120" rx="118" ry="96" className="earth-grid-line" />
            <ellipse cx="120" cy="120" rx="34" ry="118" className="earth-grid-line earth-grid-line--cyan" />
            <ellipse cx="120" cy="120" rx="76" ry="118" className="earth-grid-line" />
            <line x1="2" y1="120" x2="238" y2="120" className="earth-grid-line earth-grid-line--cyan" />
          </g>
        </svg>

        {/* Seamless 200% Width Rotating Surface */}
        <div className="earth-surface-rotator">
          <ContinentTrackSvg />
          <ContinentTrackSvg />
        </div>

        {/* 3D Specular Highlight, Night Terminator & Atmospheric Rim */}
        <div className="earth-lighting" />
      </div>
    </div>
  );
}
