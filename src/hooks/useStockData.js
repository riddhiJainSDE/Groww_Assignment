// src/hooks/useStockData.js
import { useQuery } from '@tanstack/react-query';
import client from '@/services/api/client';
import { mapAlphaTimeSeries } from '@/services/api/adapters/alphaVantage';

export function useStockTimeSeries(symbol, opts = {}) {
  const provider = opts.provider ?? 'alphavantage';
  const interval = opts.intervalMs ?? 30000; // default poll 30s

  return useQuery({
    queryKey: ['stock', provider, symbol],
    queryFn: async () => {
      const res = await client.get(`/proxy/${provider}`, {
        params: { symbol, endpoint: 'TIME_SERIES_DAILY' },
      });
      return mapAlphaTimeSeries(res.data);
    },
    staleTime: interval - 500,
    refetchInterval: interval,
    retry: 2,
    enabled: !!symbol,
  });
}
