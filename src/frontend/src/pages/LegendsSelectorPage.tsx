import { Music, Check, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEGENDS } from "../data/legends";
import type { Legend } from "../data/legends";

interface LegendsSelectorPageProps {
  selectedLegendIds: string[];
  onToggleLegend: (id: string) => void;
  onNavigateToEvents: () => void;
}

export function LegendsSelectorPage({
  selectedLegendIds,
  onToggleLegend,
  onNavigateToEvents,
}: LegendsSelectorPageProps) {
  const detroitFounders = LEGENDS.filter((l) => l.detroitFounder);
  const allDetroitSelected = detroitFounders.every((l) =>
    selectedLegendIds.includes(l.id),
  );

  function handleSelectDetroit() {
    if (allDetroitSelected) {
      // Deselect all Detroit founders
      detroitFounders.forEach((l) => {
        if (selectedLegendIds.includes(l.id)) onToggleLegend(l.id);
      });
    } else {
      // Select all Detroit founders that aren't already selected
      detroitFounders.forEach((l) => {
        if (!selectedLegendIds.includes(l.id)) onToggleLegend(l.id);
      });
    }
  }

  const selectedCount = selectedLegendIds.length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={12} className="text-neon-cyan" />
          <span className="font-mono text-xs tracking-widest uppercase text-neon-cyan">
            Curated Pioneers
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          Select your{" "}
          <span className="text-neon-cyan text-glow-cyan">Legends</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          Curated techno legends. No filler. Choose who to track, then see their gigs.
        </p>
      </div>

      {/* Controls row */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 fade-in"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSelectDetroit}
            className={`flex items-center gap-2 px-3 py-1.5 font-mono text-xs tracking-widest uppercase border transition-all duration-200 rounded-none ${
              allDetroitSelected
                ? "border-neon-red/60 text-neon-red bg-neon-red/10 hover:bg-neon-red/20"
                : "border-void-400 text-muted-foreground hover:border-neon-red/60 hover:text-neon-red hover:bg-neon-red/10"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${allDetroitSelected ? "bg-neon-red" : "bg-void-400"}`}
            />
            {allDetroitSelected ? "CLEAR DETROIT" : "SELECT ALL DETROIT FOUNDERS"}
          </button>
        </div>

        <span className="font-mono text-xs text-muted-foreground tracking-wider">
          {selectedCount > 0 ? (
            <span>
              <span className="text-neon-cyan">{selectedCount}</span> of 9 legends selected
            </span>
          ) : (
            "0 of 9 legends selected"
          )}
        </span>
      </div>

      {/* Legend Cards Grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-8 fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        {LEGENDS.map((legend, i) => (
          <LegendCard
            key={legend.id}
            legend={legend}
            isSelected={selectedLegendIds.includes(legend.id)}
            onToggle={() => onToggleLegend(legend.id)}
            animationDelay={0.1 + i * 0.04}
          />
        ))}
      </div>

      {/* CTA */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-void-400 bg-void-100 fade-in"
        style={{ animationDelay: "0.55s" }}
      >
        <div className="text-sm text-muted-foreground">
          {selectedCount === 0 ? (
            "Select at least one legend to view their events"
          ) : (
            <span>
              Showing events for{" "}
              <span className="text-foreground font-semibold">
                {LEGENDS.filter((l) => selectedLegendIds.includes(l.id))
                  .map((l) => l.name)
                  .join(", ")}
              </span>
            </span>
          )}
        </div>

        <Button
          onClick={onNavigateToEvents}
          disabled={selectedCount === 0}
          className="shrink-0 font-mono text-xs tracking-widest uppercase h-10 px-6 rounded-none bg-neon-cyan text-void hover:bg-neon-cyan/90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={
            selectedCount > 0
              ? { boxShadow: "0 0 16px oklch(0.78 0.16 200 / 0.4)" }
              : undefined
          }
        >
          VIEW {selectedCount > 0 ? selectedCount : ""} LEGEND EVENTS
          <ChevronRight size={14} className="ml-1.5" />
        </Button>
      </div>
    </main>
  );
}

interface LegendCardProps {
  legend: Legend;
  isSelected: boolean;
  onToggle: () => void;
  animationDelay: number;
}

function LegendCard({ legend, isSelected, onToggle, animationDelay }: LegendCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative flex flex-col overflow-hidden cursor-pointer transition-all duration-200 rounded-none text-left group fade-in"
      style={{
        animationDelay: `${animationDelay}s`,
        border: isSelected ? `2px solid ${legend.color}` : "2px solid oklch(0.22 0.03 260)",
        boxShadow: isSelected
          ? `0 0 16px ${legend.color}40, 0 4px 24px oklch(0 0 0 / 0.5)`
          : "0 2px 8px oklch(0 0 0 / 0.4)",
      }}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? "Deselect" : "Select"} ${legend.name}`}
    >
      {/* Portrait image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-void-200 scan-line">
        <img
          src={legend.imageUrl}
          alt={legend.name}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Bottom gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${legend.color}28 0%, ${legend.color}10 30%, transparent 60%)`,
          }}
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: `${legend.color}12` }}
        />

        {/* Detroit Founder badge */}
        {legend.detroitFounder && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-neon-red/90 font-mono text-[9px] tracking-widest uppercase text-void font-bold">
            DETROIT
          </div>
        )}

        {/* Selection indicator */}
        <div
          className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: isSelected ? legend.color : "oklch(0.08 0.015 260 / 0.8)",
            borderColor: isSelected ? legend.color : "oklch(0.22 0.03 260)",
          }}
        >
          {isSelected && <Check size={12} className="text-void" strokeWidth={3} />}
        </div>
      </div>

      {/* Info section */}
      <div
        className="flex flex-col gap-1 p-2.5 bg-void-100"
        style={{
          borderTop: isSelected ? `1px solid ${legend.color}40` : "1px solid oklch(0.22 0.03 260)",
        }}
      >
        <p className="font-bold text-sm text-foreground leading-tight truncate">{legend.name}</p>
        <p className="font-mono text-[10px] text-muted-foreground truncate leading-tight">
          {legend.alias}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <Music size={9} style={{ color: legend.color }} className="shrink-0" />
          <p className="font-mono text-[10px] truncate" style={{ color: legend.color }}>
            {legend.keyTrack}
          </p>
        </div>
      </div>
    </button>
  );
}
