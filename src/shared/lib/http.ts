/** Cliente HTTP mínimo. Único punto de la app que habla con la red. */

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly url: string,
  ) {
    super(`HTTP ${status} en ${url}`);
    this.name = 'HttpError';
  }
}

export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new HttpError(response.status, url);
  return (await response.json()) as T;
}
