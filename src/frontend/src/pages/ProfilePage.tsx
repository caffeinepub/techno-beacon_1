import { useState } from "react";
import { MapPin, Radio, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LS_HOME_CITY = "techno-beacon-home-city";

function readHomeCity(): string {
  try {
    return localStorage.getItem(LS_HOME_CITY) ?? "";
  } catch {
    return "";
  }
}

function writeHomeCity(city: string): void {
  try {
    localStorage.setItem(LS_HOME_CITY, city);
  } catch {
    // ignore
  }
}

export function ProfilePage() {
  const [homeCity, setHomeCity] = useState<string>(readHomeCity);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    writeHomeCity(homeCity);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Radio size={12} className="text-neon-cyan beacon-pulse" />
          <span className="font-mono text-xs tracking-widest uppercase text-neon-cyan">
            Settings
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          MY <span className="text-neon-cyan text-glow-cyan">PROFILE</span>
        </h1>
      </div>

      {/* Home city section */}
      <section
        className="flex flex-col gap-4 p-5 bg-void-100 border border-void-400 mb-6 fade-in"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-neon-cyan" />
          <h2 className="font-mono text-sm font-bold tracking-widest uppercase text-foreground">
            Home City
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="profile-home-city"
            className="font-mono text-xs text-muted-foreground"
          >
            Used for trip planning flight estimates
          </label>
          <div className="flex gap-2">
            <Input
              id="profile-home-city"
              type="text"
              value={homeCity}
              onChange={(e) => {
                setHomeCity(e.target.value);
                setSaved(false);
              }}
              placeholder="e.g. London, UK"
              className="bg-void-200 border-void-400 rounded-none font-mono text-sm placeholder:text-muted-foreground focus-visible:ring-neon-cyan focus-visible:border-neon-cyan flex-1"
            />
            <Button
              onClick={handleSave}
              className={`shrink-0 rounded-none font-mono text-xs tracking-widest uppercase h-10 px-4 transition-all duration-200 ${
                saved
                  ? "bg-neon-cyan/20 border border-neon-cyan/60 text-neon-cyan"
                  : "bg-neon-cyan text-void hover:bg-neon-cyan/90"
              }`}
            >
              {saved ? (
                <>
                  <Check size={12} className="mr-1.5" />
                  SAVED!
                </>
              ) : (
                "SAVE"
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/60 font-mono">
            Stored locally on your device — never sent to any server.
          </p>
        </div>
      </section>

      {/* About section */}
      <section
        className="flex flex-col gap-3 p-5 bg-void-100 border border-void-400 fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-neon-cyan" />
          <h2 className="font-mono text-sm font-bold tracking-widest uppercase text-foreground">
            About Techno Beacon
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Techno Beacon tracks live performances from the true pioneers of techno — no filler, no
          mainstream fluff. Nine legends, curated gigs, real dates.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Select the artists you care about, browse their upcoming events chronologically, and plan
          your trips directly from the app. Event data sourced from Resident Advisor.
        </p>
        <div className="pt-2 border-t border-void-400">
          <p className="font-mono text-xs text-muted-foreground/60 italic">
            Events from RA/Bandsintown – dates may change. Always verify before booking.
          </p>
        </div>
      </section>
    </main>
  );
}
