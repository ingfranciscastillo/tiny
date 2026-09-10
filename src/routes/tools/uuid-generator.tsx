import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";

export const Route = createFileRoute("/tools/uuid-generator")({
	component: UuidGenerator,
});

function uuidv4(): string {
	if (crypto.randomUUID) return crypto.randomUUID();
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

function UuidGenerator() {
	const [count, setCount] = useState(5);
	const [ids, setIds] = useState(() => Array.from({ length: 5 }, uuidv4));

	const generate = () => {
		const n = Math.max(1, Math.min(100, count || 1));
		setIds(Array.from({ length: n }, uuidv4));
	};

	const all = ids.join("\n");

	return (
		<ToolShell
			toolId="uuid"
			title="UUID Generator"
			description="Generate version 4 UUIDs"
			runsLocally
		>
			<div className="flex items-end gap-3">
				<div>
					<label
						htmlFor="uuid-count"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						count
					</label>
					<input
						id="uuid-count"
						type="number"
						min="1"
						max="100"
						value={count}
						onChange={(e) => setCount(Number(e.target.value))}
						className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<button
					type="button"
					onClick={generate}
					className="font-mono text-xs uppercase tracking-wide px-3 py-2 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
				>
					Generate
				</button>
				<CopyButton value={all} label="Copy all" />
			</div>

			<div className="border border-rule bg-surface divide-y divide-border">
				{ids.map((id) => (
					<div
						key={id}
						className="flex items-center justify-between px-3.5 py-2.5 group"
					>
						<span className="font-mono text-sm">{id}</span>
						<CopyButton
							value={id}
							label="copy"
							className="opacity-0 group-hover:opacity-100"
						/>
					</div>
				))}
			</div>
		</ToolShell>
	);
}
