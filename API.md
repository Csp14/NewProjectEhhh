# API Documentation

Complete documentation for YouTube Shorts Viral Analyzer API endpoints.

## Base URL

```
http://localhost:3000/api
```

For production: Replace with your deployed domain.

## Authentication

Currently, the API uses client-side rate limiting stored in localStorage. Future versions will include:
- API keys for Pro tier
- JWT authentication
- OAuth integration

## Rate Limiting

### Free Tier
- 10 requests per day
- Resets at midnight (local time)
- Tracked via localStorage

### Pro Tier
- Unlimited requests
- Requires authentication (coming soon)

## Endpoints

---

### GET `/api/shorts/trending`

Fetch trending YouTube Shorts with viral scores and pattern analysis.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `niche` | string | No | `all` | Content niche to filter by |
| `timeRange` | string | No | `6h` | Time window for trending content |
| `minViralScore` | number | No | `0` | Minimum viral score (0-100) |
| `limit` | number | No | `20` | Number of results (10-50) |

**Valid `niche` values:**
- `all` - All niches
- `gaming` - Gaming content
- `sports` - Sports & fitness
- `drama` - Drama & tea
- `motivation` - Motivation & success
- `finance` - Finance & investing
- `education` - Educational content
- `lifestyle` - Lifestyle & vlogs
- `tech` - Technology reviews
- `music` - Music & audio

**Valid `timeRange` values:**
- `1h` - Last hour
- `6h` - Last 6 hours (default)
- `24h` - Last 24 hours

#### Example Request

```bash
GET /api/shorts/trending?niche=gaming&timeRange=6h&minViralScore=50&limit=10
```

```javascript
const response = await fetch(
  '/api/shorts/trending?niche=gaming&timeRange=6h&minViralScore=50&limit=10'
);
const data = await response.json();
```

#### Response Schema

```json
{
  "shorts": [
    {
      "id": "dQw4w9WgXcQ",
      "title": "Amazing gaming moment #shorts",
      "channelName": "ProGamer",
      "channelId": "UCxxxxxxxxxxxxxxxx",
      "subscriberCount": 15000,
      "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      "views": 250000,
      "likes": 12500,
      "comments": 890,
      "uploadedAt": "2025-01-01T12:00:00Z",
      "duration": 42,
      "viralScore": 87,
      "viewsPerHour": 6250,
      "likeRatio": 5.0,
      "commentVelocity": 22.25,
      "copyInsight": "Exceptional like ratio (5.0%) suggests strong emotional hook. High comment velocity (22/hr) indicates audience debate/engagement.",
      "hashtags": ["#shorts", "#gaming", "#viral", "#pro"],
      "niche": "gaming",
      "dataSource": "youtube"
    }
  ],
  "metadata": {
    "totalResults": 10,
    "quotaRemaining": 9500,
    "cacheAge": 0,
    "quotaExceeded": false,
    "dataSource": "youtube"
  },
  "patterns": {
    "commonHooks": ["Question hook", "POV/Relatability", "Listicle/Number hook"],
    "avgHashtagCount": 5.2,
    "avgDuration": 42,
    "peakUploadHours": [12, 19, 21],
    "peakUploadDays": ["Friday", "Saturday", "Sunday"],
    "topNiches": ["gaming", "motivation", "sports"]
  }
}
```

#### Response Fields

**`shorts[]` - Array of Short objects:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | YouTube video ID |
| `title` | string | Video title |
| `channelName` | string | Channel name |
| `channelId` | string | YouTube channel ID |
| `subscriberCount` | number | Channel subscriber count |
| `thumbnail` | string | Thumbnail URL (high quality) |
| `views` | number | Total view count |
| `likes` | number | Total like count |
| `comments` | number | Total comment count |
| `uploadedAt` | string | ISO 8601 upload timestamp |
| `duration` | number | Video length in seconds |
| `viralScore` | number | Calculated viral score (0-100) |
| `viewsPerHour` | number | Views per hour since upload |
| `likeRatio` | number | Like percentage (0-100) |
| `commentVelocity` | number | Comments per hour |
| `copyInsight` | string | AI-generated insight (1-2 sentences) |
| `hashtags` | string[] | Extracted hashtags |
| `niche` | string | Detected content niche |
| `dataSource` | string | `"youtube"` or `"mock"` |

**`metadata` - Response metadata:**

| Field | Type | Description |
|-------|------|-------------|
| `totalResults` | number | Number of shorts returned |
| `quotaRemaining` | number | YouTube API quota remaining |
| `cacheAge` | number | Age of cached data in seconds |
| `quotaExceeded` | boolean | Whether API quota was exceeded |
| `dataSource` | string | `"youtube"` or `"mock"` |

**`patterns` - Extracted patterns:**

| Field | Type | Description |
|-------|------|-------------|
| `commonHooks` | string[] | Most common hook patterns |
| `avgHashtagCount` | number | Average hashtag count |
| `avgDuration` | number | Average video duration |
| `peakUploadHours` | number[] | Top 3 upload hours (UTC) |
| `peakUploadDays` | string[] | Top 3 upload days |
| `topNiches` | string[] | Top performing niches |

#### Error Responses

**400 Bad Request**
```json
{
  "error": "Invalid parameter",
  "message": "minViralScore must be between 0 and 100"
}
```

**429 Too Many Requests**
```json
{
  "error": "Rate limit exceeded",
  "message": "You have reached your daily limit of 10 requests. Resets in 8h 32m.",
  "resetTime": "2025-01-02T00:00:00Z"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to fetch trending shorts",
  "message": "YouTube API error: 403"
}
```

---

### POST `/api/shorts/analyze`

Analyze a specific YouTube Short and get detailed viral score breakdown.

#### Request Body

```json
{
  "videoId": "dQw4w9WgXcQ",
  "title": "Amazing content here",
  "description": "Check this out! #shorts #viral",
  "duration": 45,
  "views": 50000,
  "likes": 2500,
  "comments": 180,
  "uploadedAt": "2025-01-01T10:00:00Z",
  "subscriberCount": 25000,
  "categoryId": "20"
}
```

#### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `videoId` | string | Yes | YouTube video ID |
| `title` | string | Yes | Video title |
| `description` | string | No | Video description |
| `duration` | number | Yes | Duration in seconds |
| `views` | number | Yes | View count |
| `likes` | number | Yes | Like count |
| `comments` | number | Yes | Comment count |
| `uploadedAt` | string | Yes | ISO 8601 timestamp |
| `subscriberCount` | number | Yes | Channel subscriber count |
| `categoryId` | string | No | YouTube category ID |

#### Example Request

```bash
curl -X POST http://localhost:3000/api/shorts/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "videoId": "dQw4w9WgXcQ",
    "title": "Why this works #shorts",
    "description": "Explaining the viral formula #viral #shorts",
    "duration": 45,
    "views": 50000,
    "likes": 2500,
    "comments": 180,
    "uploadedAt": "2025-01-01T10:00:00Z",
    "subscriberCount": 25000,
    "categoryId": "27"
  }'
```

```javascript
const response = await fetch('/api/shorts/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    videoId: 'dQw4w9WgXcQ',
    title: 'Why this works #shorts',
    views: 50000,
    likes: 2500,
    comments: 180,
    uploadedAt: '2025-01-01T10:00:00Z',
    subscriberCount: 25000,
    duration: 45,
  })
});
const data = await response.json();
```

#### Response Schema

```json
{
  "videoId": "dQw4w9WgXcQ",
  "viralScore": 72,
  "breakdown": {
    "viewsPerHour": 4167,
    "likeRatio": 5.0,
    "commentVelocity": 15.0,
    "channelGrowthMultiplier": 20,
    "recencyDecay": 89
  },
  "copyInsight": "Above-average like ratio (5.0%) indicates engaging content. Strong momentum with 4.2K/hour views.",
  "patterns": {
    "hooks": ["Question hook"],
    "hashtagCount": 3,
    "niche": "education",
    "uploadHour": 10,
    "uploadDay": "Wednesday",
    "duration": 45
  },
  "recommendations": [
    "✅ Strong performance - analyze what worked and refine further",
    "❤️ Excellent like ratio - your emotional hook is working perfectly",
    "🔥 High comment velocity - your content is driving conversations"
  ]
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `videoId` | string | Video ID |
| `viralScore` | number | Overall viral score (0-100) |
| `breakdown` | object | Detailed metric breakdown |
| `breakdown.viewsPerHour` | number | Views per hour |
| `breakdown.likeRatio` | number | Like ratio percentage |
| `breakdown.commentVelocity` | number | Comments per hour |
| `breakdown.channelGrowthMultiplier` | number | Channel growth score |
| `breakdown.recencyDecay` | number | Recency score |
| `copyInsight` | string | Generated insight |
| `patterns` | object | Extracted patterns |
| `patterns.hooks` | string[] | Detected hook types |
| `patterns.hashtagCount` | number | Number of hashtags |
| `patterns.niche` | string | Detected niche |
| `patterns.uploadHour` | number | Upload hour (UTC) |
| `patterns.uploadDay` | string | Upload day |
| `patterns.duration` | number | Duration in seconds |
| `recommendations` | string[] | Actionable recommendations (max 5) |

#### Error Responses

**400 Bad Request**
```json
{
  "error": "Missing or invalid required fields",
  "required": [
    "videoId",
    "title",
    "duration",
    "views",
    "likes",
    "comments",
    "uploadedAt",
    "subscriberCount"
  ]
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to analyze video",
  "message": "Invalid date format"
}
```

---

### GET `/api/shorts/health`

Check API health status, quota remaining, and user tier information.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `tier` | string | No | `free` | User tier (`free` or `pro`) |

#### Example Request

```bash
GET /api/shorts/health?tier=free
```

```javascript
const response = await fetch('/api/shorts/health?tier=free');
const data = await response.json();
```

#### Response Schema

```json
{
  "apiStatus": "ok",
  "quotaRemaining": 9500,
  "quotaUsed": 500,
  "quotaResetTime": "2025-01-02T00:00:00Z",
  "userTier": "free",
  "requestsToday": 5,
  "requestsAllowed": 10,
  "cacheStatus": "active",
  "timestamp": "2025-01-01T15:30:00Z"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `apiStatus` | string | `"ok"`, `"limited"`, or `"error"` |
| `quotaRemaining` | number | YouTube API quota units remaining |
| `quotaUsed` | number | YouTube API quota units used |
| `quotaResetTime` | string | ISO 8601 quota reset timestamp |
| `userTier` | string | User tier (`"free"` or `"pro"`) |
| `requestsToday` | number | Requests made today |
| `requestsAllowed` | number | Max requests allowed (-1 for unlimited) |
| `cacheStatus` | string | `"active"`, `"stale"`, or `"missing"` |
| `timestamp` | string | Current server timestamp |

#### API Status Values

- `"ok"`: API operational, sufficient quota
- `"limited"`: Low quota (<1000 units remaining)
- `"error"`: Quota exhausted or API error

#### Error Responses

**500 Internal Server Error**
```json
{
  "apiStatus": "error",
  "error": "Failed to check API health",
  "message": "Unable to connect to YouTube API"
}
```

---

## Usage Examples

### Complete Workflow Example

```javascript
// 1. Check API health
const healthResponse = await fetch('/api/shorts/health');
const health = await healthResponse.json();

if (health.apiStatus !== 'ok') {
  console.warn('API issues detected:', health.apiStatus);
}

// 2. Fetch trending shorts
const params = new URLSearchParams({
  niche: 'gaming',
  timeRange: '6h',
  minViralScore: '60',
  limit: '20'
});

const trendingResponse = await fetch(`/api/shorts/trending?${params}`);
const trending = await trendingResponse.json();

console.log(`Found ${trending.shorts.length} viral shorts`);
console.log('Top patterns:', trending.patterns.commonHooks);

// 3. Analyze a specific video
const analyzeResponse = await fetch('/api/shorts/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    videoId: 'dQw4w9WgXcQ',
    title: 'My viral short',
    views: 100000,
    likes: 5000,
    comments: 300,
    uploadedAt: new Date().toISOString(),
    subscriberCount: 10000,
    duration: 45
  })
});

const analysis = await analyzeResponse.json();
console.log('Viral Score:', analysis.viralScore);
console.log('Recommendations:', analysis.recommendations);
```

### Error Handling Example

```javascript
async function fetchTrendingShorts() {
  try {
    const response = await fetch('/api/shorts/trending?niche=gaming');
    
    if (response.status === 429) {
      const error = await response.json();
      alert(`Rate limit exceeded. ${error.message}`);
      return;
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch shorts');
    }
    
    const data = await response.json();
    
    if (data.metadata.quotaExceeded) {
      console.warn('Using mock data due to quota limits');
    }
    
    return data.shorts;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

## Caching Behavior

- Responses are cached for **1 hour** (3600 seconds)
- Cache key format: `shorts_{niche}_{timeRange}_{minViralScore}_{limit}`
- Cache age is included in response metadata
- Cache status available via `/api/shorts/health`

Example cache keys:
```
shorts_gaming_6h_0_20
shorts_all_24h_50_10
shorts_motivation_1h_0_50
```

## Quota Management

### YouTube API Quota Costs

| Operation | Cost |
|-----------|------|
| Search request | 100 units |
| Video details | 1 unit |
| Channel info | 1 unit |

### Optimization Tips

1. Use caching (automatic 1-hour TTL)
2. Fetch during off-peak hours
3. Increase `limit` parameter to reduce requests
4. Use broader filters (`niche: "all"`) for general analysis
5. Monitor `quotaRemaining` in responses

## Future API Features

Planned additions:
- WebSocket support for real-time updates
- Batch analysis endpoint
- CSV export endpoint
- Trend comparison endpoint (7-day historical data)
- Webhook notifications for viral spikes
- GraphQL API option

---

For algorithm details, see [ALGORITHM.md](./ALGORITHM.md).

For general usage, see [README.md](./README.md).
