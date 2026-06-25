import Link from "next/link";

export function ComingSoon() {
  return (
    <div className="rounded border border-aws-border bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-aws-bg text-aws-orange">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-8 w-8">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-normal text-aws-text">Coming Soon</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-aws-text-secondary">
        This Route 53 section is not available in the clone yet. You can continue
        managing hosted zones and DNS records from the enabled navigation items.
      </p>
      <Link
        href="/hosted-zones"
        className="mt-6 inline-flex text-sm font-medium text-aws-link hover:underline"
      >
        Go to Hosted Zones
      </Link>
    </div>
  );
}
