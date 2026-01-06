import React from 'react';
import { useTranslation } from 'react-i18next';
import { Info, X } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

interface TermsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TermsDialog: React.FC<TermsDialogProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <Modal onClose={onClose}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-bold">
                            {t('legal.termsTitle')}
                        </h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed text-justify">
                    {t('legal.termsBody')}
                </p>
                <div className="pt-4">
                    <Button variant="secondary" className="w-full" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
