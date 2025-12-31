
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { extractJobFromText } from '../../../services/gemini';
import { JobFormData, JobStatus } from '../../../types';
import { cn } from '../../../lib/utils';

interface MagicPasteProps {
  onExtracted: (data: JobFormData) => void;
}

export const MagicPaste: React.FC<MagicPasteProps> = ({ onExtracted }) => {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const result = await extractJobFromText(content);
      onExtracted({
        ...result,
        dateApplied: new Date().toISOString().split('T')[0],
        status: JobStatus.SENT,
        link: result.link || ''
      });
      setContent('');
    } catch (e) {
      console.error(e);
      alert(t('magicPaste.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-blue-400" />
          {t('magicPaste.label')}
        </label>
        {loading && (
          <span className="text-[10px] font-medium text-blue-400 animate-pulse">
            AI is analyzing your hunt...
          </span>
        )}
      </div>
      <div className="relative group">
        <textarea 
          placeholder={t('magicPaste.placeholder')}
          className={cn(
            "w-full h-36 bg-zinc-950/40 border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 resize-none font-mono transition-all",
            loading && "opacity-50 cursor-not-allowed",
            !loading && "focus:bg-zinc-950/60"
          )}
          value={content}
          disabled={loading}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {content.length > 0 && !loading && (
             <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => setContent('')}
               className="text-[10px] uppercase font-bold px-2 py-1"
             >
               Clear
             </Button>
          )}
          <Button 
            variant="secondary"
            size="sm"
            disabled={loading || !content.trim()}
            onClick={handleExtract}
            className="gap-2 shadow-lg shadow-black/20"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-blue-400" />}
            <span className="font-bold">{loading ? t('common.parsing') : t('common.extract')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
