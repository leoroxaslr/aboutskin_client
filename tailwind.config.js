export default {
  content: ["./src/**/*.{html,js}", "./src/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: ["pastel"],
  },
  theme: {
    extend: {
      backgroundSize: {
        "size-200": "200% 200%",
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
        "pos-100": "100% 100%",
      },
    },
  },
  plugins: [require("daisyui")],
};
