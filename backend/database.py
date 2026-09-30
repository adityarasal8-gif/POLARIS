import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "polaris.db")

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
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

    -- Indices for quick faceted filtering and search
    CREATE INDEX IF NOT EXISTS idx_expeditions_region ON expeditions(region);
    CREATE INDEX IF NOT EXISTS idx_datasets_category ON datasets(science_category);
    CREATE INDEX IF NOT EXISTS idx_datasets_region ON datasets(region);
    CREATE INDEX IF NOT EXISTS idx_datasets_station ON datasets(station_id);
    CREATE INDEX IF NOT EXISTS idx_publications_year ON publications(year);
    CREATE INDEX IF NOT EXISTS idx_media_type ON media_assets(type);
    CREATE INDEX IF NOT EXISTS idx_media_region ON media_assets(region);
    """)

    conn.commit()
    conn.close()


def row_to_dict(row: sqlite3.Row, json_fields: List[str] = None) -> Dict[str, Any]:
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
