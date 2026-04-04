import { useState, useCallback, useEffect } from "react";
import { apiFetch } from "./use-api";

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  location: string;
  items: any;
  helpType: string;
  imageUrl: string | null;
  status: string;
  createdAt: string;
  authorName: string;
  authorImage: string | null;
  latitude: number | null;
  longitude: number | null;
}

export function useFeed() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    q: "",
    helpType: "",
    status: "",
    location: "",
  });

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.q) params.set("q", filters.q);
      if (filters.helpType) params.set("helpType", filters.helpType);
      if (filters.status) params.set("status", filters.status);
      if (filters.location) params.set("location", filters.location);

      const data = await apiFetch<HelpRequest[]>(`/api/help-requests/search?${params.toString()}`);
      if (data) setRequests(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeed();
    }, 300); // Debounce for search
    
    return () => clearTimeout(timer);
  }, [fetchFeed]);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    requests,
    loading,
    error,
    filters,
    updateFilters,
    refresh: fetchFeed,
  };
}
