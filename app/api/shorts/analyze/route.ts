import { NextRequest, NextResponse } from 'next/server';
import { ViralScoringEngine } from '@/app/lib/services/viralScoringEngine';
import { PatternAnalyzer } from '@/app/lib/services/patternAnalyzer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      videoId,
      title,
      description,
      duration,
      views,
      likes,
      comments,
      uploadedAt,
      subscriberCount,
      categoryId,
    } = body;

    // Validate required fields
    if (
      !videoId ||
      !title ||
      typeof duration !== 'number' ||
      typeof views !== 'number' ||
      typeof likes !== 'number' ||
      typeof comments !== 'number' ||
      !uploadedAt ||
      typeof subscriberCount !== 'number'
    ) {
      return NextResponse.json(
        {
          error: 'Missing or invalid required fields',
          required: [
            'videoId',
            'title',
            'description',
            'duration',
            'views',
            'likes',
            'comments',
            'uploadedAt',
            'subscriberCount',
            'categoryId',
          ],
        },
        { status: 400 }
      );
    }

    // Calculate viral score
    const viralMetrics = ViralScoringEngine.calculateViralScore(
      views,
      likes,
      comments,
      duration,
      uploadedAt,
      subscriberCount
    );

    // Analyze patterns
    const hooks = PatternAnalyzer.extractHookPattern(title);
    const hashtagCount = PatternAnalyzer.countHashtags(description || '');
    const niche = PatternAnalyzer.inferNiche(
      title,
      description || '',
      categoryId || '0'
    );

    const uploadDate = new Date(uploadedAt);
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const response = {
      videoId,
      viralScore: viralMetrics.viralScore,
      breakdown: {
        viewsPerHour: viralMetrics.viewsPerHour,
        likeRatio: viralMetrics.likeRatio,
        commentVelocity: viralMetrics.commentVelocity,
        channelGrowthMultiplier: viralMetrics.channelGrowthMultiplier,
        recencyDecay: viralMetrics.recencyDecay,
      },
      copyInsight: viralMetrics.copyInsight,
      patterns: {
        hooks,
        hashtagCount,
        niche,
        uploadHour: uploadDate.getUTCHours(),
        uploadDay: dayNames[uploadDate.getUTCDay()],
        duration,
      },
      recommendations: generateRecommendations(
        viralMetrics,
        hooks,
        hashtagCount
      ),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in analyze endpoint:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze video',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function generateRecommendations(
  metrics: {
    viralScore: number;
    likeRatio: number;
    commentVelocity: number;
    channelGrowthMultiplier: number;
  },
  hooks: string[],
  hashtagCount: number
): string[] {
  const recommendations: string[] = [];

  // Viral score based recommendations
  if (metrics.viralScore >= 80) {
    recommendations.push(
      '🔥 This video has exceptional viral potential - replicate this format!'
    );
  } else if (metrics.viralScore >= 60) {
    recommendations.push(
      '✅ Strong performance - analyze what worked and refine further'
    );
  } else if (metrics.viralScore >= 40) {
    recommendations.push(
      '⚠️ Moderate performance - test different hooks or posting times'
    );
  } else {
    recommendations.push(
      '📊 Below average - consider major format changes or niche pivot'
    );
  }

  // Like ratio recommendations
  if (metrics.likeRatio < 2) {
    recommendations.push(
      '👎 Low like ratio suggests weak emotional hook - add more engaging elements'
    );
  } else if (metrics.likeRatio >= 5) {
    recommendations.push(
      '❤️ Excellent like ratio - your emotional hook is working perfectly'
    );
  }

  // Comment velocity recommendations
  if (metrics.commentVelocity < 5) {
    recommendations.push(
      '💬 Low comment engagement - try controversial takes or questions to spark discussion'
    );
  } else if (metrics.commentVelocity >= 20) {
    recommendations.push(
      '🔥 High comment velocity - your content is driving conversations'
    );
  }

  // Hook recommendations
  if (!hooks.includes('Question hook') && !hooks.includes('POV/Relatability')) {
    recommendations.push(
      '❓ Consider using question or POV hooks for higher engagement'
    );
  }

  // Hashtag recommendations
  if (hashtagCount < 3) {
    recommendations.push(
      '#️⃣ Add more hashtags (aim for 5-8) to improve discoverability'
    );
  } else if (hashtagCount > 10) {
    recommendations.push(
      '#️⃣ Too many hashtags can look spammy - keep it under 10'
    );
  }

  // Channel growth recommendations
  if (metrics.channelGrowthMultiplier >= 30) {
    recommendations.push(
      '🚀 Strong shareability detected - this content is reaching beyond your subscriber base'
    );
  }

  return recommendations.slice(0, 5);
}
