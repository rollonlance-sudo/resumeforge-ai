"use client";

interface ScoreCircleProps {
  score: number;
  size?: number;
  label?: string;
  beforeScore?: number;
}

export function ScoreCircle({ score, size = 160, label, beforeScore }: ScoreCircleProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 75) return { stroke: "#22c55e", text: "text-green-600", bg: "bg-green-50" };
    if (s >= 50) return { stroke: "#f59e0b", text: "text-amber-600", bg: "bg-amber-50" };
    return { stroke: "#ef4444", text: "text-red-600", bg: "bg-red-50" };
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color.stroke}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${color.text}`}>{score}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      {beforeScore !== undefined && (
        <div className="flex gap-3 text-xs">
          <span className="text-gray-500">Before: {beforeScore}</span>
          <span className={color.text}>After: {score}</span>
          <span className="text-green-600">+{score - beforeScore}</span>
        </div>
      )}
    </div>
  );
}
