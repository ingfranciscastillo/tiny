import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/nanoid-generator")({
	head: () => toolHead("nanoid"),
	component: NanoidGenerator,
});

const ALPHABET =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

function nanoid(size = 21): string {
	const arr = new Uint8Array(size);
	crypto.getRandomValues(arr);
	let id = "";
	for (let i = 0; i < size; i++) id += ALPHABET[arr[i] & 63];
	return id;
}

function NanoidGenerator() {
	const [size, setSize] = useState(21);
	const [count, setCount] = useState(5);
	const [output, setOutput] = useState("");

	const generate = () => {
		setOutput(
			Array.from({ length: Math.min(50, count) }, () => nanoid(size)).join(
				"\n",
			),
		);
	};

	return (
		<ToolShell
			toolId="nanoid"
			title="Nano ID Generator"
			description="Generate Nano IDs"
			runsLocally
		>
			<div className="flex items-end gap-3">
				<div>
					<label
						htmlFor="nanoid-size"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						size
					</label>
					<input
						id="nanoid-size"
						type="number"
						min="1"
						max="64"
						value={size}
						onChange={(e) => setSize(Number(e.target.value))}
						className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="nanoid-count"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						count
					</label>
					<input
						id="nanoid-count"
						type="number"
						min="1"
						max="50"
						value={count}
						onChange={(e) => setCount(Number(e.target.value))}
						className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
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
			<OutputBlock value={output} placeholder="nano id" copyLabel="Copy" />
		</ToolShell>
	);
}
