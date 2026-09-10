import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/factorial-calculator")({
	head: () => toolHead("factorial"),
	component: Factorial,
});

function Factorial() {
	const [input, setInput] = useState("10");
	const result = useMemo(() => {
		const n = Number.parseInt(input, 10);
		if (Number.isNaN(n) || n < 0) return null;
		let f = 1n;
		for (let i = 2n; i <= BigInt(n); i++) f *= i;
		return f.toString();
	}, [input]);

	return (
		<ToolShell
			toolId="factorial"
			title="Factorial"
			description="Calculate factorial"
			runsLocally
		>
			<div>
				<label
					htmlFor="factorial-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					number
				</label>
				<input
					id="factorial-input"
					value={input}
					onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, ""))}
					type="number"
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			{result != null && (
				<div>
					<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5">
						{input}! =
					</div>
					<div className="font-mono text-sm bg-surface border border-rule px-3.5 py-3 break-all">
						{result}
					</div>
				</div>
			)}
		</ToolShell>
	);
}
