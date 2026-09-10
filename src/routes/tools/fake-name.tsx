import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/fake-name")({
	head: () => toolHead("fake-name"),
	component: FakeName,
});

const FIRST = [
	"John",
	"Jane",
	"Alex",
	"Sam",
	"Chris",
	"Pat",
	"Casey",
	"Morgan",
	"Riley",
	"Taylor",
	"Jordan",
	"Avery",
];
const LAST = [
	"Smith",
	"Jones",
	"Brown",
	"Davis",
	"Wilson",
	"Moore",
	"Taylor",
	"Anderson",
	"Thomas",
	"Lee",
	"Walker",
	"Hall",
];

function FakeName() {
	const [count, setCount] = useState(5);
	const [output, setOutput] = useState("");

	const generate = () => {
		setOutput(
			Array.from({ length: Math.min(50, count) }, () => {
				const f = FIRST[Math.floor(Math.random() * FIRST.length)];
				const l = LAST[Math.floor(Math.random() * LAST.length)];
				return `${f} ${l}`;
			}).join("\n"),
		);
	};

	return (
		<ToolShell
			toolId="fake-name"
			title="Fake Name"
			description="Generate test names"
			runsLocally
		>
			<div className="flex items-end gap-3">
				<div>
					<label
						htmlFor="fake-name-count"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						count
					</label>
					<input
						id="fake-name-count"
						type="number"
						min="1"
						max="50"
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
			</div>
			<OutputBlock value={output} placeholder="John Smith" copyLabel="Copy" />
		</ToolShell>
	);
}
