import { Button } from "@/components/ui/Button";

interface PaginationProps {
  total: number;
  skip: number;
  limit: number;
  onPageChange: (skip: number) => void;
}

export function Pagination({ total, skip, limit, onPageChange }: PaginationProps) {
  if (total === 0) return null;

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = skip + 1;
  const end = Math.min(skip + limit, total);

  return (
    <div className="flex flex-col gap-3 border-t border-aws-border bg-aws-bg px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-aws-text-secondary">
        Showing {start}-{end} of {total}
      </p>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(0, skip - limit))}
        >
          Previous
        </Button>
        <span className="min-w-24 text-center text-sm text-aws-text-secondary">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          size="sm"
          variant="secondary"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(skip + limit)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
