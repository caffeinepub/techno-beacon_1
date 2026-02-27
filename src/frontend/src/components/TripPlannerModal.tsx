import { useState, useEffect } from "react";
import { Plane, Hotel, DollarSign, Calendar, MapPin, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LEGEND_MAP } from "../data/legends";
import type { StaticEvent } from "../data/events";

const LS_HOME_CITY = "techno-beacon-home-city";

function getDayAfter(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
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

function getCostEstimate(city: string, country: string): string {
  const c = (city + " " + country).toLowerCase();
  if (c.includes("usa") || c.includes("canada") || c.includes("new york") || c.includes("chicago") || c.includes("los angeles") || c.includes("miami") || c.includes("toronto") || c.includes("montreal") || c.includes("san francisco") || c.includes("washington") || c.includes("detroit")) {
    return "~£500–900 from UK";
  }
  if (c.includes("south africa") || c.includes("johannesburg") || c.includes("cape town")) {
    return "~£600–1,000 from UK";
  }
  if (c.includes("brazil") || c.includes("colombia") || c.includes("sao paulo") || c.includes("bogota") || c.includes("medellin")) {
    return "~£700–1,200 from UK";
  }
  if (c.includes("uk") || c.includes("london") || c.includes("brighton") || c.includes("cardiff") || c.includes("edinburgh")) {
    return "~£50–200 within UK";
  }
  // Europe
  if (c.includes("germany") || c.includes("amsterdam") || c.includes("netherlands") || c.includes("paris") || c.includes("france") || c.includes("belgium") || c.includes("brussels") || c.includes("spain") || c.includes("sevilla") || c.includes("luxembourg") || c.includes("mannheim") || c.includes("munich") || c.includes("berlin") || c.includes("ostend") || c.includes("lyon") || c.includes("strasbourg") || c.includes("iceland")) {
    return "~£200–500 from UK";
  }
  if (c.includes("malta")) {
    return "~£200–450 from UK";
  }
  return "~£300–800 from UK";
}

interface TripPlannerModalProps {
  event: StaticEvent | null;
  onClose: () => void;
  defaultHomeCity?: string;
}

export function TripPlannerModal({ event, onClose, defaultHomeCity = "London, UK" }: TripPlannerModalProps) {
  const [homeCity, setHomeCity] = useState<string>(() => {
    try {
      return localStorage.getItem(LS_HOME_CITY) ?? defaultHomeCity;
    } catch {
      return defaultHomeCity;
    }
  });

  useEffect(() => {
    if (defaultHomeCity && defaultHomeCity !== "London, UK") {
      setHomeCity(defaultHomeCity);
    }
  }, [defaultHomeCity]);

  function handleHomeCityChange(value: string) {
    setHomeCity(value);
    try {
      localStorage.setItem(LS_HOME_CITY, value);
    } catch {
      // ignore
    }
  }

  if (!event) return null;

  const legend = LEGEND_MAP[event.legendId];
  const dayBefore = getDayBefore(event.date);
  const dayAfter = getDayAfter(event.date);
  const costEstimate = getCostEstimate(event.city, event.country);

  const googleFlightsUrl = `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(homeCity)}+to+${encodeURIComponent(event.city)}+on+${event.date}`;
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(event.city)}&checkin=${event.date}&checkout=${dayAfter}`;

  return (
    <Dialog open={!!event} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-lg w-full bg-void-100 border border-void-400 rounded-none p-0 overflow-hidden"
        style={{ boxShadow: "0 0 40px oklch(0 0 0 / 0.8)" }}
      >
        {/* Header bar with legend color */}
        {legend && (
          <div
            className="h-1 w-full"
            style={{ backgroundColor: legend.color }}
          />
        )}

        <DialogHeader className="px-5 pt-4 pb-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="font-bold text-lg text-foreground leading-tight">
                Plan Your Trip to{" "}
                <span style={{ color: legend?.color ?? "oklch(0.78 0.16 200)" }}>
                  {event.city}
                </span>
              </DialogTitle>
              <p className="mt-1 text-xs text-muted-foreground font-mono">
                {event.venue} · {formatDate(event.date)}
              </p>
              {event.title && (
                <p className="text-xs text-muted-foreground/70 italic">{event.title}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-1 p-1.5 border border-void-400 text-muted-foreground hover:text-foreground hover:border-void-300 transition-colors duration-150"
            >
              <X size={14} />
            </button>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-0 px-5 pt-4 pb-5">
          {/* Home city input */}
          <div className="flex flex-col gap-1.5 mb-5">
            <label
              htmlFor="trip-home-city"
              className="font-mono text-xs tracking-widest uppercase text-muted-foreground flex items-center gap-1.5"
            >
              <MapPin size={10} />
              YOUR HOME CITY
            </label>
            <Input
              id="trip-home-city"
              type="text"
              value={homeCity}
              onChange={(e) => handleHomeCityChange(e.target.value)}
              placeholder="e.g. London, UK"
              className="bg-void-200 border-void-400 rounded-none font-mono text-sm placeholder:text-muted-foreground focus-visible:ring-neon-cyan focus-visible:border-neon-cyan"
            />
            <p className="text-[10px] text-muted-foreground/60 font-mono">
              Used for flight links and cost estimates
            </p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-4">
            {/* Flights */}
            <section className="flex flex-col gap-2">
              <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                <Plane size={10} className="text-neon-cyan" />
                FLIGHTS
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: `Fly out (${dayBefore})`, date: dayBefore },
                  { label: `Event day (${event.date})`, date: event.date },
                  { label: `Return (${dayAfter})`, date: dayAfter },
                ].map(({ label, date }) => {
                  const gFlightsHref = `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(homeCity)}+to+${encodeURIComponent(event.city)}+on+${date}`;
                  const dateYYMMDD = date.slice(2).replace(/-/g, "");
                  const fromEnc = encodeURIComponent(homeCity.toLowerCase().replace(/,\s*/g, "-").replace(/\s+/g, "-"));
                  const toEnc = encodeURIComponent(event.city.toLowerCase().replace(/\s+/g, "-"));
                  const skyscannerHref = `https://www.skyscanner.net/transport/flights/${fromEnc}/${toEnc}/${dateYYMMDD}/`;

                  return (
                    <div key={date} className="flex flex-col gap-1">
                      <p className="font-mono text-[10px] text-muted-foreground/70 tracking-wider uppercase px-1">
                        {label}
                      </p>
                      <div className="flex gap-1.5">
                        <a
                          href={gFlightsHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-between gap-2 px-3 py-2 border border-void-400 bg-void-200 hover:border-neon-cyan/40 hover:bg-neon-cyan/5 transition-all duration-150 group"
                        >
                          <span className="font-mono text-xs text-muted-foreground group-hover:text-neon-cyan transition-colors duration-150">
                            Google Flights
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground/50 group-hover:text-neon-cyan/60 transition-colors duration-150">
                            ↗
                          </span>
                        </a>
                        <a
                          href={skyscannerHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-between gap-2 px-3 py-2 border border-void-400 bg-void-200 hover:border-neon-green/40 hover:bg-neon-green/5 transition-all duration-150 group"
                        >
                          <span className="font-mono text-xs text-muted-foreground group-hover:text-neon-green transition-colors duration-150">
                            Skyscanner
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground/50 group-hover:text-neon-green/60 transition-colors duration-150">
                            ↗
                          </span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Hotels */}
            <section className="flex flex-col gap-2">
              <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                <Hotel size={10} className="text-neon-cyan" />
                HOTELS
              </h3>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 px-3 py-2 border border-void-400 bg-void-200 hover:border-neon-cyan/40 hover:bg-neon-cyan/5 transition-all duration-150 group"
              >
                <span className="font-mono text-xs text-muted-foreground group-hover:text-neon-cyan transition-colors duration-150">
                  Hotels near {event.venue}, {event.city}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground/50 group-hover:text-neon-cyan/60 transition-colors duration-150">
                  Booking.com ↗
                </span>
              </a>
            </section>

            {/* Cost estimate */}
            <section className="flex flex-col gap-2">
              <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                <DollarSign size={10} className="text-neon-cyan" />
                ESTIMATED COST
              </h3>
              <div className="flex items-center gap-3 px-3 py-2 border border-void-400 bg-void-200">
                <span
                  className="font-bold text-lg"
                  style={{ color: legend?.color ?? "oklch(0.78 0.16 200)" }}
                >
                  {costEstimate}
                </span>
                <span className="font-mono text-xs text-muted-foreground/60">
                  flights + hotel rough estimate
                </span>
              </div>
            </section>

            {/* Basic itinerary */}
            <section className="flex flex-col gap-2">
              <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                <Calendar size={10} className="text-neon-cyan" />
                ITINERARY OUTLINE
              </h3>
              <div className="flex flex-col gap-0 border border-void-400 bg-void-200 overflow-hidden">
                {[
                  { day: formatDate(dayBefore), key: "before", action: "Fly out from " + homeCity + " · Hotel check-in" },
                  { day: formatDate(event.date), key: "event", action: `${event.venue} · ${event.title || (legend?.name ?? "") + " live"}` },
                  { day: formatDate(dayAfter), key: "after", action: "Fly home · Debrief" },
                ].map(({ day, key, action }) => (
                  <div
                    key={key}
                    className="flex gap-3 items-start px-3 py-2 border-b border-void-400 last:border-0"
                  >
                    <span className="font-mono text-[10px] text-muted-foreground/60 w-24 shrink-0 pt-0.5">
                      {day}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{action}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Close */}
          <Button
            onClick={onClose}
            className="mt-5 w-full rounded-none font-mono text-xs tracking-widest uppercase h-10 bg-void-300 border border-void-400 text-muted-foreground hover:bg-void-400 hover:text-foreground transition-all duration-150"
          >
            CLOSE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
