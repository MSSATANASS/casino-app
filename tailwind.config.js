/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        night: "#0A0E1A",
        night2: "#0F121C",
        panel: "#191D2F",
        cyan: "#00CFFF",
        blue: "#2D7FFF",
        green: "#27AE60",
        purple: "#A100FF",
        text: "#F4F2EC",
        sub: "#B0B3BE",
      },
      boxShadow: {
        glow: "0 0 24px rgba(0, 207, 255, 0.35)",
        "glow-blue": "0 0 24px rgba(45, 127, 255, 0.35)",
        "glow-green": "0 0 20px rgba(39, 174, 96, 0.4)",
      },
      borderRadius: {
        glass: "12px",
      },
    },
  },
  plugins: [],
};
