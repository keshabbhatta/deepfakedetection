import { AlertTriangle, CheckCircle, Clock, User, Cpu, AlertCircle } from 'lucide-react';
import ConfidenceMeter from './ConfidenceMeter';
import type { AnalysisResult } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const isFake = result.prediction === 'FAKE';

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${
      isFake
        ? 'border-red-500/30 bg-red-500/5'
        : 'border-emerald-500/30 bg-emerald-500/5'
    }`}>
      {/* Header banner */}
      <div className={`px-6 py-4 flex items-center gap-3 ${
        isFake ? 'bg-red-500/15' : 'bg-emerald-500/15'
      }`}>
        {isFake
          ? <AlertTriangle size={22} className="text-red-400" />
          : <CheckCircle size={22} className="text-emerald-400" />}
        <div>
          <p className={`font-bold text-lg ${isFake ? 'text-red-300' : 'text-emerald-300'}`}>
            {isFake ? 'DeepFake Detected' : 'Authentic Image'}
          </p>
          <p className="text-gray-400 text-sm">{result.filename}</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Confidence meter */}
        <div className="flex justify-center md:justify-start">
          <ConfidenceMeter confidence={result.confidence} prediction={result.prediction} size="lg" />
        </div>

        {/* Meta info */}
        <div className="space-y-3 col-span-2">
          <div className="grid grid-cols-2 gap-3">
            <InfoChip icon={<User size={14} />} label="Faces Detected" value={result.faceCount.toString()} />
            <InfoChip icon={<Clock size={14} />} label="Processing Time" value={`${result.processingTimeMs}ms`} />
            <InfoChip icon={<Cpu size={14} />} label="Model" value={result.modelUsed} />
            <InfoChip icon={<AlertCircle size={14} />} label="Analysis ID" value={result.id.slice(0, 8) + '...'} />
          </div>

          {/* Artifacts */}
          {isFake && result.artifacts.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
                Detected Artifacts
              </p>
              <div className="flex flex-wrap gap-2">
                {result.artifacts.map((artifact) => (
                  <span
                    key={artifact}
                    className="px-2.5 py-1 bg-red-500/15 border border-red-500/25 text-red-300 text-xs rounded-full"
                  >
                    {artifact}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Heatmap intensity bar */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Manipulation Heatmap Intensity
              </span>
              <span className="text-xs text-gray-400">
                {Math.round(result.heatmapIntensity * 100)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  isFake
                    ? 'bg-gradient-to-r from-amber-500 to-red-500'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                }`}
                style={{ width: `${Math.round(result.heatmapIntensity * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl px-3 py-2">
      <div className="flex items-center gap-1.5 text-gray-500 mb-0.5">
        {icon}
        <span className="text-xs uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-white text-sm font-medium truncate">{value}</p>
    </div>
  );
}
