/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Hardline brand scale
        hardline: {
          950: '#0B1F17',
          900: '#1F3F33',
          800: '#3C574E',
          500: '#59AF8C', // mint — sole accent
          400: '#6FC49F',
          300: '#7E908C',
          100: '#DBE1E4',
          50: '#F0F7F4',
        },
        mint: {
          DEFAULT: '#59AF8C',
          400: '#6FC49F',
        },
      },
      fontFamily: {
        sans: ['var(--hl-font)', 'Montserrat', 'sans-serif'],
        display: ['var(--hl-font)', 'Montserrat', 'sans-serif'],
      },
      borderRadius: {
        btn: '12px',
        card: '18px',
        input: '10px',
      },
      boxShadow: {
        // Light-surface neumorphic scale
        'neu-sm': '4px 4px 10px var(--hl-sd), -4px -4px 10px var(--hl-sl)',
        neu: '6px 6px 14px var(--hl-sd), -6px -6px 14px var(--hl-sl)',
        'neu-md': '10px 10px 22px var(--hl-sd), -10px -10px 22px var(--hl-sl)',
        'neu-lg': '14px 14px 30px var(--hl-sd), -14px -14px 30px var(--hl-sl)',
        'neu-inset':
          'inset 4px 4px 9px var(--hl-inset-dark), inset -4px -4px 9px var(--hl-inset-light)',
        'neu-inset-focus':
          'inset 5px 5px 11px var(--hl-inset-dark), inset -5px -5px 11px var(--hl-inset-light)',
        // Dark-surface variants
        'neu-dark':
          'inset 4px 4px 10px rgba(255,255,255,0.04), inset -4px -4px 10px rgba(0,0,0,0.3), 8px 8px 20px rgba(0,0,0,0.35), -4px -4px 12px rgba(255,255,255,0.03)',
        'neu-dark-sm':
          'inset 3px 3px 8px var(--hl-inset-dark), inset -3px -3px 8px var(--hl-inset-light)',
        // Nav variants
        'neu-nav': '0 6px 18px var(--hl-sd)',
        'neu-nav-dark': '0 6px 18px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'icon-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
        borderSpin: {
          to: { '--border-angle': '360deg' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'scroll-left': 'scroll-left 12.5s linear infinite',
        'icon-pulse': 'icon-pulse 3s ease-in-out infinite',
        'border-spin': 'borderSpin 3s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
