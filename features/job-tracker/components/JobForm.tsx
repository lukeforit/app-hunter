import React, { useRef } from 'react';
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
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const submittedData: Partial<JobEntry> = {
      role: formData.get('role') as string,
      companyName: formData.get('companyName') as string,
      location: formData.get('location') as string,
      salary: formData.get('salary') as string,
      workMode: formData.get('workMode') as WorkMode,
      dateApplied: formData.get('dateApplied') as string,
      link: sanitizeUrl(formData.get('link') as string),
      status: initialData?.status || JobStatus.SENT
    };

    onSubmit(submittedData);
  };

  const defaultValues = initialData || {
    companyName: '',
    role: '',
    location: '',
    workMode: WorkMode.REMOTE,
    link: '',
    status: JobStatus.SENT,
    dateApplied: new Date().toISOString().split('T')[0],
    salary: ''
  };

  return (
    <form ref={formRef} className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
      <div className="col-span-2 space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">{t('fields.role')}</label>
        <input
          name="role"
          required
          defaultValue={defaultValues.role}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-zinc-600 outline-none"
          placeholder="Frontend Engineer"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">{t('fields.company')}</label>
        <input
          name="companyName"
          required
          defaultValue={defaultValues.companyName}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-zinc-600 outline-none"
          placeholder="Linear"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">{t('fields.location')}</label>
        <input
          name="location"
          defaultValue={defaultValues.location}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-zinc-600 outline-none"
          placeholder="Remote"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">{t('fields.salary')}</label>
        <input
          name="salary"
          defaultValue={defaultValues.salary}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-zinc-600 outline-none"
          placeholder="$150,000"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">{t('fields.mode')}</label>
        <select
          name="workMode"
          defaultValue={defaultValues.workMode}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none"
        >
          {WORK_MODES.map(m => <option key={m} value={m}>{getWorkModeLabel(m, t)}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">{t('fields.date')}</label>
        <input
          name="dateApplied"
          type="date"
          defaultValue={defaultValues.dateApplied}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none [color-scheme:dark]"
        />
      </div>
      <div className="col-span-2 space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">{t('fields.link')}</label>
        <input
          name="link"
          type="url"
          defaultValue={defaultValues.link}
          onBlur={e => e.target.value = sanitizeUrl(e.target.value)}
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