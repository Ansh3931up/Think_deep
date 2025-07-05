# Google Analytics Setup Guide

## Step 1: Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Start measuring**
3. Sign in with your Google account
4. Click **Create Account**
5. Fill in:
   - **Account name**: `Think Deep Analytics`
   - **Data sharing settings**: Choose what you want to share
6. Click **Next**

## Step 2: Create a Property

1. **Property name**: `Think Deep Website`
2. **Reporting time zone**: Your timezone
3. **Currency**: Your currency
4. Click **Next**

## Step 3: Set Up Business Information

1. **Business size**: Choose appropriate size
2. **How do you plan to use Google Analytics**: Select relevant options
3. Click **Create**

## Step 4: Choose Platform

1. Select **Web**
2. Enter your website URL: `https://think-deep-lovat.vercel.app`
3. **Stream name**: `Think Deep Main`
4. Click **Create stream**

## Step 5: Get Your Measurement ID

After creating the stream, you'll get a **Measurement ID** that looks like: `G-5JG7TTZBCR`

**Your Measurement ID**: `G-5JG7TTZBCR`

## Step 6: Set Up Environment Variables

### Local Development (.env.local)
Create or update your `.env.local` file:
```
# MongoDB
MONGODB_URI=mongodb+srv://thebeliever39:Ehr2HjnUULLoNyuC@cluster0.pn0rjai.mongodb.net/think_deep?retryWrites=true&w=majority&appName=Cluster0

# Admin
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-5JG7TTZBCR
```

### Production (Vercel)
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: `G-5JG7TTZBCR`
   - **Environment**: Production, Preview, Development
5. Click **Save**

## Step 7: Test Your Setup

1. Deploy your app to production
2. Visit your website
3. Go to Google Analytics → **Reports** → **Realtime**
4. You should see your visit in real-time

## Step 8: Verify Tracking

### Check in Browser Console
1. Open your website
2. Open browser developer tools (F12)
3. Go to **Console** tab
4. Type: `gtag('event', 'test_event', {event_category: 'test'})`
5. Press Enter
6. Check Google Analytics Realtime reports

### Check Network Tab
1. Open developer tools
2. Go to **Network** tab
3. Filter by "google"
4. You should see requests to `googletagmanager.com`

## What You'll Track

Your app is already set up to track:
- **Page views** (automatic)
- **Custom events** (shayari submissions, likes, shares)
- **User engagement** (time on site, pages per session)
- **Traffic sources** (where users come from)
- **Device information** (mobile vs desktop)

## Custom Events Already Implemented

Your app tracks these custom events:
- `page_view` - When users view pages
- `shayari_submitted` - When users submit new shayari
- `shayari_liked` - When users like shayari
- `bookmark_added/removed` - When users bookmark shayari
- `share_dialog_opened` - When users open share dialog
- `shared_to_platform` - When users share to social media
- `book_opened/closed` - When users open/close the book
- `page_turned` - When users navigate pages
- `swipe_navigation` - When users swipe to navigate
- `click_navigation` - When users click to navigate

## Troubleshooting

### If tracking doesn't work:
1. Check your Measurement ID is correct
2. Verify environment variables are set
3. Check browser console for errors
4. Ensure ad blockers are disabled
5. Wait 24-48 hours for data to appear in reports

### Common Issues:
- **No data in reports**: Wait 24-48 hours for first data
- **Real-time not working**: Check Measurement ID and network requests
- **Events not tracking**: Verify gtag function is available in console

## Next Steps

Once set up, you can:
1. Set up **Goals** in Google Analytics
2. Create **Custom Reports**
3. Set up **Email Reports**
4. Configure **Audiences** for remarketing
5. Set up **E-commerce tracking** if you add monetization 