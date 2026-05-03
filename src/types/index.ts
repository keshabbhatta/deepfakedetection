export interface AnalysisResult {
  id: string;
  filename: string;
  prediction: 'REAL' | 'FAKE' | 'UNKNOWN';
  confidence: number;
  faceCount: number;
  processingTimeMs: number;
  modelUsed: string;
  artifacts: string[];
  heatmapIntensity: number;
  landmarks: number[][];
  createdAt: string;
}

export interface AnalysisRecord {
  id: string;
  filename: string;
  prediction: string;
  confidence: number;
  face_count: number;
  processing_time_ms: number;
  model_used: string;
  session_id: string;
  metadata: {
    artifacts?: string[];
    heatmap_intensity?: number;
    landmarks?: number[][];
  };
  created_at: string;
}

export interface GlobalStats {
  total: number;
  fakeCount: number;
  realCount: number;
  avgConfidence: number;
  fakeRate: number;
}

export type AppView = 'home' | 'analyze' | 'history' | 'about';
