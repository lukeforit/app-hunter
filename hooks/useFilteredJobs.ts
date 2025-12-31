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
    return jobs.filter(j => {
      const matchesSearch = [j.companyName, j.role, j.location].some(f => 
        (f || '').toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      const matchesStatus = statusFilter === null || j.status === statusFilter;
      const matchesWorkMode = workModeFilter === null || j.workMode === workModeFilter;
      
      return matchesSearch && matchesStatus && matchesWorkMode;
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
