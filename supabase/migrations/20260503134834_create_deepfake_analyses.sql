/*
  # DeepFake Detection System - Initial Schema

  ## Tables

  ### `analyses`
  Stores results of deepfake detection analyses submitted by users.
  - `id` - UUID primary key
  - `filename` - original uploaded file name
  - `image_url` - stored/referenced image URL (optional for demo)
  - `prediction` - "REAL" or "FAKE"
  - `confidence` - confidence score 0.0 to 1.0
  - `model_used` - model name used for detection
  - `face_count` - number of faces detected in the image
  - `processing_time_ms` - how long the analysis took
  - `metadata` - JSON blob for extra details (landmarks, heatmap data, etc.)
  - `session_id` - anonymous session identifier to group user uploads
  - `created_at` - timestamp

  ### `stats`
  Aggregated statistics for the dashboard.
  - `id` - UUID primary key
  - `date` - date of stats
  - `total_analyses` - total images analyzed
  - `fake_detected` - fake images detected
  - `real_detected` - real images detected
  - `avg_confidence` - average confidence score

  ## Security
  - RLS enabled on both tables
  - Public read/insert on analyses (no auth required for demo tool)
  - Public read on stats
*/

CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL DEFAULT '',
  image_url text DEFAULT '',
  prediction text NOT NULL DEFAULT 'UNKNOWN' CHECK (prediction IN ('REAL', 'FAKE', 'UNKNOWN')),
  confidence numeric(5,4) NOT NULL DEFAULT 0.0 CHECK (confidence >= 0 AND confidence <= 1),
  model_used text NOT NULL DEFAULT 'CNN-ResNet50',
  face_count integer NOT NULL DEFAULT 0,
  processing_time_ms integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  session_id text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stats_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  total_analyses integer NOT NULL DEFAULT 0,
  fake_detected integer NOT NULL DEFAULT 0,
  real_detected integer NOT NULL DEFAULT 0,
  avg_confidence numeric(5,4) NOT NULL DEFAULT 0.0
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analyses"
  ON analyses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read analyses"
  ON analyses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read stats"
  ON stats_daily FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can upsert stats"
  ON stats_daily FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update stats"
  ON stats_daily FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS analyses_session_id_idx ON analyses(session_id);
CREATE INDEX IF NOT EXISTS analyses_prediction_idx ON analyses(prediction);
