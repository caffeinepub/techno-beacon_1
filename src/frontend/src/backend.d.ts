import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RadarSummary {
    trackedArtistsCount: bigint;
    savedEventsCount: bigint;
}
export interface Artist {
    id: string;
    bio: string;
    name: string;
    imageUrl: string;
    genre: string;
}
export interface UserProfile {
    name: string;
}
export interface Event {
    id: string;
    title: string;
    source: string;
    venue: string;
    city: string;
    date: string;
    artistId: string;
    ticketUrl: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEventToRadar(eventId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllArtists(): Promise<Array<Artist>>;
    getAllEvents(): Promise<Array<Event>>;
    getArtistById(id: string): Promise<Artist | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEventsByArtistId(artistId: string): Promise<Array<Event>>;
    getEventsByTrackedArtists(): Promise<Array<Event>>;
    getRadarEvents(): Promise<Array<Event>>;
    getRadarSummary(): Promise<RadarSummary>;
    getTrackedArtists(): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeEventFromRadar(eventId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedArtists(artists: Array<Artist>): Promise<void>;
    seedEvents(events: Array<Event>): Promise<void>;
    toggleTrackArtist(artistId: string): Promise<void>;
}
