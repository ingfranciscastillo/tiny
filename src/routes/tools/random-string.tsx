import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/random-string")({
	head: () => toolHead("random-string"),
	component: RandomString,
});

const SETS = {
	lower: "abcdefghijklmnopqrstuvwxyz",
	upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	number: "0123456789",
	symbol: "!@#$%^&*()_+-=[]{}|;:,.<>?",
} as const;

type SetKey = keyof typeof SETS;

function RandomString() {
	const [length, setLength] = useState(16);
	const [sets, setSets] = useState<Record<SetKey, boolean>>({
		lower: true,
		upper: true,
		number: true,
		symbol: false,
	});
	const [output, setOutput] = useState("");

	const generate = () => {
		let pool = "";
		for (const k of Object.keys(SETS) as SetKey[]) {
			if (sets[k]) pool += SETS[k];
		}
		if (!pool) {
			setOutput("select at least one set");
			return;
		}
		const arr = new Uint8Array(length);
		crypto.getRandomValues(arr);
		let str = "";
		for (let i = 0; i < length; i++) str += pool[arr[i] % pool.length];
		setOutput(str);
	};

	return (
		<ToolShell
			toolId="random-string"
			title="Random String"
			description="Generate random strings"
			runsLocally
		>
			<div className="flex items-end gap-4">
				<div>
					<label
						htmlFor="random-string-length"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						length
					</label>
					<input
						id="random-string-length"
						type="number"
						min="1"
						max="256"
						value={length}
						onChange={(e) => setLength(Number(e.target.value))}
						className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div className="flex flex-wrap gap-3">
					{(Object.keys(SETS) as SetKey[]).map((k) => (
						<label
							key={k}
							className="flex items-center gap-1.5 font-mono text-xs text-muted cursor-pointer"
						>
							<input
								type="checkbox"
								checked={sets[k]}
								onChange={(e) =>
									setSets((s) => ({ ...s, [k]: e.target.checked }))
								}
								className="accent-accent"
							/>
							{k}
						</label>
					))}
				</div>
			</div>
			<button
				type="button"
				onClick={generate}
				className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
			>
				Generate
			</button>
			<OutputBlock
				value={output}
				placeholder="random string"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
