import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/image-link-generator")({
	head: () => toolHead("image-link-generator"),
	component: ImageLinkGenerator,
});

function ImageLinkGenerator() {
	const [src, setSrc] = useState("https://example.com/image.png");
	const [alt, setAlt] = useState("Description");
	const [width, setWidth] = useState("");
	const [height, setHeight] = useState("");
	const [loading, setLoading] = useState(true);

	const output = useMemo(() => {
		const attrs = [`src="${src}"`, `alt="${alt}"`];
		if (width) attrs.push(`width="${width}"`);
		if (height) attrs.push(`height="${height}"`);
		if (loading) attrs.push('loading="lazy"');
		return `<img ${attrs.join(" ")} />`;
	}, [src, alt, width, height, loading]);

	return (
		<ToolShell
			toolId="image-link-generator"
			title="Image Link Generator"
			description="Generate <img> tags"
			runsLocally
		>
			<div className="space-y-3">
				<div>
					<label
						htmlFor="img-link-src"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						src
					</label>
					<input
						id="img-link-src"
						value={src}
						onChange={(e) => setSrc(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="img-link-alt"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						alt text
					</label>
					<input
						id="img-link-alt"
						value={alt}
						onChange={(e) => setAlt(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="img-link-width"
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							width
						</label>
						<input
							id="img-link-width"
							value={width}
							onChange={(e) => setWidth(e.target.value)}
							type="number"
							className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
					<div>
						<label
							htmlFor="img-link-height"
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							height
						</label>
						<input
							id="img-link-height"
							value={height}
							onChange={(e) => setHeight(e.target.value)}
							type="number"
							className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				</div>
				<label className="flex items-center gap-1.5 font-mono text-xs text-muted cursor-pointer">
					<input
						type="checkbox"
						checked={loading}
						onChange={(e) => setLoading(e.target.checked)}
						className="accent-accent"
					/>{" "}
					loading="lazy"
				</label>
			</div>
			<OutputBlock
				value={output}
				placeholder='<img src="..." />'
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
