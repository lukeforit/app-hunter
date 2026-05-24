import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { JobEntry, JobStatus, WorkMode } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { sanitizeUrl } from '../../../lib/utils';
import { getStatusLabel, getWorkModeLabel } from '../../../lib/formatters';

const WORK_MODES = Object.values(WorkMode);

interface JobFormProps {
  initialData?: JobEntry | null;
  onSubmit: (data: Partial<JobEntry>) => void;
}

export const JobForm: React.FC<JobFormProps> = ({ initialData, onSubmit }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<Partial<JobEntry>>(initialData || {
    companyName: '',
    role: '',
    location: '',
    workMode: WorkMode.REMOTE,
    link: '',
    status: JobStatus.SENT,
    dateApplied: new Date().toISOString().split('T')[0],
    salary: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedData = {
      ...data,
      link: sanitizeUrl(data.link)
    };
    onSubmit(sanitizedData);
  };

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
      <div className="col-span-2 space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">{t('fields.role')}</label>
        <input
          required
          value={data.role || ''}
          onChange={e => setData({ ...data, role: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-zinc-600 outline-none"
          placeholder="Frontend Engineer"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">{t('fields.company')}</label>
        <input
          required
          value={data.companyName || ''}
          onChange={e => setData({ ...data, companyName: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-zinc-600 outline-none"
          placeholder="Linear"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">{t('fields.location')}</label>
        <input
          value={data.location || ''}
          onChange={e => setData({ ...data, location: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-zinc-600 outline-none"
          placeholder="Remote"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">{t('fields.salary')}</label>
        <input
          value={data.salary || ''}
          onChange={e => setData({ ...data, salary: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-zinc-600 outline-none"
          placeholder="$150,000"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">{t('fields.mode')}</label>
        <select
          value={data.workMode}
          onChange={e => setData({ ...data, workMode: e.target.value as WorkMode })}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none"
        >
          {WORK_MODES.map(m => <option key={m} value={m}>{getWorkModeLabel(m, t)}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">{t('fields.date')}</label>
        <input
          type="date"
          value={data.dateApplied}
          onChange={e => setData({ ...data, dateApplied: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none [color-scheme:dark]"
        />
      </div>
      <div className="col-span-2 space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">{t('fields.link')}</label>
        <input
          type="url"
          value={data.link || ''}
          onChange={e => setData({ ...data, link: e.target.value })}
          onBlur={e => setData({ ...data, link: sanitizeUrl(e.target.value) })}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none"
          placeholder="https://..."
        />
      </div>
      <Button type="submit" className="col-span-2 py-3 mt-2">
        {initialData ? t('common.update') : t('common.save')} {t('common.hunt')}
      </Button>
    </form>
  );
};