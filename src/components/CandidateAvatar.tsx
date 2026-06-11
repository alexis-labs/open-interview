const AVATAR_COLORS = [
  '#4a6fa5',
  '#6b8f71',
  '#a67c52',
  '#8b6b8f',
  '#5a8a9a',
  '#9a6b5a',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface CandidateAvatarProps {
  name: string;
  index: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function CandidateAvatar({ name, index, size = 'md' }: CandidateAvatarProps) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initials = getInitials(name);

  return (
    <div className={`candidate-avatar candidate-avatar--${size}`} style={{ '--avatar-color': color } as Record<string, string>}>
      <svg viewBox="0 0 64 80" className="candidate-avatar__svg">
        <rect x="8" y="4" width="48" height="72" rx="4" fill="var(--avatar-color)" opacity="0.15" />
        <circle cx="32" cy="28" r="14" fill="var(--avatar-color)" opacity="0.85" />
        <text x="32" y="33" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600" fontFamily="IBM Plex Mono, monospace">
          {initials}
        </text>
        <path d="M14 80 Q32 52 50 80" fill="var(--avatar-color)" opacity="0.7" />
        <rect x="8" y="4" width="48" height="72" rx="4" fill="none" stroke="var(--avatar-color)" strokeWidth="1.5" opacity="0.5" />
      </svg>
    </div>
  );
}
