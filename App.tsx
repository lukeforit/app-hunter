
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Trash2, 
  ExternalLink, 
  MapPin, 
  Calendar,
  Layers,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';
import { JobEntry, JobStatus, WorkMode } from './types';
import { STORAGE_KEY, STATUS_COLORS, STATUS_LABELS, WORK_MODE_LABELS } from './constants';
import { parseJobDescription } from './services/gemini';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const [editingJob, setEditingJob] = useState<JobEntry | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setJobs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load jobs from storage", e);
      }
    }
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs]);

  const addJob = (job: Omit<JobEntry, 'id'>) => {
    const newJob = { ...job, id: crypto.randomUUID() };
    setJobs(prev => [newJob, ...prev]);
    setIsAdding(false);
    setPasteContent('');
  };

  const updateJob = (updatedJob: JobEntry) => {
    setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
    setEditingJob(null);
  };

  const deleteJob = (id: string) => {
    if (confirm('Are you sure you want to remove this hunt?')) {
      setJobs(prev => prev.filter(j => j.id !== id));
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hunter-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          setJobs(imported);
          alert('Import successful!');
        }
      } catch (err) {
        alert('Invalid file format. Please upload a valid Hunter JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleMagicPaste = async () => {
    if (!pasteContent.trim()) return;
    setIsParsing(true);
    try {
      const extracted = await parseJobDescription(pasteContent);
      const newJob: JobEntry = {
        id: crypto.randomUUID(),
        companyName: extracted.companyName || 'Unknown Company',
        role: extracted.role || 'Unknown Role',
        location: extracted.location || 'Unknown Location',
        workMode: extracted.workMode as WorkMode || WorkMode.REMOTE,
        dateApplied: new Date().toISOString().split('T')[0],
        link: extracted.link || '',
        status: JobStatus.SENT
      };
      setJobs(prev => [newJob, ...prev]);
      setPasteContent('');
      setIsAdding(false);
    } catch (err) {
      alert("Magic failed. You might need to add it manually.");
    } finally {
      setIsParsing(false);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => 
      j.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      j.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [jobs, searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-700">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1.5 rounded-lg">
            <Briefcase className="w-5 h-5 text-zinc-950" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">The Hunter</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCompact(!isCompact)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white border border-zinc-800 rounded-md transition-all"
          >
            <Layers className="w-4 h-4" />
            {isCompact ? 'Comfortable' : 'Compact'}
          </button>
          
          <div className="h-6 w-[1px] bg-zinc-800 hidden md:block" />

          <button 
            onClick={exportData}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            title="Export JSON"
          >
            <Download className="w-5 h-5" />
          </button>
          
          <label className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer" title="Import JSON">
            <Upload className="w-5 h-5" />
            <input type="file" className="hidden" accept=".json" onChange={importData} />
          </label>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header Actions */}
        <section className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Filter hunts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
            />
          </div>
          
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-zinc-100 text-zinc-950 px-5 py-2.5 rounded-xl font-semibold hover:bg-white transition-all active:scale-95 shadow-xl shadow-white/5"
          >
            <Plus className="w-4 h-4" />
            New Hunt
          </button>
        </section>

        {/* Dashboard Content */}
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-zinc-800 rounded-3xl space-y-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-zinc-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No hunts yet</h3>
              <p className="text-zinc-500 max-w-sm mx-auto">Start by adding a job application or use the Magic Paste to import one instantly.</p>
            </div>
          </div>
        ) : (
          <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onDelete={deleteJob} 
                onEdit={setEditingJob} 
                onStatusChange={(status) => updateJob({...job, status})}
                compact={isCompact}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal - Add / Edit */}
      {(isAdding || editingJob) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => { setIsAdding(false); setEditingJob(null); }} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{editingJob ? 'Edit Hunt' : 'Start a Hunt'}</h2>
                <button onClick={() => { setIsAdding(false); setEditingJob(null); }} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!editingJob && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Magic Paste (AI Extractor)
                  </label>
                  <div className="relative">
                    <textarea 
                      placeholder="Paste Job URL or Description here..."
                      className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none font-mono"
                      value={pasteContent}
                      onChange={(e) => setPasteContent(e.target.value)}
                    />
                    <button 
                      disabled={isParsing || !pasteContent.trim()}
                      onClick={handleMagicPaste}
                      className="absolute bottom-3 right-3 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    >
                      {isParsing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      {isParsing ? 'Parsing...' : 'Extract'}
                    </button>
                  </div>
                </div>
              )}

              <div className="h-[1px] bg-zinc-800" />

              <JobForm 
                initialData={editingJob || undefined} 
                onSubmit={(data) => {
                  if (editingJob) {
                    updateJob({ ...editingJob, ...data });
                  } else {
                    addJob(data as Omit<JobEntry, 'id'>);
                  }
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-components ---

interface JobCardProps {
  job: JobEntry;
  onDelete: (id: string) => void;
  onEdit: (job: JobEntry) => void;
  onStatusChange: (status: JobStatus) => void;
  compact?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDelete, onEdit, onStatusChange, compact }) => {
  return (
    <div className={`group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all ${compact ? 'p-3 flex items-center gap-4' : 'p-5 flex flex-col gap-4'}`}>
      <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} bg-zinc-800/50 rounded-xl flex items-center justify-center shrink-0 border border-zinc-800 group-hover:border-zinc-700 transition-colors`}>
        <span className={`font-bold text-zinc-400 ${compact ? 'text-sm' : 'text-lg'}`}>{job.companyName[0].toUpperCase()}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h4 className={`font-bold text-zinc-100 truncate ${compact ? 'text-sm' : 'text-base'}`}>{job.role}</h4>
            <p className="text-zinc-500 text-xs truncate">{job.companyName}</p>
          </div>
          {!compact && (
            <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${STATUS_COLORS[job.status]}`}>
              {job.status.toUpperCase()}
            </span>
          )}
        </div>

        {!compact && (
          <div className="mt-3 flex flex-wrap gap-y-2 gap-x-4 text-[11px] text-zinc-500 font-medium">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              {job.location} • {job.workMode}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {job.dateApplied}
            </div>
          </div>
        )}
      </div>

      <div className={`flex items-center ${compact ? 'gap-2' : 'justify-between mt-2'}`}>
        {compact && (
           <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${STATUS_COLORS[job.status]}`}>
            {job.status.toUpperCase()}
          </span>
        )}
        
        <div className="flex items-center gap-1">
          {job.link && (
            <a 
              href={job.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 text-zinc-500 hover:text-white transition-colors"
              title="View Posting"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button 
            onClick={() => onEdit(job)}
            className="p-1.5 text-zinc-500 hover:text-white transition-colors"
            title="Edit"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(job.id)}
            className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        {!compact && (
          <select 
            value={job.status} 
            onChange={(e) => onStatusChange(e.target.value as JobStatus)}
            className="bg-zinc-800 text-[10px] font-bold border-none rounded px-2 py-1 text-zinc-400 focus:ring-0 outline-none cursor-pointer hover:text-white transition-colors"
          >
            {STATUS_LABELS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>
    </div>
  );
};

interface JobFormProps {
  initialData?: Partial<JobEntry>;
  onSubmit: (data: Partial<JobEntry>) => void;
}

const JobForm: React.FC<JobFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || '',
    role: initialData?.role || '',
    location: initialData?.location || '',
    workMode: initialData?.workMode || WorkMode.REMOTE,
    link: initialData?.link || '',
    status: initialData?.status || JobStatus.SENT,
    dateApplied: initialData?.dateApplied || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      <div className="col-span-2 space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">Role Title</label>
        <input 
          required
          type="text" 
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
          placeholder="Software Engineer..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">Company</label>
        <input 
          required
          type="text" 
          value={formData.companyName}
          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
          placeholder="Vercel..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">Location</label>
        <input 
          type="text" 
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
          placeholder="New York, Remote..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">Work Mode</label>
        <select 
          value={formData.workMode}
          onChange={(e) => setFormData({...formData, workMode: e.target.value as WorkMode})}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 appearance-none"
        >
          {WORK_MODE_LABELS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">Date Applied</label>
        <input 
          type="date" 
          value={formData.dateApplied}
          onChange={(e) => setFormData({...formData, dateApplied: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 appearance-none"
        />
      </div>

      <div className="col-span-2 space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase">Job Link</label>
        <input 
          type="url" 
          value={formData.link}
          onChange={(e) => setFormData({...formData, link: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
          placeholder="https://..."
        />
      </div>

      <button 
        type="submit" 
        className="col-span-2 mt-4 bg-zinc-100 text-zinc-950 py-3 rounded-xl font-bold hover:bg-white transition-all active:scale-95"
      >
        Save Hunt
      </button>
    </form>
  );
};

export default App;
