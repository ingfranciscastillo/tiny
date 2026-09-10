import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/find-replace")({
	head: () => toolHead("find-replace"),
	component: FindReplace,
});

function FindReplace() {
	const [input, setInput] = useState("");
	const [find, setFind] = useState("");
	const [replace, setReplace] = useState("");
	const [useRegex, setUseRegex] = useState(false);
	const [caseInsensitive, setCaseInsensitive] = useState(false);

	const output = useMemo(() => {
		if (!input || !find) return input;
		try {
			const flags = caseInsensitive ? "gi" : "g";
			const pattern = useRegex
				? find
				: find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			return input.replace(new RegExp(pattern, flags), replace);
		} catch {
			return input;
		}
	}, [input, find, replace, useRegex, caseInsensitive]);

	return (
		<ToolShell
			toolId="find-replace"
			title="Find & Replace"
			description="Replace text with optional regex"
			runsLocally
		>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label
						htmlFor="find-input"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						find
					</label>
					<input
						id="find-input"
						value={find}
						onChange={(e) => setFind(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="replace-input"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						replace
					</label>
					<input
						id="replace-input"
						value={replace}
						onChange={(e) => setReplace(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<label className="flex items-center gap-1.5 font-mono text-xs text-muted cursor-pointer">
					<input
						type="checkbox"
						checked={useRegex}
						onChange={(e) => setUseRegex(e.target.checked)}
						className="accent-accent"
					/>{" "}
					regex
				</label>
				<label className="flex items-center gap-1.5 font-mono text-xs text-muted cursor-pointer">
					<input
						type="checkbox"
						checked={caseInsensitive}
						onChange={(e) => setCaseInsensitive(e.target.checked)}
						className="accent-accent"
					/>{" "}
					case insensitive
				</label>
			</div>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="text to search"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="replaced text"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
