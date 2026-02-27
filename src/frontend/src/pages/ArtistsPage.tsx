import { useState, useMemo } from "react";
import { Loader2, Radio, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ArtistCard } from "../components/ArtistCard";
import {
  useAllArtists,
  useAllEvents,
  useTrackedArtists,
  useToggleTrackArtist,
} from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { toast } from "sonner";

interface ArtistsPageProps {
  onViewEvents: (artistId: string) => void;
  highlightArtistId?: string | null;
}

export function ArtistsPage({ onViewEvents, highlightArtistId }: ArtistsPageProps) {
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const [search, setSearch] = useState("");
  const { data: artists, isLoading: artistsLoading } = useAllArtists();
  const { data: allEvents } = useAllEvents();
  const { data: trackedArtists } = useTrackedArtists();
  const toggleTrackArtist = useToggleTrackArtist();

  const trackedSet = new Set(trackedArtists ?? []);
  const pendingSet = new Set<string>();

  const filteredArtists = useMemo(() => {
    if (!artists) return [];
    const q = search.trim().toLowerCase();
    if (!q) return artists;
    return artists.filter(
      (a) =>
        a.name.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q),
    );
  }, [artists, search]);

  function handleToggleFollow(artistId: string) {
    toggleTrackArtist.mutate(artistId, {
      onError: () =>
        toast.error(
          trackedSet.has(artistId)
            ? "Failed to unfollow artist"
            : "Failed to follow artist",
        ),
    });
  }

  // Event counts per artist for display
  const eventCountByArtist = useMemo(() => {
    if (!allEvents) return {} as Record<string, number>;
    return allEvents.reduce<Record<string, number>>((acc, e) => {
      acc[e.artistId] = (acc[e.artistId] ?? 0) + 1;
      return acc;
    }, {});
  }, [allEvents]);

  if (artistsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Radio size={32} className="text-neon-cyan beacon-pulse" strokeWidth={1} />
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 size={14} className="animate-spin" />
          <span className="font-mono text-sm tracking-widest uppercase">
            Loading artists...
          </span>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Users size={12} className="text-neon-cyan" />
          <span className="font-mono text-xs tracking-widest uppercase text-neon-cyan">
            Artist Roster
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          All <span className="text-neon-cyan text-glow-cyan">Artists</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl">
          Follow your favourite techno artists to track their upcoming events in your radar.
        </p>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            <span className="font-mono text-xs text-muted-foreground tracking-wider">
              {artists?.length ?? 0} artists
            </span>
          </div>
          {trackedSet.size > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-violet" />
              <span className="font-mono text-xs text-muted-foreground tracking-wider">
                {trackedSet.size} tracked
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-sm fade-in" style={{ animationDelay: "0.1s" }}>
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="text"
          placeholder="Search artists, genres..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-void-200 border-void-400 rounded-sm font-mono text-sm placeholder:text-muted-foreground focus-visible:ring-neon-cyan focus-visible:border-neon-cyan"
        />
      </div>

      {/* Artist grid */}
      {filteredArtists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Radio size={48} className="text-void-400" strokeWidth={1} />
          <p className="font-mono text-sm text-muted-foreground tracking-wider uppercase">
            {search ? "No artists match your search" : "No artists found"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredArtists.map((artist, i) => (
            <div
              key={artist.id}
              className={highlightArtistId === artist.id ? "ring-1 ring-neon-cyan rounded-sm" : ""}
            >
              <ArtistCard
                artist={{ ...artist, bio: artist.bio + (eventCountByArtist[artist.id] ? ` (${eventCountByArtist[artist.id]} upcoming events)` : "") }}
                isFollowing={trackedSet.has(artist.id)}
                isLoggedIn={isLoggedIn}
                onToggleFollow={handleToggleFollow}
                isLoading={pendingSet.has(artist.id)}
                animationIndex={i}
                onViewEvents={onViewEvents}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
