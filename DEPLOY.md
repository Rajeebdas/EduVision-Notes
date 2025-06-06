# Quick Deploy Guide - EduVision Notes

## Railway Deployment (5 minutes)

### Step 1: Prepare Repository
1. Fork this Replit to GitHub:
   - Click "Fork" button in Replit
   - Choose "Fork to GitHub"
   - Make repository public

### Step 2: Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign in with GitHub
4. Click "Deploy from GitHub repo"
5. Select your forked repository
6. Click "Deploy Now"

### Step 3: Add Database
1. In your Railway project dashboard
2. Click "New" → "Database" → "Add PostgreSQL"
3. Wait for database to provision (30 seconds)

### Step 4: Configure Environment
1. Click on your web service (not database)
2. Go to "Variables" tab
3. Add these variables:
   ```
   DATABASE_URL = (copy from PostgreSQL service Variables tab)
   SESSION_SECRET = any-random-string-here
   NODE_ENV = production
   ```

### Step 5: Migrate Database
1. In Railway project, click on your web service
2. Go to "Deployments" tab
3. Wait for build to complete
4. Your app will be live at the generated Railway URL

## Your App Features
- User registration and login
- Create, edit, delete notes
- Calendar integration
- Tag management
- Search functionality
- Purple theme throughout

## Troubleshooting
- If build fails: Check that all environment variables are set
- If database errors: Ensure DATABASE_URL is copied correctly from PostgreSQL service
- If app won't start: Verify SESSION_SECRET is set

Your app will be live at: `https://your-app-name.up.railway.app`