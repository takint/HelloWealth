module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      display: ["Belleza", "sans-serif"],
      body: ["Noto Sans", "sans-serif"],
    },
    extend: {
      colors: {
        gray: {
          100: "#f5f5f5",
          200: "#eeeeee",
          300: "#e0e0e0",
          400: "#bdbdbd",
          500: "#9e9e9e",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121",
        },
        pink: '#f9f8f7',
        red: '#b91c1c',
        blue: '#030730',
        blue__medium:'#000C66',
        blue__light:'#7EC8E3',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
