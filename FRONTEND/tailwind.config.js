/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        banking: {
          navy: "#10233f",
          blue: "#1f5f9f",
          light: "#f4f7fb"
        }
      },
      boxShadow: {
        soft: "0 14px 35px rgba(16, 35, 63, 0.08)"
      }
    }
  },
  plugins: []
};
