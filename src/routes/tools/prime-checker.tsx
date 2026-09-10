import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/prime-checker")({
	head: () => toolHead("prime-checker"),
	component: PrimeChecker,
});

function isPrime(n: number): boolean {
	if (n < 2) return false;
	if (n < 4) return true;
	if (n % 2 === 0) return false;
	for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
	return true;
}

function PrimeChecker() {
	const [input, setInput] = useState("17");
	const result = useMemo(() => {
		const n = Number.parseInt(input, 10);
		if (Number.isNaN(n)) return null;
		return { prime: isPrime(n), n };
	}, [input]);

	return (
		<ToolShell
			toolId="prime-checker"
			title="Prime Checker"
			description="Check if a number is prime"
			runsLocally
		>
			<div>
				<label
					htmlFor="prime-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					number
				</label>
				<input
					id="prime-input"
					value={input}
					onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, ""))}
					type="number"
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			{result && (
				<div
					className={`border border-rule bg-surface px-3.5 py-3 font-mono text-sm ${
						result.prime ? "text-accent" : "text-muted"
					}`}
				>
					{result.n} is {result.prime ? "prime" : "not prime"}
				</div>
			)}
		</ToolShell>
	);
}
