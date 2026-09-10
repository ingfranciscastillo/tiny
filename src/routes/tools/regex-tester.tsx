import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/regex-tester")({
	head: () => toolHead("regex"),
	component: RegexTester,
});

interface RegexMatch {
	match: string;
	index: number;
	groups: string[];
}

function RegexTester() {
	const [pattern, setPattern] = useState("");
	const [flags, setFlags] = useState("g");
	const [text, setText] = useState("");

	const { matches, error } = useMemo((): {
		matches: RegexMatch[];
		error: string | null;
	} => {
		if (!pattern) return { matches: [], error: null };
		try {
			const re = new RegExp(pattern, flags);
			const found: RegexMatch[] = [];
			if (flags.includes("g")) {
				let m: RegExpExecArray | null;
				// biome-ignore lint/suspicious/noAssignInExpressions: standard RegExp.exec loop
				while ((m = re.exec(text)) !== null) {
					found.push({ match: m[0], index: m.index, groups: m.slice(1) });
					if (m.index === re.lastIndex) re.lastIndex++;
				}
			} else {
				const m = re.exec(text);
				if (m) found.push({ match: m[0], index: m.index, groups: m.slice(1) });
			}
			return { matches: found, error: null };
		} catch (e) {
			return { matches: [], error: e instanceof Error ? e.message : String(e) };
		}
	}, [pattern, flags, text]);

	return (
		<ToolShell
			toolId="regex"
			title="Regex Tester"
			description="Test regular expressions against text"
			runsLocally
		>
			<div className="flex items-stretch gap-2">
				<div className="flex-1">
					<label
						htmlFor="regex-pattern"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						pattern
					</label>
					<div className="flex items-center bg-surface border border-rule focus-within:border-accent transition-tiny">
						<span className="font-mono text-muted text-sm pl-3.5">/</span>
						<input
							id="regex-pattern"
							value={pattern}
							onChange={(e) => setPattern(e.target.value)}
							spellCheck={false}
							className="flex-1 bg-transparent font-mono text-sm px-2 py-3 focus:outline-none"
							placeholder="pattern"
						/>
						<span className="font-mono text-muted text-sm">/</span>
						<input
							value={flags}
							onChange={(e) =>
								setFlags(e.target.value.replace(/[^gimsuy]/g, ""))
							}
							spellCheck={false}
							className="w-14 bg-transparent font-mono text-sm px-2 py-3 focus:outline-none"
							placeholder="g"
						/>
					</div>
				</div>
			</div>

			<div>
				<label
					htmlFor="regex-test-text"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					test text
				</label>
				<textarea
					id="regex-test-text"
					value={text}
					onChange={(e) => setText(e.target.value)}
					spellCheck={false}
					rows={6}
					placeholder="text to test against"
					className="w-full font-mono text-sm leading-relaxed bg-surface border border-rule rounded-none px-3.5 py-3 resize-y focus:outline-none focus:border-accent transition-tiny placeholder:text-muted/50"
				/>
			</div>

			{error && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{error}
				</div>
			)}

			<div>
				<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5">
					{matches.length} match{matches.length === 1 ? "" : "es"}
				</div>
				{matches.length === 0 ? (
					<div className="font-mono text-sm text-muted py-2">no matches</div>
				) : (
					<div className="border border-rule bg-surface divide-y divide-border max-h-60 overflow-auto">
						{matches.map((m) => (
							<div key={m.index} className="px-3.5 py-2 font-mono text-xs">
								<span className="text-muted">[{m.index}]</span>{" "}
								<span className="text-accent">{m.match}</span>
								{m.groups.length > 0 && (
									<span className="text-muted">
										{" "}
										· groups:{" "}
										{m.groups.map((g) => JSON.stringify(g)).join(", ")}
									</span>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</ToolShell>
	);
}
