# Google Analytics 4 Setup Guide

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Google Analytics 4 Property ID (numeric, e.g., 123456789)
GA4_PROPERTY_ID=your_property_id_here

# For frontend display (optional)
NEXT_PUBLIC_GA4_PROPERTY_ID=your_property_id_here

# Google Service Account JSON (single line, escaped)
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

## How to Find Your GA4 Property ID

### Method 1: Google Analytics UI
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (bottom left)
3. Under **Property**, select your GA4 property
4. Look for the Property ID (e.g., "GA4 Property 123456789")
5. The numeric part is your Property ID: `123456789`

### Method 2: Data Streams
1. In Google Analytics Admin → **Data Streams**
2. Click on your web stream
3. The **Measurement ID** is `G-XXXXXXXXXX` (this is different from Property ID)
4. Go back to Property settings to find the Property ID

### Method 3: Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. If you have a service account set up, the project ID might help identify the property

## Property ID vs Measurement ID

| Type | Format | Usage |
|------|--------|-------|
| **Property ID** | `123456789` | Used for Analytics Data API queries |
| **Measurement ID** | `G-XXXXXXXXXX` | Used for frontend tracking (gtag) |

## Admin Dashboard Display

The admin dashboard now shows:
- ✅ **Active Users (7d)**: Number of active users in the last 7 days
- ✅ **Page Views (7d)**: Number of page views in the last 7 days  
- ✅ **GA4 Property ID**: Your property ID for verification

## Troubleshooting

### Common Issues:

1. **"Property ID not configured"**
   - Make sure `GA4_PROPERTY_ID` is set in your environment variables
   - Verify the ID is numeric (no letters or special characters)

2. **"Google service account not configured"**
   - Ensure `GOOGLE_SERVICE_ACCOUNT_JSON` is properly set
   - The JSON should be on a single line with escaped newlines

3. **"Failed to load analytics"**
   - Check that your service account has access to the GA4 property
   - Verify the property ID is correct
   - Ensure the Google Analytics Data API is enabled

### Testing:

1. **Local Development**: Use `.env.local`
2. **Production (Vercel)**: Set environment variables in Vercel dashboard
3. **Check Admin Panel**: Open admin panel to see if analytics load correctly

## Security Notes

- ✅ `GA4_PROPERTY_ID` can be public (it's just an identifier)
- ✅ `NEXT_PUBLIC_GA4_PROPERTY_ID` is safe to expose to frontend
- 🔒 `GOOGLE_SERVICE_ACCOUNT_JSON` must remain private (server-side only)
- 🔒 Never commit service account credentials to version control 