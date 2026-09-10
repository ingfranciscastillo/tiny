import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/cron-explain")({
	head: () => toolHead("cron"),
	component: CronExplain,
});

interface CronField {
	name: string;
	min: number;
	max: number;
}

const FIELDS: CronField[] = [
	{ name: "minute", min: 0, max: 59 },
	{ name: "hour", min: 0, max: 23 },
	{ name: "day of month", min: 1, max: 31 },
	{ name: "month", min: 1, max: 12 },
	{ name: "day of week", min: 0, max: 6 },
];

function parseField(expr: string, field: CronField): string {
	if (expr === "*") return `every ${field.name}`;
	const parts = expr.split(",");
	const out: string[] = [];
	for (const p of parts) {
		if (p.includes("/")) {
			const [range, step] = p.split("/");
			if (range === "*") out.push(`every ${step} ${field.name}s`);
			else out.push(`${range} every ${step} ${field.name}s`);
		} else if (p.includes("-")) {
			out.push(`${field.name} ${p.replace("-", " through ")}`);
		} else {
			out.push(`${field.name} ${p}`);
		}
	}
	return out.join(", ");
}

type ExplainResult = { error: string } | { fields: string[]; summary: string };

function explain(expr: string): ExplainResult {
	const parts = expr.trim().split(/\s+/);
	if (parts.length !== 5) return { error: "a cron expression has 5 fields" };
	const desc = parts.map((p, i) => parseField(p, FIELDS[i]));
	// human-friendly summary
	let summary = "";
	if (parts[0] === "0" && parts[1] === "*")
		summary = "at the top of every hour";
	else if (parts[0] === "0" && parts[1] === "0") summary = "at midnight";
	else if (parts[1] !== "*" && parts[0] === "0")
		summary = `at the start of hour ${parts[1]}`;
	else summary = "per the schedule below";
	return { fields: desc, summary };
}

function CronExplain() {
	const [expr, setExpr] = useState("0 9 * * 1-5");
	const result = expr.trim() ? explain(expr) : null;

	return (
		<ToolShell
			toolId="cron"
			title="Cron Explain"
			description="Decode a cron expression into plain language"
			runsLocally
		>
			<div>
				<label
					htmlFor="cron-expression"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					expression
				</label>
				<input
					id="cron-expression"
					value={expr}
					onChange={(e) => setExpr(e.target.value)}
					spellCheck={false}
					placeholder="*/5 * * * *"
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny placeholder:text-muted/50"
				/>
			</div>
			{result && "error" in result && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{result.error}
				</div>
			)}
			{result && "fields" in result && (
				<>
					<div className="font-mono text-sm text-accent">{result.summary}</div>
					<div className="border border-rule bg-surface divide-y divide-border">
						{result.fields.map((f, i) => (
							<div
								key={FIELDS[i].name}
								className="px-3.5 py-2 flex items-baseline gap-3"
							>
								<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-24 shrink-0">
									{FIELDS[i].name}
								</span>
								<span className="font-mono text-sm">{f}</span>
							</div>
						))}
					</div>
				</>
			)}
		</ToolShell>
	);
}
