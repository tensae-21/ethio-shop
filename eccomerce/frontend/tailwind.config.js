export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        fasil: {
          50: "#eefcf3",
          100: "#d7f5de",
          200: "#b6e8be",
          300: "#84d691",
          400: "#4fbf5f",
          500: "#2e9f41",
          600: "#1e7a31",
          700: "#175c2a",
          800: "#154a21",
          900: "#153b1d",
        },
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.09)",
      },
    },
  },
  plugins: [],
};
