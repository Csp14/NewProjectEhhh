import { NextRequest, NextResponse } from 'next/server';
import { youtubeService } from '@/app/lib/services/youtubeService';
import { ViralScoringEngine } from '@/app/lib/services/viralScoringEngine';
import { PatternAnalyzer } from '@/app/lib/services/patternAnalyzer';
import { CacheManager } from '@/app/lib/utils/cacheManager';
import { MOCK_SHORTS } from '@/app/lib/mockData';

const NICHE_SEARCH_TERMS: Record<string, string> = {
  gaming: 'gaming shorts gameplay',
  sports: 'sports highlights fitness',
  drama: 'drama tea exposed',
  motivation: 'motivation success mindset',
  finance: 'money investing finance',
  education: 'education learning science',
  lifestyle: 'lifestyle vlog daily',
  tech: 'tech technology review',
  music: 'music beats song',
  other: 'trending viral',
};

interface ProcessedShort {
  id: string;
  title: string;
  channelName: string;
  channelId: string;
  subscriberCount: number;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  uploadedAt: string;
  duration: number;
  viralScore: number;
  viewsPerHour: number;
  likeRatio: number;
  commentVelocity: number;
  copyInsight: string;
  hashtags: string[];
  niche: string;
  dataSource: 'youtube' | 'mock';
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const niche = searchParams.get('niche') || 'all';
    const timeRange = searchParams.get('timeRange') || '6h';
    const minViralScore = parseInt(searchParams.get('minViralScore') || '0');
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '20'),
      50
    );

    // Check cache first
    const cacheKey = CacheManager.generateKey('shorts', {
      niche,
      timeRange,
      minViralScore,
      limit,
    });

    const cachedData = CacheManager.get<{
      shorts: ProcessedShort[];
      metadata: {
        totalResults: number;
        quotaRemaining: number;
        cacheAge: number;
        quotaExceeded: boolean;
        dataSource: 'youtube' | 'mock';
      };
      patterns: {
        commonHooks: string[];
        avgHashtagCount: number;
        avgDuration: number;
        peakUploadHours: number[];
        peakUploadDays: string[];
        topNiches: string[];
      };
    }>(cacheKey);

    if (cachedData) {
      return NextResponse.json({
        ...cachedData,
        metadata: {
          ...cachedData.metadata,
          cacheAge: CacheManager.getCacheAge(cacheKey),
        },
      });
    }

    // Calculate publishedAfter based on timeRange
    const timeRangeHours: Record<string, number> = {
      '1h': 1,
      '6h': 6,
      '24h': 24,
    };

    const hoursAgo = timeRangeHours[timeRange] || 6;
    const publishedAfter = new Date(
      Date.now() - hoursAgo * 60 * 60 * 1000
    ).toISOString();

    let shorts: ProcessedShort[] = [];
    let dataSource: 'youtube' | 'mock' = 'youtube';
    let quotaExceeded = false;

    try {
      // Try to fetch from YouTube API
      const searchQuery =
        niche === 'all' ? 'shorts trending' : NICHE_SEARCH_TERMS[niche] || 'shorts';

      const youtubeVideos = await youtubeService.searchShorts(
        searchQuery,
        limit * 2, // Fetch more to filter by viral score
        publishedAfter
      );

      // Process each video
      for (const video of youtubeVideos) {
        const viralMetrics = ViralScoringEngine.calculateViralScore(
          video.views,
          video.likes,
          video.comments,
          video.duration,
          video.uploadedAt,
          video.subscriberCount
        );

        const inferredNiche = PatternAnalyzer.inferNiche(
          video.title,
          video.description,
          video.categoryId
        );

        const hashtags = video.description.match(/#\w+/g) || [];

        shorts.push({
          id: video.id,
          title: video.title,
          channelName: video.channelName,
          channelId: video.channelId,
          subscriberCount: video.subscriberCount,
          thumbnail: video.thumbnail,
          views: video.views,
          likes: video.likes,
          comments: video.comments,
          uploadedAt: video.uploadedAt,
          duration: video.duration,
          viralScore: viralMetrics.viralScore,
          viewsPerHour: viralMetrics.viewsPerHour,
          likeRatio: viralMetrics.likeRatio,
          commentVelocity: viralMetrics.commentVelocity,
          copyInsight: viralMetrics.copyInsight,
          hashtags: hashtags.slice(0, 10),
          niche: inferredNiche,
          dataSource: 'youtube' as const,
        });
      }
    } catch (error: unknown) {
      console.error('YouTube API error:', error);

      if (error instanceof Error && error.message === 'QUOTA_EXCEEDED') {
        quotaExceeded = true;
        dataSource = 'mock';

        // Use mock data
        const mockShorts: ProcessedShort[] = MOCK_SHORTS.map((mock) => {
          const viralMetrics = ViralScoringEngine.calculateViralScore(
            mock.views,
            mock.likes,
            mock.comments,
            mock.duration,
            mock.uploadedAt,
            mock.subscriberCount
          );

          const hashtags = mock.description.match(/#\w+/g) || [];

          return {
            id: mock.id,
            title: mock.title,
            channelName: mock.channelName,
            channelId: mock.channelId,
            subscriberCount: mock.subscriberCount,
            thumbnail: mock.thumbnail,
            views: mock.views,
            likes: mock.likes,
            comments: mock.comments,
            uploadedAt: mock.uploadedAt,
            duration: mock.duration,
            viralScore: viralMetrics.viralScore,
            viewsPerHour: viralMetrics.viewsPerHour,
            likeRatio: viralMetrics.likeRatio,
            commentVelocity: viralMetrics.commentVelocity,
            copyInsight: viralMetrics.copyInsight,
            hashtags: hashtags.slice(0, 10),
            niche: mock.niche,
            dataSource: 'mock' as const,
          };
        });

        shorts = mockShorts;
      } else {
        throw error;
      }
    }

    // Filter by niche if specified
    if (niche !== 'all') {
      shorts = shorts.filter((short) => short.niche === niche);
    }

    // Filter by minimum viral score
    shorts = shorts.filter((short) => short.viralScore >= minViralScore);

    // Sort by viral score descending
    shorts.sort((a, b) => b.viralScore - a.viralScore);

    // Limit results
    shorts = shorts.slice(0, limit);

    // Analyze patterns from top shorts
    const patternsData = shorts.map((short) => ({
      title: short.title,
      description: short.hashtags.join(' '),
      duration: short.duration,
      uploadedAt: short.uploadedAt,
      categoryId: '0',
      viralScore: short.viralScore,
      niche: short.niche,
    }));

    const patterns = PatternAnalyzer.analyzePatterns(patternsData);

    const response = {
      shorts,
      metadata: {
        totalResults: shorts.length,
        quotaRemaining: youtubeService.getQuotaRemaining(),
        cacheAge: 0,
        quotaExceeded,
        dataSource,
      },
      patterns,
    };

    // Cache the response
    CacheManager.set(cacheKey, response, 60 * 60 * 1000); // 1 hour TTL

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in trending endpoint:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch trending shorts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
