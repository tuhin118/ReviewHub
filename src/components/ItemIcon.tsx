import type { CatalogItem } from '../types/catalog';

interface ItemIconProps {
  glyph: CatalogItem['iconGlyph'];
}

export function ItemIcon({ glyph }: ItemIconProps) {
  return (
    <span className="item-icon-box" aria-hidden="true">
      {glyph === 'shield' && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l7 3.5v6c0 4.8-3 8.8-7 10.5-4-1.7-7-5.7-7-10.5v-6L12 2z" />
          <path d="M9.5 12l1.8 1.8 3.7-3.8" />
        </svg>
      )}
      {glyph === 'radar' && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 12l6-4" />
        </svg>
      )}
      {glyph === 'terminal' && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 9l3 3-3 3M13 15h4" />
        </svg>
      )}
      {glyph === 'layers' && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" />
          <path d="M3 12l9 4.5 9-4.5" />
          <path d="M3 16.5l9 4.5 9-4.5" />
        </svg>
      )}
      {glyph === 'cpu' && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
        </svg>
      )}
      {glyph === 'bolt' && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      )}
      {glyph === 'lock' && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 018 0v4" />
        </svg>
      )}
      {glyph === 'globe' && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
        </svg>
      )}
    </span>
  );
}
