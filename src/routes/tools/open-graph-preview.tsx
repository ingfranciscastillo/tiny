import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/open-graph-preview")({
	head: () => toolHead("open-graph-preview"),
	component: OpenGraphPreview,
});

function OpenGraphPreview() {
	const [title, setTitle] = useState("My Page Title");
	const [desc, setDesc] = useState("A description of the page content.");
	const [url, setUrl] = useState("https://example.com");
	const [image, setImage] = useState(
		"https://images.unsplash.com/photo-1635776062127-d379b38ba975?w=1200&h=630&fit=crop",
	);
	const [site, setSite] = useState("@mysite");

	const tags = useMemo(() => {
		return [
			`<meta property="og:title" content="${title}" />`,
			`<meta property="og:description" content="${desc}" />`,
			`<meta property="og:url" content="${url}" />`,
			`<meta property="og:image" content="${image}" />`,
			'<meta property="og:type" content="website" />',
			`<meta property="og:site_name" content="${site}" />`,
			'<meta name="twitter:card" content="summary_large_image" />',
			`<meta name="twitter:title" content="${title}" />`,
			`<meta name="twitter:description" content="${desc}" />`,
			`<meta name="twitter:image" content="${image}" />`,
		].join("\n");
	}, [title, desc, url, image, site]);

	const fields: [string, string, (v: string) => void][] = [
		["title", title, setTitle],
		["description", desc, setDesc],
		["url", url, setUrl],
		["image", image, setImage],
		["site name", site, setSite],
	];

	return (
		<ToolShell
			toolId="open-graph-preview"
			title="Open Graph Preview"
			description="Preview OG metadata"
			runsLocally
		>
			<div className="space-y-3">
				{fields.map(([label, val, set]) => (
					<div key={label}>
						<label
							htmlFor={`og-${label}`}
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							{label}
						</label>
						<input
							id={`og-${label}`}
							value={val}
							onChange={(e) => set(e.target.value)}
							spellCheck={false}
							className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				))}
			</div>
			<div>
				<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5">
					preview
				</div>
				<div className="border border-rule bg-surface overflow-hidden">
					{image && (
						<div className="aspect-[120/63] bg-muted/20 overflow-hidden">
							<img
								src={image}
								alt="og"
								className="w-full h-full object-cover"
							/>
						</div>
					)}
					<div className="p-3">
						<div className="font-mono text-[10px] uppercase tracking-wide text-muted">
							{url}
						</div>
						<div className="text-sm font-semibold mt-1">{title}</div>
						<div className="text-xs text-muted mt-0.5">{desc}</div>
					</div>
				</div>
			</div>
			<OutputBlock value={tags} placeholder="meta tags" copyLabel="Copy" />
		</ToolShell>
	);
}
