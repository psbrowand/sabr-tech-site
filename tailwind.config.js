/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surface palette — backgrounds, cards, dividers. Driven by
        // CSS vars so runtime theme-swapping can override them without
        // touching Tailwind's compiled output.
        surface: {
          base:   'var(--bg-base)',
          raised: 'var(--bg-surface)',
          card:   'var(--bg-card)',
        },

        // Brand palette — themeable via CSS vars (see src/index.css).
        // These are the canonical token names going forward; prefer
        // `bg-accent` over `bg-[#00d4ff]` or `bg-cyan-500` so a future
        // theme flip can retint the site without a code sweep.
        accent: {
          DEFAULT: 'var(--accent)',
          2:       'var(--accent-2)',
          ink:     'var(--accent-ink)',
        },
        alert:     'var(--alert)',
        highlight: 'var(--highlight)',

        // Legacy palette — kept so existing `bg-navy-900`, `text-cyber-cyan`
        // style classes still compile. New code should use the tokens
        // above. Gradually migrating these is follow-up work.
        navy: {
          950: '#080c18',
          900: '#0d1321',
          800: '#111827',
          700: '#1a2035',
          600: '#1e2d4a',
        },
        cyber: {
          cyan:   '#00d4ff',
          purple: '#6366f1',
          red:    '#ef4444',
          amber:  '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'fade-up':      'fadeUp 0.5s ease-out forwards',
        'fade-in':      'fadeIn 0.4s ease-out forwards',
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow':         'glow 2s ease-in-out infinite alternate',
        'ticker':       'tickerScroll 55s linear infinite',
        'blink':        'blink 1.2s ease-in-out infinite',
        'gradient':     'gradientShift 4s ease infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 15px rgba(var(--accent-rgb), 0.15)' },
          '100%': { boxShadow: '0 0 35px rgba(var(--accent-rgb), 0.35)' },
        },
        tickerScroll: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'cyber-grid': `
          linear-gradient(rgba(var(--accent-rgb), 0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(var(--accent-rgb), 0.025) 1px, transparent 1px)
        `,
        'hero-glow': 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(var(--accent-rgb), 0.10), transparent 70%)',
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
    },
  },
  plugins: [],
};
