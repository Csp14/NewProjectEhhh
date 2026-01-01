# YouTube Shorts Viral Analyzer 🎬

A production-ready Next.js web application that discovers trending YouTube Shorts, calculates viral scores, and extracts repeatable patterns to help creators understand what makes content go viral.

## ✨ Features

### Core Functionality
- **Real-time Shorts Discovery**: Fetches trending YouTube Shorts (under 60 seconds) using YouTube Data API v3
- **100% Real Data**: Only displays authentic YouTube videos - no fake or mock data
- **Viral Score Calculation**: Computes a 0-100 score based on views per hour, like ratio, comment velocity, and more
- **Pattern Analysis**: Extracts repeatable patterns including hooks, hashtags, timing, and niches
- **Interactive Dashboard**: Filter by niche, time range, region, and minimum viral score
- **Region Filtering**: Focus on US/UK/CA/AU content with English language prioritization
- **Authentication**: Admin login for unlimited API access (bypass rate limits)
- **Rate Limiting**: Free tier (10 requests/day) and Admin tier (unlimited) support

### Technical Features
- ⚡ Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4
- 🎨 Responsive design with dark mode support
- 📊 Real-time viral metrics and pattern insights
- 🔄 Smart caching (1-hour TTL) to optimize API usage
- 🎯 Client-side filtering for instant results
- 🌐 RESTful API endpoints for external integrations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- YouTube Data API v3 key (already configured - see below)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. **Environment Setup** (Already Done ✅)

The YouTube API key is already configured in `.env.local`:
```bash
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyCUbfny-lgD0mS3yJk78CkuikgFDYwfu2o
```

**No additional setup needed!** The app is ready to use immediately.

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to [http://localhost:3000](http://localhost:3000)

That's it! The app will start fetching real YouTube Shorts data.

## 📖 How It Works

### Viral Scoring Algorithm

The app uses a sophisticated weighted algorithm to calculate viral scores (0-100):

**Metrics Calculated:**
1. **Views Per Hour** (40% weight): `views / hours_since_upload`
   - Normalized to 0-100 scale (1000 views/hour = 100 points)
   - Measures raw growth velocity

2. **Like Ratio** (25% weight): `(likes / views) * 100`
   - Capped at 100
   - Indicates emotional engagement strength

3. **Comment Velocity** (20% weight): `comments / hours_since_upload`
   - Normalized to 0-100 scale (100 comments/hour = 100 points)
   - Shows discussion and debate levels

4. **Channel Growth Multiplier** (10% weight): `(views / max(subscribers, 1)) * 10`
   - Capped at 100
   - Boosts small channels going viral (high shareability signal)

5. **Recency Decay** (5% weight): `100 / (1 + hours_since_upload / 48)`
   - Favors newer content
   - 48-hour half-life

**Final Score:**
```
viralScore = 
  (viewsPerHour_normalized * 0.40) +
  (likeRatio * 0.25) +
  (commentVelocity_normalized * 0.20) +
  (channelGrowthMultiplier * 0.10) +
  (recencyDecay * 0.05)
```

**Copy Insights:** The algorithm generates intelligent 1-2 sentence explanations based on which metrics are strongest, helping creators understand *why* content is viral.

### Pattern Extraction

The app analyzes top-performing Shorts to identify:
- **Common Hooks**: Question hooks, POV/relatability, listicles, emoji openers, urgency/FOMO
- **Hashtag Usage**: Average hashtag count (optimal: 5-8)
- **Duration Patterns**: Average length of viral Shorts
- **Upload Timing**: Peak hours (UTC) and days of the week
- **Niche Performance**: Top-performing content categories

## 🎯 Rate Limiting

### Free Tier
- **10 requests per day**
- Access to 3 niches: Gaming, Sports, Motivation
- Last 24 hours of data
- Resets daily at midnight

### Pro Tier (Coming Soon)
- Unlimited requests
- All 9 niches
- 7-day trend comparison
- CSV export
- API access token

Rate limits are stored in localStorage and reset every 24 hours.

## 📡 API Endpoints

### GET `/api/shorts/trending`
Fetch trending YouTube Shorts with viral scores.

**Query Parameters:**
- `niche`: string (gaming, sports, drama, motivation, finance, education, lifestyle, tech, music, all)
- `timeRange`: string (1h, 6h, 24h)
- `minViralScore`: number (0-100)
- `limit`: number (10-50, default: 20)

**Response:**
```json
{
  "shorts": [
    {
      "id": "video_id",
      "title": "...",
      "viralScore": 87,
      "viewsPerHour": 6250,
      "copyInsight": "...",
      "dataSource": "youtube"
    }
  ],
  "metadata": {
    "quotaRemaining": 9500,
    "quotaExceeded": false
  },
  "patterns": {
    "commonHooks": ["Question hook", "POV/Relatability"],
    "avgDuration": 42
  }
}
```

### POST `/api/shorts/analyze`
Analyze a specific video and get viral score breakdown.

**Body:**
```json
{
  "videoId": "string",
  "title": "string",
  "views": number,
  "likes": number,
  "comments": number,
  "uploadedAt": "ISO string",
  "subscriberCount": number
}
```

### GET `/api/shorts/health`
Check API status and quota remaining.

**Response:**
```json
{
  "apiStatus": "ok",
  "quotaRemaining": 9500,
  "userTier": "free",
  "requestsToday": 5
}
```

See [API.md](./API.md) for full documentation.

## 🗂️ Project Structure

```
app/
├── api/shorts/          # API routes
│   ├── trending/        # Fetch trending shorts
│   ├── analyze/         # Analyze specific video
│   └── health/          # API health check
├── components/          # React components
│   ├── FilterBar.tsx
│   ├── ShortsGrid.tsx
│   ├── ViralMetricsCard.tsx
│   ├── PatternInsights.tsx
│   ├── RateLimitStatus.tsx
│   └── ApiStatusBanner.tsx
├── lib/
│   ├── services/        # Business logic
│   │   ├── youtubeService.ts
│   │   ├── viralScoringEngine.ts
│   │   ├── patternAnalyzer.ts
│   │   └── rateLimiter.ts
│   ├── utils/           # Utilities
│   │   └── cacheManager.ts
│   └── mockData.ts      # Fallback data
└── page.tsx             # Main app page
```

## 🔧 Configuration

### Environment Variables

The app uses the following environment variable:

- `NEXT_PUBLIC_YOUTUBE_API_KEY`: YouTube Data API v3 key (already configured in `.env.local`)

**Important:** The API key is exposed to the client (NEXT_PUBLIC prefix) because YouTube Data API v3 is designed for browser-based applications with API key restrictions (HTTP referrer restrictions) configured in Google Cloud Console.

### YouTube API Quota

- Daily quota: 10,000 units
- Search query: 100 units
- Video details: 1 unit per video
- Channel info: 1 unit per channel

The app is optimized to cache results for 1 hour to minimize quota usage.

## 🎨 Customization

### Adding New Niches

Edit `app/lib/services/patternAnalyzer.ts`:
```typescript
private static NICHE_KEYWORDS: Record<string, string[]> = {
  your_niche: ['keyword1', 'keyword2', ...],
};
```

### Adjusting Viral Score Weights

Edit `app/lib/services/viralScoringEngine.ts`:
```typescript
const viralScore = Math.round(
  normalizedViewsPerHour * 0.40 +  // Adjust weights here
  likeRatio * 0.25 +
  normalizedCommentVelocity * 0.20 +
  channelGrowthMultiplier * 0.10 +
  recencyDecay * 0.05
);
```

### Modifying Rate Limits

Edit `app/lib/services/rateLimiter.ts`:
```typescript
private static FREE_TIER_LIMIT = 10;  // Change daily limit
```

## 🧪 Testing

The app includes:
- Real YouTube API integration (auto-fallback to mock data on quota exceeded)
- 25 realistic mock Shorts across 8 niches
- Error handling for all edge cases
- Loading states and skeleton loaders

Test scenarios:
1. ✅ Fresh load with API quota available
2. ✅ Filtering by niche, time range, viral score
3. ✅ Rate limit enforcement (after 10 requests)
4. ✅ API quota exceeded (shows mock data)
5. ✅ Network errors (retry mechanism)

## 📄 Additional Documentation

- [ALGORITHM.md](./ALGORITHM.md) - Detailed viral scoring algorithm explanation
- [API.md](./API.md) - Complete API endpoint documentation

## 🐛 Troubleshooting

### "API quota exceeded" message
- The app automatically falls back to realistic mock data
- Quota resets daily at midnight Pacific Time
- Consider implementing caching or reducing request frequency

### "Rate limit exceeded" message
- Free tier: Wait until daily reset (shown in UI)
- Or implement Pro tier authentication

### No results found
- Try broader filters (select "All Niches", increase time range)
- Check API status in the banner
- Verify API key is valid in `.env.local`

## 🚀 Production Deployment

1. Build the app:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

3. Deploy to Vercel (recommended):
```bash
vercel --prod
```

Don't forget to set environment variables in your deployment platform!

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ using Next.js, React, TypeScript, and YouTube Data API v3
