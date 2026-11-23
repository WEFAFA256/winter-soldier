const DEFAULT_WORKER_URL = "https://serenity-pawapay-webhook.turyatembajohn905.workers.dev";

export function workerBase(): string {
  return (
    process.env.PAY_API_URL ||
    process.env.NEXT_PUBLIC_PAY_API_URL ||
    DEFAULT_WORKER_URL
  ).replace(/\/$/, "");
}

export interface WorkerResult<T = any> {
  response: Response;
  data: T | null;
}

/**
 * Thin server-side bridge to the Worker that owns R2. The ADMIN_API_TOKEN is a
 * server/Worker secret: it is never returned to the browser. Admin writes use
 * a Bearer header; public reads need none.
 */
export async function workerApi<T = any>(
  path: string,
  init: RequestInit = {},
  options: { admin?: boolean } = {}
): Promise<WorkerResult<T>> {
  const headers = new Headers(init.headers || {});
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  if (options.admin !== false) {
    const token = process.env.ADMIN_API_TOKEN;
    if (token) headers.set("authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${workerBase()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  const data = (await response.json().catch(() => null)) as T | null;
  return { response, data };
}

export function workerMediaPath(key: string): string {
  return `/media/${String(key || "").replace(/^\/+/, "")}`;
}

export function workerMediaUrl(key: string): string {
  return `${workerBase()}${workerMediaPath(key)}`;
}
