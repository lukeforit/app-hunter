import { useState, useMemo, useCallback, useEffect } from 'react';
import { JobEntry, JobStatus, WorkMode } from '../types';

export function useFilteredJobs(jobs: JobEntry[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | null>(null);
  const [workModeFilter, setWorkModeFilter] = useState<WorkMode | null>(null);

  // Sync debounced search query with a 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredJobs = useMemo(() => {
    // Return early if there are no jobs to avoid unnecessary computation
    if (!jobs || jobs.length === 0) return [];

    const searchLower = debouncedSearchQuery.toLowerCase();

    // If no filters are active, return the original array
    if (!searchLower && statusFilter === null && workModeFilter === null) {
      return jobs;
    }

    return jobs.filter(j => {
      // 1. Check inexpensive exact-match filters first
      if (statusFilter !== null && j.status !== statusFilter) return false;
      if (workModeFilter !== null && j.workMode !== workModeFilter) return false;

      // 2. Check expensive string matches last
      if (searchLower) {
        if ((j.companyName || '').toLowerCase().includes(searchLower)) return true;
        if ((j.role || '').toLowerCase().includes(searchLower)) return true;
        if ((j.location || '').toLowerCase().includes(searchLower)) return true;
        return false;
      }
      
      return true;
    });
  }, [jobs, debouncedSearchQuery, statusFilter, workModeFilter]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setStatusFilter(null);
    setWorkModeFilter(null);
  }, []);

  return {
    filteredJobs,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    workModeFilter,
    setWorkModeFilter,
    clearFilters
  };
}
