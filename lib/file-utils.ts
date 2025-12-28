
import React from 'react';
import { JobEntry } from "../types";

export const exportJobs = (jobs: JobEntry[]) => {
  const blob = new Blob([JSON.stringify(jobs, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hunts-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importJobsFromFile = (
  e: React.ChangeEvent<HTMLInputElement>,
  onSuccess: (data: JobEntry[]) => void
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target?.result as string);
      if (Array.isArray(data)) {
        onSuccess(data);
        alert('Hunts imported successfully!');
      } else {
        throw new Error('Invalid format');
      }
    } catch (err) {
      alert('Invalid file format. Please provide a valid JSON array of job entries.');
    }
  };
  reader.readAsText(file);
  // Reset value to allow selecting same file again
  e.target.value = '';
};
