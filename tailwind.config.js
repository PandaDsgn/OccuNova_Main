/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        textPrimary: "var(--color-text-primary)",
        textSecondary: "var(--color-text-secondary)",
        primaryAccent: "var(--color-primary-accent)",
        secondaryAccent: "var(--color-secondary-accent)",
      },
      fontFamily: {
        // This is for your logo
        brilliant: ['Brilliant', 'serif'], 
        
        // This is your default body font
        sans: [
          'Cooper Hewitt',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};