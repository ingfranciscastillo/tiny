import { getTool } from "./tools";

export const SITE_NAME = "tiny";
export const SITE_DESCRIPTION =
	"tiny is a collection of small, fast browser-based tools for JSON, text, encoding, and everyday dev tasks. No sign-up, nothing leaves your browser.";

interface HeadMeta {
	meta: ({ title: string } | { name: string; content: string })[];
}

export function toolHead(id: string): HeadMeta {
	const tool = getTool(id);
	const title = tool ? `${tool.name} · ${SITE_NAME}` : SITE_NAME;
	const description = tool?.description ?? SITE_DESCRIPTION;
	return {
		meta: [{ title }, { name: "description", content: description }],
	};
}
