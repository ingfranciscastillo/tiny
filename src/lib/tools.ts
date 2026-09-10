// Central registry of all Tiny tools.

export type ToolCategory =
	| "popular"
	| "text"
	| "data"
	| "development"
	| "images"
	| "encoding"
	| "design";

export interface Category {
	id: ToolCategory;
	label: string;
}

export interface Tool {
	id: string;
	name: string;
	description: string;
	category: ToolCategory;
	path: string;
	runsLocally: boolean;
}

export const CATEGORIES: Category[] = [
	{ id: "popular", label: "POPULAR" },
	{ id: "text", label: "TEXT" },
	{ id: "data", label: "DATA" },
	{ id: "development", label: "DEVELOPMENT" },
	{ id: "images", label: "IMAGES" },
	{ id: "encoding", label: "ENCODING" },
	{ id: "design", label: "DESIGN" },
];

export const TOOLS: Tool[] = [
	// POPULAR
	{
		id: "json-to-csv",
		name: "JSON → CSV",
		description: "Convert structured data",
		category: "popular",
		path: "/tools/json-to-csv",
		runsLocally: true,
	},
	{
		id: "uuid",
		name: "UUID Generator",
		description: "Generate unique IDs",
		category: "popular",
		path: "/tools/uuid-generator",
		runsLocally: true,
	},
	{
		id: "timestamp",
		name: "Timestamp Converter",
		description: "Convert Unix timestamps",
		category: "popular",
		path: "/tools/timestamp-converter",
		runsLocally: true,
	},
	{
		id: "regex",
		name: "Regex Tester",
		description: "Test regular expressions",
		category: "popular",
		path: "/tools/regex-tester",
		runsLocally: true,
	},
	{
		id: "jwt",
		name: "JWT Decoder",
		description: "Inspect JWT payloads",
		category: "popular",
		path: "/tools/jwt-decoder",
		runsLocally: true,
	},
	{
		id: "diff",
		name: "Text Diff",
		description: "Compare two texts",
		category: "popular",
		path: "/tools/text-diff",
		runsLocally: true,
	},
	{
		id: "base64",
		name: "Base64",
		description: "Encode / decode",
		category: "popular",
		path: "/tools/base64-converter",
		runsLocally: true,
	},
	{
		id: "qr",
		name: "QR Generator",
		description: "Create a QR code",
		category: "popular",
		path: "/tools/qr-generator",
		runsLocally: true,
	},
	{
		id: "color",
		name: "Color Converter",
		description: "HEX · RGB · HSL",
		category: "popular",
		path: "/tools/color-converter",
		runsLocally: true,
	},
	{
		id: "image-cropper",
		name: "Image Cropper",
		description: "Crop an image",
		category: "popular",
		path: "/tools/image-cropper",
		runsLocally: true,
	},

	// TEXT
	{
		id: "case",
		name: "Case Converter",
		description: "camelCase · snake · kebab",
		category: "text",
		path: "/tools/case-converter",
		runsLocally: true,
	},
	{
		id: "word-count",
		name: "Word & Char Count",
		description: "Count words and characters",
		category: "text",
		path: "/tools/word-count",
		runsLocally: true,
	},
	{
		id: "sort-lines",
		name: "Sort Lines",
		description: "Order and dedupe lines",
		category: "text",
		path: "/tools/sort-lines",
		runsLocally: true,
	},
	{
		id: "lorem",
		name: "Lorem Ipsum",
		description: "Generate placeholder text",
		category: "text",
		path: "/tools/lorem-ipsum",
		runsLocally: true,
	},
	{
		id: "extract-lines",
		name: "Extract Lines",
		description: "Keep lines matching a pattern",
		category: "text",
		path: "/tools/extract-lines",
		runsLocally: true,
	},
	{
		id: "find-replace",
		name: "Find & Replace",
		description: "Replace text with optional regex",
		category: "text",
		path: "/tools/find-replace",
		runsLocally: true,
	},
	{
		id: "join-lines",
		name: "Join Lines",
		description: "Combine lines with a chosen separator",
		category: "text",
		path: "/tools/join-lines",
		runsLocally: true,
	},

	// DATA
	{
		id: "json-format",
		name: "JSON Formatter",
		description: "Beautify or minify JSON",
		category: "data",
		path: "/tools/json-format",
		runsLocally: true,
	},
	{
		id: "json-escape",
		name: "JSON Escape",
		description: "Escape strings for JSON",
		category: "data",
		path: "/tools/json-escape",
		runsLocally: true,
	},
	{
		id: "csv-to-json",
		name: "CSV → JSON",
		description: "Convert CSV to JSON",
		category: "data",
		path: "/tools/csv-to-json",
		runsLocally: true,
	},
	{
		id: "average-median",
		name: "Average / Median",
		description: "Basic statistics",
		category: "data",
		path: "/tools/average-median",
		runsLocally: true,
	},
	{
		id: "csv-formatter",
		name: "CSV Formatter",
		description: "Format messy CSV",
		category: "data",
		path: "/tools/csv-formatter",
		runsLocally: true,
	},
	{
		id: "csv-to-markdown",
		name: "CSV → Markdown",
		description: "Convert CSV to Markdown table",
		category: "data",
		path: "/tools/csv-to-markdown",
		runsLocally: true,
	},
	{
		id: "factorial",
		name: "Factorial",
		description: "Calculate factorial",
		category: "data",
		path: "/tools/factorial-calculator",
		runsLocally: true,
	},

	// DEVELOPMENT
	{
		id: "hash",
		name: "Hash Generator",
		description: "SHA-1 · SHA-256 · SHA-512",
		category: "development",
		path: "/tools/hash-generator",
		runsLocally: true,
	},
	{
		id: "html-entities",
		name: "HTML Entities",
		description: "Escape / unescape HTML",
		category: "development",
		path: "/tools/html-entities",
		runsLocally: true,
	},
	{
		id: "html-formatter",
		name: "HTML Formatter",
		description: "Format HTML",
		category: "development",
		path: "/tools/html-formatter",
		runsLocally: true,
	},
	{
		id: "html-minifier",
		name: "HTML Minifier",
		description: "Minify HTML",
		category: "development",
		path: "/tools/html-minifier",
		runsLocally: true,
	},
	{
		id: "html-link-generator",
		name: "HTML Link Generator",
		description: "Generate <a> tags",
		category: "development",
		path: "/tools/html-link-generator",
		runsLocally: true,
	},
	{
		id: "url-encode",
		name: "URL Encode",
		description: "Encode / decode URLs",
		category: "development",
		path: "/tools/url-encode",
		runsLocally: true,
	},
	{
		id: "cron",
		name: "Cron Explain",
		description: "Decode cron expressions",
		category: "development",
		path: "/tools/cron-explain",
		runsLocally: true,
	},
	{
		id: "cron-builder",
		name: "Cron Builder",
		description: "Build cron expressions",
		category: "development",
		path: "/tools/cron-builder",
		runsLocally: true,
	},
	{
		id: "csp-builder",
		name: "CSP Builder",
		description: "Build Content-Security-Policy",
		category: "development",
		path: "/tools/csp-builder",
		runsLocally: true,
	},
	{
		id: "css-formatter",
		name: "CSS Formatter",
		description: "Format CSS",
		category: "development",
		path: "/tools/css-formatter",
		runsLocally: true,
	},
	{
		id: "css-minifier",
		name: "CSS Minifier",
		description: "Minify CSS",
		category: "development",
		path: "/tools/css-minifier",
		runsLocally: true,
	},
	{
		id: "cuid",
		name: "CUID Generator",
		description: "Generate CUIDs",
		category: "development",
		path: "/tools/cuid-generator",
		runsLocally: true,
	},
	{
		id: "data-uri-generator",
		name: "Data URI Generator",
		description: "File → Data URI",
		category: "development",
		path: "/tools/data-uri-generator",
		runsLocally: true,
	},
	{
		id: "date-converter",
		name: "Date Converter",
		description: "Convert between date formats",
		category: "development",
		path: "/tools/date-converter",
		runsLocally: true,
	},
	{
		id: "date-generator",
		name: "Date Generator",
		description: "Generate random dates",
		category: "development",
		path: "/tools/date-generator",
		runsLocally: true,
	},
	{
		id: "date-to-timestamp",
		name: "Date → Timestamp",
		description: "Date to Unix timestamp",
		category: "development",
		path: "/tools/date-to-timestamp",
		runsLocally: true,
	},
	{
		id: "dns-record-builder",
		name: "DNS Record Builder",
		description: "Build DNS record syntax",
		category: "development",
		path: "/tools/dns-record-builder",
		runsLocally: true,
	},
	{
		id: "chmod-calculator",
		name: "Chmod Calculator",
		description: "Calculate chmod values",
		category: "development",
		path: "/tools/chmod-calculator",
		runsLocally: true,
	},
	{
		id: "cidr-calculator",
		name: "CIDR Calculator",
		description: "Calculate network ranges",
		category: "development",
		path: "/tools/cidr-calculator",
		runsLocally: true,
	},
	{
		id: "duration-calculator",
		name: "Duration Calculator",
		description: "Calculate time between two dates",
		category: "development",
		path: "/tools/duration-calculator",
		runsLocally: true,
	},
	{
		id: "epoch-converter",
		name: "Epoch Converter",
		description: "Unix epoch utilities",
		category: "development",
		path: "/tools/epoch-converter",
		runsLocally: true,
	},
	{
		id: "fake-email",
		name: "Fake Email",
		description: "Generate fake test emails",
		category: "development",
		path: "/tools/fake-email",
		runsLocally: true,
	},
	{
		id: "fake-name",
		name: "Fake Name",
		description: "Generate test names",
		category: "development",
		path: "/tools/fake-name",
		runsLocally: true,
	},
	{
		id: "hmac-generator",
		name: "HMAC Generator",
		description: "Generate HMAC signatures",
		category: "development",
		path: "/tools/hmac-generator",
		runsLocally: true,
	},
	{
		id: "http-headers",
		name: "HTTP Headers",
		description: "Format and inspect headers",
		category: "development",
		path: "/tools/http-headers",
		runsLocally: true,
	},
	{
		id: "http-status",
		name: "HTTP Status",
		description: "Explain HTTP status codes",
		category: "development",
		path: "/tools/http-status",
		runsLocally: true,
	},
	{
		id: "js-formatter",
		name: "JS Formatter",
		description: "Format JavaScript",
		category: "development",
		path: "/tools/js-formatter",
		runsLocally: true,
	},
	{
		id: "js-minifier",
		name: "JS Minifier",
		description: "Minify JavaScript",
		category: "development",
		path: "/tools/js-minifier",
		runsLocally: true,
	},
	{
		id: "image-link-generator",
		name: "Image Link Generator",
		description: "Generate <img> tags",
		category: "development",
		path: "/tools/image-link-generator",
		runsLocally: true,
	},
	{
		id: "ip-info",
		name: "IP Address Info",
		description: "Parse and validate IP addresses",
		category: "development",
		path: "/tools/ip-info",
		runsLocally: true,
	},
	{
		id: "ip-range",
		name: "IP Range Calculator",
		description: "Calculate IP ranges",
		category: "development",
		path: "/tools/ip-range",
		runsLocally: true,
	},
	{
		id: "ipv4-ipv6",
		name: "IPv4 ↔ IPv6",
		description: "Convert IP representations",
		category: "development",
		path: "/tools/ipv4-ipv6",
		runsLocally: true,
	},
	{
		id: "iso-8601",
		name: "ISO 8601",
		description: "Parse and generate ISO dates",
		category: "development",
		path: "/tools/iso-8601",
		runsLocally: true,
	},

	// IMAGES
	{
		id: "image-compress",
		name: "Image Compress",
		description: "Reduce image size",
		category: "images",
		path: "/tools/image-compress",
		runsLocally: true,
	},
	{
		id: "image-to-base64",
		name: "Image → Base64",
		description: "Encode images as data URI",
		category: "images",
		path: "/tools/image-to-base64",
		runsLocally: true,
	},
	{
		id: "base64-to-image",
		name: "Base64 → Image",
		description: "Decode Base64 into an image",
		category: "images",
		path: "/tools/base64-to-image",
		runsLocally: true,
	},
	{
		id: "favicon-generator",
		name: "Favicon Generator",
		description: "Generate favicon from image/text",
		category: "images",
		path: "/tools/favicon-generator",
		runsLocally: true,
	},
	{
		id: "image-format-converter",
		name: "Image Format Converter",
		description: "PNG · JPG · WebP",
		category: "images",
		path: "/tools/image-format-converter",
		runsLocally: true,
	},
	{
		id: "image-metadata",
		name: "Image Metadata",
		description: "Inspect image dimensions/type",
		category: "images",
		path: "/tools/image-metadata",
		runsLocally: true,
	},
	{
		id: "image-resize",
		name: "Image Resize",
		description: "Resize an image",
		category: "images",
		path: "/tools/image-resize",
		runsLocally: true,
	},

	// ENCODING
	{
		id: "hex",
		name: "Hex Converter",
		description: "Text ↔ hex",
		category: "encoding",
		path: "/tools/hex-converter",
		runsLocally: true,
	},
	{
		id: "binary",
		name: "Binary Converter",
		description: "Text ↔ binary",
		category: "encoding",
		path: "/tools/binary-converter",
		runsLocally: true,
	},
	{
		id: "rot13",
		name: "ROT13",
		description: "Rotate letters by 13",
		category: "encoding",
		path: "/tools/rot13-cipher",
		runsLocally: true,
	},
	{
		id: "base32",
		name: "Base32",
		description: "Encode / decode Base32",
		category: "encoding",
		path: "/tools/base32-converter",
		runsLocally: true,
	},
	{
		id: "ascii-converter",
		name: "ASCII Converter",
		description: "Text ↔ ASCII codes",
		category: "encoding",
		path: "/tools/ascii-converter",
		runsLocally: true,
	},
	{
		id: "base58",
		name: "Base58",
		description: "Encode / decode Base58",
		category: "encoding",
		path: "/tools/base58-converter",
		runsLocally: true,
	},
	{
		id: "base64url",
		name: "Base64 URL",
		description: "URL-safe Base64",
		category: "encoding",
		path: "/tools/base64-url",
		runsLocally: true,
	},

	// DESIGN
	{
		id: "color-contrast",
		name: "Color Contrast",
		description: "WCAG contrast checker",
		category: "design",
		path: "/tools/color-contrast",
		runsLocally: true,
	},
	{
		id: "color-mixer",
		name: "Color Mixer",
		description: "Mix two colors",
		category: "design",
		path: "/tools/color-mixer",
		runsLocally: true,
	},
	{
		id: "color-generator",
		name: "Color Generator",
		description: "Generate random colors",
		category: "design",
		path: "/tools/color-generator",
		runsLocally: true,
	},
	{
		id: "color-extractor",
		name: "Color Extractor",
		description: "Extract colors from an image",
		category: "design",
		path: "/tools/color-extractor",
		runsLocally: true,
	},
];

export const POPULAR_IDS: string[] = TOOLS.filter(
	(t) => t.category === "popular",
).map((t) => t.id);

export function getTool(id: string): Tool | undefined {
	return TOOLS.find((t) => t.id === id);
}

export function toolsByCategory(catId: ToolCategory): Tool[] {
	return TOOLS.filter((t) => t.category === catId);
}

export function searchTools(query: string): Tool[] {
	const q = query.trim().toLowerCase();
	if (!q) return TOOLS;
	return TOOLS.filter(
		(t) =>
			t.name.toLowerCase().includes(q) ||
			t.description.toLowerCase().includes(q) ||
			t.id.includes(q),
	);
}
