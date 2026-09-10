import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/chmod-calculator")({
	head: () => toolHead("chmod-calculator"),
	component: ChmodCalculator,
});

interface PermSet {
	r: boolean;
	w: boolean;
	x: boolean;
}

interface Perms {
	owner: PermSet;
	group: PermSet;
	other: PermSet;
}

type PermGroup = keyof Perms;
type PermKey = keyof PermSet;

interface Special {
	suid: boolean;
	sgid: boolean;
	sticky: boolean;
}

const GROUPS: { label: string; prefix: PermGroup }[] = [
	{ label: "Owner", prefix: "owner" },
	{ label: "Group", prefix: "group" },
	{ label: "Other", prefix: "other" },
];

function ChmodCalculator() {
	const [perms, setPerms] = useState<Perms>({
		owner: { r: true, w: true, x: true },
		group: { r: true, w: false, x: true },
		other: { r: true, w: false, x: true },
	});
	const [special, setSpecial] = useState<Special>({
		suid: false,
		sgid: false,
		sticky: false,
	});

	const toggle = (g: PermGroup, p: PermKey) =>
		setPerms((s) => ({ ...s, [g]: { ...s[g], [p]: !s[g][p] } }));
	const toggleSpecial = (k: keyof Special) =>
		setSpecial((s) => ({ ...s, [k]: !s[k] }));

	const octal = useMemo(() => {
		const specialN =
			(special.suid ? 4 : 0) +
			(special.sgid ? 2 : 0) +
			(special.sticky ? 1 : 0);
		const num = (p: PermSet) => (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0);
		const o = num(perms.owner) + (special.suid && perms.owner.x ? 4 : 0);
		const g = num(perms.group) + (special.sgid && perms.group.x ? 2 : 0);
		const ot = num(perms.other) + (special.sticky && perms.other.x ? 1 : 0);
		return `${specialN > 0 ? String(specialN) : ""}${o}${g}${ot}`;
	}, [perms, special]);

	const rwx = useMemo(() => {
		const toRwx = (p: PermSet, s: "s" | "t" | null) =>
			s ? (s === "s" ? (p.x ? "s" : "S") : p.x ? "t" : "T") : "-";
		return [
			perms.owner.r ? "r" : "-",
			perms.owner.w ? "w" : "-",
			toRwx(perms.owner, special.suid ? "s" : null),
			perms.group.r ? "r" : "-",
			perms.group.w ? "w" : "-",
			toRwx(perms.group, special.sgid ? "s" : null),
			perms.other.r ? "r" : "-",
			perms.other.w ? "w" : "-",
			toRwx(perms.other, special.sticky ? "t" : null),
		].join("");
	}, [perms, special]);

	return (
		<ToolShell
			toolId="chmod-calculator"
			title="Chmod Calculator"
			description="Calculate chmod values"
			runsLocally
		>
			<div className="space-y-3">
				{GROUPS.map(({ label, prefix }) => (
					<div key={prefix} className="flex items-center gap-4">
						<span className="font-mono text-[11px] uppercase tracking-wide text-muted w-14">
							{label}
						</span>
						{(["r", "w", "x"] as const).map((p) => (
							<label
								key={p}
								className="flex items-center gap-1.5 font-mono text-xs cursor-pointer"
							>
								<input
									type="checkbox"
									checked={perms[prefix][p]}
									onChange={() => toggle(prefix, p)}
									className="accent-accent"
								/>
								{p}
							</label>
						))}
					</div>
				))}
				<div className="flex items-center gap-4 pt-2 border-t border-rule">
					<span className="font-mono text-[11px] uppercase tracking-wide text-muted w-14">
						special
					</span>
					<label className="flex items-center gap-1.5 font-mono text-xs cursor-pointer">
						<input
							type="checkbox"
							checked={special.suid}
							onChange={() => toggleSpecial("suid")}
							className="accent-accent"
						/>{" "}
						setuid
					</label>
					<label className="flex items-center gap-1.5 font-mono text-xs cursor-pointer">
						<input
							type="checkbox"
							checked={special.sgid}
							onChange={() => toggleSpecial("sgid")}
							className="accent-accent"
						/>{" "}
						setgid
					</label>
					<label className="flex items-center gap-1.5 font-mono text-xs cursor-pointer">
						<input
							type="checkbox"
							checked={special.sticky}
							onChange={() => toggleSpecial("sticky")}
							className="accent-accent"
						/>{" "}
						sticky
					</label>
				</div>
			</div>
			<div className="flex items-center gap-6 pt-4 border-t border-rule">
				<div>
					<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1">
						numeric
					</div>
					<div className="font-mono text-2xl">{octal}</div>
				</div>
				<div>
					<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1">
						rwx
					</div>
					<div className="font-mono text-2xl">{rwx}</div>
				</div>
				<div className="flex gap-2 ml-auto">
					<CopyButton value={octal} label="copy octal" />
					<CopyButton value={rwx} label="copy rwx" />
				</div>
			</div>
		</ToolShell>
	);
}
