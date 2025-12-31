import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="space-y-6 text-center">
        <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{t('deleteModal.title')}</h3>
          <p className="text-zinc-400 text-sm">{t('deleteModal.description')}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="danger" 
            onClick={onConfirm} 
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {t('deleteModal.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};