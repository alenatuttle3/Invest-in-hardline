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
        // Hardline brand scale (Field Record)
        hardline: {
          950: '#0B1F17', // Deep Field
          900: '#1F3F33', // Forest
          800: '#3C574E',
          500: '#59AF8C', // Mint
          400: '#6FC49F', // Mint Hi
          300: '#7E908C', // Grey-green, metadata only
          100: '#E7E5E0', // Concrete
          50: '#F5F4F1', // Paper
        },
        mint: {
          DEFAULT: '#59AF8C',
          400: '#6FC49F',
        },
        paper: '#F5F4F1',
        concrete: '#E7E5E0',
        grit: '#D6D4CE',
        forest: { DEFAULT: '#1F3F33', hover: '#2A5243' },
        'deep-field': '#0B1F17',
        clay: { DEFAULT: '#A85E42', deep: '#8B4A32', light: '#C07A57' },
      },
      // 15px floor: nothing renders below 11pt, so text-xs and text-sm both
      // resolve to 15px (matches hardlineapp.com).
      fontSize: {
        xs: ['0.9375rem', { lineHeight: '1.4' }],
        sm: ['0.9375rem', { lineHeight: '1.5' }],
      },
      fontFamily: {
        sans: ['var(--hl-font)', 'Montserrat', 'sans-serif'],
        display: ['var(--hl-font)', 'Montserrat', 'sans-serif'],
      },
      // 4px everywhere.
      borderRadius: {
        btn: '4px',
        card: '4px',
        input: '4px',
      },
      // No elevation in Field Record: depth is a surface change plus a 1px
      // rule. The old neumorphic names resolve to nothing.
      boxShadow: {
        'neu-sm': 'none',
        neu: 'none',
        'neu-md': 'none',
        'neu-lg': 'none',
        'neu-inset': 'none',
        'neu-inset-focus': 'none',
        'neu-dark': 'none',
        'neu-dark-sm': 'none',
        'neu-nav': 'none',
        'neu-nav-dark': 'none',
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
