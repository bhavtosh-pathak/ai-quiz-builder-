/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // "Exam paper & ledger" palette — an academic, scoreboard-driven identity
        ink: {
          DEFAULT: '#14161F',
          light: '#1E2130',
          soft: '#2B2F45',
        },
        paper: {
          DEFAULT: '#F7F5EF',
          dim: '#EFEBE1',
        },
        primary: {
          50: '#EEF0FD',
          100: '#DBE0FB',
          200: '#B7C1F7',
          300: '#8E9EF1',
          400: '#5E71E4',
          500: '#3B4CCA',
          600: '#2F3CA3',
          700: '#262F80',
          800: '#1D245F',
          900: '#141942',
        },
        gold: {
          50: '#FDF7E7',
          100: '#FBEEC7',
          200: '#F5DC8E',
          300: '#EFC85C',
          400: '#E3B341',
          500: '#C6952A',
          600: '#9C7420',
        },
        success: {
          DEFAULT: '#2F9E64',
          light: '#E5F6ED',
        },
        danger: {
          DEFAULT: '#D6455D',
          light: '#FBE8EC',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'grid-lines':
          'linear-gradient(to right, rgba(20,22,31,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,22,31,0.04) 1px, transparent 1px)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,22,31,0.06), 0 8px 24px -12px rgba(20,22,31,0.18)',
        'card-hover': '0 1px 2px rgba(20,22,31,0.08), 0 16px 32px -12px rgba(20,22,31,0.28)',
        ticket: 'inset 0 0 0 1px rgba(20,22,31,0.08)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'rank-pulse': {
          '0%': { backgroundColor: 'rgba(227,179,65,0.35)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'rank-pulse': 'rank-pulse 1.4s ease-out',
        'fade-up': 'fade-up 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
