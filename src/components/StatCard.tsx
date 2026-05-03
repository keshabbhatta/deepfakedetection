interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent: 'cyan' | 'red' | 'green' | 'amber';
}

const accentMap = {
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    icon: 'text-cyan-400',
    value: 'text-cyan-300',
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-400',
    value: 'text-red-300',
  },
  green: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-400',
    value: 'text-emerald-300',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: 'text-amber-400',
    value: 'text-amber-300',
  },
};

export default function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
  const styles = accentMap[accent];
  return (
    <div className={`rounded-2xl border ${styles.border} ${styles.bg} p-5 flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl bg-gray-900/60 flex items-center justify-center ${styles.icon} flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</p>
        <p className={`text-2xl font-bold ${styles.value} leading-tight`}>{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
