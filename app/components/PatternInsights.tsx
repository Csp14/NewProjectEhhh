'use client';

interface PatternInsightsProps {
  patterns: {
    commonHooks: string[];
    avgHashtagCount: number;
    avgDuration: number;
    peakUploadHours: number[];
    peakUploadDays: string[];
    topNiches: string[];
  } | null;
  loading?: boolean;
  lastUpdated?: number;
}

export default function PatternInsights({
  patterns,
  loading,
  lastUpdated,
}: PatternInsightsProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 animate-pulse">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (!patterns) {
    return null;
  }

  const getLastUpdatedText = (): string => {
    if (!lastUpdated) return 'Just now';
    const now = new Date().getTime();
    const seconds = Math.floor((now - lastUpdated) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg shadow-md border border-purple-200 dark:border-purple-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span>📊</span>
          Pattern Insights
        </h2>
        <span className="text-xs text-zinc-600 dark:text-zinc-400">
          Updated {getLastUpdatedText()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Common Hooks */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
            <span>🎯</span>
            Most Common Hooks
          </h3>
          <div className="flex flex-wrap gap-2">
            {patterns.commonHooks.map((hook, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium"
              >
                {hook}
              </span>
            ))}
          </div>
        </div>

        {/* Average Stats */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
            <span>📈</span>
            Average Stats
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Hashtags
              </span>
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {patterns.avgHashtagCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Duration
              </span>
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {patterns.avgDuration}s
              </span>
            </div>
          </div>
        </div>

        {/* Peak Upload Hours */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
            <span>🕐</span>
            Peak Upload Hours (UTC)
          </h3>
          <div className="flex flex-wrap gap-2">
            {patterns.peakUploadHours.map((hour, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-bold"
              >
                {hour}:00
              </span>
            ))}
          </div>
        </div>

        {/* Peak Upload Days */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
            <span>📅</span>
            Peak Upload Days
          </h3>
          <div className="flex flex-wrap gap-2">
            {patterns.peakUploadDays.map((day, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium"
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Top Niches */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
            <span>🏆</span>
            Top Performing Niches
          </h3>
          <div className="space-y-2">
            {patterns.topNiches.map((niche, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
              >
                <span className="flex items-center justify-center w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full font-bold text-xs">
                  {index + 1}
                </span>
                <span className="capitalize">{niche}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tip */}
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg p-4 shadow-sm border border-yellow-300 dark:border-yellow-700">
          <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-2 flex items-center gap-2">
            <span>💡</span>
            Pro Tip
          </h3>
          <p className="text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed">
            Replicate these patterns in your content: use proven hooks, post
            during peak hours, and keep videos around {patterns.avgDuration}
            seconds for maximum engagement.
          </p>
        </div>
      </div>
    </div>
  );
}
