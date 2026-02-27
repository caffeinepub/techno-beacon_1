import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Button } from "@/components/ui/button";
import { Radio, LogIn, LogOut, Loader2, User } from "lucide-react";

export type Page = "home" | "events" | "radar" | "profile";

interface NavBarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_PAGES: { id: Page; label: string }[] = [
  { id: "home", label: "HOME" },
  { id: "events", label: "EVENTS" },
  { id: "radar", label: "RADAR" },
  { id: "profile", label: "PROFILE" },
];

export function NavBar({ currentPage, onNavigate }: NavBarProps) {
  const { identity, login, clear, isLoggingIn, isInitializing } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-4)}`
    : null;

  return (
    <header className="sticky top-0 z-50 border-b border-void-400 bg-void/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 group shrink-0"
          aria-label="Go to Home"
        >
          <Radio
            size={18}
            className="text-neon-cyan beacon-pulse"
            strokeWidth={1.5}
          />
          <span className="font-mono text-sm font-bold tracking-[0.2em] uppercase text-foreground group-hover:text-neon-cyan transition-colors duration-200 text-glow-cyan">
            TECHNO BEACON
          </span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_PAGES.map(({ id, label }) => (
            <button
              type="button"
              key={id}
              onClick={() => onNavigate(id)}
              className={`px-3 py-1.5 font-mono text-xs tracking-widest uppercase transition-all duration-200 rounded-sm ${
                currentPage === id
                  ? "text-neon-cyan"
                  : "text-muted-foreground hover:text-neon-cyan"
              }`}
              style={
                currentPage === id
                  ? { textShadow: "0 0 12px oklch(0.78 0.16 200 / 0.5)" }
                  : undefined
              }
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Auth + Mobile Nav dots */}
        <div className="flex items-center gap-2">
          {/* Mobile page indicator dots */}
          <div className="sm:hidden flex gap-1">
            {NAV_PAGES.map(({ id }) => (
              <button
                type="button"
                key={id}
                onClick={() => onNavigate(id)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  currentPage === id
                    ? "bg-neon-cyan"
                    : "bg-void-400 hover:bg-muted-foreground"
                }`}
                aria-label={id}
              />
            ))}
          </div>

          {isInitializing ? (
            <div className="w-8 h-8 flex items-center justify-center">
              <Loader2 size={14} className="text-muted-foreground animate-spin" />
            </div>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-sm bg-void-200 border border-void-400">
                <User size={10} className="text-neon-cyan" />
                <span className="font-mono text-xs text-muted-foreground">
                  {shortPrincipal}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-3 rounded-sm"
              >
                <LogOut size={12} className="mr-1.5" />
                <span className="hidden sm:inline">LOGOUT</span>
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="font-mono text-xs tracking-widest uppercase h-8 px-4 rounded-sm bg-neon-cyan text-void hover:bg-neon-cyan/90 transition-all duration-200"
              style={{
                boxShadow: isLoggingIn ? undefined : "0 0 12px oklch(0.78 0.16 200 / 0.4)",
              }}
            >
              {isLoggingIn ? (
                <Loader2 size={12} className="animate-spin mr-1.5" />
              ) : (
                <LogIn size={12} className="mr-1.5" />
              )}
              {isLoggingIn ? "CONNECTING..." : "LOGIN"}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Nav — full labels */}
      <div className="sm:hidden border-t border-void-400 flex">
        {NAV_PAGES.map(({ id, label }) => (
          <button
            type="button"
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex-1 py-2 font-mono text-xs tracking-wider uppercase transition-all duration-200 ${
              currentPage === id
                ? "text-neon-cyan border-b border-neon-cyan"
                : "text-muted-foreground hover:text-foreground border-b border-transparent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
