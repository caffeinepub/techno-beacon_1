export interface StaticEvent {
  id: string;
  legendId: string;
  title: string;
  venue: string;
  city: string;
  country: string;
  date: string; // YYYY-MM-DD
  source: string; // "RA"
  ticketUrl: string;
}

const makeTicketUrl = (legendName: string) =>
  `https://ra.co/search?q=${encodeURIComponent(legendName)}`;

export const STATIC_EVENTS: StaticEvent[] = [
  // ── Richie Hawtin ────────────────────────────────────────────────────────
  { id: "richie-hawtin-0",  legendId: "richie-hawtin", title: "Detroit Love Day 1 / Weekend Pass",  venue: "BERHTA",                        city: "Washington DC",  country: "USA",         date: "2026-02-27", source: "RA", ticketUrl: makeTicketUrl("Richie Hawtin") },
  { id: "richie-hawtin-1",  legendId: "richie-hawtin", title: "",                                    venue: "Knockdown Center",               city: "New York City",  country: "USA",         date: "2026-02-28", source: "RA", ticketUrl: makeTicketUrl("Richie Hawtin") },
  { id: "richie-hawtin-2",  legendId: "richie-hawtin", title: "Skyline Festival 2026",              venue: "Ace*Mission Studios",            city: "Los Angeles",    country: "USA",         date: "2026-02-28", source: "RA", ticketUrl: makeTicketUrl("Richie Hawtin") },
  { id: "richie-hawtin-3",  legendId: "richie-hawtin", title: "The Wall of Sound",                  venue: "Lofi",                           city: "Amsterdam",      country: "Netherlands", date: "2026-03-07", source: "RA", ticketUrl: makeTicketUrl("Richie Hawtin") },
  { id: "richie-hawtin-4",  legendId: "richie-hawtin", title: "WildSide",                           venue: "Lenox",                          city: "Luxembourg",     country: "Luxembourg",  date: "2026-03-20", source: "RA", ticketUrl: makeTicketUrl("Richie Hawtin") },
  { id: "richie-hawtin-5",  legendId: "richie-hawtin", title: "Time Warp Germany 2026",             venue: "Maimarkthalle",                  city: "Mannheim",       country: "Germany",     date: "2026-03-21", source: "RA", ticketUrl: makeTicketUrl("Richie Hawtin") },
  { id: "richie-hawtin-6",  legendId: "richie-hawtin", title: "",                                    venue: "Pandora Sevilla",                city: "Sevilla",        country: "Spain",       date: "2026-04-03", source: "RA", ticketUrl: makeTicketUrl("Richie Hawtin") },
  { id: "richie-hawtin-7",  legendId: "richie-hawtin", title: "Time Warp Miami",                    venue: "Factory Town",                   city: "Miami",          country: "USA",         date: "2026-04-25", source: "RA", ticketUrl: makeTicketUrl("Richie Hawtin") },
  { id: "richie-hawtin-8",  legendId: "richie-hawtin", title: "Time Warp Brasil 2026",              venue: "Vale do Anhangabaú",             city: "Sao Paulo",      country: "Brazil",      date: "2026-05-01", source: "RA", ticketUrl: makeTicketUrl("Richie Hawtin") },
  { id: "richie-hawtin-9",  legendId: "richie-hawtin", title: "Paradise City Festival 2026",        venue: "TBA",                            city: "Brussels",       country: "Belgium",     date: "2026-06-26", source: "RA", ticketUrl: makeTicketUrl("Richie Hawtin") },
  { id: "richie-hawtin-10", legendId: "richie-hawtin", title: "Awakenings Festival 2026",           venue: "Beekse Bergen",                  city: "Hilvarenbeek",   country: "Netherlands", date: "2026-07-10", source: "RA", ticketUrl: makeTicketUrl("Richie Hawtin") },
  { id: "richie-hawtin-11", legendId: "richie-hawtin", title: "Greenfields Open Air Festival 2026", venue: "Galopprennbahn",                 city: "Munich",         country: "Germany",     date: "2026-08-01", source: "RA", ticketUrl: makeTicketUrl("Richie Hawtin") },

  // ── Jeff Mills ──────────────────────────────────────────────────────────
  { id: "jeff-mills-0",  legendId: "jeff-mills", title: "Live at Liquid Room 30th Anniversary", venue: "smartbar",                          city: "Chicago",        country: "USA",          date: "2026-02-26", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-1",  legendId: "jeff-mills", title: "Live at Liquid Room Anniversary",      venue: "Lincoln Factory",                   city: "Detroit",        country: "USA",          date: "2026-02-27", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-2",  legendId: "jeff-mills", title: "Detroit Love Weekend Pass",             venue: "BERHTA",                            city: "Washington DC",  country: "USA",          date: "2026-02-27", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-3",  legendId: "jeff-mills", title: "Detroit Love Day 2",                   venue: "BERHTA",                            city: "Washington DC",  country: "USA",          date: "2026-02-28", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-4",  legendId: "jeff-mills", title: "Live at Liquid Room Anniversary",      venue: "1015 Folsom",                       city: "San Francisco",  country: "USA",          date: "2026-03-06", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-5",  legendId: "jeff-mills", title: "Metropolis Metropolis",                 venue: "Palace of Fine Arts",               city: "San Francisco",  country: "USA",          date: "2026-03-07", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-6",  legendId: "jeff-mills", title: "WORK presents",                        venue: "TBA",                               city: "Los Angeles",    country: "USA",          date: "2026-03-08", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-7",  legendId: "jeff-mills", title: "Format x Apollo",                      venue: "TBA",                               city: "Toronto",        country: "Canada",       date: "2026-03-13", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-8",  legendId: "jeff-mills", title: "Live at Liquid Room Anniversary",      venue: "Knockdown Center",                  city: "New York City",  country: "USA",          date: "2026-03-14", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-9",  legendId: "jeff-mills", title: "",                                     venue: "Société des arts technologiques",   city: "Montreal",       country: "Canada",       date: "2026-03-15", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-10", legendId: "jeff-mills", title: "",                                     venue: "1Fox Precinct",                     city: "Johannesburg",   country: "South Africa", date: "2026-03-27", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-11", legendId: "jeff-mills", title: "Live at Liquid Room 30th Anniversary", venue: "Apollo Warehouse",                  city: "Cape Town",      country: "South Africa", date: "2026-03-28", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-12", legendId: "jeff-mills", title: "",                                     venue: "KALT",                              city: "Strasbourg",     country: "France",       date: "2026-04-02", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-13", legendId: "jeff-mills", title: "909 Festival 2026",                    venue: "Amsterdamse Bos",                   city: "Amsterdam",      country: "Netherlands",  date: "2026-06-06", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-14", legendId: "jeff-mills", title: "Junction 2 x fabric",                 venue: "Boston Manor Park",                 city: "London",         country: "UK",           date: "2026-07-25", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },
  { id: "jeff-mills-15", legendId: "jeff-mills", title: "Dekmantel Festival 2026",              venue: "Amsterdamse Bos",                   city: "Amsterdam",      country: "Netherlands",  date: "2026-07-29", source: "RA", ticketUrl: makeTicketUrl("Jeff Mills") },

  // ── Dave Clarke ─────────────────────────────────────────────────────────
  { id: "dave-clarke-0", legendId: "dave-clarke", title: "City Wall x Dave Clarke",                         venue: "Concorde 2",    city: "Brighton",  country: "UK",      date: "2026-03-14", source: "RA", ticketUrl: makeTicketUrl("Dave Clarke") },
  { id: "dave-clarke-1", legendId: "dave-clarke", title: "Luvmuzik presents Dave Clarke & Gary Beck",        venue: "District Cardiff", city: "Cardiff",   country: "UK",      date: "2026-03-17", source: "RA", ticketUrl: makeTicketUrl("Dave Clarke") },
  { id: "dave-clarke-2", legendId: "dave-clarke", title: "Ostend Beach Festival 2026",                       venue: "Klein Strand",  city: "Ostend",    country: "Belgium", date: "2026-05-18", source: "RA", ticketUrl: makeTicketUrl("Dave Clarke") },
  { id: "dave-clarke-3", legendId: "dave-clarke", title: "Iceland Eclipse",                                  venue: "Hellissandur",  city: "Hellissandur", country: "Iceland", date: "2027-09-14", source: "RA", ticketUrl: makeTicketUrl("Dave Clarke") },

  // ── Joey Beltram ─────────────────────────────────────────────────────────
  { id: "joey-beltram-0", legendId: "joey-beltram", title: "Techno Night Berlin",      venue: "About Blank",  city: "Berlin",    country: "Germany",     date: "2026-03-15", source: "RA", ticketUrl: makeTicketUrl("Joey Beltram") },
  { id: "joey-beltram-1", legendId: "joey-beltram", title: "Minimalism Overdose",      venue: "The End",      city: "London",    country: "UK",          date: "2026-04-15", source: "RA", ticketUrl: makeTicketUrl("Joey Beltram") },
  { id: "joey-beltram-2", legendId: "joey-beltram", title: "Joey Beltram Mentasm/NYC", venue: "De Fabrique",  city: "Amsterdam", country: "Netherlands", date: "2026-05-28", source: "RA", ticketUrl: makeTicketUrl("Joey Beltram") },

  // ── Juan Atkins ──────────────────────────────────────────────────────────
  { id: "juan-atkins-0", legendId: "juan-atkins", title: "DETROIT LOVE",         venue: "Fvtvr",                 city: "Paris",     country: "France",      date: "2026-03-12", source: "RA", ticketUrl: makeTicketUrl("Juan Atkins") },
  { id: "juan-atkins-1", legendId: "juan-atkins", title: "Nuits sonores 2026",   venue: "TBA Les Grandes Locos", city: "Lyon",      country: "France",      date: "2026-03-16", source: "RA", ticketUrl: makeTicketUrl("Juan Atkins") },
  { id: "juan-atkins-2", legendId: "juan-atkins", title: "Dekmantel Festival 2026", venue: "Amsterdamse Bos",   city: "Amsterdam", country: "Netherlands", date: "2026-10-23", source: "RA", ticketUrl: makeTicketUrl("Juan Atkins") },

  // ── Derrick May ──────────────────────────────────────────────────────────
  { id: "derrick-may-0", legendId: "derrick-may", title: "MEDETROIT 2026 with Carl Craig", venue: "Sky Center Central Mayorista", city: "Bogota", country: "Colombia", date: "2026-03-06", source: "RA", ticketUrl: makeTicketUrl("Derrick May") },

  // ── Kevin Saunderson ─────────────────────────────────────────────────────
  { id: "kevin-saunderson-0", legendId: "kevin-saunderson", title: "Dreaming Festival 2026", venue: "Parque Norte",      city: "Medellin",  country: "Colombia",    date: "2026-08-05", source: "RA", ticketUrl: makeTicketUrl("Kevin Saunderson") },
  { id: "kevin-saunderson-1", legendId: "kevin-saunderson", title: "909 Festival 2026",      venue: "Amsterdamse Bos",   city: "Amsterdam", country: "Netherlands", date: "2026-08-07", source: "RA", ticketUrl: makeTicketUrl("Kevin Saunderson") },
  { id: "kevin-saunderson-2", legendId: "kevin-saunderson", title: "Defected Malta",         venue: "TBA Various Venues", city: "Malta",     country: "Malta",       date: "2026-12-06", source: "RA", ticketUrl: makeTicketUrl("Kevin Saunderson") },

  // ── Robert Hood ──────────────────────────────────────────────────────────
  { id: "robert-hood-0", legendId: "robert-hood", title: "Terminal V Festival 2026", venue: "Royal Highland Centre", city: "Edinburgh",  country: "UK",          date: "2026-05-18", source: "RA", ticketUrl: makeTicketUrl("Robert Hood") },
  { id: "robert-hood-1", legendId: "robert-hood", title: "The Crave Festival 2026",  venue: "Zuiderpark",            city: "The Hague",  country: "Netherlands", date: "2026-07-27", source: "RA", ticketUrl: makeTicketUrl("Robert Hood") },
  { id: "robert-hood-2", legendId: "robert-hood", title: "Dreaming Festival 2026",   venue: "Parque Norte",          city: "Medellin",   country: "Colombia",    date: "2026-08-05", source: "RA", ticketUrl: makeTicketUrl("Robert Hood") },
];

export function getEventsForLegends(legendIds: string[]): StaticEvent[] {
  return STATIC_EVENTS.filter((e) => legendIds.includes(e.legendId)).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

export function detectOverlaps(events: StaticEvent[]): Map<string, string[]> {
  // Returns a map of eventId -> array of legendIds that share same date+city
  const dateCity = new Map<string, string[]>(); // key: date+city -> legendIds
  events.forEach((e) => {
    const key = `${e.date}::${e.city.toLowerCase()}`;
    const existing = dateCity.get(key) ?? [];
    dateCity.set(key, [...existing, e.legendId]);
  });
  const result = new Map<string, string[]>();
  events.forEach((e) => {
    const key = `${e.date}::${e.city.toLowerCase()}`;
    const legends = dateCity.get(key) ?? [];
    if (legends.length > 1) {
      result.set(e.id, legends);
    }
  });
  return result;
}
