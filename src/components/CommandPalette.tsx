import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { Tool } from "#/lib/tools";
import { searchTools } from "#/lib/tools";

interface CommandPaletteProps {
	open: boolean;
	onClose: () => void;
}

// Global ⌘K / Ctrl+K command palette. Minimal technical search interface.
export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
	const [query, setQuery] = useState("");
	const [active, setActive] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	const results = searchTools(query);

	useEffect(() => {
		if (open) {
			setQuery("");
			setActive(0);
			setTimeout(() => inputRef.current?.focus(), 30);
		}
	}, [open]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset active index whenever the query changes
	useEffect(() => {
		setActive(0);
	}, [query]);

	const go = (tool: Tool) => {
		onClose();
		navigate({ to: tool.path });
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActive((a) => Math.min(a + 1, results.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActive((a) => Math.max(a - 1, 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (results[active]) go(results[active]);
		} else if (e.key === "Escape") {
			e.preventDefault();
			onClose();
		}
	};

	if (!open) return null;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: backdrop-dismiss overlay, palette itself is the accessible dialog surface
		<div
			className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
			onMouseDown={onClose}
		>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: stops backdrop mousedown from bubbling to the overlay */}
			<div
				className="w-full max-w-xl bg-surface border border-rule rounded-none shadow-none animate-slide-in"
				onMouseDown={(e) => e.stopPropagation()}
			>
				<div className="flex items-center border-b border-rule px-3.5">
					<span className="font-mono text-muted text-sm">/</span>
					<input
						ref={inputRef}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={onKeyDown}
						placeholder="search tools"
						spellCheck={false}
						className="flex-1 bg-transparent font-mono text-sm px-2.5 py-3 focus:outline-none placeholder:text-muted/50"
					/>
					<kbd className="font-mono text-[10px] text-muted border border-rule px-1.5 py-0.5">
						esc
					</kbd>
				</div>
				<div className="max-h-[50vh] overflow-auto">
					{results.length === 0 && (
						<div className="px-3.5 py-6 font-mono text-sm text-muted">
							no tools match "{query}"
						</div>
					)}
					{results.map((tool, i) => (
						<button
							key={tool.id}
							type="button"
							onMouseEnter={() => setActive(i)}
							onClick={() => go(tool)}
							className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-tiny ${
								i === active ? "bg-accent-soft text-accent" : ""
							}`}
						>
							<span className="flex items-baseline gap-3 min-w-0">
								<span className="font-mono text-sm truncate">{tool.name}</span>
								<span className="text-xs text-muted truncate hidden sm:inline">
									{tool.description}
								</span>
							</span>
							<kbd className="font-mono text-[10px] text-muted shrink-0">↵</kbd>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
