import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/regex-generator")({
	head: () => toolHead("regex-generator"),
	component: RegexGenerator,
});

function escapeRe(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function generate(examples: string[]): string {
	if (!examples.length) return "";
	const escaped = examples.map(escapeRe);
	const first = escaped[0];
	let prefix = "";
	let suffix = "";
	for (let i = 0; i < first.length; i++) {
		if (escaped.every((e) => e[i] === first[i])) prefix += first[i];
		else break;
	}
	for (let i = 0; i < first.length; i++) {
		if (
			escaped.every((e) => e[e.length - 1 - i] === first[first.length - 1 - i])
		)
			suffix = first[first.length - 1 - i] + suffix;
		else break;
	}
	const mids = escaped.map((e) =>
		e.slice(prefix.length, e.length - suffix.length),
	);
	const allDigit = mids.every((m) => /^\d+$/.test(m));
	const mid = allDigit ? "\\d+" : ".+";
	return `^${prefix}${mid}${suffix}$`;
}

function RegexGenerator() {
	const [input, setInput] = useState("");
	const examples = useMemo(
		() => input.split("\n").filter((l) => l.trim()),
		[input],
	);
	const output = useMemo(() => generate(examples), [examples]);

	return (
		<ToolShell
			toolId="regex-generator"
			title="Regex Generator"
			description="Build regex from examples"
			runsLocally
		>
			<WorkSurface
				label="examples (one per line)"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder={"user-123\nuser-456\nuser-789"}
				rows={6}
			/>
			<OutputBlock value={output} placeholder="^user-\\d+$" copyLabel="Copy" />
		</ToolShell>
	);
}
