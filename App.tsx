import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Search, Plus, Download, Upload, Layers, X, AlertTriangle } from 'lucide-react';
import { useJobs } from './hooks/useJobs';
import { useFilteredJobs } from './hooks/useFilteredJobs';
import { JobCard } from './features/job-tracker/components/JobCard';
import { MagicPaste } from './features/job-tracker/components/MagicPaste';
import { EmptyState } from './features/job-tracker/components/EmptyState';
import { JobForm } from './features/job-tracker/components/JobForm';
import { Button } from './components/ui/Button';
import { Modal } from './components/ui/Modal';
import { FilterGroup } from './components/ui/FilterGroup';
import { JobEntry, JobStatus, WorkMode } from './types';
import { exportJobs, importJobsFromFile } from './lib/file-utils';

const App: React.FC = () => {
  const { t } = useTranslation();
  const { jobs, addJob, updateJob, deleteJob, importJobs, isLoaded } = useJobs();
  
  const {
    filteredJobs,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    workModeFilter,
    setWorkModeFilter,
    clearFilters
  } = useFilteredJobs(jobs);

  const [isAdding, setIsAdding] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [editingJob, setEditingJob] = useState<JobEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStatusChange = useCallback((id: string, status: JobStatus) => {
    updateJob(id, { status });
  }, [updateJob]);

  const handleEdit = useCallback((job: JobEntry) => {
    setEditingJob(job);
  }, []);

  const handleDeleteRequest = useCallback((id: string) => {
    setDeletingId(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deletingId) {
      deleteJob(deletingId);
      setDeletingId(null);
    }
  }, [deletingId, deleteJob]);

  const handleCloseModal = useCallback(() => {
    setIsAdding(false);
    setEditingJob(null);
    setDeletingId(null);
  }, []);

  // Options for filter UI
  const statusOptions = useMemo(() => 
    (Object.values(JobStatus) as JobStatus[]).map(s => ({
      value: s,
      label: t(`common.${s.toLowerCase()}`)
    }))
  , [t]);

  const workModeOptions = useMemo(() => 
    (Object.values(WorkMode) as WorkMode[]).map(m => {
      const keyMap: Record<string, string> = {
        [WorkMode.ON_SITE]: 'onSite',
        [WorkMode.REMOTE]: 'remote',
        [WorkMode.HYBRID]: 'hybrid',
      };
      return {
        value: m,
        label: t(`common.${keyMap[m]}`)
      };
    })
  , [t]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800/50">
      <nav className="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg shadow-xl shadow-white/5">
            <Briefcase className="w-5 h-5 text-zinc-950" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter">{t('common.appName')}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsCompact(!isCompact)} 
            className="hidden md:flex gap-2"
          >
            <Layers className="w-4 h-4" />
            {isCompact ? t('common.comfortable') : t('common.compact')}
          </Button>
          <div className="h-4 w-px bg-zinc-800 mx-2 hidden md:block" />
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

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search Box */}
            <div className="relative flex-1 group min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
              <input 
                type="text" 
                placeholder={t('common.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all focus:bg-zinc-900/60"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <FilterGroup 
                options={statusOptions} 
                value={statusFilter} 
                onChange={(val) => setStatusFilter(val)} 
              />
              <FilterGroup 
                options={workModeOptions} 
                value={workModeFilter} 
                onChange={(val) => setWorkModeFilter(val)} 
              />
            </div>

            <Button onClick={() => setIsAdding(true)} className="gap-2 font-bold shadow-lg shadow-white/5 py-2.5">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t('common.addApplication')}</span>
              <span className="sm:hidden">{t('common.addApplication')}</span>
            </Button>
          </div>
        </section>

        {!isLoaded ? (
           <div className="flex justify-center py-20">
             <div className="w-6 h-6 border-2 border-zinc-800 border-t-zinc-400 rounded-full animate-spin" />
           </div>
        ) : filteredJobs.length === 0 ? (
          <div className="space-y-6">
             {jobs.length === 0 ? <EmptyState /> : (
               <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl">
                 <p className="text-zinc-500 font-medium italic">No results match your current filters.</p>
                 <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-4 text-zinc-400">Clear all filters</Button>
               </div>
             )}
          </div>
        ) : (
          <div className={`grid gap-4 transition-all duration-300 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                compact={isCompact}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Confirmation Modal for Deletion */}
      {deletingId && (
        <Modal onClose={handleCloseModal}>
          <div className="space-y-6 text-center">
            <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{t('deleteModal.title')}</h3>
              <p className="text-zinc-400 text-sm">{t('deleteModal.description')}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="secondary" onClick={handleCloseModal}>{t('common.cancel')}</Button>
              <Button variant="danger" onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">{t('deleteModal.confirm')}</Button>
            </div>
          </div>
        </Modal>
      )}

      {(isAdding || editingJob) && (
        <Modal onClose={handleCloseModal}>
          <div className="space-y-6 max-h-[90vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">{editingJob ? t('common.updateHunt') : t('common.newHunt')}</h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModal}>
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
                handleCloseModal();
              }} 
            />
          </div>
        </Modal>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
};

export default App;
