import { useState, useEffect, useCallback, useRef } from 'react';
import { JobEntry, JobFormData } from '../types';

const STORAGE_KEY = 'the_hunter_jobs_v2';

export function useJobs() {
  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load jobs on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setJobs(parsed);
        }
      } catch (e) {
        console.error("Failed to parse stored jobs:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save jobs only after initial load to prevent overwriting with empty array
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
      } catch (e) {
        console.error("Failed to save jobs to localStorage:", e);
      }
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
    isLoaded
  };
}