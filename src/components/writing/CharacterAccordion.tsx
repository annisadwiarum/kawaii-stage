'use client';

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { WritingCharacter, WritingScript } from "@/data/writingCharacters";

type Props = {
  groupedCharacters: Record<WritingScript, WritingCharacter[]>;
  activeId: string;
  onSelect: (id: string) => void;
  snapshot: any; // Replace with actual type
};

export function CharacterAccordion({ groupedCharacters, activeId, onSelect, snapshot }: Props) {
  const [open, setOpen] = useState<WritingScript | null>(null);

  const toggle = (script: WritingScript) => {
    setOpen(open === script ? null : script);
  };

  return (
    <div className="space-y-2">
      {(Object.keys(groupedCharacters) as WritingScript[]).map((script) => (
        <div key={script} className="rounded-2xl border border-white/10 bg-black/40">
          <button
            onClick={() => toggle(script)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-lg font-semibold text-indigo-100"
          >
            <span className="capitalize">{script}</span>
            <ChevronDown
              className={`transform transition-transform ${open === script ? "rotate-180" : ""}`}
            />
          </button>
          {open === script && (
            <div className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-2">
                {groupedCharacters[script].map((character) => {
                  const progress = snapshot[character.id];
                  const isActive = character.id === activeId;
                  return (
                    <button
                      key={character.id}
                      type="button"
                      onClick={() => onSelect(character.id)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left transition ${
                        isActive
                          ? "border-pink-400/60 bg-pink-500/20 text-white"
                          : "border-white/10 bg-black/40 text-indigo-100 hover:border-pink-400/40 hover:text-white"
                      }`}
                    >
                      <div>
                        <p className="text-base font-semibold">{character.glyph}</p>
                        <p className="text-xs uppercase tracking-wide text-indigo-200/70">
                          {character.romaji}
                        </p>
                      </div>
                      <div className="text-right text-xs text-indigo-200/70">
                        <p>Best {progress ? Math.round((progress.bestAccuracy ?? 0) * 100) : 0}%</p>
                        <p>XP {progress ? progress.totalXp : 0}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
