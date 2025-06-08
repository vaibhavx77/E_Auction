import type { Config } from "tailwindcss"
const { fontFamily } = require("tailwindcss/defaultTheme")

const config: Config = {
//   darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        // "page-gradient":
        //   "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent)",
        "hero-gradient":
          "radial-gradient(ellipse 50% 80% at 20% 40%, rgba(93, 52, 221, 0.1), transparent), radial-gradient(ellipse 50% 80% at 80% 50%, rgba(120, 119, 198, 0.15), transparent)",
        "primary-gradient":
          "linear-gradient(92.88deg, rgb(69, 94, 181) 9.16%, rgb(86, 67, 204) 43.89%, rgb(103, 63, 215) 64.72%)",
        "sunrise-gradient":
          "radial-gradient(circle at center top, #ffffff 0%, #1e3a8a 100%)",
        "button-gradient": "linear-gradient(180deg, #4F5EE4 0%, #1F30C4 100%)",
        "text-gradient": "linear-gradient(to bottom, #f9fafb 55%, #1a1a1a)",
        "outline-custom": "linear-gradient(to bottom,#4f5ee4 50%, #1f30c4)",
      },
      boxShadow: {
        primary: "rgb(80 63 205 / 50%) 0px 1px 40px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        subtitle: {
          DEFAULT: "#4E5273",
        },
        "dark-green": {
          700: "#141D1F",
          900: "#060F11",
        },
        gray: {
          50: "#F8F9FF",
          300: "#D1D5DB",
          400: "#9BA3AF",
          700: "#394352",
        },
        blue: {
          50: "#EDEDFA",
          500: "#1F30C4",
          900: "#0A125B",
          1000: "#0C0521",
          "card-accent": "#f2f3ff",
        },
        purple: {
          100: "#9B62FF",
          800: "#090521",
          900: "#451FC4",
        },
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
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderColor: () => ({
        DEFAULT: "#C2C5EB",
      }),
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 3px rgba(255, 255, 255, 0.9)" },
          "50%": { boxShadow: "0 0 6px rgba(255, 255, 255, 0.9)" },
        },
      },
      animation: {
        glow: "glow 4s infinite ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config

