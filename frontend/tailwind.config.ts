import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
        gold: {
          50: "#FFF7E6",
          100: "#FFE4B3",
          200: "#FFD180",
          300: "#FFBE4D",
          400: "#F5A623",
          500: "#D4A843",
          600: "#B8912E",
          700: "#9C7A1A",
          800: "#806305",
          900: "#7C4D00",
        },
        navy: {
          50: "#F0F4FF",
          100: "#D6E4FF",
          200: "#ADC8FF",
          300: "#84A9FF",
          400: "#2563EB",
          500: "#1E4D8C",
          600: "#1A3F73",
          700: "#0F2B5C",
          800: "#0A1E3D",
          900: "#0A1628",
        },
        sand: {
          50: "#FFFBF0",
          100: "#FFF4D6",
          200: "#F5E6C8",
          300: "#E8D5A3",
          400: "#D4C48A",
          500: "#C4B47A",
          600: "#A8986A",
          700: "#8C7C5A",
          800: "#6C5C3E",
          900: "#5C4A1E",
        },
        uae: {
          red: "#FF0000",
          green: "#009933",
          black: "#000000",
          white: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        arabic: ["Noto Naskh Arabic", "serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        medium: "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.04)",
        hard: "0 10px 40px -8px rgba(0, 0, 0, 0.15), 0 5px 10px -5px rgba(0, 0, 0, 0.1)",
        glow: "0 0 20px rgba(212, 168, 67, 0.3), 0 0 40px rgba(212, 168, 67, 0.1)",
      },
      backgroundImage: {
        "luxury-gold": "linear-gradient(135deg, #D4A843 0%, #F5A623 50%, #FFD180 100%)",
        "luxury-navy": "linear-gradient(135deg, #0A1628 0%, #1E4D8C 50%, #2563EB 100%)",
        "desert-sand": "linear-gradient(135deg, #C4B47A 0%, #E8D5A3 50%, #FFF4D6 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
