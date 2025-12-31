import React, { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Search, Plus, Download, Upload, Layers, X } from 'lucide-react';
import { useJobs } from './hooks/useJobs';
import { JobCard } from './features/job-tracker/components/JobCard';
import { MagicPaste } from './features/job-tracker/components/MagicPaste';
import { EmptyState } from './features/job-tracker/components/EmptyState';
import { JobForm } from './features/job-tracker/components/JobForm';
import { Button } from './components/ui/Button';
import { Modal } from './components/ui/Modal';
import { JobEntry } from './types';
import { exportJobs, importJobsFromFile } from './lib/file-utils';

const App: React.FC = () => {
  const { t } = useTranslation();
  const { jobs, addJob, updateJob, deleteJob, importJobs } = useJobs();
  const [isAdding, setIsAdding] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingJob, setEditingJob] = useState<JobEntry | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => 
      [j.companyName, j.role, j.location].some(f => 
        f.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [jobs, searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-700">
      <nav className="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg shadow-xl shadow-white/5">
            <Briefcase className="w-5 h-5 text-zinc-950" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">{t('common.appName')}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsCompact(!isCompact)} className="hidden md:flex gap-2">
            <Layers className="w-4 h-4" />
            {isCompact ? t('common.comfortable') : t('common.compact')}
          </Button>
          <div className="h-4 w-px bg-zinc-800 mx-2" />
          <Button variant="ghost" size="icon" onClick={() => exportJobs(jobs)} title={t('common.exportHunts')}>
            <Download className="w-5 h-5" />
          </Button>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              title={t('common.importHunts')} 
              onClick={() => fileInputRef.current?.click()}
            >
               <Upload className="w-5 h-5" />
            </Button>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".json" 
              onChange={(e) => importJobsFromFile(e, importJobs)} 
            />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <section className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder={t('common.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-all"
            />
          </div>
          <Button onClick={() => setIsAdding(true)} className="w-full md:w-auto gap-2">
            <Plus className="w-4 h-4" />
            {t('common.addApplication')}
          </Button>
        </section>

        {jobs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                compact={isCompact}
                onEdit={setEditingJob}
                onDelete={deleteJob}
                onStatusChange={(id, status) => updateJob(id, { status })}
              />
            ))}
          </div>
        )}
      </main>

      {(isAdding || editingJob) && (
        <Modal onClose={() => { setIsAdding(false); setEditingJob(null); }}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingJob ? t('common.updateHunt') : t('common.newHunt')}</h2>
              <Button variant="ghost" size="icon" onClick={() => { setIsAdding(false); setEditingJob(null); }}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {!editingJob && <MagicPaste onExtracted={(data) => { addJob(data); setIsAdding(false); }} />}

            <div className="h-px bg-zinc-800" />
            
            <JobForm 
              initialData={editingJob} 
              onSubmit={(data) => {
                if (editingJob) updateJob(editingJob.id, data);
                else addJob(data as any);
                setIsAdding(false);
                setEditingJob(null);
              }} 
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default App;