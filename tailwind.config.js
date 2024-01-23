/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gunemtal':'#293241',
        'powder-blue':'#98C1D9',
        'paper-darker-yellow':'#B8A991',
        'button-edit':"#AA8F04",
        'button-default':"#AA8F04",
        'button-delete':"#DA3535",
        'button-submit':"#64B216",
      }
    },
  },
  plugins: [],
}

