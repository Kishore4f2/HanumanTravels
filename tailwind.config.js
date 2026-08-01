/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF6B00",
          "orange-glow": "#FF8800",
          amber: "#F59E0B",
          dark: "#050505",
          charcoal: "#0F0F11",
          gold: "#DFB260",
          slate: "#8E8E93",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shine': 'shine 3s linear infinite',
        rotateSlow: 'rotate 45s linear infinite',
        'fog-move': 'fogMove 25s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fogMove: {
          '0%': { transform: 'translate(-5%, -2%) scale(1.05)' },
          '100%': { transform: 'translate(5%, 2%) scale(1.15)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', filter: 'blur(20px)' },
          '50%': { opacity: '0.8', filter: 'blur(30px)' },
        },
      },
      boxShadow: {
        'luxury-orange': '0 10px 40px -10px rgba(255, 107, 0, 0.5)',
        'luxury-glow': '0 0 50px rgba(255, 136, 0, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '40px',
      },
    },
  },
  plugins: [],
};
