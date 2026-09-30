# Project Context — POLARIS (SIH26063)

## Goal
- **Project Name**: POLARIS ("India's Polar Science, Connected")
- **Problem Statement ID**: SIH26063
- **Problem Statement Title**: Integrated Polar Science Outreach, Knowledge Repository and Media Dissemination Portal
- **Organization**: Ministry of Earth Sciences (MoES), Government of India
- **Department**: National Centre for Polar and Ocean Research (NCPOR)
- **Theme**: Smart Education
- **Category**: Software

## Stack
- **Backend**: FastAPI (Python 3.12), SQLite relational database with seed archive data, HTTPX live telemetry proxy to Open-Meteo, Pydantic v2 schemas.
- **Frontend**: Vite v8, React 19, TypeScript, TailwindCSS v4, Three.js 3D Polar Earth globe hero, Leaflet v1.9 interactive maps, Recharts 2.x telemetry & flux trends, Wouter client routing.

## Local Commands
- **Backend Dev Server**:
  ```bash
  cd /Users/lol/Docs/antigravity/polarsetu/backend
  source .venv/bin/activate
  uvicorn main:app --host 127.0.0.1 --port 8000 --reload
  ```
- **Frontend Dev Server**:
  ```bash
  cd /Users/lol/Docs/antigravity/polarsetu/frontend
  npm run dev -- --host 127.0.0.1 --port 5173
  ```
- **Frontend Production Build**:
  ```bash
  cd /Users/lol/Docs/antigravity/polarsetu/frontend
  npm run build
  ```

## Design Philosophy & Personality Matrix
- **Inspiration**: NASA Scientific Visualization, British Antarctic Survey storytelling, National Geographic editorial presentation, and NPDC Research Data Portal.
- **Color Architecture**:
  * Deep Ink (`#07151F`): Dominant background for immersive environments.
  * Ocean (`#0D2735`): Deep contrast surface for controls, sidebars, and navigation.
  * Snow (`#F7F8F5`): Clean light surface for data catalogs, scholarly papers, and educational modules.
  * Ice (`#B9DDE7`) & Glacial (`#74B8CC`): Cold atmospheric scientific accents.
  * Aurora (`#5BB7A5`): Active operational state indicator.
  * Warm Research Accent (`#D7A75D`): Editorial highlight for field notes, awards, and historical milestones.
- **Typography**:
  * Headlines: `Newsreader` (Google Fonts editorial serif).
  * Body & UI: `Plus Jakarta Sans` (Google Fonts modern clean sans).
  * Data & Telemetry: `JetBrains Mono` (Google Fonts monospace).
- **Page Personas**:
  * Home: Cinematic editorial narrative
  * Expeditions: Documentary field journal
  * Stations: Geographic map explorer
  * Observatory: Scientific instrumentation console
  * Repository: Cross-entity relational search
  * Datasets: NPDC data catalog (clean light mode)
  * Publications: Scholarly research library (clean light mode)
  * Media: Photojournalistic archive
  * Activities: Institutional journalism
  * Knowledge Graph: Concentric interactive visualization
  * Learn: Smart education science portal (clean light mode)
  * Studio: Professional 3-pane editorial desk
  * Admin: Administrative governance dashboard

## Live Data Sources & Provenance
- **Live Environmental Telemetry**: Open-Meteo REST API (`GET /api/observatory/live`) proxied by backend with caching and fallback. Coordinates for Maitri (-70.77°S, 11.73°E), Bharati (-69.41°S, 76.19°E), Himadri (78.92°N, 11.93°E), and Himansh (32.40°N, 77.60°E). Labeled transparently: `LIVE ENVIRONMENTAL CONTEXT · Source: Open-Meteo`.
- **National Polar Data Center (NPDC) & NCPOR Curated Archives**: 10 Expeditions (45th ISEA, 44th ISEA, 43rd ISEA, Arctic, Southern Ocean campaigns), 20 Datasets across 12 NPDC categories, 15 peer-reviewed publications with DOIs, 30 media assets (licensed authentic NASA/Wikimedia/NCPOR photography), 15 institutional activities, 4 stations, 10 researchers. Labeled honestly: `VERIFIED SOURCE` and `CURATED DEMO RECORD`.

## Primary Routes
1. `/` — Home (10-stage cinematic narrative with integrated 3D Earth, 4 regional chapters, pipeline, real-scale observatory, archive search, featured 45th ISEA).
2. `/repository` — Unified cross-entity knowledge search with relationship clusters.
3. `/expeditions` & `/expeditions/:id` — Expedition archive (documentary field journal & mission dossier).
4. `/datasets` & `/datasets/:id` — NPDC dataset catalog (clean light mode data explorer & scientific data record).
5. `/publications` — Scholarly research library with DOI badges, abstract toggle, and APA/BibTeX citation export.
6. `/media` — Photojournalistic archive with real photography, attribution badges, and lightbox.
7. `/activities` — Institutional journalism, expedition updates, and announcements.
8. `/stations` — Geographic map explorer with split-screen Leaflet satellite map.
9. `/observatory` — Scientific instrumentation console with giant live telemetry and 24h diurnal charts.
10. `/knowledge-graph` — Concentric interactive visualization with drawer inspector.
11. `/learn` — Smart education science portal with interactive lesson reader, lexicon, and 5-question quiz.
12. `/studio` & `/studio/calendar` — Source-Grounded AI Dissemination Studio with 3-pane editorial desk and 6-stage workflow.
13. `/admin` — Dedicated administrative governance console.
