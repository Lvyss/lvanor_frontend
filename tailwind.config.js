module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
            colors: {
        invaPurple: '#a855f7',
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'], // untuk judul
          cinzel: ['Cinzel', 'sans-serif'], // untuk judul
        antiqua: ['"Uncial Antiqua"', 'cursive'], // Judul INVANOR
        poppins: ['Poppins', 'sans-serif'], // Font standar untuk menu
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
    },
  },
  plugins: [],
};
