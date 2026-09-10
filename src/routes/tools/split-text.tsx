import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/split-text")({
	head: () => toolHead("split-text"),
	component: SplitText,
});

type Mode = "delimiter" | "chars";

function SplitText() {
	const [input, setInput] = useState("");
	const [mode, setMode] = useState<Mode>("delimiter");
	const [delimiter, setDelimiter] = useState(",");
	const [chunkSize, setChunkSize] = useState(10);
	const output = useMemo(() => {
		if (!input) return "";
		if (mode === "delimiter") return input.split(delimiter).join("\n");
		const size = Math.max(1, chunkSize);
		const chunks: string[] = [];
		for (let i = 0; i < input.length; i += size)
			chunks.push(input.slice(i, i + size));
		return chunks.join("\n");
	}, [input, mode, delimiter, chunkSize]);

	return (
		<ToolShell
			toolId="split-text"
			title="Split Text"
			description="Split by character count or delimiter"
			runsLocally
		>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => setMode("delimiter")}
					className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule transition-tiny ${
						mode === "delimiter"
							? "bg-accent-soft text-accent"
							: "hover:text-accent"
					}`}
				>
					delimiter
				</button>
				<button
					type="button"
					onClick={() => setMode("chars")}
					className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule transition-tiny ${
						mode === "chars"
							? "bg-accent-soft text-accent"
							: "hover:text-accent"
					}`}
				>
					char count
				</button>
				{mode === "delimiter" ? (
					<input
						value={delimiter}
						onChange={(e) => setDelimiter(e.target.value)}
						spellCheck={false}
						placeholder=","
						className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-1.5 focus:outline-none focus:border-accent transition-tiny"
					/>
				) : (
					<input
						type="number"
						min="1"
						value={chunkSize}
						onChange={(e) => setChunkSize(Number(e.target.value))}
						className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-1.5 focus:outline-none focus:border-accent transition-tiny"
					/>
				)}
			</div>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="text to split"
				rows={6}
			/>
			<OutputBlock value={output} placeholder="split output" copyLabel="Copy" />
		</ToolShell>
	);
}
