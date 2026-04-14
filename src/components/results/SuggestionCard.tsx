import { Badge } from "../ui/badge";

interface SuggestionCardProps {
  suggestion: {
    priority: string;
    category: string;
    title?: string;
    description: string;
    before?: string;
    after?: string;
  };
}

const priorityVariant: Record<string, "destructive" | "warning" | "default"> = {
  high: "destructive",
  medium: "warning",
  low: "default",
};

const categoryColors: Record<string, string> = {
  keywords: "bg-blue-100 text-blue-800",
  structure: "bg-purple-100 text-purple-800",
  content: "bg-teal-100 text-teal-800",
  formatting: "bg-orange-100 text-orange-800",
};

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={priorityVariant[suggestion.priority]}>
          {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)} Priority
        </Badge>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[suggestion.category] || ""}`}
        >
          {suggestion.category.charAt(0).toUpperCase() + suggestion.category.slice(1)}
        </span>
      </div>
      {suggestion.title && (
        <h4 className="text-sm font-semibold text-gray-900">{suggestion.title}</h4>
      )}
      <p className="text-sm text-gray-700">{suggestion.description}</p>
      {(suggestion.before || suggestion.after) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestion.before && (
            <div className="rounded-md bg-red-50 p-3 border border-red-100">
              <p className="text-xs font-medium text-red-700 mb-1">Before</p>
              <p className="text-sm text-red-900">{suggestion.before}</p>
            </div>
          )}
          {suggestion.after && (
            <div className="rounded-md bg-green-50 p-3 border border-green-100">
              <p className="text-xs font-medium text-green-700 mb-1">After</p>
              <p className="text-sm text-green-900">{suggestion.after}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
