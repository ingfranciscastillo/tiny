import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/sitemap-generator")({
	head: () => toolHead("sitemap-generator"),
	component: SitemapGenerator,
});

const CHANGEFREQS = [
	"always",
	"hourly",
	"daily",
	"weekly",
	"monthly",
	"yearly",
	"never",
] as const;

function SitemapGenerator() {
	const [urls, setUrls] = useState(
		"https://example.com/\nhttps://example.com/about",
	);
	const [changefreq, setChangefreq] =
		useState<(typeof CHANGEFREQS)[number]>("weekly");
	const [priority, setPriority] = useState("0.8");

	const output = useMemo(() => {
		const list = urls.split("\n").filter((u) => u.trim());
		const items = list
			.map(
				(u) =>
					`  <url>\n    <loc>${u.trim()}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
			)
			.join("\n");
		return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
	}, [urls, changefreq, priority]);

	return (
		<ToolShell
			toolId="sitemap-generator"
			title="Sitemap Generator"
			description="Generate sitemap XML"
			runsLocally
		>
			<div className="space-y-3">
				<div>
					<label
						htmlFor="sitemap-urls"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						urls (one per line)
					</label>
					<textarea
						id="sitemap-urls"
						value={urls}
						onChange={(e) => setUrls(e.target.value)}
						rows={5}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="sitemap-changefreq"
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							changefreq
						</label>
						<select
							id="sitemap-changefreq"
							value={changefreq}
							onChange={(e) =>
								setChangefreq(e.target.value as (typeof CHANGEFREQS)[number])
							}
							className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						>
							{CHANGEFREQS.map((f) => (
								<option key={f}>{f}</option>
							))}
						</select>
					</div>
					<div>
						<label
							htmlFor="sitemap-priority"
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							priority
						</label>
						<input
							id="sitemap-priority"
							value={priority}
							onChange={(e) => setPriority(e.target.value)}
							type="number"
							step="0.1"
							min="0"
							max="1"
							className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				</div>
			</div>
			<OutputBlock
				value={output}
				placeholder="sitemap xml"
				copyLabel="Copy"
				downloadName="sitemap.xml"
			/>
		</ToolShell>
	);
}
