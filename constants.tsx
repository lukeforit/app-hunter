
import React from 'react';
import { JobStatus } from './types';

export const STORAGE_KEY = 'the_hunter_jobs';

export const STATUS_COLORS: Record<JobStatus, string> = {
  [JobStatus.SENT]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  [JobStatus.INTERVIEWING]: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  [JobStatus.REJECTED]: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const WORK_MODE_LABELS = ['On-site', 'Remote', 'Hybrid'];
export const STATUS_LABELS = ['Sent', 'Interviewing', 'Rejected'];
