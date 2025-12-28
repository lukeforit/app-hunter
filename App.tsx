import React, { useState, useMemo } from 'react';
import { Briefcase, Search, Plus, Download, Upload, Layers, X, Sparkles } from 'lucide-react';
import { useJobs } from './hooks/useJobs';
import { JobCard } from './features/job-tracker/components/JobCard';
import { MagicPaste } from './features/job-tracker/components/MagicPaste';
import { Button } from './components/ui/Button';
import { JobEntry, JobStatus, WorkMode } from './types';

const App: React.FC = () => {
  const { jobs, addJob, updateJob, deleteJob, importJobs } = useJobs();
  const [isAdding, setIsAdding] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingJob, setEditingJob] = useState<JobEntry | null>(null);

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => 
      [j.companyName, j.role, j.location].some(f => 
        f.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [jobs, searchQuery]);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(jobs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hunts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (Array.isArray(data)) importJobs(data);
      } catch (err) { alert('Invalid format'); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-700">
      <nav className="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg shadow-xl shadow-white/5">
            <Briefcase className="w-5 h-5 text-zinc-950" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">The Hunter</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsCompact(!isCompact)} className="hidden md:flex gap-2">
            <Layers className="w-4 h-4" />
            {isCompact ? 'Comfortable' : 'Compact'}
          </Button>
          <div className="h-4 w-px bg-zinc-800 mx-2" />
          <Button variant="ghost" size="icon" onClick={handleExport} title="Export">
            <Download className="w-5 h-5" />
          </Button>
          <label className="cursor-pointer">
            {/* FIX: Removed 'asChild' prop as it is not supported by the custom Button component */}
            <Button variant="ghost" size="icon" title="Import" type="button">
               <Upload className="w-5 h-5" />
            </Button>
            <input type="file" className="hidden" accept=".json" onChange={handleImport} />
          </label>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <section className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search hunts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
          </div>
          <Button onClick={() => setIsAdding(true)} className="w-full md:w-auto gap-2">
            <Plus className="w-4 h-4" />
            Add Application
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
                /* FIX: Wrapped updateJob to match the (id, status) signature expected by JobCard */
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
              <h2 className="text-xl font-bold">{editingJob ? 'Update Hunt' : 'New Hunt'}</h2>
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

const Modal = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in duration-200">
      {children}
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-zinc-800 rounded-3xl space-y-4">
    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
      <Sparkles className="w-8 h-8 text-zinc-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold">Your hunt is quiet...</h3>
      <p className="text-zinc-500 text-sm max-w-xs mx-auto">Use Magic Paste to automatically track your next big move.</p>
    </div>
  </div>
);

const JobForm = ({ initialData, onSubmit }: { initialData?: JobEntry | null, onSubmit: (data: Partial<JobEntry>) => void }) => {
  const [data, setData] = useState(initialData || {
    companyName: '',
    role: '',
    location: '',
    workMode: WorkMode.REMOTE,
    link: '',
    status: JobStatus.SENT,
    dateApplied: new Date().toISOString().split('T')[0]
  });

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
      <div className="col-span-2 space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">Role</label>
        <input required value={data.role} onChange={e => setData({...data, role: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-zinc-600 outline-none" placeholder="Frontend Engineer" />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">Company</label>
        <input required value={data.companyName} onChange={e => setData({...data, companyName: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-zinc-600 outline-none" placeholder="Linear" />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">Location</label>
        <input value={data.location} onChange={e => setData({...data, location: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-zinc-600 outline-none" placeholder="Remote" />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">Mode</label>
        <select value={data.workMode} onChange={e => setData({...data, workMode: e.target.value as WorkMode})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none">
          {Object.values(WorkMode).map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">Date</label>
        <input type="date" value={data.dateApplied} onChange={e => setData({...data, dateApplied: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none" />
      </div>
      <div className="col-span-2 space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">Link</label>
        <input type="url" value={data.link} onChange={e => setData({...data, link: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none" placeholder="https://..." />
      </div>
      <Button type="submit" className="col-span-2 py-3 mt-2">{initialData ? 'Update' : 'Save'} Hunt</Button>
    </form>
  );
}

export default App;
