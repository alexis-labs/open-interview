export function DeskProps() {
  return (
    <div className="desk-props" aria-hidden="true">
      <svg className="desk-props__coffee" viewBox="0 0 80 80" fill="none">
        <ellipse cx="40" cy="58" rx="28" ry="10" fill="rgba(90,70,50,0.25)" />
        <ellipse cx="40" cy="40" rx="22" ry="18" fill="rgba(70,55,40,0.18)" />
        <ellipse cx="36" cy="36" rx="8" ry="6" fill="rgba(50,40,30,0.12)" />
      </svg>
      <svg className="desk-props__pen" viewBox="0 0 120 24" fill="none">
        <rect x="4" y="8" width="90" height="8" rx="2" fill="#2a4a6a" />
        <polygon points="94,8 110,12 94,16" fill="#c0a060" />
        <rect x="0" y="9" width="8" height="6" rx="1" fill="#1a3050" />
      </svg>
      <svg className="desk-props__stapler" viewBox="0 0 60 40" fill="none">
        <rect x="4" y="14" width="48" height="16" rx="3" fill="#3a3a38" />
        <rect x="8" y="10" width="36" height="10" rx="2" fill="#4a4a48" />
        <rect x="40" y="18" width="10" height="8" rx="1" fill="#2a2a28" />
      </svg>
      <div className="desk-props__in-tray">
        <span>IN</span>
      </div>
    </div>
  );
}
