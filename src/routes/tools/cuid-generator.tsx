import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/cuid-generator")({
	head: () => toolHead("cuid"),
	component: CuidGenerator,
});

const ALPHABET =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function cuid(): string {
	const ts = Date.now().toString(36);
	let rand = "c";
	const arr = new Uint8Array(24);
	crypto.getRandomValues(arr);
	for (let i = 0; i < 24; i++) rand += ALPHABET[arr[i] % ALPHABET.length];
	return rand + ts;
}

function CuidGenerator() {
	const [count, setCount] = useState(5);
	const [output, setOutput] = useState("");

	const generate = () => {
		setOutput(
			Array.from({ length: Math.min(50, count) }, () => cuid()).join("\n"),
		);
	};

	return (
		<ToolShell
			toolId="cuid"
			title="CUID Generator"
			description="Generate CUIDs"
			runsLocally
		>
			<div className="flex items-end gap-3">
				<div>
					<label
						htmlFor="cuid-count"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						count
					</label>
					<input
						id="cuid-count"
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
			<OutputBlock value={output} placeholder="c..." copyLabel="Copy" />
		</ToolShell>
	);
}
