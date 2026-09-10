// Central registry of all Tiny tools.

export type ToolCategory =
	| "popular"
	| "text"
	| "data"
	| "development"
	| "images"
	| "encoding";

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
