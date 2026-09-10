import { getTool } from "./tools";

export const SITE_NAME = "tiny";
export const SITE_URL = "https://tiny-tools-app.vercel.app";
export const SITE_DESCRIPTION =
	"tiny is a collection of small, fast browser-based tools for JSON, text, encoding, and everyday dev tasks. No sign-up, nothing leaves your browser.";

export function absoluteUrl(path: string): string {
	return `${SITE_URL}${path}`;
}

interface HeadMeta {
	meta: (
		| { title: string }
		| { name: string; content: string }
		| { property: string; content: string }
	)[];
	links: { rel: string; href: string }[];
}

function buildHead(title: string, description: string, url: string): HeadMeta {
	return {
		meta: [
			{ title },
			{ name: "description", content: description },
			{ property: "og:title", content: title },
			{ property: "og:description", content: description },
			{ property: "og:url", content: url },
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:title", content: title },
			{ name: "twitter:description", content: description },
		],
		links: [{ rel: "canonical", href: url }],
	};
}

export function toolHead(id: string): HeadMeta {
	const tool = getTool(id);
	const title = tool ? `${tool.name} · ${SITE_NAME}` : SITE_NAME;
	const description = tool?.description ?? SITE_DESCRIPTION;
	const url = absoluteUrl(tool?.path ?? "/");
	return buildHead(title, description, url);
}

export function homeHead(): HeadMeta {
	return buildHead(
		`${SITE_NAME} — small tools, zero ceremony`,
		SITE_DESCRIPTION,
		absoluteUrl("/"),
	);
}
