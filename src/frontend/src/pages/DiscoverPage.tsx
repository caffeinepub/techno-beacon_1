import { useEffect, useRef } from "react";
import { Loader2, Radio, Zap } from "lucide-react";
import { EventCard } from "../components/EventCard";
import {
  useAllArtists,
  useAllEvents,
  useRadarEvents,
  useAddToRadar,
  useRemoveFromRadar,
  useIsAdmin,
  useSeedData,
} from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { toast } from "sonner";
import type { Artist } from "../backend.d";

interface DiscoverPageProps {
  onViewArtist: (artistId: string) => void;
}

export function DiscoverPage({ onViewArtist }: DiscoverPageProps) {
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: events, isLoading: eventsLoading } = useAllEvents();
  const { data: artists, isLoading: artistsLoading } = useAllArtists();
  const { data: radarEvents } = useRadarEvents();
  const { data: isAdmin } = useIsAdmin();
  const seedData = useSeedData();
  const addToRadar = useAddToRadar();
  const removeFromRadar = useRemoveFromRadar();

  const seededRef = useRef(false);

  // Seed data if admin and no events exist
  useEffect(() => {
    if (
      !seededRef.current &&
      isAdmin &&
      events !== undefined &&
      artists !== undefined &&
      events.length === 0 &&
      artists.length === 0
    ) {
      seededRef.current = true;
      seedData.mutate(undefined, {
        onSuccess: () => toast.success("Seeded artists and events"),
        onError: () => toast.error("Failed to seed data"),
      });
    }
  }, [isAdmin, events, artists, seedData]);

  const artistMap = (artists ?? []).reduce<Record<string, Artist>>(
    (acc, a) => ({ ...acc, [a.id]: a }),
    {},
  );

  const radarEventIds = new Set((radarEvents ?? []).map((e) => e.id));
  const loadingRadarIds = new Set<string>();

  function handleAddToRadar(eventId: string) {
    addToRadar.mutate(eventId, {
      onError: () => toast.error("Failed to add event to radar"),
    });
  }

  function handleRemoveFromRadar(eventId: string) {
    removeFromRadar.mutate(eventId, {
      onError: () => toast.error("Failed to remove event from radar"),
    });
  }

  const isLoading = eventsLoading || artistsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Radio size={32} className="text-neon-cyan beacon-pulse" strokeWidth={1} />
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 size={14} className="animate-spin" />
          <span className="font-mono text-sm tracking-widest uppercase">Scanning frequencies...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-10 fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={12} className="text-neon-cyan" />
          <span className="font-mono text-xs tracking-widest uppercase text-neon-cyan">
            Live Frequencies
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          Upcoming techno events
          <br />
          <span className="text-neon-cyan text-glow-cyan">worldwide</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl">
          Discover the finest underground techno events across the globe. Add them to your radar to never miss a set.
        </p>
        {events && events.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            <span className="font-mono text-xs text-muted-foreground tracking-wider">
              {events.length} events detected
            </span>
          </div>
        )}
      </div>

      {/* Seeding indicator */}
      {seedData.isPending && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-sm">
          <Loader2 size={12} className="text-neon-cyan animate-spin" />
          <span className="font-mono text-xs text-neon-cyan tracking-wider">
            Initializing beacon data...
          </span>
        </div>
      )}

      {/* Events grid */}
      {(!events || events.length === 0) && !seedData.isPending ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Radio size={48} className="text-void-400" strokeWidth={1} />
          <p className="font-mono text-sm text-muted-foreground tracking-wider uppercase text-center">
            No signals detected
          </p>
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            {isAdmin ? "Data will be initialized shortly." : "No events found. Check back later."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(events ?? []).map((event, i) => (
            <EventCard
              key={event.id}
              event={event}
              artist={artistMap[event.artistId]}
              isInRadar={radarEventIds.has(event.id)}
              isLoggedIn={isLoggedIn}
              onAddToRadar={handleAddToRadar}
              onRemoveFromRadar={handleRemoveFromRadar}
              isLoading={loadingRadarIds.has(event.id)}
              animationIndex={i}
              onViewArtist={onViewArtist}
            />
          ))}
        </div>
      )}
    </main>
  );
}
