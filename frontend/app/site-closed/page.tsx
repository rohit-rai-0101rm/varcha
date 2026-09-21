'use client';

export const dynamic = 'force-static';

export default function SiteClosedPage() {
  return (
    <div className="shake-wrap relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <div className="siren absolute inset-0" />

      <div className="pulse-light pulse-red absolute -left-1/4 top-1/4 h-[60vmax] w-[60vmax] rounded-full blur-3xl" />
      <div className="pulse-light pulse-blue absolute -right-1/4 bottom-1/4 h-[60vmax] w-[60vmax] rounded-full blur-3xl" />

      <div className="scanlines absolute inset-0" />
      <div className="vignette absolute inset-0" />

      <div className="tape tape-top absolute left-[-10%] right-[-10%] top-[14%] h-10 -rotate-2" />
      <div className="tape tape-bottom absolute left-[-10%] right-[-10%] bottom-[14%] h-10 rotate-2" />

      <div className="x-bar x-bar-1 absolute left-1/2 top-1/2 h-3 w-[140vmax] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-red-600" />
      <div className="x-bar x-bar-2 absolute left-1/2 top-1/2 h-3 w-[140vmax] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-red-600" />

      <div className="flash absolute inset-0 bg-white" />

      <div className="stamp relative z-10 mx-6 max-w-md -rotate-6 rounded-md border-4 border-red-600 bg-black/70 p-6 text-center backdrop-blur-sm">
        <p className="font-display text-3xl font-bold tracking-wide text-red-500 sm:text-4xl">
          CASE CLOSED
        </p>
        <p className="font-annotation mt-4 text-sm leading-relaxed text-neutral-300">
          This site has been taken offline due to an outstanding unpaid invoice
          for development services.
        </p>
        <p className="typewriter font-annotation mt-3 text-xs uppercase tracking-widest text-neutral-500">
          Status: Unpaid
        </p>
      </div>

      <style jsx>{`
        .shake-wrap {
          animation: shake 0.4s ease-out;
          animation-delay: 1.05s;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translate(0, 0);
          }
          20% {
            transform: translate(-6px, 3px);
          }
          40% {
            transform: translate(5px, -4px);
          }
          60% {
            transform: translate(-4px, -2px);
          }
          80% {
            transform: translate(4px, 3px);
          }
        }

        .siren {
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(220, 38, 38, 0.4) 40deg,
            transparent 90deg,
            transparent 180deg,
            rgba(37, 99, 235, 0.4) 220deg,
            transparent 270deg
          );
          mix-blend-mode: screen;
          animation: siren-spin 3.2s linear infinite;
        }
        @keyframes siren-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .pulse-light {
          opacity: 0.25;
          animation: pulse-cycle 3s ease-in-out infinite;
        }
        .pulse-red {
          background: radial-gradient(circle, rgba(220, 38, 38, 0.9), transparent 70%);
          animation-delay: 0s;
        }
        .pulse-blue {
          background: radial-gradient(circle, rgba(37, 99, 235, 0.9), transparent 70%);
          animation-delay: 1.5s;
        }
        @keyframes pulse-cycle {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.4;
          }
        }

        .scanlines {
          background: repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.05) 0px,
            rgba(255, 255, 255, 0.05) 1px,
            transparent 1px,
            transparent 3px
          );
          animation: scanline-drift 6s linear infinite;
          pointer-events: none;
        }
        @keyframes scanline-drift {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 0 120px;
          }
        }

        .vignette {
          background: radial-gradient(
            ellipse at center,
            transparent 45%,
            rgba(0, 0, 0, 0.75) 100%
          );
          pointer-events: none;
        }

        .tape {
          background-image: repeating-linear-gradient(
            45deg,
            #facc15,
            #facc15 24px,
            #111827 24px,
            #111827 48px
          );
          background-size: 68px 68px;
          box-shadow: 0 0 24px rgba(0, 0, 0, 0.6);
          animation: tape-scroll 3s linear infinite;
        }
        .tape-bottom {
          animation-direction: reverse;
        }
        @keyframes tape-scroll {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 96px 0;
          }
        }

        .x-bar {
          transform-origin: center;
          animation: slash 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          box-shadow:
            0 0 20px rgba(220, 38, 38, 0.8),
            0 0 60px rgba(220, 38, 38, 0.4);
        }
        .x-bar-1 {
          animation-delay: 0.1s;
        }
        .x-bar-2 {
          animation-delay: 0.5s;
        }
        @keyframes slash {
          from {
            transform: translate(-50%, -50%) rotate(var(--rot, 45deg)) scaleX(0);
          }
          to {
            transform: translate(-50%, -50%) rotate(var(--rot, 45deg)) scaleX(1);
          }
        }
        .x-bar-1 {
          --rot: 45deg;
        }
        .x-bar-2 {
          --rot: -45deg;
        }

        .flash {
          opacity: 0;
          animation: flash-pop 0.5s ease-out forwards;
          animation-delay: 1.05s;
          pointer-events: none;
        }
        @keyframes flash-pop {
          0% {
            opacity: 0;
          }
          8% {
            opacity: 0.85;
          }
          100% {
            opacity: 0;
          }
        }

        .stamp {
          opacity: 0;
          animation: stamp-in 0.4s ease-out forwards;
          animation-delay: 1.15s;
        }
        @keyframes stamp-in {
          from {
            opacity: 0;
            transform: rotate(-6deg) scale(1.4);
          }
          to {
            opacity: 1;
            transform: rotate(-6deg) scale(1);
          }
        }

        .typewriter {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          width: 0;
          border-right: 2px solid #ef4444;
          animation:
            typing 0.8s steps(14, end) forwards,
            caret-blink 0.6s step-end infinite;
          animation-delay: 1.6s, 1.6s;
        }
        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 18ch;
          }
        }
        @keyframes caret-blink {
          50% {
            border-color: transparent;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .shake-wrap,
          .siren,
          .pulse-light,
          .scanlines,
          .tape,
          .x-bar,
          .flash,
          .stamp,
          .typewriter {
            animation: none !important;
          }
          .x-bar-1 {
            transform: translate(-50%, -50%) rotate(45deg) scaleX(1);
          }
          .x-bar-2 {
            transform: translate(-50%, -50%) rotate(-45deg) scaleX(1);
          }
          .stamp {
            opacity: 1;
            transform: rotate(-6deg) scale(1);
          }
          .typewriter {
            width: 18ch;
            border-right-color: transparent;
          }
        }
      `}</style>
    </div>
  );
}
