'use client';

import { useState } from 'react';

interface FilterBarProps {
  onFilterChange: (filters: Filters) => void;
  loading?: boolean;
}

export interface Filters {
  niche: string;
  timeRange: string;
  minViralScore: number;
  region: string;
}

const NICHES = [
  { value: 'all', label: 'All Niches' },
  { value: 'gaming', label: '🎮 Gaming' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'drama', label: '☕ Drama' },
  { value: 'motivation', label: '💪 Motivation' },
  { value: 'finance', label: '💰 Finance' },
  { value: 'education', label: '📚 Education' },
  { value: 'lifestyle', label: '✨ Lifestyle' },
  { value: 'tech', label: '💻 Tech' },
  { value: 'music', label: '🎵 Music' },
];

const TIME_RANGES = [
  { value: '1h', label: 'Last Hour' },
  { value: '6h', label: 'Last 6 Hours' },
  { value: '24h', label: 'Last 24 Hours' },
];

const REGIONS = [
  { value: 'US', label: '🇺🇸 United States' },
  { value: 'GB', label: '🇬🇧 United Kingdom' },
  { value: 'CA', label: '🇨🇦 Canada' },
  { value: 'AU', label: '🇦🇺 Australia' },
  { value: 'DE', label: '🇩🇪 Germany' },
  { value: 'FR', label: '🇫🇷 France' },
  { value: 'ES', label: '🇪🇸 Spain' },
  { value: 'IT', label: '🇮🇹 Italy' },
];

export default function FilterBar({ onFilterChange, loading }: FilterBarProps) {
  const [filters, setFilters] = useState<Filters>({
    niche: 'all',
    timeRange: '6h',
    minViralScore: 0,
    region: 'US',
  });

  const handleFilterUpdate = (key: keyof Filters, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Niche Selector */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Niche
          </label>
          <select
            value={filters.niche}
            onChange={(e) => handleFilterUpdate('niche', e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {NICHES.map((niche) => (
              <option key={niche.value} value={niche.value}>
                {niche.label}
              </option>
            ))}
          </select>
        </div>

        {/* Time Range Selector */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Time Range
          </label>
          <select
            value={filters.timeRange}
            onChange={(e) => handleFilterUpdate('timeRange', e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Region Selector */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Region
          </label>
          <select
            value={filters.region}
            onChange={(e) => handleFilterUpdate('region', e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {REGIONS.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>

        {/* Viral Score Slider */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Min Viral Score: {filters.minViralScore}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.minViralScore}
            onChange={(e) =>
              handleFilterUpdate('minViralScore', parseInt(e.target.value))
            }
            disabled={loading}
            className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.niche !== 'all' && (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
            {NICHES.find((n) => n.value === filters.niche)?.label}
          </span>
        )}
        {filters.timeRange !== '6h' && (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
            {TIME_RANGES.find((t) => t.value === filters.timeRange)?.label}
          </span>
        )}
        {filters.minViralScore > 0 && (
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm">
            Score ≥ {filters.minViralScore}
          </span>
        )}
        {filters.region !== 'US' && (
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm">
            {REGIONS.find((r) => r.value === filters.region)?.label}
          </span>
        )}
      </div>
    </div>
  );
}
