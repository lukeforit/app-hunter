
import React from 'react';
import { MapPin, Calendar, ExternalLink, Trash2, Settings2 } from 'lucide-react';
import { JobEntry, JobStatus } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatDate } from '../../../lib/utils';

interface JobCardProps {
  job: JobEntry;
  compact?: boolean;
  onEdit: (job: JobEntry) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: JobStatus) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, compact, onEdit, onDelete, onStatusChange }) => {
  return (
    <div className={`group relative bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all ${compact ? 'p-3 flex items-center gap-4' : 'p-5 flex flex-col gap-4'}`}>
      <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} bg-zinc-800/50 rounded-lg flex items-center justify-center shrink-0 border border-zinc-800 group-hover:border-zinc-700 transition-colors`}>
        <span className="font-bold text-zinc-400">{job.companyName[0].toUpperCase()}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h4 className={`font-bold text-zinc-100 truncate ${compact ? 'text-sm' : 'text-base'}`}>{job.role}</h4>
            <p className="text-zinc-500 text-xs truncate">{job.companyName}</p>
          </div>
          {!compact && <Badge variant={job.status}>{job.status}</Badge>}
        </div>

        {!compact && (
          <div className="mt-3 flex flex-wrap gap-y-2 gap-x-4 text-[11px] text-zinc-500 font-medium">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              {job.location} • {job.workMode}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {formatDate(job.dateApplied)}
            </div>
          </div>
        )}
      </div>

      <div className={`flex items-center ${compact ? 'gap-2' : 'justify-between mt-2'}`}>
        {compact && <Badge variant={job.status}>{job.status}</Badge>}
        
        <div className="flex items-center gap-1">
          {job.link && (
            <a href={job.link} target="_blank" rel="noopener" className="p-2 text-zinc-500 hover:text-white transition-all">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <Button variant="ghost" size="icon" onClick={() => onEdit(job)}>
            <Settings2 className="w-4 h-4" />
          </Button>
          <Button variant="danger" size="icon" onClick={() => onDelete(job.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {!compact && (
          <select 
            value={job.status} 
            onChange={(e) => onStatusChange(job.id, e.target.value as JobStatus)}
            className="bg-zinc-800 text-[10px] font-bold border-none rounded-lg px-2 py-1.5 text-zinc-400 focus:ring-0 outline-none cursor-pointer hover:text-white transition-colors"
          >
            {Object.values(JobStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>
    </div>
  );
};
