# Render Deployment Guide

This guide will help you deploy EduVision Notes to Render with all functions working correctly.

## Prerequisites

- A Render account (sign up at https://render.com)
- A GitHub repository with your code

## Deployment Steps

### 1. Push Your Code to GitHub

Make sure all your code is committed and pushed to your GitHub repository.

### 2. Create a New Web Service on Render

1. Go to your Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file

### 3. Configure the Service

The `render.yaml` file is already configured with:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**: Automatically configured
  - `NODE_ENV=production`
  - `DATABASE_URL` (from PostgreSQL database)
  - `SESSION_SECRET` (auto-generated)

### 4. Database Setup

The `render.yaml` automatically creates a PostgreSQL database named `postgres` with:
- Database name: `eduvision_notes`
- User: `postgres`
- Connection string automatically linked to `DATABASE_URL`

### 5. Initialize Database Schema

After the first deployment, you need to push the database schema:

**Option A: Using Render Shell**
1. Go to your service dashboard
2. Click "Shell" tab
3. Run: `npm run db:push`

**Option B: Using Local Machine**
1. Set `DATABASE_URL` environment variable to your Render database URL
2. Run: `npm run db:push`

### 6. Verify Deployment

Once deployed, your application will be available at:
- `https://your-service-name.onrender.com`

## What Was Fixed for Render Deployment

1. ✅ **Server Listen Fix**: Removed `reusePort` option that doesn't work on all platforms
2. ✅ **Path Resolution**: Fixed `import.meta.dirname` to use `fileURLToPath` for compatibility
3. ✅ **Session Store**: Updated to use PostgreSQL session store in production (persistent sessions)
4. ✅ **Cookie Security**: Enabled secure cookies and proper `sameSite` settings for HTTPS
5. ✅ **Dependencies**: Added `nanoid` package for cache busting

## Environment Variables

The following environment variables are automatically configured:

| Variable | Source | Description |
|----------|--------|-------------|
| `NODE_ENV` | Set to `production` | Environment mode |
| `DATABASE_URL` | From PostgreSQL database | Database connection string |
| `SESSION_SECRET` | Auto-generated | Secret key for session encryption |
| `PORT` | Auto-set by Render | Server port (usually 10000) |

## Troubleshooting

### Database Connection Issues

If you see database connection errors:
1. Verify the PostgreSQL database is created and running
2. Check that `DATABASE_URL` is set correctly
3. Ensure the database schema is pushed (`npm run db:push`)

### Build Failures

If the build fails:
1. Check build logs in Render dashboard
2. Verify all dependencies are in `package.json`
3. Ensure Node.js version is compatible (Render uses Node 20+)

### Session Issues

If sessions aren't persisting:
1. Verify `SESSION_SECRET` is set
2. Check that PostgreSQL session store table was created
3. Ensure cookies are working (check browser console)

### Static Files Not Loading

If the frontend doesn't load:
1. Verify the build completed successfully (`dist/public` exists)
2. Check that `serveStatic` is being called in production mode
3. Review server logs for path resolution errors

## Post-Deployment Checklist

- [ ] Database schema pushed (`npm run db:push`)
- [ ] Application accessible via HTTPS URL
- [ ] User registration works
- [ ] User login works
- [ ] Notes CRUD operations work
- [ ] Sessions persist across restarts
- [ ] Static assets load correctly

## Support

If you encounter issues:
1. Check Render service logs
2. Review build logs
3. Verify environment variables are set correctly
4. Ensure database is accessible

