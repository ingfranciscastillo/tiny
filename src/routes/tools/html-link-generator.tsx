import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/html-link-generator")({
	head: () => toolHead("html-link-generator"),
	component: HtmlLinkGenerator,
});

type Target = "" | "_blank" | "_self" | "_parent";

function HtmlLinkGenerator() {
	const [url, setUrl] = useState("https://example.com");
	const [text, setText] = useState("Example");
	const [target, setTarget] = useState<Target>("_blank");
	const [rel, setRel] = useState(true);

	const output = useMemo(() => {
		const attrs = [`href="${url}"`];
		if (target) attrs.push(`target="${target}"`);
		if (target === "_blank" && rel) attrs.push('rel="noopener noreferrer"');
		return `<a ${attrs.join(" ")}>${text}</a>`;
	}, [url, text, target, rel]);

	return (
		<ToolShell
			toolId="html-link-generator"
			title="HTML Link Generator"
			description="Generate <a> tags"
			runsLocally
		>
			<div className="space-y-3">
				<div>
					<label
						htmlFor="link-url"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						url
					</label>
					<input
						id="link-url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="link-text"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						link text
					</label>
					<input
						id="link-text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div className="flex items-end gap-3">
					<div>
						<label
							htmlFor="link-target"
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							target
						</label>
						<select
							id="link-target"
							value={target}
							onChange={(e) => setTarget(e.target.value as Target)}
							className="font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						>
							<option value="">none</option>
							<option value="_blank">_blank</option>
							<option value="_self">_self</option>
							<option value="_parent">_parent</option>
						</select>
					</div>
					{target === "_blank" && (
						<label className="flex items-center gap-1.5 font-mono text-xs text-muted cursor-pointer pb-2">
							<input
								type="checkbox"
								checked={rel}
								onChange={(e) => setRel(e.target.checked)}
								className="accent-accent"
							/>{" "}
							rel="noopener noreferrer"
						</label>
					)}
				</div>
			</div>
			<OutputBlock
				value={output}
				placeholder='<a href="...">...</a>'
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
