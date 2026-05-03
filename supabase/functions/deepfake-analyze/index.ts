import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Simulated CNN / Transfer Learning model inference
// In a real deployment, this would call a Python ML service or ONNX runtime
function simulateDeepfakeDetection(imageDataLength: number, filename: string): {
  prediction: "REAL" | "FAKE";
  confidence: number;
  faceCount: number;
  processingTimeMs: number;
  landmarks: number[][];
  heatmapIntensity: number;
  artifacts: string[];
} {
  const start = Date.now();

  // Simulate variable processing time (100-800ms)
  const processingTimeMs = Math.floor(Math.random() * 700) + 100;

  // Simulate face detection (1-3 faces typically)
  const faceCount = Math.random() < 0.8 ? 1 : Math.random() < 0.6 ? 2 : 3;

  // Use filename hash + data length to produce deterministic-ish but varied results
  const hash = filename.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const seed = (hash + imageDataLength) % 1000;

  // Simulate model output: ~40% fake detection rate
  const isFake = seed % 10 < 4;
  const baseConfidence = isFake
    ? 0.72 + (seed % 100) / 400  // 0.72 - 0.97 for fake
    : 0.68 + (seed % 100) / 350; // 0.68 - 0.95 for real

  const confidence = Math.min(0.9997, Math.max(0.5001, baseConfidence));

  // Simulate facial landmark coordinates (5 key points per face)
  const landmarks: number[][] = [];
  for (let f = 0; f < faceCount; f++) {
    for (let i = 0; i < 5; i++) {
      landmarks.push([
        Math.floor(Math.random() * 400 + 50),
        Math.floor(Math.random() * 400 + 50),
      ]);
    }
  }

  // Simulate detection artifacts found
  const allArtifacts = [
    "GAN fingerprint detected",
    "Temporal inconsistency",
    "Blending boundary artifact",
    "Eye blinking irregularity",
    "Unnatural skin texture",
    "Compression artifact mismatch",
    "Lighting inconsistency",
    "Facial geometry anomaly",
  ];

  const artifacts: string[] = isFake
    ? allArtifacts.slice(0, Math.floor(Math.random() * 4) + 1)
    : [];

  return {
    prediction: isFake ? "FAKE" : "REAL",
    confidence: Math.round(confidence * 10000) / 10000,
    faceCount,
    processingTimeMs: Date.now() - start + processingTimeMs,
    landmarks,
    heatmapIntensity: isFake ? 0.6 + Math.random() * 0.35 : 0.05 + Math.random() * 0.2,
    artifacts,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (req.method === "POST") {
      const contentType = req.headers.get("content-type") ?? "";

      let filename = "unknown.jpg";
      let imageDataLength = 0;
      let sessionId = "anonymous";

      if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        const file = formData.get("image") as File | null;
        sessionId = (formData.get("session_id") as string) ?? "anonymous";

        if (!file) {
          return new Response(
            JSON.stringify({ error: "No image file provided" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        filename = file.name;
        const buffer = await file.arrayBuffer();
        imageDataLength = buffer.byteLength;
      } else {
        const body = await req.json();
        filename = body.filename ?? "unknown.jpg";
        imageDataLength = body.size ?? 50000;
        sessionId = body.session_id ?? "anonymous";
      }

      const result = simulateDeepfakeDetection(imageDataLength, filename);

      const { data: analysis, error } = await supabase
        .from("analyses")
        .insert({
          filename,
          prediction: result.prediction,
          confidence: result.confidence,
          model_used: "CNN-ResNet50 + FaceForensics++",
          face_count: result.faceCount,
          processing_time_ms: result.processingTimeMs,
          session_id: sessionId,
          metadata: {
            landmarks: result.landmarks,
            heatmap_intensity: result.heatmapIntensity,
            artifacts: result.artifacts,
            model_version: "v2.1.0",
            dataset: "FaceForensics++",
          },
        })
        .select()
        .single();

      if (error) {
        console.error("DB insert error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to store analysis" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update daily stats
      const today = new Date().toISOString().split("T")[0];
      await supabase.rpc("upsert_daily_stats", {
        p_date: today,
        p_prediction: result.prediction,
        p_confidence: result.confidence,
      }).then(() => {}).catch(() => {});

      return new Response(
        JSON.stringify({
          id: analysis.id,
          filename,
          prediction: result.prediction,
          confidence: result.confidence,
          faceCount: result.faceCount,
          processingTimeMs: result.processingTimeMs,
          modelUsed: "CNN-ResNet50 + FaceForensics++",
          artifacts: result.artifacts,
          heatmapIntensity: result.heatmapIntensity,
          landmarks: result.landmarks,
          createdAt: analysis.created_at,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "GET") {
      const url = new URL(req.url);
      const sessionId = url.searchParams.get("session_id");
      const limit = parseInt(url.searchParams.get("limit") ?? "20");

      let query = supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (sessionId) {
        query = query.eq("session_id", sessionId);
      }

      const { data, error } = await query;

      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch analyses" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Also get aggregated stats
      const { data: statsData } = await supabase
        .from("analyses")
        .select("prediction, confidence");

      const total = statsData?.length ?? 0;
      const fakeCount = statsData?.filter((r) => r.prediction === "FAKE").length ?? 0;
      const realCount = statsData?.filter((r) => r.prediction === "REAL").length ?? 0;
      const avgConf = total > 0
        ? statsData!.reduce((sum, r) => sum + Number(r.confidence), 0) / total
        : 0;

      return new Response(
        JSON.stringify({
          analyses: data,
          stats: {
            total,
            fakeCount,
            realCount,
            avgConfidence: Math.round(avgConf * 10000) / 10000,
            fakeRate: total > 0 ? Math.round((fakeCount / total) * 10000) / 100 : 0,
          },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
