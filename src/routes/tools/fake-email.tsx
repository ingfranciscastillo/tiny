import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/fake-email")({
	head: () => toolHead("fake-email"),
	component: FakeEmail,
});

const DOMAINS = [
	"example.com",
	"test.org",
	"demo.net",
	"sample.io",
	"fake.dev",
];
const USERS = [
	"john",
	"jane",
	"alex",
	"sam",
	"chris",
	"pat",
	"casey",
	"morgan",
];

function FakeEmail() {
	const [count, setCount] = useState(5);
	const [output, setOutput] = useState("");

	const generate = () => {
		const arr = Array.from({ length: Math.min(50, count) }, () => {
			const user = USERS[Math.floor(Math.random() * USERS.length)];
			const num = Math.floor(Math.random() * 999);
			const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
			return `${user}${num}@${domain}`;
		});
		setOutput(arr.join("\n"));
	};

	return (
		<ToolShell
			toolId="fake-email"
			title="Fake Email"
			description="Generate fake test emails"
			runsLocally
		>
			<div className="flex items-end gap-3">
				<div>
					<label
						htmlFor="fake-email-count"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						count
					</label>
					<input
						id="fake-email-count"
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
			<OutputBlock
				value={output}
				placeholder="john123@example.com"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
