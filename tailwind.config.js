/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#08090f',
        surface:  '#0d1221',
        surface2: '#111827',
        s3:       '#161f30',
        cyan: {
          DEFAULT: '#22d3ee',
          dim:    'rgba(34,211,238,0.12)',
          border: 'rgba(34,211,238,0.28)',
        },
      },
      fontFamily: {
        sans:    ['"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Space Grotesk"', '"Inter"', 'sans-serif'],
      },
      boxShadow: {
        glow:    '0 0 24px rgba(34,211,238,0.18)',
        'glow-sm':'0 0 12px rgba(34,211,238,0.12)',
        card:    '0 4px 32px rgba(0,0,0,0.45)',
        'card-lg':'0 8px 56px rgba(0,0,0,0.65)',
      },
      animation: {
        'float':  'float 7s ease-in-out infinite',
        'float2': 'float 7s ease-in-out 2.5s infinite',
        'pulse-glow': 'pglow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-14px)' },
        },
        pglow: {
          '0%,100%': { boxShadow: '0 0 16px rgba(34,211,238,0.2)' },
          '50%':     { boxShadow: '0 0 36px rgba(34,211,238,0.5)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
