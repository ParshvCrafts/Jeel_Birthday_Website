import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0e0e0e',
        surface: '#161210',
        'surface-2': '#1e1a14',
        border: '#2a2018',
        gold: '#c9a87c',
        'gold-muted': '#8a6a3a',
        cream: '#f5f0e8',
        muted: '#8a7a6a',
        subtle: '#4a3a2a',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'float-drift': {
          '0%, 100%': { transform: 'translateY(0px) rotate(var(--tag-rotate, 0deg))' },
          '50%': { transform: 'translateY(-8px) rotate(var(--tag-rotate, 0deg))' },
        },
        'slot-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0%)', opacity: '1' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        'music-wave': {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'float-drift': 'float-drift 4s ease-in-out infinite',
        'slot-up': 'slot-up 0.3s ease-out forwards',
        'confetti-fall': 'confetti-fall 3s ease-in forwards',
        'music-wave': 'music-wave 0.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
