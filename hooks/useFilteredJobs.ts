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
    if (!jobs?.length) {
      return jobs || [];
    }

    const searchLower = debouncedSearchQuery.toLowerCase().trim();

    if (!searchLower && statusFilter === null && workModeFilter === null) {
      return jobs;
    }

    return jobs.filter((job) => {
      const matchesStatus = statusFilter === null || job.status === statusFilter;
      const matchesWorkMode = workModeFilter === null || job.workMode === workModeFilter;

      if (!matchesStatus || !matchesWorkMode) {
        return false;
      }

      if (!searchLower) {
        return true;
      }

      return (
        (job.companyName || '').toLowerCase().includes(searchLower) ||
        (job.role || '').toLowerCase().includes(searchLower) ||
        (job.location || '').toLowerCase().includes(searchLower)
      );
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
