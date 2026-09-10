import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/lorem-ipsum")({
	head: () => toolHead("lorem"),
	component: LoremIpsum,
});

const BASE_WORDS =
	"lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(
		" ",
	);

function LoremIpsum() {
	const [paragraphs, setParagraphs] = useState(3);
	const [output, setOutput] = useState("");

	const generate = () => {
		const paras: string[] = [];
		for (let p = 0; p < paragraphs; p++) {
			const len = 40 + Math.floor(Math.random() * 30);
			const words: string[] = [];
			for (let i = 0; i < len; i++)
				words.push(BASE_WORDS[Math.floor(Math.random() * BASE_WORDS.length)]);
			let s = words.join(" ");
			s = `${s[0].toUpperCase()}${s.slice(1)}.`;
			paras.push(s);
		}
		setOutput(paras.join("\n\n"));
	};

	return (
		<ToolShell
			toolId="lorem"
			title="Lorem Ipsum"
			description="Generate placeholder text"
			runsLocally
		>
			<div className="flex items-end gap-3">
				<div>
					<label
						htmlFor="lorem-paragraphs"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						paragraphs
					</label>
					<input
						id="lorem-paragraphs"
						type="number"
						min="1"
						max="20"
						value={paragraphs}
						onChange={(e) =>
							setParagraphs(Math.max(1, Math.min(20, Number(e.target.value))))
						}
						className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<button
					type="button"
					onClick={generate}
					className="font-mono text-xs uppercase tracking-wide px-3 py-2 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
				>
					Generate
				</button>
			</div>
			<OutputBlock
				value={output}
				placeholder="placeholder text appears here"
				copyLabel="Copy"
				downloadName="lorem.txt"
			/>
		</ToolShell>
	);
}
