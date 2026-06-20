import type { StyleFamily } from '@/lib/api';

interface Props {
  family: StyleFamily;
  className?: string;
}

export default function StyleMotif({ family, className = '' }: Props) {
  if (family === 'indian-craft') {
    return (
      <svg
        width="28"
        height="12"
        viewBox="0 0 28 12"
        fill="none"
        aria-hidden="true"
        className={className}
      >
        <path
          d="M0 6 C4 0, 8 12, 14 6 S22 0, 28 6"
          stroke="var(--sketch)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (family === 'global-tradition') {
    return (
      <svg
        width="28"
        height="8"
        viewBox="0 0 28 8"
        aria-hidden="true"
        className={className}
      >
        {[2, 8, 14, 20, 26].map((cx) => (
          <circle key={cx} cx={cx} cy="4" r="2" fill="var(--sketch)" />
        ))}
      </svg>
    );
  }

  // aesthetic
  return (
    <svg
      width="20"
      height="4"
      viewBox="0 0 20 4"
      aria-hidden="true"
      className={className}
    >
      <rect width="20" height="2" y="1" fill="var(--sketch)" />
    </svg>
  );
}
