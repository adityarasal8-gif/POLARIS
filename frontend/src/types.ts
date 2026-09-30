export interface Station {
  id: string;
  name: string;
  region: string;
  location_description: string;
  latitude: float;
  longitude: float;
  elevation_m: number;
  commissioned_year: number;
  status: string;
  purpose: string;
  research_themes: string[];
  image_url: string;
  image_credit: string;
}

export type float = number;

export interface StationWeather {
  station_id: string;
  station_name: string;
  region: string;
  latitude: number;
  longitude: number;
  temperature_c: number;
  wind_speed_kmh: number;
  wind_direction_deg?: number;
  relative_humidity_pct: number;
  surface_pressure_hpa: number;
  timestamp: string;
  source: string;
  source_url: string;
  status: 'live' | 'cached' | 'fallback';
  condition_description: string;
}

export interface TelemetryHourlyReading {
  time: string;
  hour_label: string;
  temperature_c: number;
  apparent_temperature_c: number;
  surface_pressure_hpa: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  relative_humidity_pct: number;
  dew_point_c: number;
  solar_radiation_wm2: number;
}

export interface StationTelemetrySummary {
  min_temperature_c: number;
  max_temperature_c: number;
  avg_temperature_c: number;
  min_wind_speed_kmh: number;
  max_wind_speed_kmh: number;
  avg_wind_speed_kmh: number;
  min_pressure_hpa: number;
  max_pressure_hpa: number;
  pressure_trend_hpa: number;
  avg_relative_humidity_pct: number;
  peak_solar_radiation_wm2: number;
}

export interface StationSensorHealth {
  sensor_id: string;
  name: string;
  parameter: string;
  model: string;
  status: 'Nominal' | 'Calibrated' | 'Degraded' | 'Offline';
  accuracy: string;
  last_calibration: string;
}

export interface StationOperationalStatus {
  uplink_carrier: string;
  uplink_status: string;
  ping_latency_ms: number;
  packet_success_rate: number;
  power_system: string;
  solar_generation_kw: number;
  wind_generation_kw: number;
  battery_bank_pct: number;
  wintering_crew_size: number;
  station_commander: string;
}

export interface StationHistoryResponse {
  station_id: string;
  station_name: string;
  region: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  timestamp: string;
  status: 'live' | 'cached' | 'fallback';
  readings_count: number;
  readings: TelemetryHourlyReading[];
  summary: StationTelemetrySummary;
  sensors: StationSensorHealth[];
  operational: StationOperationalStatus;
  source: string;
  source_url: string;
}

export interface Dataset {
  id: string;
  identifier: string;
  title: string;
  description: string;
  science_category: string;
  region: string;
  station_id?: string;
  expedition_id?: string;
  temporal_coverage: string;
  spatial_coverage: string;
  parameters: string[];
  data_format: string;
  access_status: string;
  provider: string;
  doi?: string;
  last_updated: string;
  provenance: string;
  sample_data?: any[];
}

export interface Expedition {
  id: string;
  code: string;
  name: string;
  region: string;
  dates: string;
  year: number;
  status: string;
  leader_name: string;
  leader_title: string;
  vessel?: string;
  summary: string;
  mission_overview: string;
  objectives: string[];
  research_themes: string[];
  field_locations: string[];
  researchers: string[];
  hero_image: string;
  hero_image_credit: string;
  connected_datasets: string[];
  connected_publications: string[];
  connected_media: string[];
  datasets_detail?: any[];
  publications_detail?: any[];
  media_detail?: any[];
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  volume_issue?: string;
  doi: string;
  abstract: string;
  region: string;
  research_topic: string;
  expedition_id?: string;
  station_id?: string;
  citation_count: number;
  pdf_available: boolean;
}

export interface MediaAsset {
  id: string;
  title: string;
  type: 'photo' | 'video';
  region: string;
  station_id?: string;
  expedition_id?: string;
  date: string;
  caption: string;
  thumbnail_url: string;
  media_url: string;
  credit: string;
  source: string;
  license: string;
  tags: string[];
}

export interface Activity {
  id: string;
  title: string;
  type: string;
  date: string;
  summary: string;
  content: string;
  region?: string;
  expedition_id?: string;
  source: string;
  image_url?: string;
  tags?: string[];
  url?: string;
}

export interface Researcher {
  id: string;
  name: string;
  title: string;
  institution: string;
  specialization: string;
  expeditions_count: number;
  avatar_url: string;
}

export interface ScienceTopic {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface ContentDraft {
  id: string;
  source_type: string;
  source_id: string;
  source_title: string;
  title: string;
  created_at: string;
  status: 'Draft' | 'Review' | 'Approved' | 'Scheduled' | 'Published' | 'Rejected';
  reviewer?: string;
  scheduled_for?: string;
  website_article: string;
  instagram_post: string;
  x_post: string;
  linkedin_post: string;
  youtube_description: string;
  newsletter_summary: string;
  citations: Array<{ source_field: string; reference: string }>;
}

export interface SearchResultItem {
  id: string;
  type: 'expedition' | 'dataset' | 'publication' | 'media' | 'station' | 'activity';
  title: string;
  subtitle: string;
  region: string;
  url: string;
  badge: string;
  snippet: string;
}

export interface SearchResponse {
  query: string;
  total_results: number;
  results_by_type: {
    expeditions: SearchResultItem[];
    datasets: SearchResultItem[];
    publications: SearchResultItem[];
    stations: SearchResultItem[];
    media: SearchResultItem[];
    activities: SearchResultItem[];
  };
  connected_entities_count: number;
}

export interface Stats {
  expeditions: number;
  datasets: number;
  publications: number;
  media_assets: number;
  stations: number;
  activities: number;
  researchers: number;
}

export interface KnowledgeGraphNode {
  id: string;
  name: string;
  type: string;
  region?: string;
  details: string;
}

export interface KnowledgeGraphLink {
  source: string;
  target: string;
  relationship: string;
}

export interface KnowledgeGraphResponse {
  nodes: KnowledgeGraphNode[];
  links: KnowledgeGraphLink[];
}
