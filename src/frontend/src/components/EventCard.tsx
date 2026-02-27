import { ExternalLink, MapPin, Calendar, Plus, Minus, Loader2, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Event, Artist } from "../backend.d";

interface EventCardProps {
  event: Event;
  artist?: Artist;
  isInRadar: boolean;
  isLoggedIn: boolean;
  onAddToRadar: (eventId: string) => void;
  onRemoveFromRadar: (eventId: string) => void;
  isLoading?: boolean;
  animationIndex?: number;
  onViewArtist?: (artistId: string) => void;
}

const SOURCE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Resident Advisor": {
    bg: "bg-neon-cyan/10",
    text: "text-neon-cyan",
    border: "border-neon-cyan/30",
  },
  "Bandsintown": {
    bg: "bg-neon-violet/10",
    text: "text-neon-violet",
    border: "border-neon-violet/30",
  },
  "Festicket": {
    bg: "bg-neon-teal/10",
    text: "text-neon-teal",
    border: "border-neon-teal/30",
  },
};

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

export function EventCard({
  event,
  artist,
  isInRadar,
  isLoggedIn,
  onAddToRadar,
  onRemoveFromRadar,
  isLoading = false,
  animationIndex = 0,
  onViewArtist,
}: EventCardProps) {
  const sourceStyle = SOURCE_STYLES[event.source] ?? {
    bg: "bg-muted/20",
    text: "text-muted-foreground",
    border: "border-void-400",
  };

  return (
    <div
      className={`
        group relative flex flex-col bg-card border border-void-400
        rounded-sm overflow-hidden
        transition-all duration-300 ease-out
        hover:border-neon-cyan/50 hover:shadow-card-hover hover:-translate-y-0.5
        fade-in opacity-0
      `}
      style={{ animationDelay: `${animationIndex * 0.05}s`, animationFillMode: "forwards" }}
    >
      {/* Neon accent top bar — color matches source */}
      <div
        className={`h-px w-full ${
          event.source === "Resident Advisor"
            ? "bg-neon-cyan"
            : event.source === "Bandsintown"
            ? "bg-neon-violet"
            : "bg-neon-teal"
        } opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Source + Genre */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge
            variant="outline"
            className={`font-mono text-xs px-2 py-0.5 rounded-none ${sourceStyle.bg} ${sourceStyle.text} ${sourceStyle.border}`}
          >
            {event.source}
          </Badge>
          {artist && (
            <Badge
              variant="outline"
              className="font-mono text-xs px-2 py-0.5 rounded-none bg-void-200 text-muted-foreground border-void-400"
            >
              {artist.genre}
            </Badge>
          )}
        </div>

        {/* Event Title */}
        <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-2 group-hover:text-neon-cyan transition-colors duration-200">
          {event.title}
        </h3>

        {/* Artist */}
        {artist && (
          <button
            type="button"
            onClick={() => onViewArtist?.(event.artistId)}
            className="text-left"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-void-300 border border-void-400 shrink-0">
                {artist.imageUrl ? (
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Radio size={10} className="text-neon-cyan" />
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground hover:text-neon-cyan transition-colors duration-200 font-medium truncate">
                {artist.name}
              </span>
            </div>
          </button>
        )}

        {/* Venue + Date */}
        <div className="flex flex-col gap-1 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin size={10} className="shrink-0 text-neon-cyan/60" />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar size={10} className="shrink-0 text-neon-cyan/60" />
            <span className="font-mono">{formatDate(event.date)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 px-4 pb-4 pt-2 border-t border-void-400/50">
        <a
          href={event.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-neon-cyan transition-colors duration-200 uppercase tracking-wider"
        >
          <ExternalLink size={10} />
          Tickets
        </a>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!isLoggedIn || isLoading}
                  onClick={() =>
                    isInRadar ? onRemoveFromRadar(event.id) : onAddToRadar(event.id)
                  }
                  className={`h-7 px-3 rounded-none font-mono text-xs tracking-wider uppercase transition-all duration-200 ${
                    isInRadar
                      ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40"
                      : "bg-void-200 text-muted-foreground border-void-400 hover:bg-neon-cyan/10 hover:text-neon-cyan hover:border-neon-cyan/40"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={10} className="animate-spin mr-1" />
                  ) : isInRadar ? (
                    <Minus size={10} className="mr-1" />
                  ) : (
                    <Plus size={10} className="mr-1" />
                  )}
                  {isInRadar ? "ON RADAR" : "ADD TO RADAR"}
                </Button>
              </span>
            </TooltipTrigger>
            {!isLoggedIn && (
              <TooltipContent
                side="top"
                className="font-mono text-xs bg-void-200 border-void-400 text-foreground"
              >
                Please log in to add events to your radar
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
