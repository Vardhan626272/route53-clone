/** Backend API origin. Override with NEXT_PUBLIC_API_URL in .env.local. */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

/** Client-side base path proxied to the backend via next.config rewrites. */
export const API_BASE_URL = "/api";
