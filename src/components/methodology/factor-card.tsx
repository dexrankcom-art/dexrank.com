interface FactorCardProps {
  name: string;
  weight: string;
  description: string;
  calculation: string;
  dataSource: string;
}

export function FactorCard({
  name,
  weight,
  description,
  calculation,
  dataSource,
}: FactorCardProps) {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
          {weight}
        </span>
      </div>

      <p className="text-muted-foreground">{description}</p>

      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">How it&apos;s calculated:</span>
          <p className="text-muted-foreground">{calculation}</p>
        </div>
        <div>
          <span className="font-medium">Data source:</span>
          <p className="text-muted-foreground">{dataSource}</p>
        </div>
      </div>
    </div>
  );
}
