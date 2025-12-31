import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { MagicPaste } from './MagicPaste';
import { JobForm } from './JobForm';
import { JobEntry, JobFormData } from '../../../types';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingJob: JobEntry | null;
  onAdd: (data: JobFormData) => void;
  onUpdate: (id: string, data: Partial<JobEntry>) => void;
}

export const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  onClose,
  editingJob,
  onAdd,
  onUpdate,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="space-y-6 max-h-[90vh] overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">
            {editingJob ? t('common.updateHunt') : t('common.newHunt')}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {!editingJob && (
          <MagicPaste 
            onExtracted={(data) => { 
              onAdd(data); 
              onClose(); 
            }} 
          />
        )}

        <div className="h-px bg-zinc-800" />
        
        <JobForm 
          initialData={editingJob} 
          onSubmit={(data) => {
            if (editingJob) {
              onUpdate(editingJob.id, data);
            } else {
              onAdd(data as JobFormData);
            }
            onClose();
          }} 
        />
      </div>
    </Modal>
  );
};