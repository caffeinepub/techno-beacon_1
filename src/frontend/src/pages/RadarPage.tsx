import { useState } from "react";
import {
  Radio,
  Loader2,
  LogIn,
  MapPin,
  Calendar,
  Plane,
  Users,
  Bookmark,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useRadarEvents,
  useRadarSummary,
  useTrackedArtists,
  useAllArtists,
  useEventsByArtist,
} from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { Artist, Event } from "../backend.d";

interface RadarPageProps {
  onNavigateToArtist: (artistId: string) => void;
  onNavigateToDiscover: () => void;
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

function getDayBefore(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  } catch {
    return dateStr;
  }
}

function getDayAfter(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  } catch {
    return dateStr;
  }
}

function buildSkyscannerUrl(from: string, to: string, date: string): string {
  const fromClean = from.trim().toLowerCase().replace(/\s+/g, "-");
  const toClean = to.trim().toLowerCase().replace(/\s+/g, "-");
  const dateFmt = date.replace(/-/g, "");
  return `https://www.skyscanner.net/transport/flights/${fromClean}/${toClean}/${dateFmt}/`;
}

function EventRow({
  event,
  artist,
  homeCity,
}: {
  event: Event;
  artist?: Artist;
  homeCity: string;
}) {
  const dayBefore = getDayBefore(event.date);
  const dayAfter = getDayAfter(event.date);

  return (
    <div className="flex flex-col gap-3 p-4 bg-void-100 border border-void-400 rounded-sm hover:border-neon-cyan/40 transition-colors duration-200">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <h4 className="text-sm font-bold text-foreground truncate">{event.title}</h4>
          {artist && (
            <span className="text-xs text-muted-foreground">{artist.name}</span>
          )}
        </div>
        <a
          href={event.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-neon-cyan transition-colors duration-200"
        >
          <ExternalLink size={10} />
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin size={10} className="text-neon-cyan/60 shrink-0" />
          <span>{event.venue}, {event.city}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={10} className="text-neon-cyan/60 shrink-0" />
          <span className="font-mono">{formatDate(event.date)}</span>
        </div>
      </div>

      {/* Flight search links */}
      {homeCity.trim() && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-void-400/50">
          <span className="w-full font-mono text-xs text-muted-foreground/70 tracking-wider uppercase">
            Flights from {homeCity}:
          </span>
          {[
            { label: `Day Before (${dayBefore})`, date: dayBefore },
            { label: `Event Day (${event.date})`, date: event.date },
            { label: `Day After (${dayAfter})`, date: dayAfter },
          ].map(({ label, date }) => (
            <a
              key={date}
              href={buildSkyscannerUrl(homeCity, event.city, date)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2 py-1 bg-void-200 border border-void-400 hover:border-neon-cyan/40 hover:text-neon-cyan text-muted-foreground font-mono text-xs tracking-wider transition-all duration-200 rounded-none"
            >
              <Plane size={9} />
              {label}
              <ExternalLink size={9} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function TrackedArtistSection({
  artistId,
  artists,
  onNavigateToArtist,
}: {
  artistId: string;
  artists: Artist[];
  onNavigateToArtist: (id: string) => void;
}) {
  const artist = artists.find((a) => a.id === artistId);
  const { data: events, isLoading } = useEventsByArtist(artistId);

  if (!artist) return null;

  return (
    <div className="flex flex-col gap-3 p-4 bg-void-100 border border-void-400 rounded-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-void-300 border border-void-400 shrink-0">
            {artist.imageUrl ? (
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Radio size={12} className="text-neon-cyan" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{artist.name}</p>
            <Badge
              variant="outline"
              className="font-mono text-xs px-1.5 py-0 rounded-none bg-void-200 text-muted-foreground border-void-400"
            >
              {artist.genre}
            </Badge>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigateToArtist(artistId)}
          className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-neon-cyan transition-colors duration-200 tracking-wider"
        >
          Artist <ChevronRight size={10} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-2">
          <Loader2 size={10} className="animate-spin text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">Loading events...</span>
        </div>
      ) : events && events.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between gap-2 px-3 py-2 bg-void-200 border border-void-400/50 rounded-none"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{event.title}</p>
                <p className="font-mono text-xs text-muted-foreground">{formatDate(event.date)} · {event.city}</p>
              </div>
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 font-mono text-xs text-muted-foreground hover:text-neon-cyan transition-colors duration-200"
              >
                <ExternalLink size={10} />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground font-mono italic">No upcoming events found.</p>
      )}
    </div>
  );
}

export function RadarPage({ onNavigateToArtist, onNavigateToDiscover }: RadarPageProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const [homeCity, setHomeCity] = useState("");

  const { data: radarEvents, isLoading: radarLoading } = useRadarEvents();
  const { data: radarSummary, isLoading: summaryLoading } = useRadarSummary();
  const { data: trackedArtists, isLoading: trackedLoading } = useTrackedArtists();
  const { data: allArtists } = useAllArtists();

  const artistMap = (allArtists ?? []).reduce<Record<string, Artist>>(
    (acc, a) => ({ ...acc, [a.id]: a }),
    {},
  );

  if (!isLoggedIn) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          {/* Radar animation */}
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 rounded-full border border-neon-cyan/20" />
            <div className="absolute inset-4 rounded-full border border-neon-cyan/15" />
            <div className="absolute inset-8 rounded-full border border-neon-cyan/10" />
            <div className="absolute inset-12 rounded-full border border-neon-cyan/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Radio
                size={28}
                className="text-neon-cyan beacon-pulse"
                strokeWidth={1.5}
              />
            </div>
            {/* Scanning line */}
            <div
              className="absolute top-1/2 left-1/2 w-1/2 h-px origin-left"
              style={{
                background: "linear-gradient(to right, oklch(0.78 0.16 200 / 0.8), transparent)",
                animation: "spin 3s linear infinite",
              }}
            />
          </div>

          <div className="flex flex-col items-center gap-3 text-center max-w-sm">
            <h2 className="text-2xl font-bold text-foreground">
              Enter the <span className="text-neon-cyan text-glow-cyan">Beacon</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Log in to track your favourite artists, save events to your personal radar, and plan your trips.
            </p>
          </div>

          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="h-11 px-8 rounded-none font-mono text-sm tracking-widest uppercase bg-neon-cyan text-void hover:bg-neon-cyan/90 transition-all duration-200"
            style={{ boxShadow: "0 0 20px oklch(0.78 0.16 200 / 0.4)" }}
          >
            {isLoggingIn ? (
              <Loader2 size={14} className="animate-spin mr-2" />
            ) : (
              <LogIn size={14} className="mr-2" />
            )}
            {isLoggingIn ? "CONNECTING..." : "ENTER THE BEACON"}
          </Button>
        </div>
      </main>
    );
  }

  const isLoading = radarLoading || summaryLoading || trackedLoading;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Radio size={12} className="text-neon-cyan" />
          <span className="font-mono text-xs tracking-widest uppercase text-neon-cyan">
            Personal Radar
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          My <span className="text-neon-cyan text-glow-cyan">Radar</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl">
          Your saved events and tracked artists in one place.
        </p>
      </div>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Skeleton className="h-24 bg-void-200" />
          <Skeleton className="h-24 bg-void-200" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-8 fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex flex-col gap-1 p-4 bg-card border border-void-400 rounded-sm">
            <div className="flex items-center gap-2 mb-1">
              <Bookmark size={14} className="text-neon-cyan" />
              <span className="font-mono text-xs text-muted-foreground tracking-wider uppercase">Saved Events</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {radarSummary ? Number(radarSummary.savedEventsCount) : 0}
            </p>
          </div>
          <div className="flex flex-col gap-1 p-4 bg-card border border-void-400 rounded-sm">
            <div className="flex items-center gap-2 mb-1">
              <Users size={14} className="text-neon-cyan" />
              <span className="font-mono text-xs text-muted-foreground tracking-wider uppercase">Tracked Artists</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {radarSummary ? Number(radarSummary.trackedArtistsCount) : 0}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left col: Saved Events + Trip Planner */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Saved Events */}
          <section className="fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2 mb-4">
              <Bookmark size={14} className="text-neon-cyan" />
              <h2 className="font-mono text-sm font-bold tracking-widest uppercase text-foreground">
                Saved Events
              </h2>
              {radarEvents && radarEvents.length > 0 && (
                <span className="font-mono text-xs text-muted-foreground ml-auto">
                  {radarEvents.length} events
                </span>
              )}
            </div>

            {radarLoading ? (
              <div className="flex flex-col gap-2">
                {["sk1", "sk2", "sk3"].map((k) => (
                  <Skeleton key={k} className="h-24 bg-void-200" />
                ))}
              </div>
            ) : !radarEvents || radarEvents.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 border border-void-400 border-dashed rounded-sm">
                <Bookmark size={28} className="text-void-400" strokeWidth={1} />
                <p className="font-mono text-xs text-muted-foreground tracking-wider uppercase text-center">
                  No events saved yet
                </p>
                <button
                  type="button"
                  onClick={onNavigateToDiscover}
                  className="flex items-center gap-1.5 font-mono text-xs text-neon-cyan hover:underline tracking-wider uppercase"
                >
                  Browse events <ChevronRight size={10} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {radarEvents.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    artist={artistMap[event.artistId]}
                    homeCity={homeCity}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Trip Planner */}
          <section className="fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2 mb-4">
              <Plane size={14} className="text-neon-cyan" />
              <h2 className="font-mono text-sm font-bold tracking-widest uppercase text-foreground">
                Plan Your Trip
              </h2>
            </div>
            <div className="p-4 bg-card border border-void-400 rounded-sm">
              <p className="text-xs text-muted-foreground mb-3">
                Enter your home city to generate Skyscanner flight links for each saved event.
              </p>
              <div className="relative max-w-sm">
                <MapPin
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="text"
                  placeholder="e.g. London, New York, Tokyo"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  className="pl-9 bg-void-200 border-void-400 rounded-sm font-mono text-sm placeholder:text-muted-foreground focus-visible:ring-neon-cyan focus-visible:border-neon-cyan"
                />
              </div>
              {homeCity.trim() && (radarEvents?.length ?? 0) > 0 && (
                <p className="mt-2 text-xs text-neon-cyan font-mono">
                  ✓ Flight links will appear below each saved event
                </p>
              )}
              {homeCity.trim() && (radarEvents?.length ?? 0) === 0 && (
                <p className="mt-2 text-xs text-muted-foreground font-mono">
                  Save some events to your radar first
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Right col: Tracked Artists */}
        <div className="flex flex-col gap-4">
          <section className="fade-in" style={{ animationDelay: "0.25s" }}>
            <div className="flex items-center gap-2 mb-4">
              <Users size={14} className="text-neon-cyan" />
              <h2 className="font-mono text-sm font-bold tracking-widest uppercase text-foreground">
                Tracked Artists
              </h2>
              {trackedArtists && trackedArtists.length > 0 && (
                <span className="font-mono text-xs text-muted-foreground ml-auto">
                  {trackedArtists.length}
                </span>
              )}
            </div>

            {trackedLoading ? (
              <div className="flex flex-col gap-2">
                {["sk1", "sk2", "sk3"].map((k) => (
                  <Skeleton key={k} className="h-20 bg-void-200" />
                ))}
              </div>
            ) : !trackedArtists || trackedArtists.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 border border-void-400 border-dashed rounded-sm">
                <Users size={28} className="text-void-400" strokeWidth={1} />
                <p className="font-mono text-xs text-muted-foreground tracking-wider uppercase text-center">
                  No artists tracked
                </p>
                <button
                  type="button"
                  onClick={() => onNavigateToArtist("")}
                  className="flex items-center gap-1.5 font-mono text-xs text-neon-cyan hover:underline tracking-wider uppercase"
                >
                  Browse artists <ChevronRight size={10} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {trackedArtists.map((artistId) => (
                  <TrackedArtistSection
                    key={artistId}
                    artistId={artistId}
                    artists={allArtists ?? []}
                    onNavigateToArtist={onNavigateToArtist}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
