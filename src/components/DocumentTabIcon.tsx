import type { DocumentType } from '../game/types';

interface DocumentTabIconProps {
  type: DocumentType;
}

export function DocumentTabIcon({ type }: DocumentTabIconProps) {
  switch (type) {
    case 'application':
      return (
        <svg className="document-tabs__svg" viewBox="0 0 16 16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M3 1h7l3 3v11H3V1zm6 0v3h3M5 6h6M5 8.5h6M5 11h4"
            stroke="currentColor"
            strokeWidth="0.8"
            fillOpacity="0.15"
          />
        </svg>
      );
    case 'idBadge':
      return (
        <svg className="document-tabs__svg" viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2" y="3" width="12" height="10" rx="1" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="5.5" cy="7" r="1.8" fill="currentColor" fillOpacity="0.4" />
          <path d="M8.5 6h4M8.5 8h3" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      );
    case 'resume':
      return (
        <svg className="document-tabs__svg" viewBox="0 0 16 16" aria-hidden="true">
          <path
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeWidth="0.8"
            d="M4 1h6l3 3v11H4V1zm5 0v3h3"
          />
          <path d="M5.5 7h5M5.5 9h5M5.5 11h3" stroke="currentColor" strokeWidth="0.7" />
        </svg>
      );
    case 'reference':
      return (
        <svg className="document-tabs__svg" viewBox="0 0 16 16" aria-hidden="true">
          <path
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeWidth="0.8"
            d="M2 4h12v9H2V4zm0-2h8l2 2"
          />
          <path d="M4.5 8h7M4.5 10h5" stroke="currentColor" strokeWidth="0.7" />
        </svg>
      );
  }
}
