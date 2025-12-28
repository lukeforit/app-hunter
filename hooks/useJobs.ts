
import { useState, useEffect, useCallback } from 'react';
import { JobEntry, JobFormData } from '../types';

const STORAGE_KEY = 'the_hunter_jobs_v2';

export function useJobs() {
  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setJobs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse stored jobs", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    }
  }, [jobs, isLoaded]);

  const addJob = useCallback((data: JobFormData) => {
    const newJob: JobEntry = {
      ...data,
      id: crypto.randomUUID(),
    };
    setJobs((prev) => [newJob, ...prev]);
  }, []);

  const updateJob = useCallback((id: string, data: Partial<JobEntry>) => {
    setJobs((prev) => prev.map((job) => (job.id === id ? { ...job, ...data } : job)));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }, []);

  const importJobs = useCallback((imported: JobEntry[]) => {
    setJobs(imported);
  }, []);

  return {
    jobs,
    addJob,
    updateJob,
    deleteJob,
    importJobs,
  };
}
