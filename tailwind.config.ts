import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bold: {
          bg: '#000000',
          surface: '#050505',
          drawer: '#121212',
          num: '#1A1A1A',
          op: '#2F2F2F',
          action: '#3D3D3D',
          accent: '#FF9500',
          accentText: '#FF9F0A',
          textPrimary: '#FFFFFF',
          textSecondary: '#737373',
          divider: '#2F2F2F',
          error: '#FF453A',
          success: '#32D74B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['5rem', { lineHeight: '1.1', letterSpacing: '-0.05em', fontWeight: '900' }],
        'display-md': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.05em', fontWeight: '900' }],
        'display-sm': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: '900' }],
        'display-xs': ['2rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '900' }],
      },
      transitionTimingFunction: {
        bold: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        shake: 'shake 0.25s ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
