const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour

export function cachedGet(key, fetcher, ttlMs = DEFAULT_TTL_MS) {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, expiresAt } = JSON.parse(cached);
      if (Date.now() < expiresAt) {
        return Promise.resolve({ data });
      }
    }
  } catch {
    // malformed cache entry, fall through to a fresh fetch
  }

  return fetcher().then((response) => {
    try {
      localStorage.setItem(key, JSON.stringify({ data: response.data, expiresAt: Date.now() + ttlMs }));
    } catch {
      // storage full or unavailable, cache is best-effort
    }
    return response;
  });
}
