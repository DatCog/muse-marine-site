/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        appleGray: '#fbfbfd',
        appleDark: '#1d1d1f',
        appleMuted: '#6e6e73',
        appleBlue: '#0066cc',
        appleGreen: '#1d352c',
        appleEmerald: '#34c759',
      },
    },
  },
  plugins: [],
};
