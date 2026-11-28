import { useState } from 'react';

const BG_CANDIDATES = [
  '/images/homepage-bg.webp',
  '/images/homepage-bg.jpg',
  '/images/homepage-bg.png',
] as const;

export function HomepageBackdrop() {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const activeSrc = candidateIndex < BG_CANDIDATES.length ? BG_CANDIDATES[candidateIndex] : null;

  const handleImageError = () => {
    setCandidateIndex((prev) => prev + 1);
  };

  return (
    <div className="hp-backdrop" aria-hidden="true">
      {/* Pure CSS + SVG Cyber Corridor Fallback (Matches Reference 2 Composition) */}
      <svg
        className="hp-backdrop__corridor-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="hp-zenith" cx="50%" cy="46%" r="54%">
            <stop offset="0%" stopColor="#58ffb3" stopOpacity="0.55" />
            <stop offset="28%" stopColor="#20ff9a" stopOpacity="0.22" />
            <stop offset="68%" stopColor="#041911" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#020705" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hp-rail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38d9ff" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#20ff9a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#00b86b" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="#020806" />
        <rect width="1440" height="900" fill="url(#hp-zenith)" />

        {/* Perspective Cyber Corridor Walls & Floor Track */}
        <g stroke="url(#hp-rail)" fill="none">
          <line x1="720" y1="414" x2="0" y2="120" strokeWidth="1.2" strokeOpacity="0.5" />
          <line x1="720" y1="414" x2="1440" y2="120" strokeWidth="1.2" strokeOpacity="0.5" />
          <line x1="720" y1="414" x2="0" y2="340" strokeWidth="1" strokeOpacity="0.35" />
          <line x1="720" y1="414" x2="1440" y2="340" strokeWidth="1" strokeOpacity="0.35" />
          <line x1="720" y1="414" x2="110" y2="900" strokeWidth="2.4" strokeOpacity="0.72" />
          <line x1="720" y1="414" x2="1330" y2="900" strokeWidth="2.4" strokeOpacity="0.72" />
          <line x1="720" y1="414" x2="430" y2="900" strokeWidth="1.4" strokeOpacity="0.45" />
          <line x1="720" y1="414" x2="1010" y2="900" strokeWidth="1.4" strokeOpacity="0.45" />
          <line x1="720" y1="414" x2="640" y2="900" strokeWidth="1" strokeOpacity="0.35" />
          <line x1="720" y1="414" x2="800" y2="900" strokeWidth="1" strokeOpacity="0.35" />
        </g>

        {/* Vertical Cyber Tower Data Streaks */}
        <g stroke="#20ff9a" strokeOpacity="0.22" strokeWidth="1.2">
          <line x1="120" y1="40" x2="120" y2="760" />
          <line x1="210" y1="80" x2="210" y2="690" />
          <line x1="310" y1="140" x2="310" y2="620" />
          <line x1="1130" y1="140" x2="1130" y2="620" />
          <line x1="1230" y1="80" x2="1230" y2="690" />
          <line x1="1320" y1="40" x2="1320" y2="760" />
        </g>
      </svg>

      {/* Reference 2 Actual Background Image Layer (Automatically displayed when uploaded) */}
      {activeSrc && (
        <img
          src={activeSrc}
          alt=""
          decoding="async"
          className="hp-backdrop__image"
          onError={handleImageError}
        />
      )}

      {/* Subtle Readability Vignette (Preserves Center Glow & Corridor Identity) */}
      <div className="hp-backdrop__overlay" />

      {/* Lightweight Video-Type Cinematic Animations (GPU-Composited) */}
      <div className="hp-backdrop__horizon-pulse" />
      <div className="hp-backdrop__beams" />
      <div className="hp-backdrop__streams" />
      <div className="hp-backdrop__particles" />
    </div>
  );
}
