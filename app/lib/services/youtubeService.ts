export interface YouTubeVideo {
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
  categoryId: string;
  description: string;
}

interface YouTubeSearchResult {
  items: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      channelId: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails: {
        high: { url: string };
      };
      description: string;
    };
  }>;
}

interface YouTubeVideoDetails {
  items: Array<{
    id: string;
    contentDetails: {
      duration: string;
    };
    statistics: {
      viewCount: string;
      likeCount: string;
      commentCount: string;
    };
    snippet: {
      categoryId: string;
      description: string;
    };
  }>;
}

interface YouTubeChannelDetails {
  items: Array<{
    statistics: {
      subscriberCount: string;
    };
  }>;
}

class YouTubeService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';
  private quotaUsed = 0;
  private lastResetTime = new Date();

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('YouTube API key not found in environment variables');
    }
  }

  private logQuotaUsage(cost: number) {
    this.quotaUsed += cost;
    console.log(`YouTube API quota used: ${cost} (total: ${this.quotaUsed})`);
  }

  getQuotaUsed(): number {
    return this.quotaUsed;
  }

  getQuotaRemaining(): number {
    return Math.max(0, 10000 - this.quotaUsed);
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    return hours * 3600 + minutes * 60 + seconds;
  }

  async searchShorts(
    query: string = 'shorts',
    maxResults: number = 50,
    publishedAfter?: string
  ): Promise<YouTubeVideo[]> {
    try {
      if (!this.apiKey) {
        throw new Error('QUOTA_EXCEEDED');
      }

      const searchParams = new URLSearchParams({
        key: this.apiKey,
        part: 'snippet',
        type: 'video',
        videoDuration: 'short',
        maxResults: maxResults.toString(),
        order: 'viewCount',
        q: query,
        ...(publishedAfter && { publishedAfter }),
      });

      const searchResponse = await fetch(
        `${this.baseUrl}/search?${searchParams}`
      );

      if (searchResponse.status === 403 || searchResponse.status === 429) {
        throw new Error('QUOTA_EXCEEDED');
      }

      if (!searchResponse.ok) {
        throw new Error(`YouTube API error: ${searchResponse.status}`);
      }

      const searchData: YouTubeSearchResult = await searchResponse.json();
      this.logQuotaUsage(100); // Search costs 100 quota units

      if (!searchData.items || searchData.items.length === 0) {
        return [];
      }

      const videoIds = searchData.items.map((item) => item.id.videoId);
      const videos = await this.getVideoDetails(videoIds);

      return videos.filter((video) => video.duration > 0 && video.duration <= 60);
    } catch (error) {
      if (error instanceof Error && error.message === 'QUOTA_EXCEEDED') {
        throw error;
      }
      console.error('Error searching YouTube shorts:', error);
      throw error;
    }
  }

  async getVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
    try {
      if (!this.apiKey) {
        throw new Error('QUOTA_EXCEEDED');
      }

      const videoParams = new URLSearchParams({
        key: this.apiKey,
        part: 'snippet,contentDetails,statistics',
        id: videoIds.join(','),
      });

      const videoResponse = await fetch(
        `${this.baseUrl}/videos?${videoParams}`
      );

      if (videoResponse.status === 403 || videoResponse.status === 429) {
        throw new Error('QUOTA_EXCEEDED');
      }

      if (!videoResponse.ok) {
        throw new Error(`YouTube API error: ${videoResponse.status}`);
      }

      const videoData: YouTubeVideoDetails = await videoResponse.json();
      this.logQuotaUsage(1); // Video details cost 1 quota unit

      const videoMap = new Map();

      for (const item of videoData.items) {
        const searchItem = videoIds.includes(item.id);
        if (searchItem) {
          videoMap.set(item.id, item);
        }
      }

      // Get channel info for all videos
      const videos: YouTubeVideo[] = [];
      for (const videoId of videoIds) {
        const item = videoMap.get(videoId);
        if (!item) continue;

        const duration = this.parseDuration(item.contentDetails.duration);
        
        videos.push({
          id: item.id,
          title: item.snippet.title || 'Untitled',
          channelName: 'Unknown',
          channelId: '',
          subscriberCount: 0,
          thumbnail: `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
          views: parseInt(item.statistics.viewCount || '0'),
          likes: parseInt(item.statistics.likeCount || '0'),
          comments: parseInt(item.statistics.commentCount || '0'),
          uploadedAt: new Date().toISOString(),
          duration,
          categoryId: item.snippet.categoryId || '0',
          description: item.snippet.description || '',
        });
      }

      return videos;
    } catch (error) {
      if (error instanceof Error && error.message === 'QUOTA_EXCEEDED') {
        throw error;
      }
      console.error('Error fetching video details:', error);
      throw error;
    }
  }

  async getChannelInfo(channelId: string): Promise<number> {
    try {
      if (!this.apiKey) {
        throw new Error('QUOTA_EXCEEDED');
      }

      const channelParams = new URLSearchParams({
        key: this.apiKey,
        part: 'statistics',
        id: channelId,
      });

      const channelResponse = await fetch(
        `${this.baseUrl}/channels?${channelParams}`
      );

      if (channelResponse.status === 403 || channelResponse.status === 429) {
        throw new Error('QUOTA_EXCEEDED');
      }

      if (!channelResponse.ok) {
        throw new Error(`YouTube API error: ${channelResponse.status}`);
      }

      const channelData: YouTubeChannelDetails = await channelResponse.json();
      this.logQuotaUsage(1); // Channel details cost 1 quota unit

      if (channelData.items && channelData.items.length > 0) {
        return parseInt(channelData.items[0].statistics.subscriberCount || '0');
      }

      return 0;
    } catch (error) {
      if (error instanceof Error && error.message === 'QUOTA_EXCEEDED') {
        throw error;
      }
      console.error('Error fetching channel info:', error);
      return 0;
    }
  }
}

export const youtubeService = new YouTubeService();
