interface ScoreBreakdownProps {
  scores: Record<string, number>;
}

const labels: Record<string, string> = {
  keywords: "Keyword Match",
  formatting: "Formatting & Structure",
  achievements: "Achievement Quantification",
  relevance: "Relevance to Job Description",
  readability: "Readability",
};

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  const getColor = (score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-4">
      {Object.entries(scores).map(([key, value]) => (
        <div key={key}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              {labels[key] || key}
            </span>
            <span className="text-sm font-semibold text-gray-900">{value}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ease-out ${getColor(value)}`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
