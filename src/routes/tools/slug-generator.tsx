import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/slug-generator")({
	head: () => toolHead("slug-generator"),
	component: SlugGenerator,
});

// Combining diacritical marks (U+0300 - U+036F), stripped after NFKD normalization
const DIACRITICS = /\p{M}/gu;

function slugify(s: string): string {
	return s
		.normalize("NFKD")
		.replace(DIACRITICS, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

function SlugGenerator() {
	const [input, setInput] = useState("");
	const [count, setCount] = useState(5);
	const [output, setOutput] = useState("");

	const generate = () => {
		const base = slugify(input) || "slug";
		setOutput(
			Array.from(
				{ length: Math.min(50, count) },
				() => `${base}-${Math.random().toString(36).slice(2, 8)}`,
			).join("\n"),
		);
	};

	return (
		<ToolShell
			toolId="slug-generator"
			title="Slug Generator"
			description="Generate URL slugs"
			runsLocally
		>
			<div className="flex items-end gap-3">
				<div className="flex-1">
					<label
						htmlFor="slug-gen-base"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						base text
					</label>
					<input
						id="slug-gen-base"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="slug-gen-count"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						count
					</label>
					<input
						id="slug-gen-count"
						type="number"
						min="1"
						max="50"
						value={count}
						onChange={(e) => setCount(Number(e.target.value))}
						className="w-20 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<button
					type="button"
					onClick={generate}
					className="font-mono text-xs uppercase tracking-wide px-3 py-2 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
				>
					Generate
				</button>
			</div>
			<OutputBlock
				value={output}
				placeholder="my-slug-abc123"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
