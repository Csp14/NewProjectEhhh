export interface PatternAnalysis {
  commonHooks: string[];
  avgHashtagCount: number;
  avgDuration: number;
  peakUploadHours: number[];
  peakUploadDays: string[];
  topNiches: string[];
}

export interface ShortWithMetrics {
  title: string;
  description: string;
  duration: number;
  uploadedAt: string;
  categoryId: string;
  viralScore: number;
  niche: string;
}

export class PatternAnalyzer {
  private static HOOK_PATTERNS = {
    question: /^(why|how|what|when|where|who|which|can|do|does|is|are|will|would|should)\s/i,
    number: /^(\d+|\w+\s(ways|tips|tricks|secrets|hacks|reasons|things|steps|rules))/i,
    emoji: /^[\p{Emoji}]/u,
    urgency: /(now|today|asap|urgent|breaking|must|need|shocking|insane|crazy)/i,
    negative: /^(don't|never|stop|avoid|worst|biggest mistake)/i,
    pov: /^(pov|when you|imagine|me when|that moment)/i,
  };

  private static NICHE_KEYWORDS: Record<string, string[]> = {
    gaming: ['gaming', 'game', 'gameplay', 'gamer', 'fortnite', 'minecraft', 'valorant', 'cod', 'fifa', 'ps5', 'xbox'],
    sports: ['sports', 'football', 'basketball', 'soccer', 'nba', 'nfl', 'fitness', 'workout', 'gym', 'athletic'],
    drama: ['drama', 'tea', 'exposed', 'cancelled', 'beef', 'fight', 'controversy', 'breakup', 'leaked'],
    motivation: ['motivation', 'inspire', 'success', 'mindset', 'hustle', 'grind', 'goals', 'discipline', 'quotes'],
    finance: ['money', 'invest', 'crypto', 'stocks', 'business', 'finance', 'rich', 'wealth', 'passive income'],
    education: ['learn', 'tutorial', 'explained', 'education', 'study', 'science', 'history', 'facts', 'did you know'],
    lifestyle: ['lifestyle', 'vlog', 'daily', 'routine', 'life', 'travel', 'fashion', 'beauty', 'food'],
    tech: ['tech', 'technology', 'coding', 'programming', 'ai', 'iphone', 'android', 'gadget', 'review'],
    music: ['music', 'song', 'beat', 'remix', 'cover', 'singing', 'instrumental', 'lyrics', 'audio'],
  };

  static extractHookPattern(title: string): string[] {
    const hooks: string[] = [];

    for (const [hookType, pattern] of Object.entries(this.HOOK_PATTERNS)) {
      if (pattern.test(title)) {
        hooks.push(this.formatHookType(hookType));
      }
    }

    return hooks.length > 0 ? hooks : ['Direct statement'];
  }

  private static formatHookType(hookType: string): string {
    const formatted: Record<string, string> = {
      question: 'Question hook',
      number: 'Listicle/Number hook',
      emoji: 'Emoji opener',
      urgency: 'Urgency/FOMO',
      negative: 'Negative angle',
      pov: 'POV/Relatability',
    };
    return formatted[hookType] || hookType;
  }

  static countHashtags(description: string): number {
    const hashtags = description.match(/#\w+/g);
    return hashtags ? hashtags.length : 0;
  }

  static inferNiche(title: string, description: string, categoryId: string): string {
    const text = `${title} ${description}`.toLowerCase();

    for (const [niche, keywords] of Object.entries(this.NICHE_KEYWORDS)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return niche;
        }
      }
    }

    // Fallback based on YouTube category
    const categoryMap: Record<string, string> = {
      '20': 'gaming',
      '17': 'sports',
      '24': 'lifestyle',
      '22': 'lifestyle',
      '10': 'music',
      '27': 'education',
      '28': 'tech',
    };

    return categoryMap[categoryId] || 'other';
  }

  static analyzePatterns(shorts: ShortWithMetrics[]): PatternAnalysis {
    if (shorts.length === 0) {
      return {
        commonHooks: [],
        avgHashtagCount: 0,
        avgDuration: 0,
        peakUploadHours: [],
        peakUploadDays: [],
        topNiches: [],
      };
    }

    // Extract all hooks
    const hookCounts = new Map<string, number>();
    let totalHashtags = 0;
    let totalDuration = 0;
    const uploadHours = new Map<number, number>();
    const uploadDays = new Map<string, number>();
    const nicheCounts = new Map<string, number>();

    for (const short of shorts) {
      // Hooks
      const hooks = this.extractHookPattern(short.title);
      for (const hook of hooks) {
        hookCounts.set(hook, (hookCounts.get(hook) || 0) + 1);
      }

      // Hashtags
      totalHashtags += this.countHashtags(short.description);

      // Duration
      totalDuration += short.duration;

      // Upload timing
      const uploadDate = new Date(short.uploadedAt);
      const hour = uploadDate.getUTCHours();
      uploadHours.set(hour, (uploadHours.get(hour) || 0) + 1);

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const day = dayNames[uploadDate.getUTCDay()];
      uploadDays.set(day, (uploadDays.get(day) || 0) + 1);

      // Niches
      nicheCounts.set(short.niche, (nicheCounts.get(short.niche) || 0) + 1);
    }

    // Get top hooks (at least 2 occurrences)
    const commonHooks = Array.from(hookCounts.entries())
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([hook]) => hook);

    // Get peak upload hours (top 3)
    const peakUploadHours = Array.from(uploadHours.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => hour);

    // Get peak upload days (top 3)
    const peakUploadDays = Array.from(uploadDays.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([day]) => day);

    // Get top niches
    const topNiches = Array.from(nicheCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([niche]) => niche);

    return {
      commonHooks: commonHooks.length > 0 ? commonHooks : ['Question hook', 'Direct statement'],
      avgHashtagCount: Math.round((totalHashtags / shorts.length) * 10) / 10,
      avgDuration: Math.round(totalDuration / shorts.length),
      peakUploadHours,
      peakUploadDays,
      topNiches,
    };
  }
}
