import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-aws-border bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-aws-bg text-aws-muted">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-7 w-7">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M4 7h16M4 12h16M4 17h10"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-aws-text">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-aws-text-secondary">{description}</p>
      {actionLabel && onAction ? (
        <Button variant="primary" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
