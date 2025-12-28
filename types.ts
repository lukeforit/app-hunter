
export enum WorkMode {
  ON_SITE = 'On-site',
  REMOTE = 'Remote',
  HYBRID = 'Hybrid'
}

export enum JobStatus {
  SENT = 'Sent',
  INTERVIEWING = 'Interviewing',
  REJECTED = 'Rejected'
}

export interface JobEntry {
  id: string;
  companyName: string;
  role: string;
  location: string;
  workMode: WorkMode;
  dateApplied: string;
  link: string;
  status: JobStatus;
}

export interface AIJobExtraction {
  companyName: string;
  role: string;
  location: string;
  workMode: WorkMode;
  link?: string;
}

export type JobFormData = Omit<JobEntry, 'id'>;
