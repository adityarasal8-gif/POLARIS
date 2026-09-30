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

## Live Data Sources & Provenance
- **Live Environmental Telemetry**: Open-Meteo REST API (`GET /api/observatory/live`) proxied by backend with caching and fallback. Coordinates for Maitri (-70.77°S, 11.73°E), Bharati (-69.41°S, 76.19°E), Himadri (78.92°N, 11.93°E), and Himansh (32.40°N, 77.60°E). Labeled transparently: `LIVE · Open-Meteo`.
- **National Polar Data Center (NPDC) & NCPOR Curated Archives**: 10 Expeditions (45th ISEA, 44th ISEA, 43rd ISEA, Arctic, Southern Ocean campaigns), 20 Datasets across 12 NPDC categories, 15 peer-reviewed publications with DOIs, 30 media assets (licensed authentic NASA/Wikimedia/NCPOR photography), 15 institutional activities, 4 stations, 10 researchers. Labeled honestly: `VERIFIED SOURCE` and `CURATED DEMO RECORD`.

## Primary Routes
1. `/` — Home with Three.js Polar Globe, live observatory ticker, pipeline flow, region cards, dynamic stats, timeline.
2. `/repository` — Unified cross-entity knowledge search with relationship chips.
3. `/expeditions` & `/expeditions/:id` — Expedition archive with mission overview, team, linked datasets, papers, media.
4. `/datasets` & `/datasets/:id` — NPDC dataset catalog, Recharts time-series preview, CSV/JSON sample download, provenance.
5. `/publications` — Peer-reviewed papers with filter, abstract expander, and BibTeX/APA/RIS citation generator.
6. `/media` — Photo and video gallery with real photography, attribution badges, and lightbox.
7. `/activities` — Institutional news, expedition updates, and announcements.
8. `/stations` — Detailed fact sheets for Maitri, Bharati, Himadri, and Himansh with telemetry shortcuts.
9. `/observatory` — Interactive Leaflet map with live station telemetry and diurnal charts.
10. `/knowledge-graph` — Interactive directed SVG knowledge graph showing entity interconnections.
11. `/learn` — Smart Education Student Hub with 3 core lessons, 10 polar glossary terms, and 5-question quiz.
12. `/studio` — Source-Grounded AI Dissemination Studio generating Website, Instagram, X, LinkedIn, YouTube, and Newsletter outreach with citations and review flow.
13. `/studio/calendar` — 5-day Mon-Fri scheduled outreach calendar.
14. `/admin` — Multi-role console for Student, Scientist, Content Editor, and Administrator.
