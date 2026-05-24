import { JobStatus, WorkMode } from '../types';

export const getStatusLabel = (status: JobStatus, t: (key: string) => string): string => {
  switch (status) {
    case JobStatus.SENT: return t('common.sent');
    case JobStatus.INTERVIEWING: return t('common.interviewing');
    case JobStatus.REJECTED: return t('common.rejected');
    default: return status;
  }
};

export const getWorkModeLabel = (mode: WorkMode, t: (key: string) => string): string => {
  switch (mode) {
    case WorkMode.REMOTE: return t('common.remote');
    case WorkMode.ON_SITE: return t('common.onSite');
    case WorkMode.HYBRID: return t('common.hybrid');
    default: return mode;
  }
};
