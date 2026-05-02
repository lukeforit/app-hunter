import React from 'react';
import i18n from './i18n';
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
  onSuccess: (data: JobEntry[]) => void,
  onError: (msg: string) => void
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target?.result as string);
      if (Array.isArray(data)) {
        onSuccess(data);
        // Success feedback is handled by the caller (e.g. a toast notification).
      } else {
        throw new Error('Invalid format');
      }
    } catch {
      onError(i18n.t('common.importError'));
    }
  };
  reader.readAsText(file);
  // Reset value so the same file can be selected again.
  e.target.value = '';
};