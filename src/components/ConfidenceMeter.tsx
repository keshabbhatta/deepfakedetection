interface ConfidenceMeterProps {
  confidence: number;
  prediction: 'REAL' | 'FAKE' | 'UNKNOWN';
  size?: 'sm' | 'lg';
}

export default function ConfidenceMeter({ confidence, prediction, size = 'lg' }: ConfidenceMeterProps) {
  const pct = Math.round(confidence * 100);
  const isFake = prediction === 'FAKE';

  const stroke = isFake ? '#ef4444' : '#10b981';
  const glow = isFake ? 'drop-shadow(0 0 8px #ef444480)' : 'drop-shadow(0 0 8px #10b98180)';
  const trackColor = '#1f2937';

  const r = size === 'lg' ? 54 : 36;
  const cx = size === 'lg' ? 64 : 44;
  const strokeWidth = size === 'lg' ? 8 : 6;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;
  const svgSize = size === 'lg' ? 128 : 88;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: glow, transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold leading-none ${size === 'lg' ? 'text-2xl' : 'text-base'}`}
            style={{ color: stroke }}>
            {pct}%
          </span>
          <span className="text-gray-500 text-xs mt-0.5">conf.</span>
        </div>
      </div>
      <span className={`font-bold tracking-widest uppercase text-sm ${isFake ? 'text-red-400' : 'text-emerald-400'}`}>
        {prediction}
      </span>
    </div>
  );
}
