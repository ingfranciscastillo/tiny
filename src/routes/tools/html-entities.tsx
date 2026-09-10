import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";

export const Route = createFileRoute("/tools/html-entities")({
	component: HtmlEntities,
});

type Mode = "escape" | "unescape";

function HtmlEntities() {
	const [mode, setMode] = useState<Mode>("escape");
	const [input, setInput] = useState("");

	let output = "";
	if (input) {
		output =
			mode === "escape"
				? input
						.replace(/&/g, "&amp;")
						.replace(/</g, "&lt;")
						.replace(/>/g, "&gt;")
						.replace(/"/g, "&quot;")
						.replace(/'/g, "&#39;")
				: input
						.replace(/&#39;/g, "'")
						.replace(/&quot;/g, '"')
						.replace(/&lt;/g, "<")
						.replace(/&gt;/g, ">")
						.replace(/&amp;/g, "&");
	}

	return (
		<ToolShell
			toolId="html-entities"
			title="HTML Entities"
			description="Escape or unescape HTML"
			runsLocally
		>
			<div className="flex items-center gap-1">
				{(["escape", "unescape"] as const).map((m) => (
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
				placeholder="<html>content</html>"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="escaped output"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
