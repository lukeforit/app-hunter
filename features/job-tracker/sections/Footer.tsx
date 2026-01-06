import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { PrivacyDialog } from '@/features/job-tracker/components/PrivacyDialog';
import { TermsDialog } from '@/features/job-tracker/components/TermsDialog';

export const Footer: React.FC = () => {
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);

    return (
        <footer className="w-full max-w-6xl mx-auto px-6 py-6 mt-12 mb-6 border-t border-zinc-900/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-sm">
                <p>© {new Date().getFullYear()} App Hunter. All rights reserved.</p>
                <div className="flex gap-4">
                    <Button variant="ghost" size="sm" onClick={() => setIsPrivacyOpen(true)}>
                        Privacy Policy
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsTermsOpen(true)}>
                        Terms of Service
                    </Button>
                </div>
            </div>

            <PrivacyDialog
                isOpen={isPrivacyOpen}
                onClose={() => setIsPrivacyOpen(false)}
            />

            <TermsDialog
                isOpen={isTermsOpen}
                onClose={() => setIsTermsOpen(false)}
            />
        </footer>
    );
};
