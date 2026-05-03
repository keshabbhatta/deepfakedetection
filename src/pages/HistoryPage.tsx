import { useEffect, useState } from 'react';
import { fetchHistory, fetchGlobalStats } from '../lib/api';
import { getSessionId } from '../lib/session';
import StatCard from '../components/StatCard';
import ConfidenceMeter from '../components/ConfidenceMeter';
import { BarChart2, AlertTriangle, CheckCircle, Clock, RefreshCw, History, TrendingUp } from 'lucide-react';
import type { AnalysisRecord, GlobalStats } from '../types';

export default function HistoryPage() {
  const [myAnalyses, setMyAnalyses] = useState<AnalysisRecord[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mine' | 'global'>('mine');

  const load = async () => {
    setLoading(true);
    try {
      const sessionId = getSessionId();
      const [myData, globalData] = await Promise.all([
        fetchHistory(sessionId),
        fetchGlobalStats(),
      ]);
      setMyAnalyses(myData.analyses);
      setGlobalStats(globalData.stats);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              Analysis <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">History</span>
            </h1>
            <p className="text-gray-400">Track your scans and platform-wide detection statistics.</p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Global Stats */}
        {globalStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard
              label="Total Analyzed"
              value={globalStats.total}
              icon={<BarChart2 size={22} />}
              accent="cyan"
            />
            <StatCard
              label="Fakes Detected"
              value={globalStats.fakeCount}
              sub={`${globalStats.fakeRate}% of total`}
              icon={<AlertTriangle size={22} />}
              accent="red"
            />
            <StatCard
              label="Real Images"
              value={globalStats.realCount}
              icon={<CheckCircle size={22} />}
              accent="green"
            />
            <StatCard
              label="Avg. Confidence"
              value={`${Math.round(globalStats.avgConfidence * 100)}%`}
              icon={<TrendingUp size={22} />}
              accent="amber"
            />
          </div>
        )}

        {/* Fake/Real bar */}
        {globalStats && globalStats.total > 0 && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-400">Detection Distribution</span>
              <span className="text-xs text-gray-500">{globalStats.total} total scans</span>
            </div>
            <div className="h-3 rounded-full bg-gray-800 overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-700"
                style={{ width: `${globalStats.fakeRate}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700 flex-1"
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                {globalStats.fakeRate}% Fake
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {(100 - globalStats.fakeRate).toFixed(1)}% Real
              </span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'mine' as const, label: 'My Analyses', icon: <History size={15} /> },
            { id: 'global' as const, label: 'All Analyses', icon: <BarChart2 size={15} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-gray-500 hover:text-white bg-gray-900/50 border border-gray-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
          </div>
        ) : (
          <AnalysisTable
            analyses={activeTab === 'mine' ? myAnalyses : []}
            sessionId={getSessionId()}
            isGlobal={activeTab === 'global'}
          />
        )}
      </div>
    </div>
  );
}

function AnalysisTable({
  analyses,
  isGlobal,
}: {
  analyses: AnalysisRecord[];
  sessionId: string;
  isGlobal: boolean;
}) {
  const [allGlobal, setAllGlobal] = useState<AnalysisRecord[]>([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  useEffect(() => {
    if (isGlobal && allGlobal.length === 0) {
      setLoadingGlobal(true);
      fetchGlobalStats().then(d => {
        setAllGlobal(d.analyses);
        setLoadingGlobal(false);
      }).catch(() => setLoadingGlobal(false));
    }
  }, [isGlobal, allGlobal.length]);

  const rows = isGlobal ? allGlobal : analyses;

  if (loadingGlobal) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600">
        <History size={40} className="mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">No analyses yet</p>
        <p className="text-sm mt-1">Upload an image on the Analyze page to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">File</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Result</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Faces</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Time</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-white/2 transition-colors group">
                <td className="px-5 py-4">
                  <p className="text-white text-sm font-medium truncate max-w-[180px]">{r.filename}</p>
                  <p className="text-gray-600 text-xs">{r.id.slice(0, 8)}...</p>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    r.prediction === 'FAKE'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  }`}>
                    {r.prediction === 'FAKE'
                      ? <AlertTriangle size={11} />
                      : <CheckCircle size={11} />}
                    {r.prediction}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <ConfidenceMeter
                    confidence={r.confidence}
                    prediction={r.prediction as 'REAL' | 'FAKE' | 'UNKNOWN'}
                    size="sm"
                  />
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-gray-400 text-sm">{r.face_count}</td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="flex items-center gap-1 text-gray-400 text-sm">
                    <Clock size={13} />
                    {r.processing_time_ms}ms
                  </span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell text-gray-500 text-xs">
                  {new Date(r.created_at).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
