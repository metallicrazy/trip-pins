# Trip Pins — setup guide

A free iPhone web app for your map of places to visit / visited, with ratings, notes,
Google Maps import and nearby alerts. No Apple developer account, no API keys.

## Files
| File | Purpose |
|---|---|
| `index.html` | The whole app |
| `manifest.webmanifest` | Makes it installable to the Home Screen |
| `sw.js` | Offline support (caches the app and map tiles you've viewed) |
| `icon-180.png`, `icon-192.png`, `icon-512.png` | App icons |

## 1. Host it (free, ~5 minutes)
The app must be served over **https** for location, notifications and offline mode to work.
Either option below is free.

**Option A — Netlify Drop (easiest)**
1. Go to https://app.netlify.com/drop (create a free account when prompted).
2. Drag the whole `tripins` folder onto the page.
3. You get a URL like `https://something-1234.netlify.app` — that's your app.

**Option B — GitHub Pages**
1. Create a free GitHub account → New repository (e.g. `trip-pins`, Public).
2. Upload all the files (Add file → Upload files).
3. Settings → Pages → Source: *Deploy from a branch*, Branch: `main`, folder `/ (root)` → Save.
4. After a minute your app is at `https://<your-username>.github.io/trip-pins/`.

## 2. Install on your iPhone
1. Open the URL in **Safari**.
2. Tap **Share** → **Add to Home Screen** → Add.
3. Always open it from the Home Screen icon (full screen, and notifications only work this way).
4. On first use, allow **Location** when asked.

## 3. Import your Google Maps places
1. On any device go to https://takeout.google.com → **Deselect all**.
2. Tick **Maps (your places)** and **Saved** → Next step → Create export.
3. Google emails you a link within a few minutes. Download the zip on your iPhone and tap it in **Files** to unzip.
4. In Trip Pins: **⋯ → Import from Google Maps** → choose:
   - `Takeout/Maps (your places)/Saved Places.json` — your starred places (has coordinates)
   - `Takeout/Saved/*.csv` — one file per list (*Want to go*, *Favourites*, custom lists)
5. Tap **Import**.

Notes:
- Google's list CSVs contain names but usually no coordinates. The app looks those up
  by name via OpenStreetMap at about one per second — a 100‑place list takes ~2 minutes.
  Keep the app open while it runs. Anything it can't find is listed so you can add it via search.
- Places it located by name are flagged "double‑check these" — glance over them and
  correct any that landed in the wrong spot (Edit → Coordinates, or delete and re‑add via search).
- If your Google note says e.g. "visited" or "4 stars"/"⭐⭐⭐⭐", the app sets that automatically.
- Re‑importing the same files is safe — duplicates are skipped.

## 4. Using the app
- **Red pin** = to visit. **Green pin ✓** = visited.
- **Long‑press** the map, or use the **search box**, or tap **＋**, to add a place.
- **Tap a pin** for the card: name, ⭐ rating, your note, ✓ Visited / ○ To visit,
  plus Edit, Mark visited, Open in Google Maps / Apple Maps, Arrival reminder, Delete.
- **All / To visit / Visited** filter at the top.
- **⋯ → All places** — searchable list.
- **⋯ → Export / back up** — data lives only on your phone; back up regularly.

## 5. Alerts while the app is open
**⋯ → Settings** → turn on *Watch my location*. While the app is on screen (e.g. mounted
in the car while navigating), it alerts you — banner, sound, and a notification if enabled —
when you come within your chosen radius (default 2 km) of any **unvisited** place, or when
you're about 5 minutes away based on your speed. Each place alerts once per session.

## 6. Background alerts with Apple Reminders (one‑time setup)
iPhone web apps can't track location when closed, so Trip Pins hands that job to
Apple Reminders through two tiny Shortcuts. Build them once in the **Shortcuts** app.

### Shortcut 1 — name it exactly `Trip Pins Reminders`
1. New shortcut → tap the name → rename to **Trip Pins Reminders**.
2. Add action **Receive input** (search "Receive"): *Receive **Text** input from **Share Sheet, Quick Actions***.
   (If you can't find it, skip it — "Shortcut Input" still works.)
3. Add **Split Text** → text: *Shortcut Input*, separator: **New Lines**.
4. Add **Repeat with Each** → items: *Split Text* result. Inside the repeat:
   1. **Split Text** → text: *Repeat Item*, separator: **Custom** → type `|`
   2. **Get Item from List** → *First Item* from *Split Text* → this is the **name**
   3. **Get Item from List** → *Item at Index* **2** → **latitude**
   4. **Get Item from List** → *Item at Index* **3** → **longitude**
   5. **Get Item from List** → *Item at Index* **4** → **radius** (metres)
   6. **Get Item from List** → *Item at Index* **5** → **note**
   7. **Text** → `You're near [name] — it's on your list!` (insert the name variable)
   8. **Add New Reminder** → tap **Show More**:
      - Reminder: the Text from step 7
      - List: **Places nearby** (create this list in Reminders first)
      - Notes: the note variable
      - Alert: **Location** → **Arriving** → tap the location field and insert
        latitude, longitude as text (`[latitude],[longitude]`).
        If the location field only accepts a search, insert the name instead.
5. Done.

### Shortcut 2 — name it exactly `Trip Pins Clear`
1. **Find Reminders** where *List* **is** *Places nearby*.
2. **Remove Reminders** → the found reminders.

### Using them
- **⋯ → Plan alerts**: choose a centre (your location or the map centre), set the search
  area, the alert radius and a maximum (keep ≤ 20 — iOS only monitors ~20 locations
  reliably). Tap **Create reminders** → the Shortcut runs and fills the *Places nearby* list.
- Before a trip elsewhere, or once you're home, tap **Clear alerts** and re‑plan.
- When you mark a place visited, delete its reminder (swipe left in Reminders) or just
  re‑run Plan alerts, which rebuilds the list from unvisited places only.
- **Radius:** if your iOS version's *Add New Reminder* action doesn't let the Shortcut set a
  radius, the reminders are created with Apple's default radius. Open Reminders → the
  reminder → Details → tap the map → drag the circle wider. **Copy list** in Plan alerts
  gives you the same places as text if you prefer to set them up by hand.

## Privacy
Everything stays on your phone. The only network calls are OpenStreetMap map tiles,
OpenStreetMap search (Nominatim) when you search or import by name, and the Leaflet
map library from jsDelivr. No accounts, no tracking.
