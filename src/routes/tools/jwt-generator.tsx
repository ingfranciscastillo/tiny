import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/jwt-generator")({
	head: () => toolHead("jwt-generator"),
	component: JwtGenerator,
});

// biome-ignore lint/suspicious/noExplicitAny: JSON.parse of user-authored header/payload
function b64url(obj: any): string {
	return btoa(JSON.stringify(obj))
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
}

const ALG_MAP: Record<string, string> = {
	HS256: "SHA-256",
	HS384: "SHA-384",
	HS512: "SHA-512",
};

function JwtGenerator() {
	const [header, setHeader] = useState('{"alg":"HS256","typ":"JWT"}');
	const [payload, setPayload] = useState(
		`{"sub":"1234567890","name":"John Doe","iat":${Math.floor(Date.now() / 1000)}}`,
	);
	const [secret, setSecret] = useState("your-secret-key");
	const [output, setOutput] = useState("");

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const h = JSON.parse(header);
				const p = JSON.parse(payload);
				const data = `${b64url(h)}.${b64url(p)}`;
				if (h.alg === "none") {
					if (!cancelled) setOutput(`${data}.`);
					return;
				}
				const hashAlg = ALG_MAP[h.alg];
				if (!hashAlg) {
					if (!cancelled)
						setOutput("unsupported alg (use HS256/384/512 or none)");
					return;
				}
				const enc = new TextEncoder();
				const keyData = await crypto.subtle.importKey(
					"raw",
					enc.encode(secret),
					{ name: "HMAC", hash: hashAlg },
					false,
					["sign"],
				);
				const sig = await crypto.subtle.sign("HMAC", keyData, enc.encode(data));
				const sigHex = Array.from(new Uint8Array(sig))
					.map((b) => b.toString(16).padStart(2, "0"))
					.join("");
				const sigBin = (sigHex.match(/.{1,2}/g) ?? [])
					.map((h2) => String.fromCharCode(Number.parseInt(h2, 16)))
					.join("");
				if (!cancelled)
					setOutput(
						`${data}.${btoa(sigBin).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")}`,
					);
			} catch {
				if (!cancelled) setOutput("invalid JSON header/payload");
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [header, payload, secret]);

	return (
		<ToolShell
			toolId="jwt-generator"
			title="JWT Generator"
			description="Create test JWTs"
			runsLocally
		>
			<WorkSurface
				label="header (JSON)"
				value={header}
				onChange={(e) => setHeader(e.target.value)}
				placeholder='{"alg":"HS256","typ":"JWT"}'
				rows={3}
			/>
			<WorkSurface
				label="payload (JSON)"
				value={payload}
				onChange={(e) => setPayload(e.target.value)}
				placeholder='{"sub":"123"}'
				rows={4}
			/>
			<div>
				<label
					htmlFor="jwt-secret"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					secret
				</label>
				<input
					id="jwt-secret"
					value={secret}
					onChange={(e) => setSecret(e.target.value)}
					spellCheck={false}
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-2.5 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			<OutputBlock value={output} placeholder="eyJ..." copyLabel="Copy" />
		</ToolShell>
	);
}
