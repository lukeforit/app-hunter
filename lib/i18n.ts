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
        update: 'Update',
        save: 'Save',
        hunt: 'Hunt',
        newHunt: 'New Hunt',
        updateHunt: 'Update Hunt',
        parsing: 'Parsing...',
        extract: 'Extract',
        remote: 'Remote',
        onSite: 'On-site',
        hybrid: 'Hybrid',
        sent: 'Sent',
        interviewing: 'Interviewing',
        rejected: 'Rejected',
        importSuccess: 'Job hunts imported successfully!',
        importError: 'Invalid file format. Please provide a valid JSON array of job entries.'
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
      }
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