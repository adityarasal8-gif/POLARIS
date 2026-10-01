import sqlite3
import json
import os
from contextlib import contextmanager
from typing import List, Dict, Any, Optional, Generator

DB_PATH = os.path.join(os.path.dirname(__file__), "polaris.db")

def get_connection() -> sqlite3.Connection:
    """
    Creates an optimized SQLite connection with WAL journal mode,
    foreign keys, busy timeout, and thread safety for concurrent FastAPI requests.
    """
    conn = sqlite3.connect(DB_PATH, check_same_thread=False, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.execute("PRAGMA synchronous = NORMAL;")
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA busy_timeout = 30000;")
    return conn

@contextmanager
def get_db() -> Generator[sqlite3.Connection, None, None]:
    """
    Context manager that safely provides a database connection and guarantees
    connection closure even if exceptions occur.
    """
    conn = get_connection()
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """
    Initializes all core schema tables and multi-dimensional indices for
    expeditions, datasets, publications, media assets, stations, and outreach drafts.
    """
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.executescript("""
        CREATE TABLE IF NOT EXISTS stations (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            region TEXT NOT NULL,
            location_description TEXT,
            latitude REAL,
            longitude REAL,
            elevation_m REAL,
            commissioned_year INTEGER,
            status TEXT,
            purpose TEXT,
            research_themes TEXT, -- JSON array
            image_url TEXT,
            image_credit TEXT
        );

        CREATE TABLE IF NOT EXISTS researchers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            title TEXT,
            institution TEXT,
            specialization TEXT,
            expeditions_count INTEGER,
            avatar_url TEXT
        );

        CREATE TABLE IF NOT EXISTS science_topics (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS expeditions (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            region TEXT NOT NULL,
            dates TEXT,
            year INTEGER,
            status TEXT,
            leader_name TEXT,
            leader_title TEXT,
            vessel TEXT,
            summary TEXT,
            mission_overview TEXT,
            objectives TEXT, -- JSON array
            research_themes TEXT, -- JSON array
            field_locations TEXT, -- JSON array
            researchers TEXT, -- JSON array
            hero_image TEXT,
            hero_image_credit TEXT,
            connected_datasets TEXT, -- JSON array
            connected_publications TEXT, -- JSON array
            connected_media TEXT -- JSON array
        );

        CREATE TABLE IF NOT EXISTS datasets (
            id TEXT PRIMARY KEY,
            identifier TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            science_category TEXT,
            region TEXT,
            station_id TEXT,
            expedition_id TEXT,
            temporal_coverage TEXT,
            spatial_coverage TEXT,
            parameters TEXT, -- JSON array
            data_format TEXT,
            access_status TEXT,
            provider TEXT,
            doi TEXT,
            last_updated TEXT,
            provenance TEXT,
            sample_data TEXT -- JSON array
        );

        CREATE TABLE IF NOT EXISTS publications (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            authors TEXT, -- JSON array
            journal TEXT,
            year INTEGER,
            volume_issue TEXT,
            doi TEXT,
            abstract TEXT,
            region TEXT,
            research_topic TEXT,
            expedition_id TEXT,
            station_id TEXT,
            citation_count INTEGER,
            pdf_available INTEGER
        );

        CREATE TABLE IF NOT EXISTS media_assets (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            type TEXT, -- photo or video
            region TEXT,
            station_id TEXT,
            expedition_id TEXT,
            date TEXT,
            caption TEXT,
            thumbnail_url TEXT,
            media_url TEXT,
            credit TEXT,
            source TEXT,
            license TEXT,
            tags TEXT -- JSON array
        );

        CREATE TABLE IF NOT EXISTS activities (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            type TEXT,
            date TEXT,
            summary TEXT,
            content TEXT,
            region TEXT,
            expedition_id TEXT,
            source TEXT,
            image_url TEXT
        );

        CREATE TABLE IF NOT EXISTS content_drafts (
            id TEXT PRIMARY KEY,
            source_type TEXT,
            source_id TEXT,
            source_title TEXT,
            title TEXT,
            created_at TEXT,
            status TEXT, -- Draft, Review, Approved, Scheduled, Published
            reviewer TEXT,
            scheduled_for TEXT,
            website_article TEXT,
            instagram_post TEXT,
            x_post TEXT,
            linkedin_post TEXT,
            youtube_description TEXT,
            newsletter_summary TEXT,
            citations TEXT -- JSON array
        );

        -- Performance indices for fast faceted filtering, searches, and relational joins
        CREATE INDEX IF NOT EXISTS idx_expeditions_region ON expeditions(region);
        CREATE INDEX IF NOT EXISTS idx_expeditions_year ON expeditions(year);
        CREATE INDEX IF NOT EXISTS idx_expeditions_code ON expeditions(code);
        CREATE INDEX IF NOT EXISTS idx_datasets_category ON datasets(science_category);
        CREATE INDEX IF NOT EXISTS idx_datasets_region ON datasets(region);
        CREATE INDEX IF NOT EXISTS idx_datasets_station ON datasets(station_id);
        CREATE INDEX IF NOT EXISTS idx_datasets_expedition ON datasets(expedition_id);
        CREATE INDEX IF NOT EXISTS idx_publications_year ON publications(year);
        CREATE INDEX IF NOT EXISTS idx_publications_region ON publications(region);
        CREATE INDEX IF NOT EXISTS idx_publications_expedition ON publications(expedition_id);
        CREATE INDEX IF NOT EXISTS idx_publications_station ON publications(station_id);
        CREATE INDEX IF NOT EXISTS idx_media_type ON media_assets(type);
        CREATE INDEX IF NOT EXISTS idx_media_region ON media_assets(region);
        CREATE INDEX IF NOT EXISTS idx_media_station ON media_assets(station_id);
        CREATE INDEX IF NOT EXISTS idx_media_expedition ON media_assets(expedition_id);
        CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
        CREATE INDEX IF NOT EXISTS idx_activities_region ON activities(region);
        CREATE INDEX IF NOT EXISTS idx_content_drafts_status ON content_drafts(status);
        """)
        conn.commit()


def init_search_fts(conn: sqlite3.Connection):
    """
    Initializes the SQLite FTS5 virtual table with unicode61 tokenizer
    for sub-millisecond full-text indexing and BM25 relevance scoring.
    """
    try:
        cursor = conn.cursor()
        cursor.execute("""
        CREATE VIRTUAL TABLE IF NOT EXISTS search_fts USING fts5(
            entity_id UNINDEXED,
            entity_type UNINDEXED,
            title,
            subtitle,
            region,
            content_body,
            tokenize = 'porter unicode61'
        );
        """)
        conn.commit()
    except Exception as e:
        # FTS5 might not be enabled in some environments
        print(f"FTS5 initialization notice: {e}")


def sync_search_fts(conn: sqlite3.Connection):
    """
    Synchronizes the search_fts index with all active records across the 6 core entities.
    """
    try:
        init_search_fts(conn)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM search_fts;")
        
        # 1. Expeditions
        cursor.execute("""
        INSERT INTO search_fts (entity_id, entity_type, title, subtitle, region, content_body)
        SELECT id, 'expedition', code || ' — ' || name, 'Field Campaign | ' || region || ' | ' || dates, region, summary || ' ' || COALESCE(mission_overview, '')
        FROM expeditions;
        """)
        
        # 2. Datasets
        cursor.execute("""
        INSERT INTO search_fts (entity_id, entity_type, title, subtitle, region, content_body)
        SELECT id, 'dataset', title, 'Dataset Ref: ' || identifier || ' | ' || science_category, region, description || ' ' || science_category || ' ' || identifier
        FROM datasets;
        """)
        
        # 3. Publications
        cursor.execute("""
        INSERT INTO search_fts (entity_id, entity_type, title, subtitle, region, content_body)
        SELECT id, 'publication', title, journal || ' (' || year || ') | DOI: ' || doi, region, abstract || ' ' || authors || ' ' || journal
        FROM publications;
        """)
        
        # 4. Stations
        cursor.execute("""
        INSERT INTO search_fts (entity_id, entity_type, title, subtitle, region, content_body)
        SELECT id, 'station', name, 'Research Facility | ' || region || ' | ' || location_description, region, purpose || ' ' || location_description
        FROM stations;
        """)
        
        # 5. Media
        cursor.execute("""
        INSERT INTO search_fts (entity_id, entity_type, title, subtitle, region, content_body)
        SELECT id, 'media', title, UPPER(type) || ' | ' || region || ' | Credit: ' || credit, region, caption || ' ' || credit || ' ' || COALESCE(tags, '')
        FROM media_assets;
        """)
        
        # 6. Activities
        cursor.execute("""
        INSERT INTO search_fts (entity_id, entity_type, title, subtitle, region, content_body)
        SELECT id, 'activity', title, type || ' | ' || date, COALESCE(region, 'General'), summary || ' ' || COALESCE(content, '')
        FROM activities;
        """)
        conn.commit()
    except Exception as e:
        print(f"FTS5 sync notice: {e}")


def ensure_seeded():
    """
    Self-healing database initialization: guarantees that tables exist and
    populates core baseline scientific records if the database is newly created or empty.
    """
    init_db()
    with get_db() as conn:
        cursor = conn.cursor()
        count = cursor.execute("SELECT COUNT(*) FROM stations").fetchone()[0]
        if count == 0:
            from seed_data import seed_all
            seed_all()
        sync_search_fts(conn)


def row_to_dict(row: sqlite3.Row, json_fields: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Converts a sqlite3.Row to a native Python dictionary and automatically
    parses JSON array/object columns with fallback to empty list.
    """
    if row is None:
        return {}
    d = dict(row)
    if json_fields:
        for f in json_fields:
            if f in d and d[f]:
                try:
                    d[f] = json.loads(d[f])
                except Exception:
                    d[f] = []
            elif f in d:
                d[f] = []
    return d
