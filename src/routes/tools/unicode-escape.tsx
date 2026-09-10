import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/unicode-escape")({
	head: () => toolHead("unicode-escape"),
	component: UnicodeEscape,
});

type Mode = "escape" | "unescape";

function UnicodeEscape() {
	const [mode, setMode] = useState<Mode>("escape");
	const [input, setInput] = useState("");
	const output = useMemo(() => {
		if (!input) return "";
		if (mode === "escape") {
			return [...input]
				.map((c) => {
					const cp = c.codePointAt(0) ?? 0;
					return cp > 127 ? `\\u{${cp.toString(16)}}` : c;
				})
				.join("");
		}
		return input
			.replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, h) =>
				String.fromCodePoint(Number.parseInt(h, 16)),
			)
			.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) =>
				String.fromCharCode(Number.parseInt(h, 16)),
			);
	}, [input, mode]);

	return (
		<ToolShell
			toolId="unicode-escape"
			title="Unicode Escape"
			description="Text ↔ \\uXXXX"
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
				placeholder={mode === "escape" ? "café" : "\\u{e9}"}
				rows={5}
			/>
			<OutputBlock
				value={output}
				placeholder="escaped output"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
