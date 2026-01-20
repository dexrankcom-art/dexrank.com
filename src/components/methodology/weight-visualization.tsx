interface WeightItem {
  name: string;
  weight: number;
  color: string;
}

interface WeightVisualizationProps {
  weights: WeightItem[];
  title?: string;
}

export function WeightVisualization({ weights, title = "Score Composition" }: WeightVisualizationProps) {
  const total = weights.reduce((sum, w) => sum + w.weight, 0);

  return (
    <div className="bg-muted/50 rounded-lg p-6">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}

      {/* Visual bar */}
      <div className="h-8 rounded-full overflow-hidden flex mb-4">
        {weights.map((item) => (
          <div
            key={item.name}
            className={item.color}
            style={{ width: `${(item.weight / total) * 100}%` }}
            title={`${item.name}: ${((item.weight / total) * 100).toFixed(0)}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {weights.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-sm">
              {item.name}: <span className="font-medium">{((item.weight / total) * 100).toFixed(0)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
