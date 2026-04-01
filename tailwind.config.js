/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ocean-blue': '#3A7CA5',
        'ocean-blue-dark': '#2D5F7E',
        'ocean-blue-light': '#5A9CC5',
        'tropical-green': '#2D5016',
        'tropical-green-dark': '#1E360F',
        'tropical-green-light': '#3D6B1E',
        'sand-beige': '#F5E6D3',
        'deep-sand': '#E8D5C1',
        'shell-white': '#FFF8F0',
        'terracotta': '#C17A5F',
        'coral-white': '#F8F4EF',
        'warm-sand': '#F0E8DC',
        'deep-sand': '#E8D5BE',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'breath-on-hover': 'breath 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.15s ease-out',
      },
      keyframes: {
        breath: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
          '50%': { transform: 'scale(1.02)', boxShadow: '0 8px 25px rgba(27, 79, 114, 0.15)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
