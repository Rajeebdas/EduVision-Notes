import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, registerSchema, insertNoteSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import ConnectPgSimple from "connect-pg-simple";
import { pool } from "./db";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      name: string;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for deployment monitoring
  app.get('/api/health', (req, res) => {
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  const PgSession = ConnectPgSimple(session);

  // Session configuration
  app.use(session({
    store: new PgSession({
      pool: pool,
      tableName: 'session',
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user || !user.password) {
          return done(null, false, { message: 'Invalid email or password.' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: 'Invalid email or password.' });
        }

        return done(null, { id: user.id, email: user.email, name: user.name });
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Only configure Google OAuth if credentials are provided
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await storage.getUserByGoogleId(profile.id);
        
        if (!user) {
          // Check if user exists with same email
          user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
          
          if (user) {
            // Link Google account to existing user
            await storage.updateUser(user.id, { googleId: profile.id });
          } else {
            // Create new user
            user = await storage.createUser({
              email: profile.emails?.[0]?.value || '',
              name: profile.displayName || '',
              googleId: profile.id,
            });
          }
        }

        return done(null, { id: user.id, email: user.email, name: user.name });
      } catch (error) {
        return done(error);
      }
    }));
  }

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (user) {
        done(null, { id: user.id, email: user.email, name: user.name });
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  });

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
  };

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Create user
      const user = await storage.createUser({
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
      });

      // Log in user
      req.login({ id: user.id, email: user.email, name: user.name }, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Login failed' });
        }
        res.json({ user: { id: user.id, email: user.email, name: user.name } });
      });
    } catch (error) {
      res.status(400).json({ message: 'Registration failed', error });
    }
  });

  app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
    res.json({ user: req.user });
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  // Only register Google OAuth routes if credentials are provided
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get('/api/auth/google/callback', 
      passport.authenticate('google', { failureRedirect: '/auth' }),
      (req, res) => {
        res.redirect('/dashboard');
      }
    );
  } else {
    app.get('/api/auth/google', (req, res) => {
      res.status(400).json({ message: 'Google OAuth not configured' });
    });
  }

  app.get('/api/auth/config', (req, res) => {
    res.json({ 
      googleOAuthEnabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    });
  });

  app.get('/api/auth/me', requireAuth, (req, res) => {
    res.json({ user: req.user });
  });

  // Notes routes
  app.get('/api/notes', requireAuth, async (req, res) => {
    try {
      const { search, favorites } = req.query;
      let notes;

      if (search) {
        notes = await storage.searchNotes(req.user!.id, search as string);
      } else if (favorites === 'true') {
        notes = await storage.getFavoriteNotes(req.user!.id);
      } else {
        notes = await storage.getNotesByUserId(req.user!.id);
      }

      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch notes' });
    }
  });

  app.get('/api/notes/:id', requireAuth, async (req, res) => {
    try {
      const note = await storage.getNote(parseInt(req.params.id), req.user!.id);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch note' });
    }
  });

  app.post('/api/notes', requireAuth, async (req, res) => {
    try {
      const validatedData = insertNoteSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });

      const note = await storage.createNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create note', error });
    }
  });

  app.put('/api/notes/:id', requireAuth, async (req, res) => {
    try {
      const updates = insertNoteSchema.partial().parse(req.body);
      const note = await storage.updateNote(parseInt(req.params.id), req.user!.id, updates);
      
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      
      res.json(note);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update note', error });
    }
  });

  app.delete('/api/notes/:id', requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteNote(parseInt(req.params.id), req.user!.id);
      
      if (!success) {
        return res.status(404).json({ message: 'Note not found' });
      }
      
      res.json({ message: 'Note deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete note' });
    }
  });

  app.post('/api/notes/:id/favorite', requireAuth, async (req, res) => {
    try {
      const note = await storage.toggleNoteFavorite(parseInt(req.params.id), req.user!.id);
      
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: 'Failed to toggle favorite' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
