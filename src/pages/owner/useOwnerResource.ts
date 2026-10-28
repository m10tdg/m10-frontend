import { useCallback, useEffect, useState } from "react";

// Loads data for an owner console page and exposes a `reload` for refresh buttons.
export function useOwnerResource<T>(fetcher: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetcher());
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, failed, reload };
}
