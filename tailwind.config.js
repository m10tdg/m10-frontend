export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#4C6EF5",
          success: "#40C057",
          warning: "#FAB005",
          danger:  "#FA5252",
          purple:  "#7048E8",
          cyan:    "#0C8599",
          pink:    "#E64980",
          teal:    "#20C997",
        },
        surface: {
          bg:   "#F8F9FA",
          card: "#FFFFFF",
        },
        dark: {
          base: "#111827",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}