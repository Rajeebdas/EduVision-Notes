# EduVision Notes

A modern note-taking application built with React, TypeScript, and Express.

## Features

- 📝 Rich text note editor
- 🔍 Real-time search functionality
- ⭐ Favorite notes system
- 📊 Writing statistics and streaks
- 📅 Calendar integration
- 🌙 Dark/light theme support
- 🔐 User authentication with Replit Auth
- 💾 Cloud storage with PostgreSQL

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Project Structure

```
EduVision-Notes/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # App pages
│   │   ├── hooks/        # Custom hooks
│   │   └── lib/          # Utilities
│   └── index.html
├── server/           # Express backend
│   ├── db.ts            # Database connection
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Data access layer
│   └── index.ts         # Server entry point
├── shared/           # Shared TypeScript schemas
│   └── schema.ts
└── package.json
```

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-secure-secret-key
NODE_ENV=development
```

3. Push database schema:
```bash
npm run db:push
```

4. Start the application:
```bash
npm run dev
```

## Deployment

### Railway (Recommended)

1. Fork this repository to your GitHub
2. Connect to Railway and add PostgreSQL service
3. Set environment variables:
   - `DATABASE_URL` (from PostgreSQL service)
   - `SESSION_SECRET` (generate secure key)
   - `NODE_ENV=production`
4. Deploy automatically with `nixpacks.toml` configuration

### Manual Deployment

Use the included configuration files:
- `nixpacks.toml` - Railway deployment
- `railway.toml` - Railway settings

## License

MIT License