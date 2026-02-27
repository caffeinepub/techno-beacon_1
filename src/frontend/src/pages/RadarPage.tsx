import { Radio, Plane, Ticket, X, ExternalLink, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LEGEND_MAP } from "../data/legends";
import type { StaticEvent } from "../data/events";

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

interface RadarPageProps {
  radarEvents: StaticEvent[];
  removeFromRadar: (eventId: string) => void;
  onPlanTrip: (event: StaticEvent) => void;
  onNavigateToEvents: () => void;
}

export function RadarPage({
  radarEvents,
  removeFromRadar,
  onPlanTrip,
  onNavigateToEvents,
}: RadarPageProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Radio size={12} className="text-neon-cyan beacon-pulse" />
          <span className="font-mono text-xs tracking-widest uppercase text-neon-cyan">
            Personal Radar
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            My <span className="text-neon-cyan text-glow-cyan">Radar</span>
          </h1>
          {radarEvents.length > 0 && (
            <span className="font-mono text-sm text-muted-foreground">
              {radarEvents.length} {radarEvents.length === 1 ? "event" : "events"}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          Events you've saved for planning. No login required.
        </p>
      </div>

      {/* Empty state */}
      {radarEvents.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 gap-5 border border-void-400 border-dashed fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Radar circles */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border border-neon-cyan/15" />
            <div className="absolute inset-4 rounded-full border border-neon-cyan/12" />
            <div className="absolute inset-8 rounded-full border border-neon-cyan/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Radio size={22} className="text-neon-cyan/40 beacon-pulse" strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center max-w-xs">
            <p className="font-mono text-sm text-muted-foreground tracking-wider uppercase">
              Nothing on radar yet
            </p>
            <p className="text-xs text-muted-foreground">
              Add events from the Events feed using the RADAR button on each event card.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToEvents}
            className="flex items-center gap-1.5 font-mono text-xs text-neon-cyan hover:underline tracking-widest uppercase transition-colors duration-200"
          >
            Browse Events <ChevronRight size={10} />
          </button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          {radarEvents.map((event, i) => (
            <RadarEventCard
              key={event.id}
              event={event}
              onRemove={removeFromRadar}
              onPlanTrip={onPlanTrip}
              animationDelay={0.1 + i * 0.03}
            />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      {radarEvents.length > 0 && (
        <p
          className="mt-8 text-xs text-muted-foreground/60 italic text-center fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          Events from RA/Bandsintown – dates may change. Always verify before booking.
        </p>
      )}
    </main>
  );
}

interface RadarEventCardProps {
  event: StaticEvent;
  onRemove: (eventId: string) => void;
  onPlanTrip: (event: StaticEvent) => void;
  animationDelay: number;
}

function RadarEventCard({ event, onRemove, onPlanTrip, animationDelay }: RadarEventCardProps) {
  const legend = LEGEND_MAP[event.legendId];
  if (!legend) return null;

  return (
    <div
      className="relative flex gap-0 overflow-hidden bg-void-100 border transition-all duration-200 fade-in group"
      style={{
        animationDelay: `${animationDelay}s`,
        borderColor: `${legend.color}50`,
        boxShadow: `0 0 12px ${legend.color}15`,
      }}
    >
      {/* Left color accent bar */}
      <div
        className="w-1 shrink-0 self-stretch"
        style={{ backgroundColor: legend.color }}
      />

      {/* Card content */}
      <div className="flex-1 flex flex-col gap-2 p-3">
        {/* Date + remove button */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-xs text-muted-foreground">{formatDate(event.date)}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge
              variant="outline"
              className="font-mono text-[9px] tracking-widest uppercase px-1.5 py-0 rounded-none bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan/80"
            >
              RA
            </Badge>
            <button
              type="button"
              onClick={() => onRemove(event.id)}
              title="Remove from Radar"
              className="flex items-center justify-center w-5 h-5 border border-void-400 text-muted-foreground hover:border-destructive/50 hover:text-destructive transition-all duration-150"
            >
              <X size={10} />
            </button>
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

        {/* Legend + actions */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-void-400/50">
          {/* Legend name */}
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
          <div className="flex items-center gap-1 shrink-0">
            {/* Plan Trip */}
            <button
              type="button"
              onClick={() => onPlanTrip(event)}
              className="flex items-center gap-1 px-2 py-1 font-mono text-[10px] tracking-wider uppercase border border-void-400 text-muted-foreground hover:border-neon-cyan/50 hover:text-neon-cyan transition-all duration-150 rounded-none"
            >
              <Plane size={9} />
              TRIP
            </button>

            {/* RA Tickets */}
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 font-mono text-[10px] tracking-wider uppercase border border-void-400 text-muted-foreground hover:border-neon-violet/50 hover:text-neon-violet transition-all duration-150 rounded-none"
            >
              <Ticket size={9} />
              RA
              <ExternalLink size={8} />
            </a>

            {/* Songkick Tickets */}
            <a
              href={event.songkickUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 font-mono text-[10px] tracking-wider uppercase border border-void-400 text-muted-foreground hover:border-neon-green/50 hover:text-neon-green transition-all duration-150 rounded-none"
            >
              <Ticket size={9} />
              SK
              <ExternalLink size={8} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
