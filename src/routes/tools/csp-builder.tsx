import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/csp-builder")({
	head: () => toolHead("csp-builder"),
	component: CspBuilder,
});

interface Directive {
	key: string;
	label: string;
	default: string;
}

const DIRECTIVES: Directive[] = [
	{ key: "default-src", label: "default-src", default: "'self'" },
	{ key: "script-src", label: "script-src", default: "" },
	{ key: "style-src", label: "style-src", default: "" },
	{ key: "img-src", label: "img-src", default: "" },
	{ key: "font-src", label: "font-src", default: "" },
	{ key: "connect-src", label: "connect-src", default: "" },
	{ key: "media-src", label: "media-src", default: "" },
	{ key: "frame-src", label: "frame-src", default: "" },
	{ key: "object-src", label: "object-src", default: "" },
];

function CspBuilder() {
	const [values, setValues] = useState<Record<string, string>>({
		"default-src": "'self'",
	});
	const output = useMemo(() => {
		return DIRECTIVES.filter((d) => values[d.key])
			.map((d) => `${d.key} ${values[d.key]}`)
			.join("; ");
	}, [values]);

	const set = (key: string, val: string) =>
		setValues((v) => ({ ...v, [key]: val }));

	return (
		<ToolShell
			toolId="csp-builder"
			title="CSP Builder"
			description="Build Content-Security-Policy"
			runsLocally
		>
			<div className="space-y-2">
				{DIRECTIVES.map((d) => (
					<div key={d.key} className="flex items-center gap-3">
						<span className="font-mono text-xs text-muted w-28 shrink-0">
							{d.label}
						</span>
						<input
							value={values[d.key] || ""}
							onChange={(e) => set(d.key, e.target.value)}
							placeholder={d.default || "none"}
							spellCheck={false}
							className="flex-1 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				))}
			</div>
			<OutputBlock
				value={output}
				placeholder="default-src 'self'; ..."
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
