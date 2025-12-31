import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { extractJobFromText } from '../../../services/gemini';
import { JobFormData, JobStatus } from '../../../types';

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
      alert(t('magicPaste.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
        <Sparkles className="w-3 h-3" />
        {t('magicPaste.label')}
      </label>
      <div className="relative">
        <textarea 
          placeholder={t('magicPaste.placeholder')}
          className="w-full h-32 bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none font-mono"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button 
          variant="secondary"
          size="sm"
          disabled={loading || !content.trim()}
          onClick={handleExtract}
          className="absolute bottom-3 right-3 gap-2"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {loading ? t('common.parsing') : t('common.extract')}
        </Button>
      </div>
    </div>
  );
};