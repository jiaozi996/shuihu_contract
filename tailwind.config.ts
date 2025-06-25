import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/theme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // extend: {
    //   fontFamily: {
    //     "zcool-xiaowei": ["ZCOOL XiaoWei", "sans-serif"],
    //     raleway: ["Raleway", "sans-serif"],
    //     // "ma-shan-zheng": ["Ma Shan Zheng", "sans-serif"],
    //   },
    // },
    // extend: {
    // 	animation: {
    // 		'background-position-spin': 'background-position-spin 3000ms infinite alternate',
    // 		gradient: 'gradient 8s linear infinite',
    // 		shine: 'shine var(--duration) infinite linear'
    // 	},
    // 	keyframes: {
    // 		'background-position-spin': {
    // 			'0%': {
    // 				backgroundPosition: 'top center'
    // 			},
    // 			'100%': {
    // 				backgroundPosition: 'bottom center'
    // 			}
    // 		},
    // 		gradient: {
    // 			to: {
    // 				backgroundPosition: 'var(--bg-size, 300%) 0'
    // 			}
    // 		},
    // 		shine: {
    // 			'0%': {
    // 				'background-position': '0% 0%'
    // 			},
    // 			'50%': {
    // 				'background-position': '100% 100%'
    // 			},
    // 			to: {
    // 				'background-position': '0% 0%'
    // 			}
    // 		}
    // 	}
    // }
  },
  plugins: [
    require("daisyui"),
    nextui({
      themes: {
        "purple-dark": {
          extend: "dark", // <- inherit default values from dark theme
          colors: {
            background: "#0D001A",
            foreground: "#ffffff",
            primary: {
              50: "#3B096C",
              100: "#520F83",
              200: "#7318A2",
              300: "#9823C2",
              400: "#c031e2",
              500: "#DD62ED",
              600: "#F182F6",
              700: "#FCADF9",
              800: "#FDD5F9",
              900: "#FEECFE",
              DEFAULT: "#DD62ED",
              foreground: "#ffffff",
            },
            focus: "#F182F6",
          },
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
      },
    }),
    require("tailwindcss-animate"),
  ],
};
export default config;
