import { Radio, UserPlus, UserMinus, Loader2, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Artist } from "../backend.d";

interface ArtistCardProps {
  artist: Artist;
  isFollowing: boolean;
  isLoggedIn: boolean;
  onToggleFollow: (artistId: string) => void;
  isLoading?: boolean;
  animationIndex?: number;
  onViewEvents?: (artistId: string) => void;
}

export function ArtistCard({
  artist,
  isFollowing,
  isLoggedIn,
  onToggleFollow,
  isLoading = false,
  animationIndex = 0,
  onViewEvents,
}: ArtistCardProps) {
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
      {/* Artist Image */}
      <div className="relative h-40 bg-void-200 overflow-hidden">
        {artist.imageUrl ? (
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Radio size={36} className="text-neon-cyan/30" strokeWidth={1} />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

        {/* Following indicator */}
        {isFollowing && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-neon-cyan/20 border border-neon-cyan/40 rounded-none">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            <span className="font-mono text-xs text-neon-cyan tracking-wider">TRACKING</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        {/* Name + Genre */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-foreground leading-tight group-hover:text-neon-cyan transition-colors duration-200 line-clamp-2">
            {artist.name}
          </h3>
          <Badge
            variant="outline"
            className="font-mono text-xs px-2 py-0.5 rounded-none bg-void-200 text-muted-foreground border-void-400 shrink-0 whitespace-nowrap"
          >
            {artist.genre}
          </Badge>
        </div>

        {/* Bio */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {artist.bio}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 px-4 pb-4 pt-2 border-t border-void-400/50 mt-auto">
        <button
          type="button"
          onClick={() => onViewEvents?.(artist.id)}
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-neon-cyan transition-colors duration-200 uppercase tracking-wider"
        >
          <Music size={10} />
          View Events
        </button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!isLoggedIn || isLoading}
                  onClick={() => onToggleFollow(artist.id)}
                  className={`h-7 px-3 rounded-none font-mono text-xs tracking-wider uppercase transition-all duration-200 ${
                    isFollowing
                      ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40"
                      : "bg-void-200 text-muted-foreground border-void-400 hover:bg-neon-cyan/10 hover:text-neon-cyan hover:border-neon-cyan/40"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={10} className="animate-spin mr-1" />
                  ) : isFollowing ? (
                    <UserMinus size={10} className="mr-1" />
                  ) : (
                    <UserPlus size={10} className="mr-1" />
                  )}
                  {isFollowing ? "UNFOLLOW" : "FOLLOW"}
                </Button>
              </span>
            </TooltipTrigger>
            {!isLoggedIn && (
              <TooltipContent
                side="top"
                className="font-mono text-xs bg-void-200 border-void-400 text-foreground"
              >
                Please log in to follow artists
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
