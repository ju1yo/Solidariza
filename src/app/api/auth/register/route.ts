// Proxy to use the original handler in `src/api/...` while keeping
// a route in the App Router (`src/app/api/...`). This preserves your
// original implementation as the single source of truth.
export { POST } from "@/api/auth/register/route";
