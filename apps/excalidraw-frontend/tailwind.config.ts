import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#65e6bf",
        primary2:"#DE3163"
      },
      fontFamily:{
        'satoshi':['Satoshi','sans-serif']
      }
    },
  },
  plugins: [],
} satisfies Config;
