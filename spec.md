# Techno Beacon

## Current State
The app has three pages: Discover (events feed), Artists (roster), and My Radar (personal saved events + trip planner). It uses a backend canister to store artists and events, seeded by an admin on first login. The design is dark with cyan/neon accents. The artist and event data are stored in the backend and fetched via React Query hooks.

## Requested Changes (Diff)

### Add
- **Legends Selector screen** (new "Home" page): Scrollable grid of 9 legend cards with portrait photo, short bio, key track; multi-select checkboxes; "Select All Detroit Founders" quick button (Belleville Three + second-wave: Derrick May, Kevin Saunderson, Juan Atkins, Robert Hood)
- **Color-coding per legend** on event cards (each legend has a distinct neon accent color)
- **Overlap highlighting**: event cards that have multiple legends playing the same event/venue/date show a special badge
- **Plan Trip button** on each event card: opens a modal with user location input, Google Flights deep link, Booking.com hotel link, and estimated cost range
- **All hardcoded event data** for 9 legends: Richie Hawtin (12 events), Jeff Mills (16 events), Dave Clarke (4 events), Joey Beltram (3 events), Juan Atkins (3 events), Derrick May (1 event), Kevin Saunderson (3 events), Robert Hood (3 events) — total 45 events
- **Artist photos** for all 9 legends using generated images
- **Disclaimer footer** text: "Events from RA/Bandsintown – dates may change"
- **Profile page** for setting home location (replaces or augments My Radar's trip planner section)
- **Adam Beyer** as optional 9th legend

### Modify
- **Navigation**: rename "Discover" to "Home" (now the legends selector screen), keep "Events" for the filtered feed, rename "My Radar" to "Radar", add "Profile" tab
- **Events Feed**: Now filtered based on selected legends from Home screen, chronologically sorted, with legend color-coding and overlap badges
- **DiscoverPage** → becomes **LegendsSelectorPage**: show legend cards with selection state
- **Events page**: Shows filtered events feed based on selected legends; each event card has "Plan Trip" and "Tickets" buttons
- **App.tsx**: Add new page routing to include "home", "events", "radar", "profile"
- **Data layer**: All 45 events and 9 artists hardcoded as static data in the frontend (no backend seed dependency for initial display). Backend still used for radar/saved events.

### Remove
- Dependency on admin seeding for initial data display — data should be visible immediately from hardcoded static data
- "Artists" page as a separate navigation item (merge into Home/Legends view)

## Implementation Plan
1. Create `src/data/legends.ts` — all 9 legend artist objects with color, bio, key track
2. Create `src/data/events.ts` — all 45 hardcoded events with legendId references
3. Create `src/pages/LegendsSelectorPage.tsx` — Home screen with selection grid
4. Create `src/pages/EventsFeedPage.tsx` — Filtered chronological events feed
5. Create `src/pages/ProfilePage.tsx` — Home city / location settings
6. Update `src/components/EventCard.tsx` — Add legend color accent, Plan Trip button, Tickets button
7. Create `src/components/TripPlannerModal.tsx` — Modal with Google Flights + Booking.com links
8. Update `src/components/NavBar.tsx` — 4 tabs: Home, Events, Radar, Profile
9. Update `App.tsx` — New routing with selected legends state flowing from Home → Events
10. Generate artist portrait images for all 9 legends

## UX Notes
- Mobile-first: single column on mobile, 2-3 columns on tablet/desktop
- Legend color palette: Jeff Mills = blue, Richie Hawtin = green, Dave Clarke = red, Joey Beltram = orange, Derrick May = violet, Juan Atkins = yellow, Kevin Saunderson = teal, Robert Hood = pink, Adam Beyer = white/silver
- Overlap events (same date+city with multiple legends) highlighted with a multi-legend badge
- Plan Trip modal: pre-fill Google Flights URL from user's home city to event city; Booking.com search link for venue city; estimated cost range based on distance heuristic
- "Select All Detroit Founders" button selects: Derrick May, Kevin Saunderson, Juan Atkins, Jeff Mills, Robert Hood
- Disclaimer shown at bottom of Events Feed page
- Events sorted ascending by date
