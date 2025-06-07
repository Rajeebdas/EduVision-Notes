# EduVision Notes - Deployment Guide

## Quick Deploy to Railway (Recommended - Free Tier Available)

### Step 1: Push to GitHub
1. Create a new repository at https://github.com/new
2. Upload all project files to your repository
3. Make sure all folders are preserved (client/, server/, shared/)

### Step 2: Deploy to Railway
1. Visit https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your EduVision-Notes repository
5. Railway will automatically detect the project

### Step 3: Add PostgreSQL Database
1. In your Railway project dashboard
2. Click "New Service" → "Database" → "Add PostgreSQL"
3. The database will be automatically provisioned

### Step 4: Configure Environment Variables
Add these variables in Railway's environment settings:

```
DATABASE_URL=(automatically set by PostgreSQL service)
SESSION_SECRET=your-super-secret-session-key-here-make-it-long
NODE_ENV=production
```

### Step 5: Custom Deployment Settings
In Railway service settings:
- **Build Command**: Leave empty
- **Start Command**: `npx tsx server/index.ts`
- **Root Directory**: Leave empty

### Step 6: Deploy and Access
Railway will automatically deploy your app. Access it via the generated railway.app URL.

---

## Alternative: Deploy to Render

### Step 1: Setup
1. Visit https://render.com
2. Connect your GitHub repository
3. Create a new "Web Service"

### Step 2: Configuration
- **Build Command**: `npm install`
- **Start Command**: `npx tsx server/index.ts`
- **Environment**: Node

### Step 3: Database
1. Create a PostgreSQL database on Render
2. Copy the DATABASE_URL to your web service environment variables

### Step 4: Environment Variables
```
DATABASE_URL=your-render-postgresql-url
SESSION_SECRET=your-super-secret-session-key
NODE_ENV=production
```

---

## Alternative: Deploy to Vercel + Supabase

### Step 1: Database (Supabase)
1. Create account at https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy the connection string (replace [YOUR-PASSWORD])

### Step 2: Deploy to Vercel
1. Visit https://vercel.com
2. Import your GitHub repository
3. Vercel will auto-detect and deploy

### Step 3: Environment Variables in Vercel
```
DATABASE_URL=your-supabase-connection-string
SESSION_SECRET=your-super-secret-session-key
NODE_ENV=production
```

---

## Post-Deployment Setup

### Database Schema
After deployment, run this command in your deployment platform's console:
```bash
npm run db:push
```

This creates the necessary database tables.

### Authentication Note
The app uses Replit Auth, which works automatically when deployed on platforms with domain support.

---

## Troubleshooting

**Build Errors**: Use the custom start command `npx tsx server/index.ts` to bypass build issues.

**Database Connection**: Ensure DATABASE_URL includes the correct credentials and is accessible from your deployment platform.

**Environment Variables**: Make sure SESSION_SECRET is a long, secure random string.

---

## Cost Estimates (Free Tiers)

- **Railway**: Free tier with 500 hours/month
- **Render**: Free tier with 750 hours/month  
- **Vercel**: Free tier with generous limits
- **Supabase**: Free tier with 500MB database

Your EduVision Notes app will run completely free on these platforms!