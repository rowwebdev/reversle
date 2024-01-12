/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom': '3px 4px 0px 0px rgb(255,255,255)',
        'custom-small': '1px 2px 0px 0px rgb(255,255,255)',
      }
    },
  },
  plugins: [],
}

