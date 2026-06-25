interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-aws-border pb-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-2xl font-normal text-aws-text">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-aws-text-secondary">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

export function Panel({ children, className = "" }: PanelProps) {
  return (
    <section className={`overflow-hidden rounded border border-aws-border bg-white shadow-sm ${className}`}>
      {children}
    </section>
  );
}

export function PanelToolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-aws-border bg-aws-bg px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
      {children}
    </div>
  );
}

interface TableProps {
  children: React.ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-aws-border text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-[#fafafa]">
      <tr className="text-left text-xs font-semibold uppercase tracking-wide text-aws-text-secondary">
        {children}
      </tr>
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-aws-border bg-white">{children}</tbody>;
}

export function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 ${className}`}>{children}</th>;
}

export function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top text-aws-text ${className}`}>{children}</td>;
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning";
}) {
  const toneClasses = {
    neutral: "bg-aws-bg text-aws-text-secondary border-aws-border",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
  }[tone];

  return (
    <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${toneClasses}`}>
      {children}
    </span>
  );
}
