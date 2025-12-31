import React from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Download, Upload, Layers } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface TopAppBarProps {
  isCompact: boolean;
  onToggleCompact: () => void;
  onExport: () => void;
  onImportClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  isCompact,
  onToggleCompact,
  onExport,
  onImportClick,
  fileInputRef,
  onFileChange,
}) => {
  const { t } = useTranslation();

  return (
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
          onClick={onToggleCompact}
          className="hidden md:flex gap-2"
        >
          <Layers className="w-4 h-4" />
          {isCompact ? t('common.comfortable') : t('common.compact')}
        </Button>
        <div className="h-4 w-px bg-zinc-800 mx-2 hidden md:block" />
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onExport} 
          title={t('common.exportHunts')}
        >
          <Download className="w-5 h-5" />
        </Button>

        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            title={t('common.importHunts')}
            onClick={onImportClick}
          >
            <Upload className="w-5 h-5" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={onFileChange}
          />
        </div>
      </div>
    </nav>
  );
};
