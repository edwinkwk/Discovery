# Discovery

A self-discovery web app that blends 5 fortune-telling / divination systems — Western astrology, Chinese Four Pillars (BaZi), Purple Star Astrology (Zi Wei Dou Shu), Qi Men Dun Jia, and numerology — into one synthesized narrative reading.

Enter a birth date, time, and place; the app runs all 5 systems' calculations, extracts structured traits from each, and uses Gemini to weave them into a single coherent reading.

## Stack

- Next.js (App Router) + TypeScript
- `lunar-typescript` (BaZi), `iztro` (Zi Wei Dou Shu), `circular-natal-horoscope-js` (Western astrology) — see `lib/systems/qimen` for the custom Qi Men Dun Jia board logic
- `geo-tz` + `luxon` for timezone/true-solar-time resolution
- `@google/genai` for narrative synthesis
- Vitest for calculator unit tests

## Getting Started

```bash
npm install
npm run dev
```

Set `GEMINI_API_KEY` in your environment for the synthesis step to work.

Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npm test         # vitest run
npx tsc --noEmit  # typecheck
npx eslint .      # lint
```

## Known limitations (MVP)

- Qi Men Dun Jia is a simplified day-level board (see caveats in `lib/systems/qimen/board.ts`) — not a full hour-precise classical chart, and not independently validated against a reference calculator yet.
- Geocoding uses Nominatim (OpenStreetMap), which is free but rate-limited and not intended for heavy production use — swap to a paid geocoder (e.g. OpenCage) before any real launch.
- No persistence/accounts — readings are stateless and only kept in the browser's `sessionStorage` for the results page.
