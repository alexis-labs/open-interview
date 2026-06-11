export function CompanyBranding() {
  return (
    <div className="company-brand">
      <svg className="company-brand__mark" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="2" y="2" width="44" height="44" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M10 34 L24 12 L38 34" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="company-brand__text">
        <span className="company-brand__name">OPENCORP</span>
        <span className="company-brand__tag">Human Resources · Screening Booth 3</span>
      </div>
    </div>
  );
}
