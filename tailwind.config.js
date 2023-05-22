/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      opensans: ['Open Sans', 'sans-serif'],
      oswald: ['Oswald', 'sans-serif']
    },
    colors: {
      primary: '#326273',
      primaryLight: '#5C9EAD',
      black: '#000000',
      white: '#FFFFFF',
      gray: '#808080',
      antiWhite: '#EEEEEE',
      tangerine: '#E39774'
    },
    extend: {}
  },
  plugins: []
}
