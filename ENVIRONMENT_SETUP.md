# Environment Variables Setup for Production

## Issue
Your production deployment is failing with 500 errors because environment variables are not properly configured in Vercel.

## Solution

### 1. Set up Environment Variables in Vercel

Go to your Vercel dashboard and add these environment variables:

1. **MONGODB_URI** (Required)
   - Value: `mongodb+srv://thebeliever39:Ehr2HjnUULLoNyuC@cluster0.pn0rjai.mongodb.net/think_deep?retryWrites=true&w=majority&appName=Cluster0`
   - Environment: Production, Preview, Development

2. **NEXT_PUBLIC_ADMIN_EMAIL** (Required for admin panel)
   - Value: Your admin email address
   - Environment: Production, Preview, Development

3. **ADMIN_EMAIL** (Optional - fallback)
   - Value: Same as NEXT_PUBLIC_ADMIN_EMAIL
   - Environment: Production, Preview, Development

### 2. How to Add Environment Variables in Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select your project (`think-deep-lovat`)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add each variable with the values above
6. Make sure to select all environments (Production, Preview, Development)
7. Click **Save**

### 3. Redeploy

After adding the environment variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on your latest deployment
3. Or push a new commit to trigger a new deployment

### 4. Verify

After redeployment, test these endpoints:
- `https://think-deep-lovat.vercel.app/api/get-shayari`
- `https://think-deep-lovat.vercel.app/api/post_shayari`

## Why This Fixes the Issue

The API routes were using hardcoded MongoDB connection strings instead of environment variables. In production, Vercel needs these values to be set as environment variables for security and configuration management.

## Security Note

The MongoDB connection string is currently hardcoded in the fallback. For better security, you should:
1. Use only environment variables (remove the hardcoded fallback)
2. Consider using MongoDB Atlas's IP whitelist feature
3. Use a dedicated database user with limited permissions 