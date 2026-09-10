import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/prefix-suffix")({
	head: () => toolHead("prefix-suffix"),
	component: PrefixSuffix,
});

function PrefixSuffix() {
	const [input, setInput] = useState("");
	const [prefix, setPrefix] = useState("");
	const [suffix, setSuffix] = useState("");
	const output = useMemo(() => {
		if (!input) return "";
		return input
			.split("\n")
			.map((l) => `${prefix}${l}${suffix}`)
			.join("\n");
	}, [input, prefix, suffix]);

	return (
		<ToolShell
			toolId="prefix-suffix"
			title="Prefix / Suffix"
			description="Add text before or after every line"
			runsLocally
		>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label
						htmlFor="prefix-input"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						prefix
					</label>
					<input
						id="prefix-input"
						value={prefix}
						onChange={(e) => setPrefix(e.target.value)}
						placeholder="→ "
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="suffix-input"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						suffix
					</label>
					<input
						id="suffix-input"
						value={suffix}
						onChange={(e) => setSuffix(e.target.value)}
						placeholder=" ←"
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="one line per row"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="prefixed / suffixed output"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
