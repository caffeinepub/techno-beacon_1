export interface Legend {
  id: string;
  name: string;
  alias: string;
  bio: string;
  keyTrack: string;
  genre: string;
  color: string; // CSS color for borders/accents
  detroitFounder: boolean;
}

export const LEGENDS: Legend[] = [
  {
    id: "jeff-mills",
    name: "Jeff Mills",
    alias: "The Wizard",
    bio: "Detroit-born pioneer who defined the raw, relentless side of techno from the Underground Resistance days. Currently touring his legendary Live at Liquid Room 30th Anniversary set.",
    keyTrack: "The Bells",
    genre: "Detroit Techno",
    color: "#3B82F6",
    detroitFounder: true,
  },
  {
    id: "richie-hawtin",
    name: "Richie Hawtin",
    alias: "Plastikman",
    bio: "Canadian-British minimal techno innovator who stripped the genre to its bones as Plastikman. Architect of the Minus label and a global festival circuit headliner.",
    keyTrack: "Spastik",
    genre: "Minimal Techno",
    color: "#22C55E",
    detroitFounder: false,
  },
  {
    id: "dave-clarke",
    name: "Dave Clarke",
    alias: "Red 2 / Baron of Techno",
    bio: "Brighton-based hard techno master whose Red series EPs redefined aggression in the genre. Uncompromising selector and DJ with a career spanning four decades.",
    keyTrack: "Red 2",
    genre: "Hard Techno",
    color: "#EF4444",
    detroitFounder: false,
  },
  {
    id: "joey-beltram",
    name: "Joey Beltram",
    alias: "Energy Flash",
    bio: "New York-born producer whose 'Energy Flash' and 'Mentasm' (1990-91) became the DNA of Belgian new beat and hardcore techno worldwide. A true underground legend.",
    keyTrack: "Energy Flash",
    genre: "Hardcore / Techno",
    color: "#A855F7",
    detroitFounder: false,
  },
  {
    id: "derrick-may",
    name: "Derrick May",
    alias: "Mayday / Rhythim Is Rhythim",
    bio: "One of the Belleville Three, the founding Detroit techno trio. His 'Strings of Life' (1987) is widely considered one of the most important electronic records ever made.",
    keyTrack: "Strings of Life",
    genre: "Detroit Techno",
    color: "#60A5FA",
    detroitFounder: true,
  },
  {
    id: "juan-atkins",
    name: "Juan Atkins",
    alias: "Cybotron / Model 500",
    bio: "The Godfather of Techno and founding member of the Belleville Three. His Cybotron and Model 500 projects defined the blueprint of techno music in the early 1980s.",
    keyTrack: "No UFOs",
    genre: "Detroit Techno",
    color: "#06B6D4",
    detroitFounder: true,
  },
  {
    id: "kevin-saunderson",
    name: "Kevin Saunderson",
    alias: "Inner City / E-Dancer",
    bio: "Belleville Three member who bridged Detroit techno with mainstream house success via Inner City's 'Big Fun' and 'Good Life'. Still pushes forward as E-Dancer.",
    keyTrack: "Big Fun",
    genre: "Detroit Techno",
    color: "#F97316",
    detroitFounder: true,
  },
  {
    id: "robert-hood",
    name: "Robert Hood",
    alias: "M-Plant",
    bio: "Detroit-born minimal techno pioneer and founder of M-Plant Records. His stripped, hypnotic approach to techno inspired an entire generation of producers.",
    keyTrack: "Moveable Parts",
    genre: "Minimal Techno",
    color: "#6B7280",
    detroitFounder: true,
  },
];

export const LEGEND_MAP: Record<string, Legend> = LEGENDS.reduce(
  (acc, l) => ({ ...acc, [l.id]: l }),
  {} as Record<string, Legend>,
);
