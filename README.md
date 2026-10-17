# AI Arms Race

An 8-bit, mobile-web strategy game about the (exaggerated) history of the AI race, played as Sam Altman.

```bash
npm install
npm run dev -- --host   # open the Network URL on your phone
npm run sim             # headless balance check across all chapters
```

## Chapters

1. **The Garage** (2015–2017) — wait for "Attention Is All You Need", train GPT-1 for $600.
2. **The Pioneer Building** (2018–2019) — Elon leaves, capped-profit decision, GPT-2, Microsoft's $1B.
3. **The Azure Supercomputer** (2019–2021) — scaling laws, GPT-3, the API, and Dario's exit.

## Where things live

- `src/game/chapters.ts` — goals, economy, cards, investors, rival news per chapter
- `src/game/events.ts` — date-triggered historical events and choices
- `src/game/engine.ts` — the reducer: turns, burn, research = √(people × GPUs), saves
- `src/game/people.ts` — characters (bios + pixel "looks")
- `src/art/` — SVG pixel art: sprite builder, garage/office/data center scenes, Bay Area map
- `src/ui/` — HUD, card tray, stats panel, VC pitch, shops, cutscenes
