import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { NavBar } from "./components/NavBar";
import type { Page } from "./components/NavBar";
import { LegendsSelectorPage } from "./pages/LegendsSelectorPage";
import { EventsFeedPage } from "./pages/EventsFeedPage";
import { RadarPage } from "./pages/RadarPage";
import { ProfilePage } from "./pages/ProfilePage";
import { TripPlannerModal } from "./components/TripPlannerModal";
import { Heart } from "lucide-react";
import type { StaticEvent } from "./data/events";

const LS_SELECTED_LEGENDS = "techno-beacon-selected-legends";
const LS_HOME_CITY = "techno-beacon-home-city";

function readSelectedLegends(): string[] {
  try {
    const raw = localStorage.getItem(LS_SELECTED_LEGENDS);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function writeSelectedLegends(ids: string[]): void {
  try {
    localStorage.setItem(LS_SELECTED_LEGENDS, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

function readHomeCity(): string {
  try {
    return localStorage.getItem(LS_HOME_CITY) ?? "London, UK";
  } catch {
    return "London, UK";
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedLegendIds, setSelectedLegendIds] = useState<string[]>(readSelectedLegends);
  const [planTripEvent, setPlanTripEvent] = useState<StaticEvent | null>(null);
  const [homeCity, setHomeCity] = useState<string>(readHomeCity);

  // Sync homeCity from localStorage whenever profile page writes it
  useEffect(() => {
    function syncHomeCity() {
      setHomeCity(readHomeCity());
    }
    window.addEventListener("storage", syncHomeCity);
    return () => window.removeEventListener("storage", syncHomeCity);
  }, []);

  function handleToggleLegend(id: string) {
    setSelectedLegendIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeSelectedLegends(next);
      return next;
    });
  }

  function handleNavigateToEvents() {
    setCurrentPage("events");
  }

  // Refresh homeCity when navigating away from profile
  function handleNavigate(page: Page) {
    if (currentPage === "profile") {
      setHomeCity(readHomeCity());
    }
    setCurrentPage(page);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar currentPage={currentPage} onNavigate={handleNavigate} />

      <div className="flex-1">
        {currentPage === "home" && (
          <LegendsSelectorPage
            selectedLegendIds={selectedLegendIds}
            onToggleLegend={handleToggleLegend}
            onNavigateToEvents={handleNavigateToEvents}
          />
        )}
        {currentPage === "events" && (
          <EventsFeedPage
            selectedLegendIds={selectedLegendIds}
            onPlanTrip={(event) => setPlanTripEvent(event)}
            homeCity={homeCity}
          />
        )}
        {currentPage === "radar" && (
          <RadarPage
            onNavigateToArtist={() => {
              // Navigate to home for now (discover is removed from nav)
              setCurrentPage("home");
            }}
            onNavigateToDiscover={() => setCurrentPage("events")}
          />
        )}
        {currentPage === "profile" && (
          <ProfilePage key="profile" />
        )}
      </div>

      {/* Trip Planner Modal */}
      <TripPlannerModal
        event={planTripEvent}
        onClose={() => setPlanTripEvent(null)}
        defaultHomeCity={homeCity}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-void-400 bg-void/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs text-muted-foreground tracking-wider">
            © 2026 Techno Beacon. Built with{" "}
            <Heart
              size={10}
              className="inline text-neon-red fill-neon-red mx-0.5"
            />{" "}
            using{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.residentadvisor.net"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground hover:text-neon-cyan transition-colors duration-200 tracking-wider"
            >
              Resident Advisor
            </a>
            <a
              href="https://www.bandsintown.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground hover:text-neon-violet transition-colors duration-200 tracking-wider"
            >
              Bandsintown
            </a>
          </div>
        </div>
      </footer>

      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "bg-void-200 border border-void-400 text-foreground font-mono text-xs",
            success: "border-neon-cyan/40 text-neon-cyan",
            error: "border-destructive/40 text-destructive",
          },
        }}
      />
    </div>
  );
}
