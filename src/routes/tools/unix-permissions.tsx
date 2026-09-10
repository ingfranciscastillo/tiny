import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/unix-permissions")({
	head: () => toolHead("unix-permissions"),
	component: UnixPermissions,
});

function UnixPermissions() {
	const [mode, setMode] = useState("755");
	const rwx = useMemo(() => {
		if (!/^[0-7]{3,4}$/.test(mode)) return null;
		const m = mode.padStart(4, "0").slice(-3);
		return m
			.split("")
			.map((d) => {
				const n = Number.parseInt(d, 10);
				return (n & 4 ? "r" : "-") + (n & 2 ? "w" : "-") + (n & 1 ? "x" : "-");
			})
			.join("");
	}, [mode]);

	const [rwxInput, setRwxInput] = useState("rwxr-xr-x");
	const fromRwx = useMemo(() => {
		if (!/^[rwx-]{9}$/.test(rwxInput)) return null;
		let n = "";
		for (let i = 0; i < 9; i += 3) {
			const t = rwxInput.slice(i, i + 3);
			n +=
				(t[0] === "r" ? 4 : 0) +
				(t[1] === "w" ? 2 : 0) +
				(t[2] === "x" ? 1 : 0);
		}
		return n;
	}, [rwxInput]);

	return (
		<ToolShell
			toolId="unix-permissions"
			title="Unix Permissions"
			description="755 ↔ rwxr-xr-x"
			runsLocally
		>
			<div>
				<label
					htmlFor="unix-perm-numeric"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					numeric → rwx
				</label>
				<div className="flex items-center gap-3">
					<input
						id="unix-perm-numeric"
						value={mode}
						onChange={(e) => setMode(e.target.value.replace(/[^0-7]/g, ""))}
						maxLength={4}
						spellCheck={false}
						className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
					<span className="font-mono text-muted">→</span>
					<span className="font-mono text-sm bg-surface border border-rule px-3 py-2 min-w-[120px]">
						{rwx || "—"}
					</span>
					{rwx && <CopyButton value={rwx} label="copy" />}
				</div>
			</div>
			<div>
				<label
					htmlFor="unix-perm-rwx"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					rwx → numeric
				</label>
				<div className="flex items-center gap-3">
					<input
						id="unix-perm-rwx"
						value={rwxInput}
						onChange={(e) =>
							setRwxInput(e.target.value.replace(/[^rwx-]/g, "").slice(0, 9))
						}
						spellCheck={false}
						className="w-32 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
					<span className="font-mono text-muted">→</span>
					<span className="font-mono text-sm bg-surface border border-rule px-3 py-2 min-w-[60px]">
						{fromRwx || "—"}
					</span>
					{fromRwx && <CopyButton value={fromRwx} label="copy" />}
				</div>
			</div>
		</ToolShell>
	);
}
