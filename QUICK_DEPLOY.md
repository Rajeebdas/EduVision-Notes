# Deploy EduVision Notes to Railway (5 Minutes)

## Step 1: Upload to GitHub
1. Go to https://github.com/new
2. Create repository named `EduVision-Notes`
3. Upload all project files from your Replit

## Step 2: Deploy to Railway
1. Visit https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Connect your `EduVision-Notes` repository

## Step 3: Add Database
1. In Railway dashboard, click "New Service"
2. Select "Database" → "Add PostgreSQL"
3. Database will auto-provision

## Step 4: Configure App Service
1. Click on your app service (not database)
2. Go to "Settings" tab
3. Add these environment variables:
   ```
   SESSION_SECRET=your-super-secret-key-make-it-very-long-and-random
   NODE_ENV=production
   ```
4. In "Deploy" section:
   - Build Command: (leave empty)
   - Start Command: `npx tsx server/index.ts`

## Step 5: Deploy Database Schema
1. In Railway app service, go to "Deployments"
2. Click on latest deployment → "View Logs"
3. Once app is running, run: `npm run db:push`

## Step 6: Access Your App
Your app will be live at: `your-app-name.railway.app`

## Environment Variables Needed:
- `DATABASE_URL` (automatically set by PostgreSQL service)
- `SESSION_SECRET` (set to a long random string)
- `NODE_ENV=production`

## Cost: FREE
Railway free tier provides 500 hours/month - perfect for personal projects.

## Troubleshooting:
- If build fails: Use custom start command `npx tsx server/index.ts`
- If database connection fails: Check DATABASE_URL is correctly linked
- If authentication doesn't work: Ensure all environment variables are set