import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/package-name-checker")({
	head: () => toolHead("package-name-checker"),
	component: PackageNameChecker,
});

interface Rule {
	test: (n: string) => boolean;
	msg: string;
}

const RULES: Rule[] = [
	{ test: (n) => /^[a-z]/.test(n), msg: "must start with lowercase letter" },
	{ test: (n) => !/^[_.-]/.test(n), msg: "cannot start with . _ or -" },
	{ test: (n) => !/[_.-]$/.test(n), msg: "cannot end with . _ or -" },
	{ test: (n) => !/[A-Z]/.test(n), msg: "should not contain uppercase" },
	{ test: (n) => !/\s/.test(n), msg: "cannot contain spaces" },
	{
		test: (n) => !/[~)('!*]/.test(n),
		msg: "cannot contain special chars (~)('!* etc)",
	},
	{ test: (n) => n.length >= 1, msg: "must not be empty" },
	{ test: (n) => n.length <= 214, msg: "must be ≤ 214 chars" },
	{ test: (n) => !/^[._]/.test(n), msg: "cannot start with . or _" },
];

function PackageNameChecker() {
	const [name, setName] = useState("");
	const issues = useMemo(() => {
		if (!name) return [];
		return RULES.filter((r) => !r.test(name)).map((r) => r.msg);
	}, [name]);
	const valid = name && issues.length === 0;

	return (
		<ToolShell
			toolId="package-name-checker"
			title="Package Name Checker"
			description="Validate npm-style package names"
			runsLocally
		>
			<div>
				<label
					htmlFor="pkg-name-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					package name
				</label>
				<input
					id="pkg-name-input"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="my-package"
					spellCheck={false}
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			{name && (
				<div>
					<div
						className={`font-mono text-sm ${valid ? "text-accent" : "text-muted"}`}
					>
						{valid ? "✓ valid package name" : "✗ invalid"}
					</div>
					{issues.length > 0 && (
						<ul className="mt-2 space-y-1">
							{issues.map((msg) => (
								<li
									key={msg}
									className="font-mono text-xs text-muted border-l-2 border-rule pl-3 py-0.5"
								>
									{msg}
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</ToolShell>
	);
}
