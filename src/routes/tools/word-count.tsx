import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/word-count")({
	head: () => toolHead("word-count"),
	component: WordCount,
});

function WordCount() {
	const [text, setText] = useState("");
	const stats = useMemo(() => {
		const chars = text.length;
		const charsNoSpaces = text.replace(/\s/g, "").length;
		const words = text.trim() ? text.trim().split(/\s+/).length : 0;
		const lines = text ? text.split("\n").length : 0;
		const sentences = text.trim()
			? (text.match(/[.!?]+/g) || []).length || (words > 0 ? 1 : 0)
			: 0;
		return { chars, charsNoSpaces, words, lines, sentences };
	}, [text]);

	return (
		<ToolShell
			toolId="word-count"
			title="Word & Character Count"
			description="Count words, characters, and lines"
			runsLocally
		>
			<textarea
				value={text}
				onChange={(e) => setText(e.target.value)}
				spellCheck={false}
				rows={8}
				placeholder="paste or type text"
				className="w-full font-mono text-sm leading-relaxed bg-surface border border-rule rounded-none px-3.5 py-3 resize-y focus:outline-none focus:border-accent transition-tiny placeholder:text-muted/50"
			/>
			<div className="grid grid-cols-2 sm:grid-cols-5 border border-rule divide-x divide-y sm:divide-y-0 divide-border">
				<Stat label="words" value={stats.words} />
				<Stat label="chars" value={stats.chars} />
				<Stat label="no spaces" value={stats.charsNoSpaces} />
				<Stat label="lines" value={stats.lines} />
				<Stat label="sentences" value={stats.sentences} />
			</div>
		</ToolShell>
	);
}

interface StatProps {
	label: string;
	value: number;
}

function Stat({ label, value }: StatProps) {
	return (
		<div className="px-4 py-3">
			<div className="font-mono text-2xl font-medium tabular-nums">{value}</div>
			<div className="font-mono text-[10px] uppercase tracking-wide text-muted">
				{label}
			</div>
		</div>
	);
}
