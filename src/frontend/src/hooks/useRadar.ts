import { useState, useCallback } from "react";
import type { StaticEvent } from "../data/events";

const LS_RADAR_KEY = "techno-beacon-radar-events";

function readRadar(): StaticEvent[] {
  try {
    const raw = localStorage.getItem(LS_RADAR_KEY);
    return raw ? (JSON.parse(raw) as StaticEvent[]) : [];
  } catch {
    return [];
  }
}

function writeRadar(events: StaticEvent[]): void {
  try {
    localStorage.setItem(LS_RADAR_KEY, JSON.stringify(events));
  } catch {
    // ignore
  }
}

export function useRadar() {
  const [radarEvents, setRadarEvents] = useState<StaticEvent[]>(readRadar);

  const addToRadar = useCallback((event: StaticEvent) => {
    setRadarEvents((prev) => {
      if (prev.find((e) => e.id === event.id)) return prev;
      const next = [...prev, event].sort((a, b) => a.date.localeCompare(b.date));
      writeRadar(next);
      return next;
    });
  }, []);

  const removeFromRadar = useCallback((eventId: string) => {
    setRadarEvents((prev) => {
      const next = prev.filter((e) => e.id !== eventId);
      writeRadar(next);
      return next;
    });
  }, []);

  const isOnRadar = useCallback(
    (eventId: string) => {
      return radarEvents.some((e) => e.id === eventId);
    },
    [radarEvents],
  );

  return { radarEvents, addToRadar, removeFromRadar, isOnRadar };
}
