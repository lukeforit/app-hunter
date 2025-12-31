import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Link2, Trash2, Pencil, Banknote, Building2 } from 'lucide-react';
import { JobEntry, JobStatus, WorkMode } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatDate, cn } from '../../../lib/utils';

interface JobCardProps {
  job: JobEntry;
  compact?: boolean;
  onEdit: (job: JobEntry) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: JobStatus) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, compact, onEdit, onDelete, onStatusChange }) => {
  const { t } = useTranslation();

  const getStatusLabel = (status: JobStatus) => {
    switch (status) {
      case JobStatus.SENT: return t('common.sent');
      case JobStatus.INTERVIEWING: return t('common.interviewing');
      case JobStatus.REJECTED: return t('common.rejected');
      default: return status;
    }
  };

  const getWorkModeLabel = (mode: WorkMode) => {
    switch (mode) {
      case WorkMode.REMOTE: return t('common.remote');
      case WorkMode.ON_SITE: return t('common.onSite');
      case WorkMode.HYBRID: return t('common.hybrid');
      default: return mode;
    }
  };

  const handleOpenLink = () => {
    if (job.link) {
      window.open(job.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`group relative bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all ${compact ? 'p-3 flex items-center gap-4' : 'p-5 flex flex-col gap-4'}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h4 className={`font-extrabold text-zinc-100 truncate ${compact ? 'text-base' : 'text-lg tracking-tight'}`}>
              {job.companyName}
            </h4>
            <p className="text-zinc-400 text-sm font-medium truncate flex items-center gap-1.5">
              {job.role}
            </p>
          </div>
          {!compact && <Badge variant={job.status}>{getStatusLabel(job.status)}</Badge>}
        </div>

        {!compact && (
          <div className="mt-4 space-y-2 text-[11px] text-zinc-500 font-medium">
            <div className="flex flex-wrap gap-y-1 gap-x-4">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                {job.location} • {getWorkModeLabel(job.workMode)}
              </div>
              {job.salary && (
                <div className="flex items-center gap-1.5 text-emerald-500/90">
                  <Banknote className="w-3 h-3" />
                  {job.salary}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 w-fit">
              <Calendar className="w-3 h-3" />
              {formatDate(job.dateApplied)}
            </div>
          </div>
        )}
      </div>

      <div className={`flex items-center gap-4 ${compact ? 'mt-0' : 'mt-1'}`}>
        <div className="flex items-center gap-1">
          {job.link && (
            <Button variant="blue" size="icon" onClick={handleOpenLink} title={t('common.openLink')}>
              <Link2 className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => onEdit(job)} title={t('common.updateHunt')}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="danger" size="icon" onClick={() => onDelete(job.id)} title={t('common.deleteJob')}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {compact && <Badge variant={job.status}>{getStatusLabel(job.status)}</Badge>}

        {!compact && (
          <>
            <div className="flex-1" />
            <select 
              value={job.status} 
              onChange={(e) => onStatusChange(job.id, e.target.value as JobStatus)}
              className="bg-zinc-800 text-[10px] font-bold border-none rounded-lg px-2 py-1.5 text-zinc-400 focus:ring-0 outline-none cursor-pointer hover:text-white transition-colors"
            >
              {Object.values(JobStatus).map(s => (
                <option key={s} value={s}>{getStatusLabel(s)}</option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
};