import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";
import type { Artist, Event } from "../backend.d";

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const QUERY_KEYS = {
  artists: ["artists"] as const,
  events: ["events"] as const,
  radarEvents: ["radarEvents"] as const,
  radarSummary: ["radarSummary"] as const,
  trackedArtists: ["trackedArtists"] as const,
  eventsByArtist: (artistId: string) => ["eventsByArtist", artistId] as const,
  isAdmin: ["isAdmin"] as const,
};

// ─── Read Queries ────────────────────────────────────────────────────────────
export function useAllArtists() {
  const { actor, isFetching } = useActor();
  return useQuery<Artist[]>({
    queryKey: QUERY_KEYS.artists,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArtists();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<Event[]>({
    queryKey: QUERY_KEYS.events,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRadarEvents() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Event[]>({
    queryKey: QUERY_KEYS.radarEvents,
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getRadarEvents();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useRadarSummary() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: QUERY_KEYS.radarSummary,
    queryFn: async () => {
      if (!actor || !identity) return null;
      return actor.getRadarSummary();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useTrackedArtists() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<string[]>({
    queryKey: QUERY_KEYS.trackedArtists,
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getTrackedArtists();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useEventsByArtist(artistId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Event[]>({
    queryKey: QUERY_KEYS.eventsByArtist(artistId),
    queryFn: async () => {
      if (!actor || !artistId) return [];
      return actor.getEventsByArtistId(artistId);
    },
    enabled: !!actor && !isFetching && !!artistId,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<boolean>({
    queryKey: QUERY_KEYS.isAdmin,
    queryFn: async () => {
      if (!actor || !identity) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────
export function useAddToRadar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addEventToRadar(eventId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.radarEvents });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.radarSummary });
    },
  });
}

export function useRemoveFromRadar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.removeEventFromRadar(eventId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.radarEvents });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.radarSummary });
    },
  });
}

export function useToggleTrackArtist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (artistId: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.toggleTrackArtist(artistId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedArtists });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.radarSummary });
    },
  });
}

export function useSeedData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const SEED_ARTISTS: Artist[] = [
    { id: "a1", name: "Charlotte de Witte", genre: "Techno", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Charlotte_de_Witte_-_Panorama_Bar_%28Berghain%29_-_2019_%2848786596696%29.jpg/440px-Charlotte_de_Witte_-_Panorama_Bar_%28Berghain%29_-_2019_%2848786596696%29.jpg", bio: "Belgian DJ and producer known for her relentless, hypnotic techno sets." },
    { id: "a2", name: "Amelie Lens", genre: "Techno", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Amelie_Lens_%28Soulwax_Nite%29_at_Extrema_Outdoor_2019.jpg/440px-Amelie_Lens_%28Soulwax_Nite%29_at_Extrema_Outdoor_2019.jpg", bio: "Belgian techno DJ and producer, founder of Exhale Records." },
    { id: "a3", name: "Sven Väth", genre: "Techno", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sven_V%C3%A4th_in_Chicago.jpg/440px-Sven_V%C3%A4th_in_Chicago.jpg", bio: "German DJ and producer, founder of Cocoon Recordings and Cocoon Club." },
    { id: "a4", name: "Richie Hawtin", genre: "Minimal Techno", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Richie_Hawtin_2010.jpg/440px-Richie_Hawtin_2010.jpg", bio: "Pioneer of minimal techno and electronic music innovator." },
    { id: "a5", name: "Nina Kraviz", genre: "Techno/House", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Nina_Kraviz_-_Melt_Festival_2013_-_3.jpg/440px-Nina_Kraviz_-_Melt_Festival_2013_-_3.jpg", bio: "Russian DJ, producer and vocalist, founder of трип label." },
    { id: "a6", name: "Ben Klock", genre: "Techno", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Ben_Klock_2013.jpg/440px-Ben_Klock_2013.jpg", bio: "Berlin-based DJ and Berghain resident known for his deep, hypnotic techno." },
    { id: "a8", name: "Jeff Mills", genre: "Techno", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Jeff_Mills_2014.jpg/440px-Jeff_Mills_2014.jpg", bio: "Detroit techno pioneer and Axis Records founder." },
  ];

  const SEED_EVENTS: Event[] = [
    { id: "e1", title: "Awakenings Festival 2026", artistId: "a1", venue: "Spaarnwoude", city: "Amsterdam", date: "2026-06-27", ticketUrl: "https://www.residentadvisor.net/events/", source: "Resident Advisor" },
    { id: "e2", title: "Exhale @ Fabric", artistId: "a2", venue: "Fabric", city: "London", date: "2026-03-15", ticketUrl: "https://www.bandsintown.com/", source: "Bandsintown" },
    { id: "e3", title: "Cocoon Ibiza Opening", artistId: "a3", venue: "Amnesia", city: "Ibiza", date: "2026-05-30", ticketUrl: "https://www.festicket.com/", source: "Festicket" },
    { id: "e4", title: "ENTER. Ibiza 2026", artistId: "a4", venue: "Space", city: "Ibiza", date: "2026-07-04", ticketUrl: "https://www.residentadvisor.net/events/", source: "Resident Advisor" },
    { id: "e5", title: "трип Night", artistId: "a5", venue: "Berghain", city: "Berlin", date: "2026-04-11", ticketUrl: "https://www.bandsintown.com/", source: "Bandsintown" },
    { id: "e6", title: "Klockworks @ Fabric", artistId: "a6", venue: "Fabric", city: "London", date: "2026-04-25", ticketUrl: "https://www.residentadvisor.net/events/", source: "Resident Advisor" },
    { id: "e8", title: "Movement Detroit 2026", artistId: "a8", venue: "Hart Plaza", city: "Detroit", date: "2026-05-23", ticketUrl: "https://www.residentadvisor.net/events/", source: "Resident Advisor" },
    { id: "e9", title: "Charlotte de Witte @ Rex Club", artistId: "a1", venue: "Rex Club", city: "Paris", date: "2026-03-21", ticketUrl: "https://www.residentadvisor.net/events/", source: "Resident Advisor" },
    { id: "e10", title: "Berghain Resident Night", artistId: "a6", venue: "Berghain", city: "Berlin", date: "2026-05-09", ticketUrl: "https://www.bandsintown.com/", source: "Bandsintown" },
  ];

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await Promise.all([
        actor.seedArtists(SEED_ARTISTS),
        actor.seedEvents(SEED_EVENTS),
      ]);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.artists });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events });
    },
  });
}
