import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/text-to-ascii")({
	head: () => toolHead("text-to-ascii"),
	component: TextToAscii,
});

// Combining diacritical marks, stripped after NFKD normalization
const DIACRITICS = /\p{M}/gu;
const NON_ASCII = /[^a-zA-Z0-9.,!?'"\-:;()\s@#$%&*+/=<>[\]{}_\\|]/g;

function TextToAscii() {
	const [input, setInput] = useState("");
	const output = useMemo(() => {
		if (!input) return "";
		return input
			.normalize("NFKD")
			.replace(DIACRITICS, "")
			.replace(NON_ASCII, "");
	}, [input]);

	return (
		<ToolShell
			toolId="text-to-ascii"
			title="Text → ASCII"
			description="Remove accents and normalize characters"
			runsLocally
		>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="café résumé naïve"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="cafe resume naive"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
