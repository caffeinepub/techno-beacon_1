import { useState } from "react";
import { Plane, Ticket, Radio, ExternalLink, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LEGENDS, LEGEND_MAP } from "../data/legends";
import { getEventsForLegends, detectOverlaps } from "../data/events";
import type { StaticEvent } from "../data/events";

type SortMode = "date" | "legend";

interface EventsFeedPageProps {
  selectedLegendIds: string[];
  onPlanTrip: (event: StaticEvent) => void;
  homeCity: string;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function EventsFeedPage({
  selectedLegendIds,
  onPlanTrip,
  homeCity,
}: EventsFeedPageProps) {
  const [sortMode, setSortMode] = useState<SortMode>("date");
  const [localSelected, setLocalSelected] = useState<string[]>(selectedLegendIds);

  // Sync local selected with incoming prop but allow local filtering
  const activeIds = localSelected.filter((id) => selectedLegendIds.includes(id));
  const displayIds = activeIds.length > 0 ? activeIds : selectedLegendIds;

  function handleToggleFilter(id: string) {
    setLocalSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const events = getEventsForLegends(displayIds);
  const overlaps = detectOverlaps(events);

  const sortedEvents =
    sortMode === "legend"
      ? [...events].sort((a, b) => {
          const aIdx = LEGENDS.findIndex((l) => l.id === a.legendId);
          const bIdx = LEGENDS.findIndex((l) => l.id === b.legendId);
          return aIdx - bIdx || a.date.localeCompare(b.date);
        })
      : events; // already date-sorted from getEventsForLegends

  const activeLegends = LEGENDS.filter((l) => selectedLegendIds.includes(l.id));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6 fade-in">
        <div className="flex items-center gap-2 mb-2">
          <Radio size={12} className="text-neon-cyan beacon-pulse" />
          <span className="font-mono text-xs tracking-widest uppercase text-neon-cyan">
            Events Feed
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          <span className="text-neon-cyan">{sortedEvents.length}</span> EVENTS ·{" "}
          <span className="text-neon-cyan">{selectedLegendIds.length}</span> LEGENDS SELECTED
        </h1>
      </div>

      {/* Filter chips + sort */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 fade-in"
        style={{ animationDelay: "0.05s" }}
      >
        {/* Legend filter chips */}
        <div className="flex flex-wrap gap-2">
          {activeLegends.map((legend) => {
            const isActive = localSelected.includes(legend.id) || localSelected.length === 0;
            return (
              <button
                key={legend.id}
                type="button"
                onClick={() => handleToggleFilter(legend.id)}
                className="flex items-center gap-1.5 px-2 py-1 font-mono text-xs tracking-wider transition-all duration-200 rounded-none border"
                style={{
                  borderColor: isActive ? `${legend.color}80` : "oklch(0.22 0.03 260)",
                  backgroundColor: isActive ? `${legend.color}18` : "transparent",
                  color: isActive ? legend.color : "oklch(0.52 0.05 230)",
                  opacity: isActive ? 1 : 0.5,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: legend.color }}
                />
                {legend.name}
              </button>
            );
          })}
        </div>

        {/* Sort toggle */}
        <div className="flex items-center gap-1 border border-void-400 p-0.5 shrink-0">
          {(["date", "legend"] as SortMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSortMode(mode)}
              className={`px-3 py-1 font-mono text-xs tracking-widest uppercase transition-all duration-200 ${
                sortMode === mode
                  ? "bg-neon-cyan/20 text-neon-cyan"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode === "date" ? "DATE" : "LEGEND"}
            </button>
          ))}
        </div>
      </div>

      {/* Events list */}
      {selectedLegendIds.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 gap-4 border border-void-400 border-dashed fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <Radio size={40} className="text-void-400" strokeWidth={1} />
          <p className="font-mono text-sm text-muted-foreground tracking-wider uppercase text-center">
            No legends selected
          </p>
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            Select legends on the Home screen to see their events
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          {sortedEvents.map((event, i) => (
            <EventCard
              key={event.id}
              event={event}
              overlapLegendIds={overlaps.get(event.id)}
              onPlanTrip={onPlanTrip}
              animationDelay={0.1 + i * 0.02}
            />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <p
        className="mt-8 text-xs text-muted-foreground/60 italic text-center fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        Events from RA/Bandsintown – dates may change. Always verify before booking.
      </p>
    </main>
  );
}

interface EventCardProps {
  event: StaticEvent;
  overlapLegendIds?: string[];
  onPlanTrip: (event: StaticEvent) => void;
  animationDelay: number;
}

function EventCard({ event, overlapLegendIds, onPlanTrip, animationDelay }: EventCardProps) {
  const legend = LEGEND_MAP[event.legendId];
  if (!legend) return null;

  const isOverlap = overlapLegendIds && overlapLegendIds.length > 1;
  const otherOverlapLegends = isOverlap
    ? overlapLegendIds!
        .filter((id) => id !== event.legendId)
        .map((id) => LEGEND_MAP[id]?.name)
        .filter(Boolean)
    : [];

  return (
    <div
      className="relative flex gap-0 overflow-hidden bg-void-100 border border-void-400 hover:border-void-300 transition-all duration-200 fade-in group"
      style={{
        animationDelay: `${animationDelay}s`,
        ...(isOverlap
          ? {
              borderColor: `${legend.color}60`,
              boxShadow: `0 0 12px ${legend.color}20`,
            }
          : {}),
      }}
    >
      {/* Left color accent bar */}
      <div
        className="w-1 shrink-0 self-stretch"
        style={{ backgroundColor: legend.color }}
      />

      {/* Card content */}
      <div className="flex-1 flex flex-col gap-2 p-3">
        {/* Date + overlap */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-xs text-muted-foreground">{formatDate(event.date)}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            {isOverlap && (
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 font-mono text-[9px] tracking-widest uppercase font-bold"
                style={{
                  backgroundColor: `${legend.color}20`,
                  color: legend.color,
                  border: `1px solid ${legend.color}40`,
                }}
              >
                <Users2 size={9} />
                SHARED
              </div>
            )}
            <Badge
              variant="outline"
              className="font-mono text-[9px] tracking-widest uppercase px-1.5 py-0 rounded-none bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan/80"
            >
              RA
            </Badge>
          </div>
        </div>

        {/* Venue + city */}
        <div>
          <p className="font-bold text-sm text-foreground leading-tight">{event.venue}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {event.city}, {event.country}
          </p>
        </div>

        {/* Event title */}
        {event.title && (
          <p className="text-xs text-muted-foreground/80 italic leading-tight">{event.title}</p>
        )}

        {/* Overlap info */}
        {isOverlap && otherOverlapLegends.length > 0 && (
          <p className="font-mono text-[10px]" style={{ color: legend.color }}>
            Also playing: {otherOverlapLegends.join(", ")}
          </p>
        )}

        {/* Legend + actions row */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-void-400/50">
          {/* Legend name with dot */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: legend.color }}
            />
            <span
              className="font-mono text-xs font-bold truncate"
              style={{ color: legend.color }}
            >
              {legend.name}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onPlanTrip(event)}
              className="flex items-center gap-1 px-2 py-1 font-mono text-[10px] tracking-wider uppercase border border-void-400 text-muted-foreground hover:border-neon-cyan/50 hover:text-neon-cyan transition-all duration-150 rounded-none"
            >
              <Plane size={9} />
              PLAN TRIP
            </button>
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 font-mono text-[10px] tracking-wider uppercase border border-void-400 text-muted-foreground hover:border-neon-violet/50 hover:text-neon-violet transition-all duration-150 rounded-none"
            >
              <Ticket size={9} />
              TICKETS
              <ExternalLink size={8} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
