import { useState, useRef, useCallback } from 'react';
import { Upload, X, ScanFace, AlertCircle, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { analyzeImage } from '../lib/api';
import { getSessionId } from '../lib/session';
import ResultCard from '../components/ResultCard';
import type { AnalysisResult } from '../types';

type Stage = 'idle' | 'preview' | 'analyzing' | 'done' | 'error';

export default function AnalyzePage() {
  const [stage, setStage] = useState<Stage>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WebP).');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setError('');
    setStage('preview');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!file) return;
    setStage('analyzing');
    setProgress(0);

    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 85) { clearInterval(interval); return 85; }
        return p + Math.random() * 12;
      });
    }, 150);

    try {
      const sessionId = getSessionId();
      const data = await analyzeImage(file, sessionId);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setResult(data);
        setStage('done');
      }, 400);
    } catch (err) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      setStage('error');
    }
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError('');
    setProgress(0);
    setStage('idle');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-3">
            Image <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Analysis</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Upload a face image to detect deepfake manipulation using our CNN model.
          </p>
        </div>

        {/* Upload zone */}
        {(stage === 'idle' || stage === 'error') && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-200 ${
              dragOver
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-gray-700 bg-gray-900/30 hover:border-gray-600 hover:bg-gray-900/50'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            <div className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                dragOver ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-400'
              }`}>
                <Upload size={28} />
              </div>
              <div>
                <p className="text-white font-semibold text-lg mb-1">
                  {dragOver ? 'Drop to analyze' : 'Drop image here or click to browse'}
                </p>
                <p className="text-gray-500 text-sm">JPEG, PNG, WebP — max 10MB</p>
              </div>
            </div>

            {error && (
              <div className="mt-6 flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-3 rounded-xl text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
        )}

        {/* Preview */}
        {stage === 'preview' && file && previewUrl && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon size={18} className="text-gray-400" />
                <span className="text-white text-sm font-medium truncate max-w-xs">{file.name}</span>
                <span className="text-gray-500 text-xs">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
              </div>
              <button onClick={reset} className="text-gray-500 hover:text-red-400 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center gap-6">
              <div className="relative rounded-xl overflow-hidden max-h-80 border border-gray-700">
                <img src={previewUrl} alt="Preview" className="max-h-80 object-contain" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent pointer-events-none" />
              </div>
              <button
                onClick={handleAnalyze}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl text-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
              >
                <ScanFace size={20} />
                Run DeepFake Analysis
              </button>
            </div>
          </div>
        )}

        {/* Analyzing */}
        {stage === 'analyzing' && previewUrl && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6">
              <div className="relative rounded-xl overflow-hidden max-h-72 border border-gray-700 mb-6">
                <img src={previewUrl} alt="Analyzing" className="max-h-72 w-full object-contain" />
                <div className="absolute inset-0 bg-gray-900/60 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                  <p className="text-cyan-300 font-semibold">Analyzing facial patterns...</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>CNN Inference</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex gap-6 text-xs text-gray-600 mt-3">
                  {['Face Detection', 'Feature Extraction', 'Classification', 'Artifact Analysis'].map((step, i) => (
                    <span
                      key={step}
                      className={`transition-colors ${progress > i * 22 ? 'text-cyan-400' : 'text-gray-700'}`}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {stage === 'done' && result && (
          <div className="space-y-6">
            {previewUrl && (
              <div className="rounded-2xl overflow-hidden border border-gray-700 max-h-64">
                <img src={previewUrl} alt="Analyzed" className="w-full max-h-64 object-contain" />
              </div>
            )}
            <ResultCard result={result} />
            <button
              onClick={reset}
              className="w-full py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-700"
            >
              <RefreshCw size={18} />
              Analyze Another Image
            </button>
          </div>
        )}

        {/* Tips */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { tip: 'Use clear, well-lit face images for best accuracy.' },
            { tip: 'Single faces yield higher confidence scores than group photos.' },
            { tip: 'Original uncompressed images produce the most reliable results.' },
          ].map((t) => (
            <div key={t.tip} className="bg-gray-900/30 border border-gray-800 rounded-xl p-4 text-gray-500 text-xs leading-relaxed">
              {t.tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
