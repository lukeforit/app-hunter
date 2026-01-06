
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        appName: 'Job Hunter',
        searchPlaceholder: 'Search jobs...',
        addApplication: 'Add Job Application',
        compact: 'Compact',
        comfortable: 'Comfortable',
        exportHunts: 'Export Job Hunts',
        importHunts: 'Import Job Hunts',
        deleteJob: 'Delete',
        openLink: 'Open Link',
        update: 'Update',
        save: 'Save',
        hunt: 'Hunt',
        newHunt: 'New Hunt',
        updateHunt: 'Edit',
        parsing: 'Parsing...',
        extract: 'Extract',
        remote: 'Remote',
        onSite: 'On-site',
        hybrid: 'Hybrid',
        sent: 'Sent',
        interviewing: 'Interviewing',
        rejected: 'Rejected',
        importSuccess: 'Job hunts imported successfully!',
        importError: 'Invalid file format. Please provide a valid JSON array of job entries.',
        cancel: 'Cancel'
      },
      fields: {
        role: 'Role',
        company: 'Company',
        location: 'Location',
        salary: 'Salary (Max)',
        mode: 'Mode',
        date: 'Date',
        link: 'Link'
      },
      magicPaste: {
        label: 'Magic Paste (AI Extractor)',
        placeholder: 'Paste job URL or description...',
        error: 'AI extraction failed. Try manual entry.'
      },
      emptyState: {
        title: 'Your hunt is quiet...',
        description: 'Use Magic Paste to automatically track your next big move.'
      },
      deleteModal: {
        title: 'Confirm Deletion',
        description: 'Are you sure you want to remove this job hunt? This action cannot be undone.',
        confirm: 'Delete Hunt'
      },
      legal: {
        privacyTitle: 'Privacy & Data',
        privacyBody: 'The Hunter is a local-first application. All job data you enter is stored exclusively in your browser\'s local storage. We do not have a backend and cannot access your data. When using the "Magic Paste" feature, the text you paste is sent to Google Gemini for processing.',
        termsTitle: 'Terms of Use',
        termsBody: 'This tool is provided "as-is" without warranty of any kind. AI-generated data should be verified for accuracy. We are not responsible for any data loss resulting from browser cache clearance.'
      },

    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
