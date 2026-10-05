import {
  Station, StationWeather, Expedition, Dataset, Publication,
  MediaAsset, Activity, Researcher, ScienceTopic, ContentDraft,
  SearchResponse, Stats, KnowledgeGraphResponse, StationHistoryResponse,
  NetCDFPreviewResponse
} from './types';

const API_BASE = import.meta.env.PROD 
  ? 'https://polaris-backend-7tjc.onrender.com/api' 
  : '/api';

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchStations(): Promise<Station[]> {
  const res = await fetch(`${API_BASE}/stations`);
  if (!res.ok) throw new Error('Failed to fetch stations');
  return res.json();
}

export async function fetchStation(id: string): Promise<Station> {
  const res = await fetch(`${API_BASE}/stations/${id}`);
  if (!res.ok) throw new Error('Failed to fetch station');
  return res.json();
}

export async function fetchLiveObservatory(): Promise<StationWeather[]> {
  const res = await fetch(`${API_BASE}/observatory/live`);
  if (!res.ok) throw new Error('Failed to fetch live observatory');
  return res.json();
}

export async function fetchStationHistory(stationId: string): Promise<StationHistoryResponse> {
  const res = await fetch(`${API_BASE}/observatory/history/${stationId}`);
  if (!res.ok) throw new Error(`Failed to fetch history for ${stationId}`);
  return res.json();
}

export async function fetchAllStationsHistory(): Promise<StationHistoryResponse[]> {
  const res = await fetch(`${API_BASE}/observatory/history`);
  if (!res.ok) throw new Error('Failed to fetch all stations history');
  return res.json();
}

export function getStationTelemetryExportUrl(stationId: string): string {
  return `${API_BASE}/observatory/export/${stationId}`;
}

export async function fetchExpeditions(params?: { region?: string; year?: number; status?: string; q?: string }): Promise<Expedition[]> {
  const url = new URL(`${API_BASE}/expeditions`, window.location.origin);
  if (params?.region && params.region !== 'All') url.searchParams.set('region', params.region);
  if (params?.year) url.searchParams.set('year', params.year.toString());
  if (params?.status && params.status !== 'All') url.searchParams.set('status', params.status);
  if (params?.q) url.searchParams.set('q', params.q);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch expeditions');
  return res.json();
}

export async function fetchExpeditionDetail(id: string): Promise<Expedition> {
  const res = await fetch(`${API_BASE}/expeditions/${id}`);
  if (!res.ok) throw new Error('Failed to fetch expedition detail');
  return res.json();
}

export async function fetchDatasets(params?: { category?: string; region?: string; station?: string; q?: string }): Promise<Dataset[]> {
  const url = new URL(`${API_BASE}/datasets`, window.location.origin);
  if (params?.category && params.category !== 'All') url.searchParams.set('category', params.category);
  if (params?.region && params.region !== 'All') url.searchParams.set('region', params.region);
  if (params?.station && params.station !== 'All') url.searchParams.set('station', params.station);
  if (params?.q) url.searchParams.set('q', params.q);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch datasets');
  return res.json();
}

export async function fetchDatasetDetail(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/datasets/${id}`);
  if (!res.ok) throw new Error('Failed to fetch dataset detail');
  return res.json();
}

export async function fetchPublications(params?: { topic?: string; region?: string; year?: number; q?: string }): Promise<Publication[]> {
  const url = new URL(`${API_BASE}/publications`, window.location.origin);
  if (params?.topic && params.topic !== 'All') url.searchParams.set('topic', params.topic);
  if (params?.region && params.region !== 'All') url.searchParams.set('region', params.region);
  if (params?.year) url.searchParams.set('year', params.year.toString());
  if (params?.q) url.searchParams.set('q', params.q);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch publications');
  return res.json();
}

export async function fetchMedia(params?: { type?: string; region?: string; station?: string; expedition?: string; q?: string }): Promise<MediaAsset[]> {
  const url = new URL(`${API_BASE}/media`, window.location.origin);
  if (params?.type && params.type !== 'All') url.searchParams.set('type', params.type);
  if (params?.region && params.region !== 'All') url.searchParams.set('region', params.region);
  if (params?.station && params.station !== 'All') url.searchParams.set('station', params.station);
  if (params?.expedition && params.expedition !== 'All') url.searchParams.set('expedition', params.expedition);
  if (params?.q) url.searchParams.set('q', params.q);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch media');
  return res.json();
}

export async function fetchActivities(params?: { type?: string; region?: string }): Promise<Activity[]> {
  const url = new URL(`${API_BASE}/activities`, window.location.origin);
  if (params?.type && params.type !== 'All') url.searchParams.set('type', params.type);
  if (params?.region && params.region !== 'All') url.searchParams.set('region', params.region);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch activities');
  return res.json();
}

export async function fetchResearchers(): Promise<Researcher[]> {
  const res = await fetch(`${API_BASE}/researchers`);
  if (!res.ok) throw new Error('Failed to fetch researchers');
  return res.json();
}

export async function fetchTopics(): Promise<ScienceTopic[]> {
  const res = await fetch(`${API_BASE}/topics`);
  if (!res.ok) throw new Error('Failed to fetch topics');
  return res.json();
}

export async function unifiedSearch(query: string, type?: string, region?: string): Promise<SearchResponse> {
  const url = new URL(`${API_BASE}/search`, window.location.origin);
  url.searchParams.set('q', query);
  if (type && type !== 'all') url.searchParams.set('type', type);
  if (region && region !== 'all') url.searchParams.set('region', region);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to execute search');
  return res.json();
}

export async function generateContent(source_type: string, source_id: string): Promise<ContentDraft> {
  const res = await fetch(`${API_BASE}/content/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_type, source_id })
  });
  if (!res.ok) throw new Error('Failed to generate content');
  return res.json();
}

export async function fetchContentDrafts(): Promise<ContentDraft[]> {
  const res = await fetch(`${API_BASE}/content/drafts`);
  if (!res.ok) throw new Error('Failed to fetch content drafts');
  return res.json();
}

export async function reviewContentDraft(draftId: string, action: string, reviewer?: string, scheduled_for?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/content/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      draft_id: draftId,
      action,
      reviewer: reviewer || 'Content Editorial Board',
      scheduled_for
    })
  });
  if (!res.ok) throw new Error('Failed to review draft');
  return res.json();
}

export async function fetchContentCalendar(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/content/calendar`);
  if (!res.ok) throw new Error('Failed to fetch calendar');
  return res.json();
}

export async function fetchKnowledgeGraph(): Promise<KnowledgeGraphResponse> {
  const res = await fetch(`${API_BASE}/knowledge-graph`);
  if (!res.ok) throw new Error('Failed to fetch knowledge graph');
  return res.json();
}

export async function fetchNetCDFPreview(datasetId: string): Promise<NetCDFPreviewResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}/netcdf-preview`);
    if (res.status === 404) return null; // Dataset doesn't support NetCDF
    if (!res.ok) throw new Error('Failed to fetch NetCDF preview');
    return res.json();
  } catch {
    return null;
  }
}
