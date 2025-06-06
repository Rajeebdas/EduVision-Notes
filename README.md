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

### 1. Database Setup (Supabase)

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the URI connection string (replace `[YOUR-PASSWORD]` with your database password)

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

## Deployment

### Railway Deployment

1. Fork this repository
2. Connect your GitHub account to [Railway](https://railway.app)
3. Create a new project from your forked repository
4. Add environment variables in Railway dashboard:
   - `DATABASE_URL`: Your Supabase connection string
   - `SESSION_SECRET`: A random secret string
   - `NODE_ENV`: `production`

### Render Deployment

1. Fork this repository
2. Connect your GitHub account to [Render](https://render.com)
3. Create a new Web Service
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`
6. Add environment variables

### Vercel Deployment

1. Fork this repository
2. Connect to [Vercel](https://vercel.com)
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables

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