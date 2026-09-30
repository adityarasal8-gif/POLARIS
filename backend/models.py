from __future__ import annotations
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Station(BaseModel):
    id: str
    name: str
    region: str
    location_description: str
    latitude: float
    longitude: float
    elevation_m: float
    commissioned_year: int
    status: str
    purpose: str
    research_themes: List[str]
    image_url: str
    image_credit: str

class StationWeather(BaseModel):
    station_id: str
    station_name: str
    region: str
    latitude: float
    longitude: float
    temperature_c: float
    wind_speed_kmh: float
    wind_direction_deg: Optional[float] = None
    relative_humidity_pct: float
    surface_pressure_hpa: float
    timestamp: str
    source: str
    source_url: str
    status: str  # "live" | "cached" | "fallback"
    condition_description: str

class Researcher(BaseModel):
    id: str
    name: str
    title: str
    institution: str
    specialization: str
    expeditions_count: int
    avatar_url: str

class ScienceTopic(BaseModel):
    id: str
    name: str
    category: str
    description: str

class Dataset(BaseModel):
    id: str
    identifier: str
    title: str
    description: str
    science_category: str
    region: str
    station_id: Optional[str] = None
    expedition_id: Optional[str] = None
    temporal_coverage: str
    spatial_coverage: str
    parameters: List[str]
    data_format: str
    access_status: str  # "Open Access" | "Restricted" | "Upon Request"
    provider: str
    doi: Optional[str] = None
    last_updated: str
    provenance: str
    sample_data: Optional[List[Dict[str, Any]]] = None

class Publication(BaseModel):
    id: str
    title: str
    authors: List[str]
    journal: str
    year: int
    volume_issue: Optional[str] = None
    doi: str
    abstract: str
    region: str
    research_topic: str
    expedition_id: Optional[str] = None
    station_id: Optional[str] = None
    citation_count: int
    pdf_available: bool

class MediaAsset(BaseModel):
    id: str
    title: str
    type: str  # "photo" | "video"
    region: str
    station_id: Optional[str] = None
    expedition_id: Optional[str] = None
    date: str
    caption: str
    thumbnail_url: str
    media_url: str
    credit: str
    source: str
    license: str
    tags: List[str]

class Activity(BaseModel):
    id: str
    title: str
    type: str  # "Expedition Update" | "Institutional" | "Conference" | "Outreach" | "Announcement"
    date: str
    summary: str
    content: str
    region: Optional[str] = None
    expedition_id: Optional[str] = None
    source: str
    image_url: Optional[str] = None

class Expedition(BaseModel):
    id: str
    code: str
    name: str
    region: str
    dates: str
    year: int
    status: str  # "Active" | "Completed" | "Planning"
    leader_name: str
    leader_title: str
    vessel: Optional[str] = None
    summary: str
    mission_overview: str
    objectives: List[str]
    research_themes: List[str]
    field_locations: List[str]
    researchers: List[str]
    hero_image: str
    hero_image_credit: str
    connected_datasets: List[str] = []
    connected_publications: List[str] = []
    connected_media: List[str] = []

class ContentDraft(BaseModel):
    id: str
    source_type: str  # "expedition" | "dataset" | "publication" | "activity"
    source_id: str
    source_title: str
    title: str
    created_at: str
    status: str  # "Draft" | "Review" | "Approved" | "Scheduled" | "Published"
    reviewer: Optional[str] = None
    scheduled_for: Optional[str] = None
    website_article: str
    instagram_post: str
    x_post: str
    linkedin_post: str
    youtube_description: str
    newsletter_summary: str
    citations: List[Dict[str, str]]

class ContentReviewRequest(BaseModel):
    draft_id: str
    action: str  # "approve" | "schedule" | "reject" | "update"
    reviewer: str = "Editorial Board"
    scheduled_for: Optional[str] = None
    updated_content: Optional[Dict[str, str]] = None

class GenerateContentRequest(BaseModel):
    source_type: str
    source_id: str
    tone: Optional[str] = "Scientific Outreach"
    target_audience: Optional[str] = "General Public & Students"

class SearchResultItem(BaseModel):
    id: str
    type: str  # "expedition" | "dataset" | "publication" | "media" | "station" | "activity"
    title: str
    subtitle: str
    region: str
    url: str
    badge: str
    snippet: str

class SearchResponse(BaseModel):
    query: str
    total_results: int
    results_by_type: Dict[str, List[SearchResultItem]]
    connected_entities_count: int

class KnowledgeGraphNode(BaseModel):
    id: str
    name: str
    type: str  # "station" | "expedition" | "dataset" | "publication" | "topic" | "researcher"
    region: Optional[str] = None
    details: str

class KnowledgeGraphLink(BaseModel):
    source: str
    target: str
    relationship: str

class KnowledgeGraphResponse(BaseModel):
    nodes: List[KnowledgeGraphNode]
    links: List[KnowledgeGraphLink]
