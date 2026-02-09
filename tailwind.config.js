/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'deep': '#0a0b0d',
        'card': '#12141a',
        'card-hover': '#181c26',
        'text-primary': '#eee8df',
        'text-muted': 'rgba(238,232,223,0.45)',
        'accent': '#c8a96e',
        'accent-dim': 'rgba(200,169,110,0.15)',
        'accent-hover': '#d9bf84',
        'green': '#6fbf82',
        'green-dim': 'rgba(111,191,130,0.15)',
        'border': 'rgba(255,255,255,0.06)',
        'tag-bg': 'rgba(255,255,255,0.05)',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'pulse-slow': 'pulse 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
}