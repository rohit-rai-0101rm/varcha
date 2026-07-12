export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 340" className={className} aria-hidden="true">
      <g
        transform="translate(40,50.0) scale(0.75)"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <polygon
          points="34.2,23.5 135.3,239.6 142.7,236.4 49.8,16.5"
          fill="currentColor"
          strokeWidth="4"
        />
        <polygon
          points="250.2,16.5 157.3,236.4 164.7,239.6 265.8,23.5"
          fill="currentColor"
          strokeWidth="4"
        />
        <rect x="22" y="8" width="42" height="9" rx="4.5" fill="currentColor" strokeWidth="2" />
        <rect x="236" y="8" width="42" height="9" rx="4.5" fill="currentColor" strokeWidth="2" />
        <g fill="none">
          <path d="M128 260 L172 260 L186 275 L150 316 L114 275 Z" strokeWidth="8" />
          <path d="M128 260 L139 275 L150 316" strokeWidth="4.6" />
          <path d="M172 260 L161 275 L150 316" strokeWidth="4.6" />
          <path d="M114 275 L186 275" strokeWidth="4.6" />
        </g>
      </g>
    </svg>
  );
}
