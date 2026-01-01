'use client';

import ViralMetricsCard from './ViralMetricsCard';

interface Short {
  id: string;
  title: string;
  channelName: string;
  thumbnail: string;
  views: number;
  uploadedAt: string;
  viewsPerHour: number;
  viralScore: number;
  copyInsight: string;
  dataSource: 'youtube' | 'mock';
  niche: string;
  duration: number;
  likeRatio: number;
}

interface ShortsGridProps {
  shorts: Short[];
  loading?: boolean;
}

export default function ShortsGrid({ shorts, loading }: ShortsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-zinc-200 dark:bg-zinc-800" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          No shorts found
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          Try adjusting your filters or check back later for new content.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shorts.map((short) => (
        <ViralMetricsCard key={short.id} short={short} />
      ))}
    </div>
  );
}
