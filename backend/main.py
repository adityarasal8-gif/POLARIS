import sqlite3
import json
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from database import get_connection, row_to_dict
from observatory import get_all_stations_weather, fetch_station_weather
from generator import generate_grounded_outreach
from models import (
    Station, StationWeather, Expedition, Dataset, Publication,
    MediaAsset, Activity, Researcher, ScienceTopic, ContentDraft,
    ContentReviewRequest, GenerateContentRequest, SearchResponse,
    SearchResultItem, KnowledgeGraphResponse, KnowledgeGraphNode, KnowledgeGraphLink
)

app = FastAPI(
    title="POLARIS API",
    description="Integrated Polar Science Outreach, Knowledge Repository and Media Dissemination Portal API (SIH26063)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "POLARIS Core Scientific API",
        "initiative": "Ministry of Earth Sciences (MoES) / NCPOR",
        "problem_statement": "SIH26063",
        "version": "1.0.0"
    }


@app.get("/api/stats")
def get_stats():
    conn = get_connection()
    c = conn.cursor()

    counts = {
        "expeditions": c.execute("SELECT COUNT(*) FROM expeditions").fetchone()[0],
        "datasets": c.execute("SELECT COUNT(*) FROM datasets").fetchone()[0],
        "publications": c.execute("SELECT COUNT(*) FROM publications").fetchone()[0],
        "media_assets": c.execute("SELECT COUNT(*) FROM media_assets").fetchone()[0],
        "stations": c.execute("SELECT COUNT(*) FROM stations").fetchone()[0],
        "activities": c.execute("SELECT COUNT(*) FROM activities").fetchone()[0],
        "researchers": c.execute("SELECT COUNT(*) FROM researchers").fetchone()[0]
    }
    conn.close()
    return counts


@app.get("/api/stations", response_model=List[Station])
def list_stations():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM stations ORDER BY commissioned_year ASC").fetchall()
    res = [row_to_dict(r, ["research_themes"]) for r in rows]
    conn.close()
    return res


@app.get("/api/stations/{station_id}", response_model=Station)
def get_station(station_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM stations WHERE id = ?", (station_id.lower(),)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Station not found")
    return row_to_dict(row, ["research_themes"])


@app.get("/api/observatory/live", response_model=List[StationWeather])
async def get_live_observatory():
    """
    Returns real-time or cached environmental context for all Indian polar stations
    using the Open-Meteo external scientific feed.
    """
    return await get_all_stations_weather()


@app.get("/api/expeditions", response_model=List[Expedition])
def list_expeditions(
    region: Optional[str] = None,
    year: Optional[int] = None,
    status: Optional[str] = None,
    q: Optional[str] = None
):
    conn = get_connection()
    query = "SELECT * FROM expeditions WHERE 1=1"
    params = []

    if region and region != "All":
        query += " AND region = ?"
        params.append(region)
    if year:
        query += " AND year = ?"
        params.append(year)
    if status and status != "All":
        query += " AND status = ?"
        params.append(status)
    if q:
        query += " AND (name LIKE ? OR code LIKE ? OR summary LIKE ?)"
        like = f"%{q}%"
        params.extend([like, like, like])

    query += " ORDER BY year DESC"
    rows = conn.execute(query, params).fetchall()
    res = [
        row_to_dict(r, [
            "objectives", "research_themes", "field_locations", "researchers",
            "connected_datasets", "connected_publications", "connected_media"
        ])
        for r in rows
    ]
    conn.close()
    return res


@app.get("/api/expeditions/{expedition_id}")
def get_expedition_detail(expedition_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM expeditions WHERE id = ?", (expedition_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Expedition not found")

    exp = row_to_dict(row, [
        "objectives", "research_themes", "field_locations", "researchers",
        "connected_datasets", "connected_publications", "connected_media"
    ])

    # Fetch connected datasets
    ds_rows = conn.execute(
        "SELECT id, identifier, title, science_category, access_status, parameters, last_updated FROM datasets WHERE expedition_id = ?",
        (expedition_id,)
    ).fetchall()
    connected_datasets = [row_to_dict(r, ["parameters"]) for r in ds_rows]

    # Fetch connected publications
    pub_rows = conn.execute(
        "SELECT id, title, authors, journal, year, doi, abstract FROM publications WHERE expedition_id = ?",
        (expedition_id,)
    ).fetchall()
    connected_publications = [row_to_dict(r, ["authors"]) for r in pub_rows]

    # Fetch connected media
    med_rows = conn.execute(
        "SELECT id, title, type, thumbnail_url, media_url, caption, credit, source FROM media_assets WHERE expedition_id = ?",
        (expedition_id,)
    ).fetchall()
    connected_media = [dict(r) for r in med_rows]

    conn.close()
    return {
        **exp,
        "datasets_detail": connected_datasets,
        "publications_detail": connected_publications,
        "media_detail": connected_media
    }


@app.get("/api/datasets", response_model=List[Dataset])
def list_datasets(
    category: Optional[str] = None,
    region: Optional[str] = None,
    station: Optional[str] = None,
    q: Optional[str] = None
):
    conn = get_connection()
    query = "SELECT * FROM datasets WHERE 1=1"
    params = []

    if category and category != "All":
        query += " AND science_category = ?"
        params.append(category)
    if region and region != "All":
        query += " AND region = ?"
        params.append(region)
    if station and station != "All":
        query += " AND station_id = ?"
        params.append(station.lower())
    if q:
        query += " AND (title LIKE ? OR identifier LIKE ? OR description LIKE ?)"
        like = f"%{q}%"
        params.extend([like, like, like])

    query += " ORDER BY id ASC"
    rows = conn.execute(query, params).fetchall()
    res = [row_to_dict(r, ["parameters", "sample_data"]) for r in rows]
    conn.close()
    return res


@app.get("/api/datasets/{dataset_id}")
def get_dataset_detail(dataset_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM datasets WHERE id = ?", (dataset_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Dataset not found")

    ds = row_to_dict(row, ["parameters", "sample_data"])

    # Fetch related expedition
    related_exp = None
    if ds.get("expedition_id"):
        exp_row = conn.execute(
            "SELECT id, code, name, region, dates, leader_name FROM expeditions WHERE id = ?",
            (ds["expedition_id"],)
        ).fetchone()
        if exp_row:
            related_exp = dict(exp_row)

    # Fetch related station
    related_station = None
    if ds.get("station_id"):
        st_row = conn.execute(
            "SELECT id, name, region, location_description FROM stations WHERE id = ?",
            (ds["station_id"],)
        ).fetchone()
        if st_row:
            related_station = dict(st_row)

    # Fetch related publications in same category/region
    pub_rows = conn.execute(
        "SELECT id, title, authors, journal, year, doi FROM publications WHERE region = ? LIMIT 3",
        (ds["region"],)
    ).fetchall()
    related_pubs = [row_to_dict(r, ["authors"]) for r in pub_rows]

    conn.close()
    return {
        **ds,
        "related_expedition": related_exp,
        "related_station": related_station,
        "related_publications": related_pubs
    }


@app.get("/api/publications", response_model=List[Publication])
def list_publications(
    topic: Optional[str] = None,
    region: Optional[str] = None,
    year: Optional[int] = None,
    q: Optional[str] = None
):
    conn = get_connection()
    query = "SELECT * FROM publications WHERE 1=1"
    params = []

    if topic and topic != "All":
        query += " AND research_topic = ?"
        params.append(topic)
    if region and region != "All":
        query += " AND region = ?"
        params.append(region)
    if year:
        query += " AND year = ?"
        params.append(year)
    if q:
        query += " AND (title LIKE ? OR abstract LIKE ? OR authors LIKE ? OR doi LIKE ?)"
        like = f"%{q}%"
        params.extend([like, like, like, like])

    query += " ORDER BY year DESC, citation_count DESC"
    rows = conn.execute(query, params).fetchall()
    res = [row_to_dict(r, ["authors"]) for r in rows]
    conn.close()
    return res


@app.get("/api/publications/{pub_id}")
def get_publication(pub_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM publications WHERE id = ?", (pub_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Publication not found")
    return row_to_dict(row, ["authors"])


@app.get("/api/media", response_model=List[MediaAsset])
def list_media(
    type: Optional[str] = None,
    region: Optional[str] = None,
    station: Optional[str] = None,
    expedition: Optional[str] = None,
    q: Optional[str] = None
):
    conn = get_connection()
    query = "SELECT * FROM media_assets WHERE 1=1"
    params = []

    if type and type != "All":
        query += " AND type = ?"
        params.append(type.lower())
    if region and region != "All":
        query += " AND region = ?"
        params.append(region)
    if station and station != "All":
        query += " AND station_id = ?"
        params.append(station.lower())
    if expedition and expedition != "All":
        query += " AND expedition_id = ?"
        params.append(expedition)
    if q:
        query += " AND (title LIKE ? OR caption LIKE ? OR tags LIKE ?)"
        like = f"%{q}%"
        params.extend([like, like, like])

    query += " ORDER BY date DESC"
    rows = conn.execute(query, params).fetchall()
    res = [row_to_dict(r, ["tags"]) for r in rows]
    conn.close()
    return res


@app.get("/api/activities", response_model=List[Activity])
def list_activities(
    type: Optional[str] = None,
    region: Optional[str] = None
):
    conn = get_connection()
    query = "SELECT * FROM activities WHERE 1=1"
    params = []

    if type and type != "All":
        query += " AND type = ?"
        params.append(type)
    if region and region != "All":
        query += " AND region = ?"
        params.append(region)

    query += " ORDER BY date DESC"
    rows = conn.execute(query, params).fetchall()
    res = [dict(r) for r in rows]
    conn.close()
    return res


@app.get("/api/researchers", response_model=List[Researcher])
def list_researchers():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM researchers ORDER BY expeditions_count DESC").fetchall()
    res = [dict(r) for r in rows]
    conn.close()
    return res


@app.get("/api/topics", response_model=List[ScienceTopic])
def list_topics():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM science_topics ORDER BY category ASC").fetchall()
    res = [dict(r) for r in rows]
    conn.close()
    return res


@app.get("/api/search", response_model=SearchResponse)
def unified_search(
    q: str = Query(..., min_length=1, description="Unified search query"),
    type: Optional[str] = None,
    region: Optional[str] = None
):
    """
    Unified Knowledge Repository Search across all 6 scientific entities with
    connected relationship counts.
    """
    conn = get_connection()
    tokens = [t.strip() for t in q.split() if len(t.strip()) > 1]
    if not tokens:
        tokens = [q.strip()]

    results_by_type: Dict[str, List[SearchResultItem]] = {
        "expeditions": [],
        "datasets": [],
        "publications": [],
        "stations": [],
        "media": [],
        "activities": []
    }

    def score_match(text: str) -> int:
        text_lower = text.lower()
        score = 0
        if q.lower() in text_lower:
            score += 10
        for tok in tokens:
            if tok.lower() in text_lower:
                score += 2
        return score

    # 1. Expeditions
    if not type or type in ["all", "expeditions"]:
        exp_conds = " OR ".join(["(name LIKE ? OR code LIKE ? OR summary LIKE ? OR region LIKE ?)" for _ in tokens])
        exp_params = []
        for t in tokens:
            exp_params.extend([f"%{t}%", f"%{t}%", f"%{t}%", f"%{t}%"])
        exp_rows = conn.execute(
            f"SELECT id, code, name, region, dates, summary FROM expeditions WHERE {exp_conds}",
            exp_params
        ).fetchall()
        
        sorted_exps = sorted(exp_rows, key=lambda r: score_match(f"{r['code']} {r['name']} {r['summary']} {r['region']}"), reverse=True)
        for r in sorted_exps:
            results_by_type["expeditions"].append(SearchResultItem(
                id=r["id"],
                type="expedition",
                title=f"{r['code']} — {r['name']}",
                subtitle=f"Field Campaign | {r['region']} | {r['dates']}",
                region=r["region"],
                url=f"/expeditions/{r['id']}",
                badge="EXPEDITION",
                snippet=r["summary"][:160] + "..."
            ))

    # 2. Datasets
    if not type or type in ["all", "datasets"]:
        ds_conds = " OR ".join(["(title LIKE ? OR identifier LIKE ? OR description LIKE ? OR science_category LIKE ?)" for _ in tokens])
        ds_params = []
        for t in tokens:
            ds_params.extend([f"%{t}%", f"%{t}%", f"%{t}%", f"%{t}%"])
        ds_rows = conn.execute(
            f"SELECT id, identifier, title, science_category, region, description, access_status FROM datasets WHERE {ds_conds}",
            ds_params
        ).fetchall()
        
        sorted_ds = sorted(ds_rows, key=lambda r: score_match(f"{r['title']} {r['identifier']} {r['description']} {r['science_category']}"), reverse=True)
        for r in sorted_ds:
            results_by_type["datasets"].append(SearchResultItem(
                id=r["id"],
                type="dataset",
                title=r["title"],
                subtitle=f"Dataset Ref: {r['identifier']} | {r['science_category']}",
                region=r["region"],
                url=f"/datasets/{r['id']}",
                badge="DATASET",
                snippet=r["description"][:160] + "..."
            ))

    # 3. Publications
    if not type or type in ["all", "publications"]:
        pub_conds = " OR ".join(["(title LIKE ? OR abstract LIKE ? OR authors LIKE ? OR doi LIKE ?)" for _ in tokens])
        pub_params = []
        for t in tokens:
            pub_params.extend([f"%{t}%", f"%{t}%", f"%{t}%", f"%{t}%"])
        pub_rows = conn.execute(
            f"SELECT id, title, journal, year, doi, abstract, region FROM publications WHERE {pub_conds}",
            pub_params
        ).fetchall()
        
        sorted_pubs = sorted(pub_rows, key=lambda r: score_match(f"{r['title']} {r['abstract']} {r['journal']}"), reverse=True)
        for r in sorted_pubs:
            results_by_type["publications"].append(SearchResultItem(
                id=r["id"],
                type="publication",
                title=r["title"],
                subtitle=f"{r['journal']} ({r['year']}) | DOI: {r['doi']}",
                region=r["region"],
                url=f"/publications",
                badge="PUBLICATION",
                snippet=r["abstract"][:160] + "..."
            ))

    # 4. Stations
    if not type or type in ["all", "stations"]:
        st_conds = " OR ".join(["(name LIKE ? OR location_description LIKE ? OR purpose LIKE ?)" for _ in tokens])
        st_params = []
        for t in tokens:
            st_params.extend([f"%{t}%", f"%{t}%", f"%{t}%"])
        st_rows = conn.execute(
            f"SELECT id, name, region, location_description, purpose FROM stations WHERE {st_conds}",
            st_params
        ).fetchall()
        
        sorted_sts = sorted(st_rows, key=lambda r: score_match(f"{r['name']} {r['location_description']} {r['purpose']}"), reverse=True)
        for r in sorted_sts:
            results_by_type["stations"].append(SearchResultItem(
                id=r["id"],
                type="station",
                title=r["name"],
                subtitle=f"Research Facility | {r['region']} | {r['location_description']}",
                region=r["region"],
                url=f"/stations",
                badge="STATION",
                snippet=r["purpose"][:160] + "..."
            ))

    # 5. Media
    if not type or type in ["all", "media"]:
        med_conds = " OR ".join(["(title LIKE ? OR caption LIKE ? OR tags LIKE ?)" for _ in tokens])
        med_params = []
        for t in tokens:
            med_params.extend([f"%{t}%", f"%{t}%", f"%{t}%"])
        med_rows = conn.execute(
            f"SELECT id, title, type, region, caption, credit FROM media_assets WHERE {med_conds}",
            med_params
        ).fetchall()
        
        sorted_meds = sorted(med_rows, key=lambda r: score_match(f"{r['title']} {r['caption']}"), reverse=True)
        for r in sorted_meds:
            results_by_type["media"].append(SearchResultItem(
                id=r["id"],
                type="media",
                title=r["title"],
                subtitle=f"{r['type'].upper()} | {r['region']} | Credit: {r['credit']}",
                region=r["region"],
                url=f"/media",
                badge=r["type"].upper(),
                snippet=r["caption"][:160] + "..."
            ))

    # 6. Activities
    if not type or type in ["all", "activities"]:
        act_conds = " OR ".join(["(title LIKE ? OR summary LIKE ? OR content LIKE ?)" for _ in tokens])
        act_params = []
        for t in tokens:
            act_params.extend([f"%{t}%", f"%{t}%", f"%{t}%"])
        act_rows = conn.execute(
            f"SELECT id, title, type, date, summary, region FROM activities WHERE {act_conds}",
            act_params
        ).fetchall()
        
        sorted_acts = sorted(act_rows, key=lambda r: score_match(f"{r['title']} {r['summary']}"), reverse=True)
        for r in sorted_acts:
            results_by_type["activities"].append(SearchResultItem(
                id=r["id"],
                type="activity",
                title=r["title"],
                subtitle=f"{r['type']} | {r['date']}",
                region=r["region"] or "General",
                url=f"/activities",
                badge="ACTIVITY",
                snippet=r["summary"][:160] + "..."
            ))

    total = sum(len(items) for items in results_by_type.values())
    conn.close()

    return SearchResponse(
        query=q,
        total_results=total,
        results_by_type=results_by_type,
        connected_entities_count=total
    )


@app.post("/api/content/generate", response_model=ContentDraft)
def generate_content(req: GenerateContentRequest):
    """
    Source-grounded AI dissemination generation. Inspects the source record from SQLite,
    extracts verified scientific parameters, and generates multi-platform packages
    with verifiable citations.
    """
    conn = get_connection()
    source_data = {}

    if req.source_type == "expedition":
        row = conn.execute("SELECT * FROM expeditions WHERE id = ?", (req.source_id,)).fetchone()
        if row:
            source_data = row_to_dict(row, ["objectives", "research_themes", "field_locations", "researchers"])
        else:
            conn.close()
            raise HTTPException(status_code=404, detail="Expedition source not found")

    elif req.source_type == "dataset":
        row = conn.execute("SELECT * FROM datasets WHERE id = ?", (req.source_id,)).fetchone()
        if row:
            source_data = row_to_dict(row, ["parameters", "sample_data"])
        else:
            conn.close()
            raise HTTPException(status_code=404, detail="Dataset source not found")

    elif req.source_type == "publication":
        row = conn.execute("SELECT * FROM publications WHERE id = ?", (req.source_id,)).fetchone()
        if row:
            source_data = row_to_dict(row, ["authors"])
        else:
            conn.close()
            raise HTTPException(status_code=404, detail="Publication source not found")

    elif req.source_type == "activity":
        row = conn.execute("SELECT * FROM activities WHERE id = ?", (req.source_id,)).fetchone()
        if row:
            source_data = dict(row)
        else:
            conn.close()
            raise HTTPException(status_code=404, detail="Activity source not found")

    draft = generate_grounded_outreach(req.source_type, source_data)

    # Save draft into database
    conn.execute(
        """
        INSERT INTO content_drafts (
            id, source_type, source_id, source_title, title, created_at, status,
            reviewer, scheduled_for, website_article, instagram_post, x_post,
            linkedin_post, youtube_description, newsletter_summary, citations
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """,
        (
            draft.id, draft.source_type, draft.source_id, draft.source_title,
            draft.title, draft.created_at, draft.status, draft.reviewer,
            draft.scheduled_for, draft.website_article, draft.instagram_post,
            draft.x_post, draft.linkedin_post, draft.youtube_description,
            draft.newsletter_summary, json.dumps(draft.citations)
        )
    )
    conn.commit()
    conn.close()
    return draft


@app.get("/api/content/drafts", response_model=List[ContentDraft])
def get_content_drafts():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM content_drafts ORDER BY created_at DESC").fetchall()
    res = [row_to_dict(r, ["citations"]) for r in rows]
    conn.close()
    return res


@app.post("/api/content/review")
def review_content(req: ContentReviewRequest):
    conn = get_connection()
    c = conn.cursor()

    row = c.execute("SELECT * FROM content_drafts WHERE id = ?", (req.draft_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Draft not found")

    new_status = "Review"
    if req.action == "approve":
        new_status = "Approved"
    elif req.action == "schedule":
        new_status = "Scheduled"
    elif req.action == "reject":
        new_status = "Rejected"
    elif req.action == "publish":
        new_status = "Published"

    scheduled_val = req.scheduled_for or (row["scheduled_for"] if row["scheduled_for"] else None)

    c.execute(
        "UPDATE content_drafts SET status = ?, reviewer = ?, scheduled_for = ? WHERE id = ?",
        (new_status, req.reviewer, scheduled_val, req.draft_id)
    )
    conn.commit()
    conn.close()
    return {"message": f"Draft {req.draft_id} updated to status '{new_status}'", "status": new_status}


@app.get("/api/content/calendar")
def get_content_calendar():
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, title, source_type, status, scheduled_for, created_at FROM content_drafts WHERE status IN ('Approved', 'Scheduled', 'Published') ORDER BY scheduled_for ASC"
    ).fetchall()
    res = [dict(r) for r in rows]
    conn.close()
    return res


@app.get("/api/knowledge-graph", response_model=KnowledgeGraphResponse)
def get_knowledge_graph():
    """
    Generates relational knowledge graph nodes and links across Expeditions,
    Stations, Datasets, Publications, Researchers, and Science Topics.
    """
    conn = get_connection()
    nodes: List[KnowledgeGraphNode] = []
    links: List[KnowledgeGraphLink] = []

    # Stations
    st_rows = conn.execute("SELECT id, name, region FROM stations").fetchall()
    for s in st_rows:
        nodes.append(KnowledgeGraphNode(
            id=s["id"],
            name=s["name"],
            type="station",
            region=s["region"],
            details=f"Permanent Research Base in {s['region']}"
        ))

    # Expeditions
    exp_rows = conn.execute("SELECT id, code, name, region FROM expeditions LIMIT 6").fetchall()
    for e in exp_rows:
        nodes.append(KnowledgeGraphNode(
            id=e["id"],
            name=f"{e['code']} ({e['name']})",
            type="expedition",
            region=e["region"],
            details=f"Field Mission in {e['region']}"
        ))
        # Link Expedition -> Station (approximate mapping)
        if e["region"] == "Antarctica":
            links.append(KnowledgeGraphLink(source=e["id"], target="maitri", relationship="Operates At"))
            links.append(KnowledgeGraphLink(source=e["id"], target="bharati", relationship="Operates At"))
        elif e["region"] == "Arctic":
            links.append(KnowledgeGraphLink(source=e["id"], target="himadri", relationship="Operates At"))
        elif e["region"] == "Himalaya":
            links.append(KnowledgeGraphLink(source=e["id"], target="himansh", relationship="Operates At"))

    # Datasets
    ds_rows = conn.execute("SELECT id, identifier, title, region, station_id, expedition_id FROM datasets LIMIT 8").fetchall()
    for d in ds_rows:
        nodes.append(KnowledgeGraphNode(
            id=d["id"],
            name=f"{d['identifier']} — {d['title'][:32]}...",
            type="dataset",
            region=d["region"],
            details="Validated Open Dataset"
        ))
        if d["expedition_id"]:
            links.append(KnowledgeGraphLink(source=d["expedition_id"], target=d["id"], relationship="Generated Dataset"))
        if d["station_id"]:
            links.append(KnowledgeGraphLink(source=d["station_id"], target=d["id"], relationship="Observation Site"))

    # Publications
    pub_rows = conn.execute("SELECT id, title, region, expedition_id, station_id FROM publications LIMIT 6").fetchall()
    for p in pub_rows:
        nodes.append(KnowledgeGraphNode(
            id=p["id"],
            name=f"Paper: {p['title'][:36]}...",
            type="publication",
            region=p["region"],
            details="Peer-Reviewed Literature"
        ))
        if p["expedition_id"]:
            links.append(KnowledgeGraphLink(source=p["expedition_id"], target=p["id"], relationship="Produced Publication"))
        if p["station_id"]:
            links.append(KnowledgeGraphLink(source=p["station_id"], target=p["id"], relationship="Affiliated Station"))

    # Science Topics
    top_rows = conn.execute("SELECT id, name, category FROM science_topics LIMIT 5").fetchall()
    for t in top_rows:
        nodes.append(KnowledgeGraphNode(
            id=t["id"],
            name=t["name"],
            type="topic",
            region="Cross-Regional",
            details=f"Scientific Domain: {t['category']}"
        ))
        # Link topics to first station
        links.append(KnowledgeGraphLink(source="maitri", target=t["id"], relationship="Researches Topic"))

    conn.close()
    return KnowledgeGraphResponse(nodes=nodes, links=links)
