import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Download, Upload, Layers } from 'lucide-react';
import { useJobs } from './hooks/useJobs';
import { useFilteredJobs } from './hooks/useFilteredJobs';
import { JobCard } from './features/job-tracker/components/JobCard';
import { EmptyState } from './features/job-tracker/components/EmptyState';
import { ActionBar } from './features/job-tracker/sections/ActionBar';
import { JobModal } from './features/job-tracker/components/JobModal';
import { DeleteConfirmationModal } from './features/job-tracker/components/DeleteConfirmationModal';
import { Button } from './components/ui/Button';
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
        <ActionBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusOptions={statusOptions}
          workModeFilter={workModeFilter}
          onWorkModeFilterChange={setWorkModeFilter}
          workModeOptions={workModeOptions}
          onAddClick={() => setIsAdding(true)}
        />

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

      <DeleteConfirmationModal 
        isOpen={!!deletingId}
        onClose={handleCloseModal}
        onConfirm={confirmDelete}
      />

      <JobModal 
        isOpen={isAdding || !!editingJob}
        onClose={handleCloseModal}
        editingJob={editingJob}
        onAdd={addJob}
        onUpdate={updateJob}
      />
    </div>
  );
};

export default App;