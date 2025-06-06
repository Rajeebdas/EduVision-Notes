# EduVision Notes

A modern note-taking application with authentication, calendar integration, and real-time collaboration features.

## Features

- 📝 Rich note editor with auto-save
- 🔐 User authentication (email/password + Google OAuth)
- 📅 Calendar integration for date-based organization
- 🏷️ Tag management system
- 🔍 Full-text search across notes
- ⭐ Favorite notes
- 🎨 Purple-themed modern UI
- ⌨️ Keyboard shortcuts (Ctrl+N for new note, Ctrl+K for search)
- 📊 Writing statistics and analytics

## Quick Start

### 1. Free Database Setup Options

#### Option A: Supabase (Recommended - 500MB free)
1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project (choose any region)
3. Wait for project to initialize (2-3 minutes)
4. Go to Settings → Database → Connection string
5. Copy the URI connection string
6. Replace `[YOUR-PASSWORD]` with the password you set during project creation

#### Option B: Railway PostgreSQL (Free tier available)
1. Go to [Railway](https://railway.app) and sign up
2. Create new project → Add PostgreSQL
3. Click on PostgreSQL service → Connect tab
4. Copy the `DATABASE_URL` connection string

#### Option C: Aiven (1 month free)
1. Go to [Aiven](https://aiven.io) and create account
2. Create PostgreSQL service (choose smallest size)
3. Download SSL certificate if required
4. Copy connection string from service overview

### 2. Environment Configuration

Copy `.env.example` to `.env` and fill in your database URL:

```bash
cp .env.example .env
```

Update the `.env` file:
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres
SESSION_SECRET=your-random-secret-here
```

### 3. Database Migration

Push the database schema to your Supabase database:

```bash
npm run db:push
```

### 4. Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Free Deployment Options

### 🚀 Railway (Recommended - Easy Deploy)

**Step 1: Database Setup**
1. Go to [Railway](https://railway.app) and sign up with GitHub
2. Create new project → Add PostgreSQL database
3. Copy the `DATABASE_URL` from PostgreSQL service

**Step 2: App Deployment**
1. Fork this repository to your GitHub
2. In Railway, create new project → Deploy from GitHub repo
3. Select your forked repository
4. Add environment variables:
   - `DATABASE_URL`: (from step 1)
   - `SESSION_SECRET`: Generate random string
   - `NODE_ENV`: `production`
5. Deploy automatically happens

### 🌐 Render (Free tier available)

**Step 1: Setup**
1. Fork this repository
2. Create [Render](https://render.com) account
3. Create PostgreSQL database (free tier)
4. Note the database URL

**Step 2: Deploy**
1. Create new Web Service from your GitHub repo
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Add environment variables (same as Railway)

### ⚡ Vercel + Supabase

**Step 1: Database**
1. Create [Supabase](https://supabase.com) project (500MB free)
2. Copy database connection string

**Step 2: Deploy**
1. Fork repository
2. Connect to [Vercel](https://vercel.com)
3. Import your forked repository
4. Add environment variables
5. Deploy

### 🐳 Self-hosted with Docker

```bash
# Clone and setup
git clone <your-forked-repo>
cd eduvision-notes
cp .env.example .env
# Edit .env with your database URL

# Build and run
docker build -t eduvision-notes .
docker run -p 5000:5000 --env-file .env eduvision-notes
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string from Supabase | Yes |
| `SESSION_SECRET` | Random string for session encryption | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional) | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (optional) | No |
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port (default: 5000) | No |

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `GET /api/notes` - Get user notes
- `POST /api/notes` - Create new note
- `PATCH /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/favorite` - Toggle favorite status

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js with local and Google OAuth strategies
- **UI Components**: Radix UI with shadcn/ui

## License

MIT License - see LICENSE file for details