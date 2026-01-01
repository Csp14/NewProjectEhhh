'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FilterBar, { Filters } from './components/FilterBar';
import ShortsGrid from './components/ShortsGrid';
import PatternInsights from './components/PatternInsights';
import RateLimitStatus from './components/RateLimitStatus';
import ApiStatusBanner from './components/ApiStatusBanner';
import { RateLimiter, UserTier } from './lib/services/rateLimiter';

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

interface Metadata {
  totalResults: number;
  quotaRemaining: number;
  cacheAge: number;
  quotaExceeded: boolean;
  dataSource: 'youtube' | 'mock';
}

interface Patterns {
  commonHooks: string[];
  avgHashtagCount: number;
  avgDuration: number;
  peakUploadHours: number[];
  peakUploadDays: string[];
  topNiches: string[];
}

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [shorts, setShorts] = useState<Short[]>([]);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [patterns, setPatterns] = useState<Patterns | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    niche: 'all',
    timeRange: '6h',
    minViralScore: 0,
    region: 'US',
  });
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [rateLimitInfo, setRateLimitInfo] = useState({
    tier: 'free' as UserTier,
    requestsToday: 0,
    requestsAllowed: 10,
    resetTime: new Date(),
  });

  // Determine user tier based on session
  const getUserTier = (): UserTier => {
    if (session?.user && (session.user as { role?: string }).role === 'admin') {
      return 'admin';
    }
    return RateLimiter.getUserTier();
  };

  const fetchShorts = async (newFilters: Filters) => {
    try {
      setLoading(true);
      setError(null);

      // Check rate limit (admins bypass this)
      const tier = getUserTier();
      const rateLimitCheck = RateLimiter.checkRateLimit(tier);

      if (!rateLimitCheck.allowed) {
        setError(
          `Rate limit exceeded. You have ${rateLimitCheck.requestsToday} of ${rateLimitCheck.requestsAllowed} requests today. Resets in ${getTimeUntilReset(rateLimitCheck.resetTime)}.`
        );
        setLoading(false);
        return;
      }

      // Increment request count (not for admins)
      if (tier !== 'admin') {
        RateLimiter.incrementRequest();
      }

      const params = new URLSearchParams({
        niche: newFilters.niche,
        timeRange: newFilters.timeRange,
        minViralScore: newFilters.minViralScore.toString(),
        region: newFilters.region,
        limit: '20',
      });

      const response = await fetch(`/api/shorts/trending?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch shorts');
      }

      const data = await response.json();

      setShorts(data.shorts || []);
      setMetadata(data.metadata || null);
      setPatterns(data.patterns || null);
      setLastUpdated(Date.now());

      // Update rate limit info
      const newRateLimitCheck = RateLimiter.checkRateLimit(tier);
      setRateLimitInfo({
        tier,
        requestsToday: newRateLimitCheck.requestsToday,
        requestsAllowed: newRateLimitCheck.requestsAllowed,
        resetTime: newRateLimitCheck.resetTime,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  const getTimeUntilReset = (resetTime: Date): string => {
    const now = new Date();
    const diff = resetTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    fetchShorts(newFilters);
  };

  const handleRefresh = () => {
    fetchShorts(filters);
  };

  useEffect(() => {
    fetchShorts(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getApiStatus = (): 'ok' | 'limited' | 'mock' | 'error' => {
    if (error) return 'error';
    if (metadata?.quotaExceeded) return 'mock';
    if (metadata && metadata.quotaRemaining < 1000) return 'limited';
    return 'ok';
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>🎬</span>
                YouTube Shorts Viral Analyzer
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Discover trending Shorts and extract repeatable viral patterns
              </p>
            </div>
            <div className="flex items-center gap-3">
              {session?.user ? (
                <>
                  <div className="text-right mr-2">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {session.user.name || session.user.email}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {(session.user as { role?: string }).role === 'admin' ? '👑 Administrator' : 'User'}
                    </p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Sign In
                </button>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:cursor-not-allowed"
              >
                <span className={loading ? 'animate-spin' : ''}>🔄</span>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Status Banner */}
        <ApiStatusBanner
          status={getApiStatus()}
          quotaRemaining={metadata?.quotaRemaining || 0}
          message={error || undefined}
        />

        {/* Rate Limit Status */}
        <div className="mb-6">
          <RateLimitStatus
            tier={rateLimitInfo.tier}
            requestsToday={rateLimitInfo.requestsToday}
            requestsAllowed={rateLimitInfo.requestsAllowed}
            quotaRemaining={metadata?.quotaRemaining || 10000}
            resetTime={rateLimitInfo.resetTime}
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterBar onFilterChange={handleFilterChange} loading={loading} />
        </div>

        {/* Results Count */}
        {!loading && shorts.length > 0 && (
          <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Found <span className="font-semibold text-zinc-900 dark:text-zinc-100">{shorts.length}</span> viral shorts
            {metadata?.dataSource === 'mock' && (
              <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded text-xs font-medium">
                Demo Data
              </span>
            )}
          </div>
        )}

        {/* Shorts Grid */}
        <div className="mb-8">
          <ShortsGrid shorts={shorts} loading={loading} />
        </div>

        {/* Pattern Insights */}
        {shorts.length > 0 && (
          <div className="mb-8">
            <PatternInsights
              patterns={patterns}
              loading={loading}
              lastUpdated={lastUpdated}
            />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
              Error Loading Shorts
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              {error}
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              Built with Next.js • Powered by YouTube Data API v3 • Analyzing
              viral patterns in real-time
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
