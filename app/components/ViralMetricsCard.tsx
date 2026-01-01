'use client';

import Image from 'next/image';

interface ViralMetricsCardProps {
  short: {
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
  };
}

export default function ViralMetricsCard({ short }: ViralMetricsCardProps) {
  const getViralScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
  };

  const getViralScoreBorder = (score: number) => {
    if (score >= 70) return 'border-green-300 dark:border-green-700';
    if (score >= 40) return 'border-yellow-300 dark:border-yellow-700';
    return 'border-red-300 dark:border-red-700';
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getRelativeTime = (dateString: string): string => {
    const now = new Date();
    const uploaded = new Date(dateString);
    const diffMs = now.getTime() - uploaded.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const youtubeUrl = `https://www.youtube.com/watch?v=${short.id}`;

  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-lg shadow-md border-2 ${getViralScoreBorder(
        short.viralScore
      )} hover:shadow-lg transition-all duration-200 overflow-hidden group`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={short.thumbnail}
          alt={short.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {short.duration}s
        </div>
        {/* Data Source Badge */}
        <div className="absolute top-2 right-2">
          {short.dataSource === 'mock' ? (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Demo
            </span>
          ) : (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              Live
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2 min-h-[3rem]">
          {short.title}
        </h3>

        {/* Channel & Time */}
        <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          <span className="truncate">{short.channelName}</span>
          <span className="text-xs whitespace-nowrap ml-2">
            {getRelativeTime(short.uploadedAt)}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-2">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">Views</div>
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {formatNumber(short.views)}
            </div>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-2">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">Views/Hour</div>
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {formatNumber(short.viewsPerHour)}
            </div>
          </div>
        </div>

        {/* Viral Score */}
        <div className={`rounded-lg p-3 mb-3 ${getViralScoreColor(short.viralScore)}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Viral Score</span>
            <span className="text-3xl font-bold">{short.viralScore}</span>
          </div>
        </div>

        {/* Copy Insight */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
          <div className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">
            💡 Pattern Analysis
          </div>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
            {short.copyInsight}
          </p>
        </div>

        {/* Niche & Like Ratio */}
        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-3">
          <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
            {short.niche}
          </span>
          <span>{short.likeRatio.toFixed(2)}% like ratio</span>
        </div>

        {/* Action Button */}
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}
