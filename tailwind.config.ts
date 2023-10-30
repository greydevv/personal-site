import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    fontFamily: {
      "ibm-plex-sans": ["IBM Plex Sans", "sans-serif"],
      "inter": ["Inter", "sans-serif"],
      "dm-mono": ["DM Mono", "sans-serif"]
    },
    colors: {
        "dark": "#363636",
        "light": "#F5F5F5",

        "grey": "#ACACAC",
        "grey-10": "#D4D4D4",
        "grey-20": "#E8E8E8",

        "red": "#8F6D6D",
        "red-10": "#E9DFDF",
        "red-20": "#E0C7C7",
        "red-30": "#D0ADAD",
        "red-40": "#BB8888",
    }
  },
  plugins: [],
}
export default config
