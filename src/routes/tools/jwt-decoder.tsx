import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";

export const Route = createFileRoute("/tools/jwt-decoder")({
	component: JwtDecoder,
});

type DecodedJwt =
	| { error: string }
	| { header: unknown; payload: unknown; signature: string };

function decodeJwt(token: string): DecodedJwt {
	const parts = token.trim().split(".");
	if (parts.length < 2) return { error: "a JWT has 3 dot-separated parts" };
	try {
		const decode = (s: string) => {
			let b = s.replace(/-/g, "+").replace(/_/g, "/");
			while (b.length % 4) b += "=";
			return JSON.parse(atob(b));
		};
		return {
			header: decode(parts[0]),
			payload: decode(parts[1]),
			signature: parts[2] || "",
		};
	} catch (e) {
		return {
			error: `could not decode: ${e instanceof Error ? e.message : String(e)}`,
		};
	}
}

function JwtDecoder() {
	const [token, setToken] = useState("");
	const decoded = useMemo(
		() => (token.trim() ? decodeJwt(token) : null),
		[token],
	);

	return (
		<ToolShell
			toolId="jwt"
			title="JWT Decoder"
			description="Inspect JWT header and payload"
			runsLocally
		>
			<div>
				<label
					htmlFor="jwt-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					paste jwt
				</label>
				<textarea
					id="jwt-input"
					value={token}
					onChange={(e) => setToken(e.target.value)}
					spellCheck={false}
					rows={6}
					placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
					className="w-full font-mono text-xs leading-relaxed bg-surface border border-rule rounded-none px-3.5 py-3 resize-y focus:outline-none focus:border-accent transition-tiny placeholder:text-muted/50 break-all"
				/>
			</div>

			{decoded && "error" in decoded && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{decoded.error}
				</div>
			)}

			{decoded && "header" in decoded && (
				<div className="space-y-4">
					<Block
						label="header"
						value={JSON.stringify(decoded.header, null, 2)}
					/>
					<Block
						label="payload"
						value={JSON.stringify(decoded.payload, null, 2)}
					/>
					<div>
						<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5">
							signature
						</div>
						<div className="font-mono text-xs bg-surface border border-rule px-3.5 py-3 break-all">
							{decoded.signature || <span className="text-muted/50">none</span>}
						</div>
					</div>
				</div>
			)}
		</ToolShell>
	);
}

interface BlockProps {
	label: string;
	value: string;
}

function Block({ label, value }: BlockProps) {
	return (
		<div>
			<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5 flex items-center justify-between">
				<span>{label}</span>
				<CopyButton value={value} label="copy" />
			</div>
			<pre className="font-mono text-xs leading-relaxed bg-surface border border-rule px-3.5 py-3 whitespace-pre-wrap break-all">
				{value}
			</pre>
		</div>
	);
}
