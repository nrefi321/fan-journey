# Fan Journey 🤍

Personal fan journey app — check in to events you've attended, write a memory,
collect achievements, and share a ticket-style card to X.

Built with **Vue 3 + Vite**, organized as separate page components (Composition
API `<script setup>` — Vue 3's modern replacement for class components), so
each screen lives in its own file.

## Project structure

```
src/
  App.vue                     # shell: header, stats, tabs, router-view
  main.js                     # app entry
  style.css                   # global design system (ticket-stub theme)
  router/index.js             # 1 route per page
  data/
    events.js                 # event list (swap for a Supabase query later)
    achievements.js           # achievement definitions + unlock conditions
  composables/
    useFanJourney.js          # shared state: attendances, check-in, memory
    useToast.js                # achievement-unlock toast notifications
  components/
    TicketStub.vue            # event card (list + grid)
    CheckInModal.vue          # check-in / memory editor
    ShareModal.vue            # share-to-X card
    AchievementBadge.vue
    TabBar.vue
  views/
    EventsView.vue            # page: /events
    JourneyView.vue           # page: /journey
    AchievementsView.vue      # page: /achievements
```

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL. Data is currently saved to the browser's
`localStorage`, so check-ins persist across refreshes on the same device.

## Deploy to Vercel

Vercel's "New Project" page imports from a Git repository, so push this
folder to GitHub (or GitLab/Bitbucket) first:

1. `git init && git add . && git commit -m "Fan Journey"`
2. Create a new empty repo on GitHub, then:
   `git remote add origin <your-repo-url> && git push -u origin main`
3. Go to **https://vercel.com/new**, import that repository.
4. Vercel auto-detects Vite (build command `npm run build`, output `dist` —
   already set in `vercel.json`). Click **Deploy**.

No environment variables are required for this version.

## Moving from localStorage to a real backend (Supabase)

The app is structured so only `src/composables/useFanJourney.js` needs to
change — no component touches storage directly.

1. `npm install @supabase/supabase-js`
2. In Supabase, create these tables:

```sql
create table events (
  id text primary key,
  title text not null,
  date date not null,
  location text not null,
  description text,
  cover_image text,
  type text
);

create table attendances (
  user_id uuid references auth.users not null,
  event_id text references events not null,
  attended_at timestamptz default now(),
  memory text,
  primary key (user_id, event_id)
);

create table achievements (
  id text primary key,
  name text not null,
  description text
);

create table user_achievements (
  user_id uuid references auth.users not null,
  achievement_id text references achievements not null,
  unlocked_at timestamptz default now(),
  primary key (user_id, achievement_id)
);
```

3. Add a `.env` (already git-ignored):

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Uncomment the client in `src/lib/supabase.js`.
5. In `useFanJourney.js`, replace `loadFromStorage()` / `persist()` with
   `supabase.from('attendances').select()` / `.upsert()` calls, and add
   Supabase Auth (magic link or OAuth) so `user_id` is available. The rest
   of the app — components, views, achievement logic — doesn't need to change.
6. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Environment
   Variables in the Vercel project settings, then redeploy.

## Notes

- Event cover images are emoji + gradient placeholders — swap `g: [color1, color2]`
  in `src/data/events.js` for a real `cover_image` URL field once you have
  official artwork per event.
- "Share to X" opens a pre-filled tweet intent link. It can't attach an
  image automatically (X's intent API doesn't support that) — the visual
  card is for the user to screenshot, or you can later render it to an
  image with a library like `html-to-image` if you want a real download.
