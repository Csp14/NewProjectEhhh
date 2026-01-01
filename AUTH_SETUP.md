# Authentication Setup Guide

## Overview

The YouTube Shorts Viral Analyzer now includes a complete authentication system with administrator access for unlimited API requests.

## Features

✅ **Login/Signup System** - Secure authentication using NextAuth.js
✅ **Administrator Access** - Bypass all rate limits with admin credentials
✅ **Session Management** - Persistent login sessions
✅ **Role-Based Access** - Different tiers: Free, Pro, and Admin

## Quick Start

### 1. Admin Credentials (Already Configured)

The admin account is pre-configured in `.env.local`:

```
Email: admin@youtube-analyzer.com
Password: admin123
```

### 2. Login to the App

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000 in your browser

3. Click the **"Sign In"** button in the top-right corner

4. Use the admin credentials shown on the login page:
   - **Email:** `admin@youtube-analyzer.com`
   - **Password:** `admin123`

5. After login, you'll see:
   - **👑 Administrator** badge next to your name
   - **Unlimited requests** status (no 10/day limit)
   - **Sign Out** button

### 3. Enjoy Unlimited Refreshes!

As an administrator, you can:
- ✅ Click "Refresh" as many times as you want (no rate limiting)
- ✅ Access all 9 content niches (not limited to 3)
- ✅ No daily request limits
- ✅ Full access to all features

## User Tiers Comparison

| Feature | Free Tier | Admin Tier |
|---------|-----------|------------|
| Daily Requests | 10 | ♾️ Unlimited |
| Available Niches | 3 (Gaming, Sports, Motivation) | All 9 |
| Time Ranges | Last 24h only | All ranges |
| API Priority | Standard | Priority |
| Rate Limiting | Yes | ❌ None |

## Technical Details

### Authentication Flow

1. **Login** → NextAuth.js validates credentials
2. **Session Created** → JWT token stored in cookies
3. **Role Assigned** → User role (admin/free) added to session
4. **Rate Limiter Checks** → Admin role bypasses all limits

### Files Modified

- `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `app/login/page.tsx` - Login page UI
- `app/page.tsx` - Main page with auth integration
- `app/layout.tsx` - Session provider wrapper
- `app/lib/services/rateLimiter.ts` - Admin tier support
- `app/components/RateLimitStatus.tsx` - Admin status display

### Environment Variables

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-in-production

# Admin Credentials
ADMIN_EMAIL=admin@youtube-analyzer.com
ADMIN_PASSWORD=admin123
```

## Security Notes

⚠️ **Important for Production:**

1. **Change the admin password** - Don't use `admin123` in production!
2. **Use a strong NEXTAUTH_SECRET** - Generate a random 32+ character string
3. **Store passwords securely** - Use bcrypt hashing (already configured)
4. **Enable HTTPS** - Set `NEXTAUTH_URL` to your production HTTPS URL
5. **Add real database** - Replace in-memory user store with a real DB

### Generate Secure Secret

```bash
openssl rand -base64 32
```

## Adding More Users

To add more users, edit `app/api/auth/[...nextauth]/route.ts`:

```typescript
const users = [
  {
    id: '1',
    email: 'admin@youtube-analyzer.com',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'userpass',
    name: 'Regular User',
    role: 'free',
  },
  // Add more users here
];
```

## Troubleshooting

### "Invalid email or password" error
- Check that you're using the correct credentials
- Verify `.env.local` has the admin credentials set

### Session not persisting
- Clear browser cookies
- Restart the dev server
- Check that `NEXTAUTH_SECRET` is set

### Rate limiting still applies
- Make sure you're logged in as admin
- Check the header shows "👑 Administrator"
- Try signing out and signing back in

## API Integration

The authentication integrates with all API endpoints:

```typescript
// Example: Checking user tier in API route
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const session = await getServerSession(authOptions);
const isAdmin = session?.user?.role === 'admin';

if (isAdmin) {
  // No rate limiting
} else {
  // Apply rate limits
}
```

## Demo Video

When demonstrating the app:

1. Show the login page with credentials
2. Login as admin
3. Show the administrator badge
4. Click refresh multiple times rapidly
5. Show "Unlimited requests" in the rate limit status

## Support

For questions or issues with authentication:
1. Check this guide first
2. Verify environment variables are set
3. Check browser console for errors
4. Review NextAuth.js logs in terminal

---

**Congratulations!** You now have full administrator access to the YouTube Shorts Viral Analyzer with unlimited refreshes! 🎉
