import { useEffect, useState } from "react";

/**
 *
 * @param {any} initialData
 * @param {()=>Promise<import("axios").AxiosResponse>} fn
 */
export default function useApiRequest(initialData, fn) {
  const [data, setData] = useState(initialData);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fn();
        setData(res.data);
      } catch (error) {
        setError(error);
      }

      setLoading(false);
    })();
  }, [fn]);

  return { data, setData, error, loading };
}
