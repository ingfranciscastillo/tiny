import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/dns-record-builder")({
	head: () => toolHead("dns-record-builder"),
	component: DnsRecordBuilder,
});

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA"] as const;
type RecordType = (typeof RECORD_TYPES)[number];

function DnsRecordBuilder() {
	const [type, setType] = useState<RecordType>("A");
	const [name, setName] = useState("example.com");
	const [value, setValue] = useState("192.168.1.1");
	const [ttl, setTtl] = useState(3600);

	const output = useMemo(() => {
		if (!name || !value) return "";
		switch (type) {
			case "A":
			case "AAAA":
				return `${name}.\t${ttl}\tIN\t${type}\t${value}`;
			case "CNAME":
			case "NS":
				return `${name}.\t${ttl}\tIN\t${type}\t${value}.`;
			case "MX":
				return `${name}.\t${ttl}\tIN\tMX\t10\t${value}.`;
			case "TXT":
				return `${name}.\t${ttl}\tIN\tTXT\t"${value}"`;
			case "SOA":
				return `${name}.\t${ttl}\tIN\tSOA\tns.${name}. admin.${name}. ${Math.floor(Date.now() / 1000)} 7200 3600 1209600 3600`;
			default:
				return "";
		}
	}, [type, name, value, ttl]);

	return (
		<ToolShell
			toolId="dns-record-builder"
			title="DNS Record Builder"
			description="Build DNS record syntax"
			runsLocally
		>
			<div className="space-y-3">
				<div className="flex items-end gap-3">
					<div>
						<label
							htmlFor="dns-type"
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							type
						</label>
						<select
							id="dns-type"
							value={type}
							onChange={(e) => setType(e.target.value as RecordType)}
							className="font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						>
							{RECORD_TYPES.map((t) => (
								<option key={t}>{t}</option>
							))}
						</select>
					</div>
					<div className="flex-1">
						<label
							htmlFor="dns-name"
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							name
						</label>
						<input
							id="dns-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							spellCheck={false}
							className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
					<div>
						<label
							htmlFor="dns-ttl"
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							ttl
						</label>
						<input
							id="dns-ttl"
							type="number"
							value={ttl}
							onChange={(e) => setTtl(Number(e.target.value))}
							className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				</div>
				<div>
					<label
						htmlFor="dns-value"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						value
					</label>
					<input
						id="dns-value"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
			<OutputBlock value={output} placeholder="dns record" copyLabel="Copy" />
		</ToolShell>
	);
}
