import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/meta-tag-generator")({
	head: () => toolHead("meta-tag-generator"),
	component: MetaTagGenerator,
});

function MetaTagGenerator() {
	const [title, setTitle] = useState("My Page");
	const [desc, setDesc] = useState("Page description");
	const [keywords, setKeywords] = useState("keyword, keyword2");
	const [author, setAuthor] = useState("");
	const [canonical, setCanonical] = useState("https://example.com");
	const [viewport, setViewport] = useState(
		"width=device-width, initial-scale=1.0",
	);

	const tags = useMemo(() => {
		const t = [
			`<title>${title}</title>`,
			`<meta name="description" content="${desc}" />`,
		];
		if (keywords) t.push(`<meta name="keywords" content="${keywords}" />`);
		if (author) t.push(`<meta name="author" content="${author}" />`);
		t.push(`<meta name="viewport" content="${viewport}" />`);
		if (canonical) t.push(`<link rel="canonical" href="${canonical}" />`);
		t.push(`<meta property="og:title" content="${title}" />`);
		t.push(`<meta property="og:description" content="${desc}" />`);
		t.push('<meta charset="utf-8" />');
		return t.join("\n");
	}, [title, desc, keywords, author, canonical, viewport]);

	const fields: [string, string, (v: string) => void][] = [
		["title", title, setTitle],
		["description", desc, setDesc],
		["keywords", keywords, setKeywords],
		["author", author, setAuthor],
		["canonical", canonical, setCanonical],
		["viewport", viewport, setViewport],
	];

	return (
		<ToolShell
			toolId="meta-tag-generator"
			title="Meta Tag Generator"
			description="Generate HTML meta tags"
			runsLocally
		>
			<div className="space-y-3">
				{fields.map(([label, val, set]) => (
					<div key={label}>
						<label
							htmlFor={`meta-${label}`}
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							{label}
						</label>
						<input
							id={`meta-${label}`}
							value={val}
							onChange={(e) => set(e.target.value)}
							spellCheck={false}
							className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				))}
			</div>
			<OutputBlock value={tags} placeholder="meta tags" copyLabel="Copy" />
		</ToolShell>
	);
}
