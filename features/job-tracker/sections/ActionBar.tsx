import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { FilterGroup } from '../../../components/ui/FilterGroup';
import { JobStatus, WorkMode } from '../../../types';

interface ActionBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: JobStatus | null;
  onStatusFilterChange: (value: JobStatus | null) => void;
  statusOptions: { value: JobStatus; label: string }[];
  workModeFilter: WorkMode | null;
  onWorkModeFilterChange: (value: WorkMode | null) => void;
  workModeOptions: { value: WorkMode; label: string }[];
  onAddClick: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  workModeFilter,
  onWorkModeFilterChange,
  workModeOptions,
  onAddClick,
}) => {
  const { t } = useTranslation();

  return (
    <section className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Search Box */}
        <div className="relative flex-1 group min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
          <input
            type="text"
            placeholder={t('common.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all focus:bg-zinc-900/60"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <FilterGroup
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusFilterChange}
          />
          <FilterGroup
            options={workModeOptions}
            value={workModeFilter}
            onChange={onWorkModeFilterChange}
          />
        </div>

        <Button onClick={onAddClick} className="gap-2 font-bold shadow-lg shadow-white/5 py-2.5">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t('common.addApplication')}</span>
          <span className="sm:hidden">{t('common.addApplication')}</span>
        </Button>
      </div>
    </section>
  );
};
