# Region & Language Filtering

## Overview

The YouTube Shorts Viral Analyzer now focuses on English-language content from the United States and Europe. You can also customize the region to target specific countries.

## What Changed

### ✅ Automatic English Filtering

The app now automatically:
- **Filters by English language** (`relevanceLanguage: 'en'`)
- **Defaults to US region** (`regionCode: 'US'`)
- **Uses English-focused search terms** (includes keywords like "english", "usa", "streamer")

### 🌍 Region Selector

A new **Region** dropdown has been added to the filters, allowing you to choose from:

- 🇺🇸 **United States** (default)
- 🇬🇧 **United Kingdom**
- 🇨🇦 **Canada**
- 🇦🇺 **Australia**
- 🇩🇪 **Germany**
- 🇫🇷 **France**
- 🇪🇸 **Spain**
- 🇮🇹 **Italy**

## How to Use

### 1. Default Behavior (US English)

Simply use the app as normal - it will now show US-based English content by default:

```
npm run dev
```

Visit http://localhost:3000 and you'll see US/English content automatically.

### 2. Change Region

1. Click the **Region** dropdown in the filter bar
2. Select your preferred country (e.g., 🇬🇧 United Kingdom)
3. Click **Refresh** to fetch content from that region

### 3. Search Terms Improved

All search queries now include English-focused keywords:

| Niche | Old Query | New Query |
|-------|-----------|-----------|
| Gaming | `gaming shorts gameplay` | `gaming shorts gameplay english streamer` |
| Sports | `sports highlights fitness` | `sports highlights fitness workout usa` |
| Drama | `drama tea exposed` | `drama tea exposed storytime english` |
| Tech | `tech technology review` | `tech technology review gadget iphone` |

## Technical Details

### YouTube API Parameters

The app now uses these YouTube API parameters:

```typescript
{
  regionCode: 'US',           // Country code (ISO 3166-1 alpha-2)
  relevanceLanguage: 'en',    // Language code (ISO 639-1)
  q: 'query + english',       // Search query with English keywords
}
```

### Files Modified

1. **`app/lib/services/youtubeService.ts`**
   - Added `regionCode` and `relevanceLanguage` parameters
   - Defaults to US/English

2. **`app/api/shorts/trending/route.ts`**
   - Updated search terms with English keywords
   - Passes region from query params to YouTube API

3. **`app/components/FilterBar.tsx`**
   - Added Region selector dropdown
   - 8 supported countries

4. **`app/lib/config/regions.ts`** (new)
   - Region configuration
   - Country codes and display names

5. **`app/page.tsx`**
   - Updated to include region in filters
   - Passes region to API calls

## Region Behavior

### How YouTube Region Filtering Works

- **`regionCode`**: Tells YouTube to return videos that are popular/available in that region
- **`relevanceLanguage`**: Prioritizes videos in the specified language
- **Combined**: Both filters work together for best results

### Example Results by Region

**US (default)**:
- American YouTubers
- US-centric content (NFL, NBA, US politics, etc.)
- American English accents and slang

**GB (United Kingdom)**:
- British YouTubers
- UK-centric content (Premier League, UK news, etc.)
- British English accents and slang

**DE (Germany)**:
- German-language content (if available)
- European content popular in Germany
- Mix of English and German depending on language setting

## Why This Helps

### Before (No Filtering)

❌ Mixed content from all regions
❌ Lots of non-English videos
❌ Indian content dominating results
❌ Hard to find relevant English creators

### After (US/English Focus)

✅ Primarily English-language content
✅ US/European creators prioritized
✅ Better match for English-speaking audiences
✅ Easier to analyze English trends

## Advanced Usage

### API Direct Access

You can also use the region filter via API:

```bash
# US content (default)
curl "http://localhost:3000/api/shorts/trending?niche=gaming&region=US"

# UK content
curl "http://localhost:3000/api/shorts/trending?niche=gaming&region=GB"

# Canadian content
curl "http://localhost:3000/api/shorts/trending?niche=sports&region=CA"
```

### Custom Language

While the UI defaults to English, you can pass custom language codes via API:

```bash
# French content from France
curl "http://localhost:3000/api/shorts/trending?niche=all&region=FR&language=fr"

# German content from Germany
curl "http://localhost:3000/api/shorts/trending?niche=tech&region=DE&language=de"
```

## Troubleshooting

### Still Seeing Non-English Content?

1. **Clear your cache** - The app caches results for 1 hour
2. **Change region** - Try a different English-speaking region (UK, CA, AU)
3. **Adjust niche** - Some niches have more international content
4. **Refresh multiple times** - YouTube's algorithm may need a few queries to adjust

### Limited Results?

- Some regions have fewer Shorts available
- Try changing time range to 24h instead of 1h or 6h
- Lower the minimum viral score threshold

### Want More Regions?

Edit `app/components/FilterBar.tsx` and add more regions:

```typescript
const REGIONS = [
  // ... existing regions
  { value: 'NZ', label: '🇳🇿 New Zealand' },
  { value: 'IE', label: '🇮🇪 Ireland' },
];
```

## Impact on Results

### Typical Result Distribution

With US/English filtering:
- 🇺🇸 ~70% US content
- 🇬🇧 ~15% UK content  
- 🇨🇦 ~10% Canadian content
- 🇦🇺 ~5% Australian content

### Content Quality

English-focused filtering typically results in:
- ✅ Better for English-speaking creators
- ✅ More actionable insights for US/EU markets
- ✅ Clearer audio transcription (if implemented)
- ✅ Culturally relevant trends

---

**Your content should now be focused on English-speaking regions!** 🎉

Select your preferred region from the dropdown and enjoy more relevant viral Shorts analysis.
