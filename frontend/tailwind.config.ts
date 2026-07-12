import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        annotation: ['var(--font-special-elite)', 'cursive'],
      },
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        wine: 'var(--wine)',
        gold: 'var(--gold)',
        sketch: 'var(--sketch)',
        line: 'var(--line)',
        'rose-bg': 'var(--rose-bg)',
        'rose-ink': 'var(--rose-ink)',
      },
      borderRadius: {
        btn: '8px',
        card: '8px',
        panel: '12px',
        badge: '5px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 3.5s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
