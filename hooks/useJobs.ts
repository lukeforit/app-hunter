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

  // Ref to hold the timeout ID for debouncing saves
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save jobs only after initial load to prevent overwriting with empty array
  // Use debouncing to prevent excessive synchronous I/O on rapid state updates
  useEffect(() => {
    if (isLoaded) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
        } catch (e) {
          if (e instanceof DOMException && e.name === 'QuotaExceededError') {
            console.error("Critical: localStorage quota exceeded. Export your data immediately to avoid loss!");
          } else {
            console.error("Failed to save jobs to localStorage:", e);
          }
        }
      }, 500); // 500ms debounce
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