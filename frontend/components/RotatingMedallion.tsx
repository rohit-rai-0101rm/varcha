import { useId } from 'react';
import LogoMark from './LogoMark';

interface Props {
  size?: number;
  className?: string;
}

const RING_TEXT = 'NATURAL STONES  ·  HANDCRAFTED JEWELLERY  ·  ';
const RING_WIDTH = 10;

export default function RotatingMedallion({ size = 176, className = '' }: Props) {
  const pathId = useId();
  const innerSize = size - RING_WIDTH * 2;
  const textRadius = innerSize / 2 - 16;
  const innerCenter = innerSize / 2;

  return (
    <div
      className={`relative shrink-0 rounded-full shadow-[0_0_0_1px_rgba(184,144,46,0.15),0_20px_45px_-18px_rgba(0,0,0,.4),0_0_36px_rgba(184,144,46,0.35)] ${className}`}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(155deg, #F3E2B0 0%, #D9B36A 45%, #9E7328 100%)',
      }}
    >
      {/* inner disc */}
      <div className="absolute rounded-full bg-surface" style={{ inset: RING_WIDTH }}>
        {/* rotating text ring */}
        <svg
          viewBox={`0 0 ${innerSize} ${innerSize}`}
          className="absolute inset-0 h-full w-full animate-[spin_22s_linear_infinite]"
        >
          <path
            id={pathId}
            fill="none"
            d={`M ${innerCenter - textRadius},${innerCenter} a ${textRadius},${textRadius} 0 1,1 ${textRadius * 2},0 a ${textRadius},${textRadius} 0 1,1 -${textRadius * 2},0`}
          />
          <text className="fill-wine font-body font-semibold uppercase" style={{ fontSize: 9.5, letterSpacing: '0.14em' }}>
            <textPath href={`#${pathId}`} startOffset="0%">
              {RING_TEXT}
            </textPath>
          </text>
        </svg>

        {/* static center mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <LogoMark className="h-11 w-11 text-wine" />
        </div>
      </div>
    </div>
  );
}
