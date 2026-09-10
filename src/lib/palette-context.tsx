import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import CommandPalette from "#/components/CommandPalette";

interface PaletteContextValue {
	isPaletteOpen: boolean;
	openPalette: () => void;
	closePalette: () => void;
}

const PaletteContext = createContext<PaletteContextValue | null>(null);

export function PaletteProvider({ children }: { children: ReactNode }) {
	const [isPaletteOpen, setPaletteOpen] = useState(false);

	const value = useMemo<PaletteContextValue>(
		() => ({
			isPaletteOpen,
			openPalette: () => setPaletteOpen(true),
			closePalette: () => setPaletteOpen(false),
		}),
		[isPaletteOpen],
	);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setPaletteOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, []);

	return (
		<PaletteContext.Provider value={value}>
			{children}
			<CommandPalette
				open={isPaletteOpen}
				onClose={() => setPaletteOpen(false)}
			/>
		</PaletteContext.Provider>
	);
}

export function usePalette(): PaletteContextValue {
	const ctx = useContext(PaletteContext);
	if (!ctx) {
		throw new Error("usePalette must be used within a PaletteProvider");
	}
	return ctx;
}
