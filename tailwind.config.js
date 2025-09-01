/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        earth: "#8B5E3C",
        water: "#0EA5E9",
        fire:  "#EF4444",
        air:   "#38BDF8",
        space: "#6D28D9",
      },
      boxShadow: { soft: "0 6px 30px rgba(0,0,0,0.08)" },
      borderRadius: { xl2: "1rem" },
    },
  },
};
