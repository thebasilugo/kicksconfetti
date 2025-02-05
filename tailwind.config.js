module.exports = {
	darkMode: ["class"],
	content: [
		"app/**/*.{ts,tsx}",
		"components/**/*.{ts,tsx}",
		"./**/*.html",
		"./js/**/*.js",
	],
	theme: {
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: {
					DEFAULT: "var(--color-background)",
					offset: "var(--color-background-offset)",
				},
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "var(--color-primary)",
					hover: "var(--color-primary-hover)",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "var(--color-secondary)",
					hover: "var(--color-secondary-hover)",
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
				text: {
					DEFAULT: "var(--color-text)",
					offset: "var(--color-text-offset)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
