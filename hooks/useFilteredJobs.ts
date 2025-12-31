import { useState, useMemo, useCallback } from 'react';
import { JobEntry, JobStatus, WorkMode } from '../types';

export function useFilteredJobs(jobs: JobEntry[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | null>(null);
  const [workModeFilter, setWorkModeFilter] = useState<WorkMode | null>(null);

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      const matchesSearch = [j.companyName, j.role, j.location].some(f => 
        (f || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesStatus = statusFilter === null || j.status === statusFilter;
      const matchesWorkMode = workModeFilter === null || j.workMode === workModeFilter;
      
      return matchesSearch && matchesStatus && matchesWorkMode;
    });
  }, [jobs, searchQuery, statusFilter, workModeFilter]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
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
