import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/url-encode")({
	head: () => toolHead("url-encode"),
	component: UrlEncode,
});

type Mode = "encode" | "decode";

function UrlEncode() {
	const [mode, setMode] = useState<Mode>("encode");
	const [input, setInput] = useState("");

	let output = "";
	let error: string | null = null;
	if (input) {
		try {
			output =
				mode === "encode"
					? encodeURIComponent(input)
					: decodeURIComponent(input);
		} catch {
			error = "invalid encoded input";
		}
	}

	return (
		<ToolShell
			toolId="url-encode"
			title="URL Encode"
			description="Encode or decode URL components"
			runsLocally
		>
			<div className="flex items-center gap-1">
				{(["encode", "decode"] as const).map((m) => (
					<button
						key={m}
						type="button"
						onClick={() => setMode(m)}
						className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule transition-tiny ${
							mode === m ? "bg-accent-soft text-accent" : "hover:text-accent"
						}`}
					>
						{m}
					</button>
				))}
			</div>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="text or URL"
				rows={6}
			/>
			{error && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{error}
				</div>
			)}
			<OutputBlock
				value={error ? "" : output}
				placeholder="encoded output"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
