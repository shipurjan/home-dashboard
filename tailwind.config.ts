import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      keyframes: {
        'pulse-time': {
          '0%, 50%': { opacity: '1' },
          '100%': { opacity: '0' }
        }
      },
      animation: {
        'pulse-time': 'pulse-time 2s linear infinite'
      }
    }
  },
  plugins: []
};
export default config;
