import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/query-string-builder")({
	head: () => toolHead("query-string-builder"),
	component: QueryStringBuilder,
});

interface Pair {
	key: string;
	value: string;
}

function QueryStringBuilder() {
	const [pairs, setPairs] = useState<Pair[]>([{ key: "", value: "" }]);
	const output = useMemo(() => {
		const params = new URLSearchParams();
		for (const { key, value } of pairs) if (key) params.append(key, value);
		const s = params.toString();
		return s ? `?${s}` : "";
	}, [pairs]);

	const update = (i: number, field: keyof Pair, val: string) =>
		setPairs((p) =>
			p.map((pair, idx) => (idx === i ? { ...pair, [field]: val } : pair)),
		);
	const add = () => setPairs((p) => [...p, { key: "", value: "" }]);
	const remove = (i: number) =>
		setPairs((p) => p.filter((_, idx) => idx !== i));

	return (
		<ToolShell
			toolId="query-string-builder"
			title="Query String Builder"
			description="Build query strings"
			runsLocally
		>
			<div className="space-y-2">
				{pairs.map((pair, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: rows are reorderable-by-index, no stable id exists
					<div key={i} className="flex items-center gap-2">
						<input
							value={pair.key}
							onChange={(e) => update(i, "key", e.target.value)}
							placeholder="key"
							spellCheck={false}
							className="flex-1 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
						<span className="font-mono text-muted">=</span>
						<input
							value={pair.value}
							onChange={(e) => update(i, "value", e.target.value)}
							placeholder="value"
							spellCheck={false}
							className="flex-1 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
						<button
							type="button"
							onClick={() => remove(i)}
							className="font-mono text-xs text-muted hover:text-accent transition-tiny px-2"
						>
							×
						</button>
					</div>
				))}
				<button
					type="button"
					onClick={add}
					className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule transition-tiny hover:text-accent hover:border-accent"
				>
					+ add pair
				</button>
			</div>
			<OutputBlock value={output} placeholder="?key=value" copyLabel="Copy" />
		</ToolShell>
	);
}
