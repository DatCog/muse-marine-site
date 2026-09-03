/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        appleGray: '#F6F8FA',
        appleDark: '#0A2540',
        appleMuted: '#475569',
        appleBlue: '#0E7C86',
        appleAccent: '#F59E0B',
        appleGreen: '#0F3D36',
        appleEmerald: '#2DD4BF',
      },
    },
  },
  plugins: [],
};
