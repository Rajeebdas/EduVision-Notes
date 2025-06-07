import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Notes routes
  app.get("/api/notes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { search, favorites } = req.query;
      
      let notes;
      if (search) {
        notes = await storage.searchNotes(userId, search as string);
      } else if (favorites === 'true') {
        notes = await storage.getFavoriteNotes(userId);
      } else {
        notes = await storage.getNotesByUserId(userId);
      }
      
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.get("/api/notes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const noteId = parseInt(req.params.id);
      const note = await storage.getNote(noteId, userId);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(note);
    } catch (error) {
      console.error("Error fetching note:", error);
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  app.post("/api/notes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const noteData = {
        ...req.body,
        userId,
      };
      
      const note = await storage.createNote(noteData);
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  app.patch("/api/notes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const noteId = parseInt(req.params.id);
      const updates = req.body;
      
      const note = await storage.updateNote(noteId, userId, updates);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  app.delete("/api/notes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const noteId = parseInt(req.params.id);
      
      const success = await storage.deleteNote(noteId, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  app.patch("/api/notes/:id/favorite", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const noteId = parseInt(req.params.id);
      
      const note = await storage.toggleNoteFavorite(noteId, userId);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(note);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      res.status(500).json({ message: "Failed to toggle favorite" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}