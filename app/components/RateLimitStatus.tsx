'use client';

interface RateLimitStatusProps {
  tier: 'free' | 'pro' | 'admin';
  requestsToday: number;
  requestsAllowed: number;
  quotaRemaining: number;
  resetTime: Date;
}

export default function RateLimitStatus({
  tier,
  requestsToday,
  requestsAllowed,
  quotaRemaining,
  resetTime,
}: RateLimitStatusProps) {
  const getPercentageUsed = (): number => {
    if (requestsAllowed === -1) return 0;
    return (requestsToday / requestsAllowed) * 100;
  };

  const getStatusColor = (): string => {
    const percentage = getPercentageUsed();
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTimeUntilReset = (): string => {
    const now = new Date();
    const diff = resetTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {tier === 'admin' ? '👑' : tier === 'pro' ? '⭐' : '🆓'}
            </span>
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {tier === 'admin' ? 'Administrator' : tier === 'free' ? 'Free Tier' : 'Pro Tier'}
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                {tier === 'free'
                  ? 'Limited to 10 requests/day'
                  : 'Unlimited requests'}
              </div>
            </div>
          </div>
        </div>
        {tier === 'free' && (
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
            Upgrade to Pro
          </button>
        )}
      </div>

      {tier === 'free' && (
        <>
          {/* Usage Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-zinc-700 dark:text-zinc-300">
                Requests Today
              </span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {requestsToday} / {requestsAllowed}
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatusColor()} transition-all duration-300`}
                style={{ width: `${Math.min(getPercentageUsed(), 100)}%` }}
              />
            </div>
          </div>

          {/* Reset Time */}
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            Resets in {getTimeUntilReset()}
          </div>
        </>
      )}

      {/* API Quota */}
      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-700 dark:text-zinc-300">
            YouTube API Quota
          </span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {quotaRemaining.toLocaleString()} units
          </span>
        </div>
        {quotaRemaining < 1000 && (
          <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
            ⚠️ Low quota - may fallback to demo data
          </div>
        )}
      </div>
    </div>
  );
}
