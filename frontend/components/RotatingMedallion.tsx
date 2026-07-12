import { useId } from 'react';
import LogoMark from './LogoMark';

interface Props {
  size?: number;
  className?: string;
}

const RING_TEXT = 'NATURAL STONES  ·  HANDCRAFTED JEWELLERY  ·  ';

export default function RotatingMedallion({ size = 160, className = '' }: Props) {
  const pathId = useId();
  const radius = size / 2 - 15;
  const center = size / 2;

  return (
    <div
      className={`relative shrink-0 rounded-full border border-line bg-surface shadow-[0_18px_36px_-20px_rgba(0,0,0,.18)] ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 h-full w-full animate-[spin_26s_linear_infinite]"
      >
        <path
          id={pathId}
          fill="none"
          d={`M ${center - radius},${center} a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
        />
        <text className="fill-sketch font-body uppercase" style={{ fontSize: 8.5, letterSpacing: '0.18em' }}>
          <textPath href={`#${pathId}`} startOffset="0%">
            {RING_TEXT}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <LogoMark className="h-8 w-8 text-gold" />
      </div>
    </div>
  );
}
