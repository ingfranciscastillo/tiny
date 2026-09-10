import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/color-generator")({
	head: () => toolHead("color-generator"),
	component: ColorGenerator,
});

function randomHex(n: number): string {
	const arr = new Uint8Array(n);
	crypto.getRandomValues(arr);
	return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function ColorGenerator() {
	const [output, setOutput] = useState("");

	const generate = useCallback(() => {
		setOutput(`#${randomHex(3)}`);
	}, []);

	return (
		<ToolShell
			toolId="color-generator"
			title="Color Generator"
			description="Generate random colors"
			runsLocally
		>
			<button
				type="button"
				onClick={generate}
				className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
			>
				Generate
			</button>
			{output && (
				<div>
					<div
						className="h-20 border border-rule"
						style={{ background: output }}
					/>
					<OutputBlock value={output} placeholder="#abc123" copyLabel="Copy" />
				</div>
			)}
		</ToolShell>
	);
}
