import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/random-color")({
	head: () => toolHead("random-color"),
	component: RandomColor,
});

function RandomColor() {
	const [colors, setColors] = useState<string[]>([]);

	const generate = useCallback(() => {
		const arr = Array.from(
			{ length: 8 },
			() =>
				`#${Array.from({ length: 6 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
		);
		setColors(arr);
	}, []);

	return (
		<ToolShell
			toolId="random-color"
			title="Random Color"
			description="Generate random colors"
			runsLocally
		>
			<button
				type="button"
				onClick={generate}
				className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
			>
				Generate
			</button>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
				{colors.map((c, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: random hex values can repeat, index is the stable slot identity
					<div key={i}>
						<div
							className="h-16 border border-rule"
							style={{ background: c }}
						/>
						<div className="flex items-center justify-between mt-1">
							<span className="font-mono text-xs">{c}</span>
							<CopyButton value={c} label="copy" />
						</div>
					</div>
				))}
			</div>
			{colors.length === 0 && (
				<div className="font-mono text-sm text-muted">
					click generate to create colors
				</div>
			)}
		</ToolShell>
	);
}
