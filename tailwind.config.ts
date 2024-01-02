/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "pattern-current": `url('data:image/svg+xml,%3Csvg width="76" height="18" viewBox="0 0 76 18" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M32 18c-2.43-1.824-4-4.73-4-8 0-4.418-3.582-8-8-8H0V0h20c5.523 0 10 4.477 10 10 0 4.418 3.582 8 8 8h20c4.418 0 8-3.582 8-8 0-5.523 4.477-10 10-10v2c-4.418 0-8 3.582-8 8 0 3.27-1.57 6.176-4 8H32zM64 0c-1.67 1.256-3.748 2-6 2H38c-2.252 0-4.33-.744-6-2h32z" fill="%233f434b" fill-opacity="0.02" fill-rule="evenodd"/%3E%3C/svg%3E')`,
      },
      scale: {
        "-100": "-1",
      },
      transitionDuration: {
        "3000": "3000ms",
      },
      backdropBlur: {
        none: "0",
        blur: "blur(20px)",
        "blur-lg": "blur(40px)",
        "blur-xl": "blur(60px)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          secondary: "hsl(var(--card-secondary))",
          secondaryLight: "hsl(var(--card-secondary-light))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
