import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/robots-txt")({
	head: () => toolHead("robots-txt"),
	component: RobotsTxt,
});

function RobotsTxt() {
	const [agent, setAgent] = useState("*");
	const [disallow, setDisallow] = useState("/admin/");
	const [allow, setAllow] = useState("");
	const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");

	const output = useMemo(() => {
		const lines = [`User-agent: ${agent}`];
		if (disallow)
			for (const p of disallow.split("\n"))
				if (p.trim()) lines.push(`Disallow: ${p.trim()}`);
		if (allow)
			for (const p of allow.split("\n"))
				if (p.trim()) lines.push(`Allow: ${p.trim()}`);
		if (sitemap) lines.push("", `Sitemap: ${sitemap}`);
		return lines.join("\n");
	}, [agent, disallow, allow, sitemap]);

	return (
		<ToolShell
			toolId="robots-txt"
			title="Robots.txt Generator"
			description="Generate robots.txt"
			runsLocally
		>
			<div className="space-y-3">
				<div>
					<label
						htmlFor="robots-agent"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						user-agent
					</label>
					<input
						id="robots-agent"
						value={agent}
						onChange={(e) => setAgent(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="robots-disallow"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						disallow (one per line)
					</label>
					<textarea
						id="robots-disallow"
						value={disallow}
						onChange={(e) => setDisallow(e.target.value)}
						rows={3}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="robots-allow"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						allow (one per line)
					</label>
					<textarea
						id="robots-allow"
						value={allow}
						onChange={(e) => setAllow(e.target.value)}
						rows={2}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="robots-sitemap"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						sitemap
					</label>
					<input
						id="robots-sitemap"
						value={sitemap}
						onChange={(e) => setSitemap(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
			<OutputBlock
				value={output}
				placeholder="User-agent: *"
				copyLabel="Copy"
				downloadName="robots.txt"
			/>
		</ToolShell>
	);
}
