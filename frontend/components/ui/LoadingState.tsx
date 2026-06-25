interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-aws-border border-t-aws-orange" />
      <p className="text-sm text-aws-text-secondary">{label}</p>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse divide-y divide-aws-border border border-aws-border bg-white">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex gap-4 px-4 py-4">
          <div className="h-4 w-1/4 rounded bg-aws-border" />
          <div className="h-4 w-1/5 rounded bg-aws-border" />
          <div className="h-4 w-1/6 rounded bg-aws-border" />
          <div className="h-4 flex-1 rounded bg-aws-border" />
        </div>
      ))}
    </div>
  );
}
