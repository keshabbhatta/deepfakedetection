import { EDGE_FUNCTION_URL } from './supabase';
import type { AnalysisResult, AnalysisRecord, GlobalStats } from '../types';

const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const headers = {
  Authorization: `Bearer ${ANON_KEY}`,
};

export async function analyzeImage(
  file: File,
  sessionId: string
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('session_id', sessionId);

  const res = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? 'Analysis failed');
  }

  return res.json();
}

export async function fetchHistory(sessionId: string): Promise<{
  analyses: AnalysisRecord[];
  stats: GlobalStats;
}> {
  const url = `${EDGE_FUNCTION_URL}?session_id=${encodeURIComponent(sessionId)}&limit=50`;
  const res = await fetch(url, { headers });

  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function fetchGlobalStats(): Promise<{
  analyses: AnalysisRecord[];
  stats: GlobalStats;
}> {
  const url = `${EDGE_FUNCTION_URL}?limit=100`;
  const res = await fetch(url, { headers });

  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}
