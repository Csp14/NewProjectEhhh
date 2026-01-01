export interface ViralScoreBreakdown {
  viralScore: number;
  viewsPerHour: number;
  likeRatio: number;
  commentVelocity: number;
  channelGrowthMultiplier: number;
  recencyDecay: number;
  copyInsight: string;
}

export class ViralScoringEngine {
  /**
   * Calculate viral score for a YouTube Short
   * 
   * Algorithm:
   * 1. viewsPerHour = views / hours_since_upload
   * 2. likeRatio = (likes / views) * 100 (capped at 100)
   * 3. commentVelocity = comments / hours_since_upload
   * 4. channelGrowthMultiplier = (views / max(subscriberCount, 1)) * 10 (capped at 100)
   * 5. recencyDecay = 100 / (1 + (hours_since_upload / 48))
   * 
   * Final Score (weighted):
   * - viewsPerHour: 40%
   * - likeRatio: 25%
   * - commentVelocity: 20%
   * - channelGrowthMultiplier: 10%
   * - recencyDecay: 5%
   */
  static calculateViralScore(
    views: number,
    likes: number,
    comments: number,
    duration: number,
    uploadedAt: string,
    subscriberCount: number
  ): ViralScoreBreakdown {
    const now = new Date();
    const uploadDate = new Date(uploadedAt);
    const hoursSinceUpload = Math.max(
      (now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60),
      0.1 // Minimum 0.1 hours to avoid division by zero
    );

    // 1. Views per hour (raw metric)
    const viewsPerHour = views / hoursSinceUpload;

    // 2. Like ratio as percentage (capped at 100)
    const likeRatio = Math.min((likes / Math.max(views, 1)) * 100, 100);

    // 3. Comment velocity (comments per hour)
    const commentVelocity = comments / hoursSinceUpload;

    // 4. Channel growth multiplier (boost for small channels going viral)
    const channelGrowthMultiplier = Math.min(
      (views / Math.max(subscriberCount, 1)) * 10,
      100
    );

    // 5. Recency decay (newer videos get higher scores)
    const recencyDecay = 100 / (1 + hoursSinceUpload / 48);

    // Normalize metrics to 0-100 scale
    const normalizedViewsPerHour = Math.min((viewsPerHour / 1000) * 100, 100);
    const normalizedCommentVelocity = Math.min((commentVelocity / 100) * 100, 100);

    // Calculate weighted viral score
    const viralScore = Math.round(
      normalizedViewsPerHour * 0.4 +
      likeRatio * 0.25 +
      normalizedCommentVelocity * 0.2 +
      channelGrowthMultiplier * 0.1 +
      recencyDecay * 0.05
    );

    // Generate copy insight based on strongest metrics
    const copyInsight = this.generateCopyInsight(
      viewsPerHour,
      likeRatio,
      commentVelocity,
      channelGrowthMultiplier,
      subscriberCount,
      hoursSinceUpload,
      uploadDate
    );

    return {
      viralScore: Math.min(Math.max(viralScore, 0), 100),
      viewsPerHour: Math.round(viewsPerHour),
      likeRatio: Math.round(likeRatio * 100) / 100,
      commentVelocity: Math.round(commentVelocity * 100) / 100,
      channelGrowthMultiplier: Math.round(channelGrowthMultiplier),
      recencyDecay: Math.round(recencyDecay),
      copyInsight,
    };
  }

  private static generateCopyInsight(
    viewsPerHour: number,
    likeRatio: number,
    commentVelocity: number,
    channelGrowthMultiplier: number,
    subscriberCount: number,
    hoursSinceUpload: number,
    uploadDate: Date
  ): string {
    const insights: string[] = [];

    // High like ratio
    if (likeRatio >= 5) {
      insights.push(
        `Exceptional like ratio (${likeRatio.toFixed(1)}%) suggests strong emotional hook`
      );
    } else if (likeRatio >= 3) {
      insights.push(
        `Above-average like ratio (${likeRatio.toFixed(1)}%) indicates engaging content`
      );
    }

    // Small channel going viral
    if (channelGrowthMultiplier >= 50 && subscriberCount < 10000) {
      insights.push(
        `Small channel (${this.formatNumber(subscriberCount)} subs) achieving ${this.formatNumber(viewsPerHour * hoursSinceUpload)} views = viral potential pattern`
      );
    } else if (channelGrowthMultiplier >= 30 && subscriberCount < 50000) {
      insights.push(
        `Channel outperforming subscriber base - high shareability detected`
      );
    }

    // High velocity
    if (viewsPerHour >= 10000) {
      insights.push(
        `Explosive growth with ${this.formatNumber(viewsPerHour)}/hour view velocity`
      );
    } else if (viewsPerHour >= 5000) {
      insights.push(
        `Strong momentum with ${this.formatNumber(viewsPerHour)}/hour views`
      );
    }

    // High comment velocity
    if (commentVelocity >= 50) {
      insights.push(
        `High comment velocity (${Math.round(commentVelocity)}/hr) indicates audience debate/engagement`
      );
    } else if (commentVelocity >= 20) {
      insights.push(
        `Strong comment engagement driving algorithm boost`
      );
    }

    // Peak timing analysis
    const uploadHour = uploadDate.getUTCHours();
    const peakHours = [12, 13, 14, 18, 19, 20, 21];
    if (peakHours.includes(uploadHour)) {
      insights.push(
        `Posted during peak engagement hour (${uploadHour}:00 UTC)`
      );
    }

    // Recency
    if (hoursSinceUpload < 6) {
      insights.push(
        `Fresh upload trending fast - potential early viral signal`
      );
    }

    // Default if no strong patterns
    if (insights.length === 0) {
      insights.push(
        `Pattern analysis suggests ${this.formatNumber(viewsPerHour)} views/hour with ${likeRatio.toFixed(1)}% engagement`
      );
    }

    // Return top 2 insights
    return insights.slice(0, 2).join('. ') + '.';
  }

  private static formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
