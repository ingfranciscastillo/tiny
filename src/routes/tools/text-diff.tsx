import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";

export const Route = createFileRoute("/tools/text-diff")({
	component: TextDiff,
});

interface DiffLine {
	type: "eq" | "add" | "del";
	text: string;
}

// Simple line-based diff.
function diffLines(a: string, b: string): DiffLine[] {
	const la = a.split("\n");
	const lb = b.split("\n");
	const n = la.length;
	const m = lb.length;
	// LCS DP
	const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
	for (let i = n - 1; i >= 0; i--) {
		for (let j = m - 1; j >= 0; j--) {
			dp[i][j] =
				la[i] === lb[j]
					? dp[i + 1][j + 1] + 1
					: Math.max(dp[i + 1][j], dp[i][j + 1]);
		}
	}
	const out: DiffLine[] = [];
	let i = 0;
	let j = 0;
	while (i < n && j < m) {
		if (la[i] === lb[j]) {
			out.push({ type: "eq", text: la[i] });
			i++;
			j++;
		} else if (dp[i + 1][j] >= dp[i][j + 1]) {
			out.push({ type: "del", text: la[i] });
			i++;
		} else {
			out.push({ type: "add", text: lb[j] });
			j++;
		}
	}
	while (i < n) out.push({ type: "del", text: la[i++] });
	while (j < m) out.push({ type: "add", text: lb[j++] });
	return out;
}

function TextDiff() {
	const [a, setA] = useState("");
	const [b, setB] = useState("");
	const lines = useMemo(() => (a || b ? diffLines(a, b) : []), [a, b]);
	const changes = lines.filter((l) => l.type !== "eq").length;

	return (
		<ToolShell
			toolId="diff"
			title="Text Diff"
			description="Compare two texts line by line"
			runsLocally
		>
			<div className="grid sm:grid-cols-2 gap-4">
				<div>
					<label
						htmlFor="diff-original"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						original
					</label>
					<textarea
						id="diff-original"
						value={a}
						onChange={(e) => setA(e.target.value)}
						spellCheck={false}
						rows={8}
						placeholder="paste original"
						className="w-full font-mono text-sm leading-relaxed bg-surface border border-rule rounded-none px-3.5 py-3 resize-y focus:outline-none focus:border-accent transition-tiny placeholder:text-muted/50"
					/>
				</div>
				<div>
					<label
						htmlFor="diff-changed"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						changed
					</label>
					<textarea
						id="diff-changed"
						value={b}
						onChange={(e) => setB(e.target.value)}
						spellCheck={false}
						rows={8}
						placeholder="paste changed"
						className="w-full font-mono text-sm leading-relaxed bg-surface border border-rule rounded-none px-3.5 py-3 resize-y focus:outline-none focus:border-accent transition-tiny placeholder:text-muted/50"
					/>
				</div>
			</div>

			<div>
				<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5">
					diff · {changes} change{changes === 1 ? "" : "s"}
				</div>
				{lines.length === 0 ? (
					<div className="font-mono text-sm text-muted py-2">
						nothing to compare
					</div>
				) : (
					<div className="border border-rule bg-surface font-mono text-sm divide-y divide-border">
						{lines.map((l, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: diff lines have no stable identity across edits
								key={i}
								className={`px-3.5 py-1 whitespace-pre-wrap break-all ${
									l.type === "add"
										? "text-accent"
										: l.type === "del"
											? "text-muted line-through opacity-70"
											: ""
								}`}
							>
								<span className="text-muted/60 mr-2 select-none">
									{l.type === "add" ? "+" : l.type === "del" ? "−" : " "}
								</span>
								{l.text || " "}
							</div>
						))}
					</div>
				)}
			</div>
		</ToolShell>
	);
}
