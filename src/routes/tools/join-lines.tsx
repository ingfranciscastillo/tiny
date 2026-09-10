import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/join-lines")({
	head: () => toolHead("join-lines"),
	component: JoinLines,
});

function JoinLines() {
	const [input, setInput] = useState("");
	const [sep, setSep] = useState(", ");
	const output = useMemo(() => {
		if (!input) return "";
		return input
			.split("\n")
			.filter((l) => l.length > 0)
			.join(sep);
	}, [input, sep]);

	return (
		<ToolShell
			toolId="join-lines"
			title="Join Lines"
			description="Combine lines with a chosen separator"
			runsLocally
		>
			<div className="flex items-end gap-3">
				<div>
					<label
						htmlFor="join-sep"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						separator
					</label>
					<input
						id="join-sep"
						value={sep}
						onChange={(e) => setSep(e.target.value)}
						spellCheck={false}
						className="w-40 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="one"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="one, two, three"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
