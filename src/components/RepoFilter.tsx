import React from 'react';
import { FilterState, SortOption, ViewMode } from '../types/github';
import { getLanguageColor } from '../utils/languageColors';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  Check, 
  Layers
} from 'lucide-react';

interface RepoFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableLanguages: { name: string; count: number }[];
  availableTopics: { name: string; count: number }[];
  totalCount: number;
  filteredCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const RepoFilter: React.FC<RepoFilterProps> = ({
  filters,
  onFilterChange,
  availableLanguages,
  availableTopics,
  totalCount,
  filteredCount,
  viewMode,
  onViewModeChange,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const clearSearch = () => {
    onFilterChange({ ...filters, search: '' });
  };

  const handleLanguageSelect = (lang: string) => {
    onFilterChange({
      ...filters,
      language: filters.language === lang ? '' : lang,
    });
  };

  const handleTopicSelect = (topic: string) => {
    onFilterChange({
      ...filters,
      topic: filters.topic === topic ? '' : topic,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as SortOption });
  };

  const toggleOnlyWithDemo = () => {
    onFilterChange({ ...filters, onlyWithDemo: !filters.onlyWithDemo });
  };

  const toggleIncludeForks = () => {
    onFilterChange({ ...filters, includeForks: !filters.includeForks });
  };

  const resetAllFilters = () => {
    onFilterChange({
      search: '',
      language: '',
      topic: '',
      sortBy: 'stars',
      onlyWithDemo: false,
      includeForks: false,
      includeArchived: false,
    });
  };

  const hasActiveFilters = 
    Boolean(filters.search) || 
    Boolean(filters.language) || 
    Boolean(filters.topic) || 
    filters.onlyWithDemo || 
    filters.includeForks;

  return (
    <div className="space-y-4 pt-6 pb-2">
      
      {/* Top Search & Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input Bar */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Cari repositori (nama, topik, deskripsi)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition"
          />
          {filters.search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sorting & View Mode Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          
          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm cursor-pointer"
            >
              <option value="stars">Urutkan: Bintang Terbanyak</option>
              <option value="updated">Urutkan: Baru Diperbarui</option>
              <option value="forks">Urutkan: Fork Terbanyak</option>
              <option value="name">Urutkan: Nama (A-Z)</option>
            </select>
          </div>

          {/* Toggle: Hanya yang ada demo */}
          <button
            onClick={toggleOnlyWithDemo}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
              filters.onlyWithDemo
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {filters.onlyWithDemo && <Check className="w-3.5 h-3.5" />}
            <span>Ada Demo</span>
          </button>

          {/* Toggle: Forked repos */}
          <button
            onClick={toggleIncludeForks}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
              filters.includeForks
                ? 'bg-slate-800 dark:bg-slate-700 text-white border-slate-700'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {filters.includeForks && <Check className="w-3.5 h-3.5" />}
            <span>Forks</span>
          </button>

          {/* View Mode Toggle: Grid vs List */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Tampilan Grid"
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              title="Tampilan List"
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Language Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs font-medium">
        <button
          onClick={() => onFilterChange({ ...filters, language: '' })}
          className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            !filters.language
              ? 'bg-slate-900 dark:bg-emerald-500 text-white font-bold shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span>Semua Bahasa</span>
          <span className="text-[10px] opacity-70">({totalCount})</span>
        </button>

        {availableLanguages.map((lang) => {
          const isSelected = filters.language === lang.name;
          const color = getLanguageColor(lang.name);

          return (
            <button
              key={lang.name}
              onClick={() => handleLanguageSelect(lang.name)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: color }}
              />
              <span>{lang.name}</span>
              <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                {lang.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Topic Filter Chips & Result summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        
        {/* Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>Topik:</span>
          </span>

          {availableTopics.slice(0, 8).map((topic) => {
            const isSelected = filters.topic === topic.name;
            return (
              <button
                key={topic.name}
                onClick={() => handleTopicSelect(topic.name)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                #{topic.name}
              </button>
            );
          })}
        </div>

        {/* Filter count & Reset */}
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
          <span>Menampilkan <b>{filteredCount}</b> dari <b>{totalCount}</b> repositori</span>
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer ml-1"
            >
              Reset Filter
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
