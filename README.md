**Happenings App**

**Status:** Currently updating the backend to turn it into a functioning app with the appropriate keys  and database. It will be updated soon. Play around with the demo below and please share feedback. 
For initial launch, I will remove the NFT Marketplace and will focus on developing a lean content exchange and monetization that’s supports peer-to-peer and peer-to-business.

**Brief Description**
A React + TypeScript demo app for managing live events, media capture, and artist engagement. Includes event browsing, profiles, camera capture flow, and simple analytics.

View on Mobile (Demo) ← https://tinyurl.com/theHappeningsApp

**Features**
Tag: users, events, locations
Content sharing: User to User
Event discovery: browse upcoming events, filter by category, view analytics.
Event profiles: details, signups, media gallery, and actions.
Camera flow: capture media against a pre-selected event.
Moderation: pending/approved galleries and NFT-marked items.
Artists (User Profiles): basic profile metadata and associations with events.

**Tech Stack**
Frontend: React + TypeScript (TSX)
Build: Vite
UI: TailwindCSS + custom components in src/components/ui/
Icons: lucide-react

**Project Structure**
src/App.tsx
 — main app, screen routing, shared handlers
src/components/EventScreen.tsx
 — list & filter public events
src/components/EventProfileScreen.tsx
 — event detail + signups
src/components/CameraScreen.tsx
 — media capture UX (preselect support)
src/types/events.ts — centralized domain types:
PublicEvent, MediaItem, EventSignup, EventAnalytics, Artist

**Getting Started**
Still developing, will be updated shortly**

