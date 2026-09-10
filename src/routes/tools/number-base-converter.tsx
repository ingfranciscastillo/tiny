import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/number-base-converter")({
	head: () => toolHead("number-base"),
	component: NumberBaseConverter,
});

const BASES = [
	{ label: "bin", base: 2 },
	{ label: "oct", base: 8 },
	{ label: "dec", base: 10 },
	{ label: "hex", base: 16 },
] as const;

function NumberBaseConverter() {
	const [value, setValue] = useState("255");
	const [fromBase, setFromBase] = useState(10);
	const results = useMemo<Record<number, string> | null>(() => {
		if (!value.trim()) return null;
		const n = Number.parseInt(value, fromBase);
		if (Number.isNaN(n)) return null;
		return {
			2: n.toString(2),
			8: n.toString(8),
			10: n.toString(10),
			16: n.toString(16).toUpperCase(),
		};
	}, [value, fromBase]);

	return (
		<ToolShell
			toolId="number-base"
			title="Number Base Converter"
			description="Binary · Octal · Decimal · Hex"
			runsLocally
		>
			<div className="flex items-end gap-3">
				<div className="flex-1">
					<label
						htmlFor="base-value"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						value
					</label>
					<input
						id="base-value"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="base-from"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						from
					</label>
					<select
						id="base-from"
						value={fromBase}
						onChange={(e) => setFromBase(Number(e.target.value))}
						className="font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					>
						{BASES.map((b) => (
							<option key={b.base} value={b.base}>
								{b.label}
							</option>
						))}
					</select>
				</div>
			</div>
			{results ? (
				<div className="border border-rule bg-surface divide-y divide-border">
					{BASES.map((b) => (
						<div
							key={b.base}
							className="flex items-center justify-between px-3.5 py-2.5"
						>
							<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-10">
								{b.label}
							</span>
							<span className="font-mono text-sm flex-1">
								{results[b.base]}
							</span>
							<CopyButton value={results[b.base]} label="copy" />
						</div>
					))}
				</div>
			) : (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					invalid number
				</div>
			)}
		</ToolShell>
	);
}
