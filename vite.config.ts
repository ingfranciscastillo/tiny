import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

// Every tool runs client-side only (no fetch/XHR anywhere in src/routes), so
// connect-src can stay locked to 'self'. img-src allows any https origin
// because the Open Graph Preview tool renders an <img> from a
// user-supplied URL by design. script-src/style-src need 'unsafe-inline'
// because TanStack Router injects an inline scroll-restoration bootstrap
// script and React sets inline `style` attributes for dynamic colors
// throughout the color/image tools; neither is wired for CSP nonces here.
const CSP = [
	"default-src 'self'",
	"script-src 'self' 'unsafe-inline'",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data: blob: https:",
	"font-src 'self'",
	"connect-src 'self'",
	"object-src 'none'",
	"base-uri 'self'",
	"frame-ancestors 'none'",
	"form-action 'self'",
].join("; ");

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		paraglideVitePlugin({
			project: "./project.inlang",
			outdir: "./src/paraglide",
			strategy: ["url", "baseLocale"],
		}),
		nitro({
			rollupConfig: { external: [/^@sentry\//] },
			routeRules: {
				"/**": {
					headers: {
						"X-Content-Type-Options": "nosniff",
						"X-Frame-Options": "DENY",
						"Referrer-Policy": "strict-origin-when-cross-origin",
						"Strict-Transport-Security": "max-age=31536000; includeSubDomains",
						"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
						"Content-Security-Policy": CSP,
					},
				},
			},
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
