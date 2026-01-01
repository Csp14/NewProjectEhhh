import { NextRequest, NextResponse } from 'next/server';
import { youtubeService } from '@/app/lib/services/youtubeService';
import { CacheManager } from '@/app/lib/utils/cacheManager';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userTier = (searchParams.get('tier') || 'free') as 'free' | 'pro';

    const quotaUsed = youtubeService.getQuotaUsed();
    const quotaRemaining = youtubeService.getQuotaRemaining();

    // Determine API status
    let apiStatus: 'ok' | 'limited' | 'error' = 'ok';
    if (quotaRemaining < 100) {
      apiStatus = 'error';
    } else if (quotaRemaining < 1000) {
      apiStatus = 'limited';
    }

    // Calculate requests today (from localStorage on client side)
    const requestsToday = 0; // This will be managed client-side
    const requestsAllowed = userTier === 'free' ? 10 : -1;

    // Calculate quota reset time (YouTube resets at midnight Pacific Time)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const quotaResetTime = tomorrow.toISOString();

    // Check cache status for common queries
    const cacheKey = CacheManager.generateKey('shorts', {
      niche: 'all',
      timeRange: '6h',
      minViralScore: 0,
      limit: 20,
    });
    const cacheStatus = CacheManager.getCacheStatus(cacheKey);

    const response = {
      apiStatus,
      quotaRemaining,
      quotaUsed,
      quotaResetTime,
      userTier,
      requestsToday,
      requestsAllowed,
      cacheStatus,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in health endpoint:', error);
    return NextResponse.json(
      {
        apiStatus: 'error',
        error: 'Failed to check API health',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
