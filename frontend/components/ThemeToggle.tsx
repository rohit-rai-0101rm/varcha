'use client';

import { useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      className="mt-6 rounded-btn border border-gold px-4 py-2 font-body text-sm text-gold hover:bg-gold hover:text-surface transition-colors"
    >
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  );
}
