import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/semver")({
	head: () => toolHead("semver"),
	component: Semver,
});

interface SemverParts {
	major: number;
	minor: number;
	patch: number;
	pre: string;
	build: string;
}

function parseSemver(v: string): SemverParts | null {
	const m = v.match(
		/^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.]+))?(?:\+([a-zA-Z0-9.]+))?$/,
	);
	if (!m) return null;
	return {
		major: +m[1],
		minor: +m[2],
		patch: +m[3],
		pre: m[4] || "",
		build: m[5] || "",
	};
}

function compare(a: string, b: string): number | null {
	const pa = parseSemver(a);
	const pb = parseSemver(b);
	if (!pa || !pb) return null;
	if (pa.major !== pb.major) return pa.major - pb.major;
	if (pa.minor !== pb.minor) return pa.minor - pb.minor;
	if (pa.patch !== pb.patch) return pa.patch - pb.patch;
	if (pa.pre && !pb.pre) return -1;
	if (!pa.pre && pb.pre) return 1;
	if (pa.pre && pb.pre) return pa.pre.localeCompare(pb.pre);
	return 0;
}

type SemverResult =
	| { valid: true; p1: SemverParts; p2: SemverParts; rel: string }
	| { valid: false; p1: SemverParts | null; p2: SemverParts | null };

function Semver() {
	const [v1, setV1] = useState("1.2.3");
	const [v2, setV2] = useState("1.2.4");
	const result = useMemo<SemverResult>(() => {
		const p1 = parseSemver(v1);
		const p2 = parseSemver(v2);
		if (!p1 || !p2) return { valid: false, p1, p2 };
		const c = compare(v1, v2);
		let rel = "equal to";
		if (c !== null && c < 0) rel = "older than";
		if (c !== null && c > 0) rel = "newer than";
		return { valid: true, p1, p2, rel };
	}, [v1, v2]);

	return (
		<ToolShell
			toolId="semver"
			title="Semver"
			description="Compare and validate versions"
			runsLocally
		>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label
						htmlFor="semver-a"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						version a
					</label>
					<input
						id="semver-a"
						value={v1}
						onChange={(e) => setV1(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
					<div className="font-mono text-xs mt-1">
						{result.p1 ? "✓ valid" : "✗ invalid"}
					</div>
				</div>
				<div>
					<label
						htmlFor="semver-b"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						version b
					</label>
					<input
						id="semver-b"
						value={v2}
						onChange={(e) => setV2(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
					<div className="font-mono text-xs mt-1">
						{result.p2 ? "✓ valid" : "✗ invalid"}
					</div>
				</div>
			</div>
			{result.valid && (
				<div className="border border-rule bg-surface px-3.5 py-3">
					<span className="font-mono text-sm">{v1}</span>
					<span className="font-mono text-sm text-muted mx-2">
						is {result.rel}
					</span>
					<span className="font-mono text-sm">{v2}</span>
				</div>
			)}
		</ToolShell>
	);
}
