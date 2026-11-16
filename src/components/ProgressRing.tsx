interface ProgressRingProps {
  progress: number;
  tone: "blue" | "emerald";
}

export function ProgressRing({ progress, tone }: ProgressRingProps) {
  const radius = 11;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const stroke = tone === "blue" ? "text-blue-600" : "text-emerald-600";
  const label = tone === "blue" ? "text-on-surface-variant" : "text-emerald-800";

  return (
    <div className="relative w-7 h-7 flex items-center justify-center">
      <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
        <circle
          cx="14"
          cy="14"
          r={radius}
          className="text-surface-container-highest stroke-current"
          strokeWidth="2.5"
          fill="transparent"
        />
        <circle
          cx="14"
          cy="14"
          r={radius}
          className={`${stroke} stroke-current transition-all`}
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <span className={`absolute font-label-specs text-[8px] font-mono font-bold ${label}`}>
        {progress}%
      </span>
    </div>
  );
}
