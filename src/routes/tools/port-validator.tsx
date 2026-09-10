import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/port-validator")({
	head: () => toolHead("port-validator"),
	component: PortValidator,
});

const COMMON: Record<number, string> = {
	80: "HTTP",
	443: "HTTPS",
	22: "SSH",
	21: "FTP",
	25: "SMTP",
	53: "DNS",
	3306: "MySQL",
	5432: "PostgreSQL",
	6379: "Redis",
	8080: "HTTP Alt",
	3000: "Node.js",
	5173: "Vite",
};

interface PortResult {
	valid: boolean;
	n: number;
	range: string;
	common: string | null;
}

function PortValidator() {
	const [input, setInput] = useState("8080");
	const result = useMemo<PortResult | null>(() => {
		const n = Number.parseInt(input, 10);
		if (Number.isNaN(n)) return null;
		const valid = n >= 0 && n <= 65535;
		let range = "dynamic/private";
		if (n >= 0 && n <= 1023) range = "well-known";
		else if (n >= 1024 && n <= 49151) range = "registered";
		return { valid, n, range, common: COMMON[n] || null };
	}, [input]);

	return (
		<ToolShell
			toolId="port-validator"
			title="Port Validator"
			description="Validate port numbers"
			runsLocally
		>
			<div>
				<label
					htmlFor="port-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					port
				</label>
				<input
					id="port-input"
					value={input}
					onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, ""))}
					type="number"
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			{result && (
				<div className="border border-rule bg-surface divide-y divide-border">
					{(
						[
							["valid", result.valid ? "✓ yes" : "✗ no"],
							["range", result.range],
							["common use", result.common || "—"],
						] as const
					).map(([k, v]) => (
						<div
							key={k}
							className="flex items-center justify-between px-3.5 py-2.5"
						>
							<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-24">
								{k}
							</span>
							<span className="font-mono text-sm">{v}</span>
						</div>
					))}
				</div>
			)}
		</ToolShell>
	);
}
