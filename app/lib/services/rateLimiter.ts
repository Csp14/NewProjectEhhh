export type UserTier = 'free' | 'pro' | 'admin';

export interface RateLimitInfo {
  allowed: boolean;
  requestsToday: number;
  requestsAllowed: number;
  resetTime: Date;
  tier: UserTier;
}

interface RequestLog {
  count: number;
  date: string;
}

export class RateLimiter {
  private static STORAGE_KEY = 'youtube_shorts_rate_limit';
  private static FREE_TIER_LIMIT = 10;
  private static FREE_TIER_NICHES = ['motivation', 'sports', 'gaming'];

  static checkRateLimit(tier: UserTier = 'free'): RateLimitInfo {
    // Admin and Pro tiers have unlimited access
    if (tier === 'admin' || tier === 'pro') {
      return {
        allowed: true,
        requestsToday: 0,
        requestsAllowed: -1, // Unlimited
        resetTime: this.getNextResetTime(),
        tier,
      };
    }

    const requestLog = this.getRequestLog();
    const today = this.getTodayString();

    // Reset if new day
    if (requestLog.date !== today) {
      this.resetRequestLog();
      return {
        allowed: true,
        requestsToday: 0,
        requestsAllowed: this.FREE_TIER_LIMIT,
        resetTime: this.getNextResetTime(),
        tier: 'free',
      };
    }

    const allowed = requestLog.count < this.FREE_TIER_LIMIT;

    return {
      allowed,
      requestsToday: requestLog.count,
      requestsAllowed: this.FREE_TIER_LIMIT,
      resetTime: this.getNextResetTime(),
      tier: 'free',
    };
  }

  static incrementRequest(): void {
    const requestLog = this.getRequestLog();
    const today = this.getTodayString();

    if (requestLog.date !== today) {
      this.setRequestLog({ count: 1, date: today });
    } else {
      this.setRequestLog({ count: requestLog.count + 1, date: today });
    }
  }

  static isNicheAllowed(niche: string, tier: UserTier = 'free'): boolean {
    if (tier === 'admin' || tier === 'pro') {
      return true;
    }

    return this.FREE_TIER_NICHES.includes(niche);
  }

  static getAllowedNiches(tier: UserTier = 'free'): string[] {
    if (tier === 'admin' || tier === 'pro') {
      return ['all'];
    }

    return this.FREE_TIER_NICHES;
  }

  private static getRequestLog(): RequestLog {
    if (typeof window === 'undefined') {
      return { count: 0, date: this.getTodayString() };
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading rate limit from localStorage:', error);
    }

    return { count: 0, date: this.getTodayString() };
  }

  private static setRequestLog(log: RequestLog): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(log));
    } catch (error) {
      console.error('Error writing rate limit to localStorage:', error);
    }
  }

  private static resetRequestLog(): void {
    this.setRequestLog({ count: 0, date: this.getTodayString() });
  }

  private static getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private static getNextResetTime(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  static getUserTier(): UserTier {
    if (typeof window === 'undefined') {
      return 'free';
    }

    try {
      const tier = localStorage.getItem('user_tier');
      return (tier as UserTier) || 'free';
    } catch {
      return 'free';
    }
  }

  static setUserTier(tier: UserTier): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem('user_tier', tier);
    } catch (error) {
      console.error('Error setting user tier:', error);
    }
  }
}
