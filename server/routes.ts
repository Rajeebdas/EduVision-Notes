import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Default guest user email - all notes will be associated with this user
const GUEST_USER_EMAIL = "guest@eduvision.com";

// Helper function to get or create guest user
let cachedGuestUserId: number | null = null;

async function getGuestUserId(): Promise<number> {
  if (cachedGuestUserId) {
    return cachedGuestUserId;
  }

  try {
    // Try to find guest user by email
    let guestUser = await storage.getUserByEmail(GUEST_USER_EMAIL);
    
    if (!guestUser) {
      // Create guest user if it doesn't exist
      guestUser = await storage.createUser({
        email: GUEST_USER_EMAIL,
        name: "Guest User",
        password: "guest", // Not used since auth is disabled
      });
    }
    
    cachedGuestUserId = guestUser.id;
    return guestUser.id;
  } catch (error) {
    console.error("Error getting guest user:", error);
    // Fallback to ID 1 if there's an error
    return 1;
  }
}

export function registerRoutes(app: Express): Server {
  // Notes routes - no authentication required
  app.get("/api/notes", async (req: any, res) => {
    try {
      const userId = await getGuestUserId();
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

  app.get("/api/notes/:id", async (req: any, res) => {
    try {
      const userId = await getGuestUserId();
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

  app.post("/api/notes", async (req: any, res) => {
    try {
      const userId = await getGuestUserId();
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

  app.patch("/api/notes/:id", async (req: any, res) => {
    try {
      const userId = await getGuestUserId();
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

  app.delete("/api/notes/:id", async (req: any, res) => {
    try {
      const userId = await getGuestUserId();
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

  app.patch("/api/notes/:id/favorite", async (req: any, res) => {
    try {
      const userId = await getGuestUserId();
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

  // User endpoint - returns guest user without authentication
  app.get("/api/user", async (req: any, res) => {
    try {
      const userId = await getGuestUserId();
      const guestUser = await storage.getUser(userId);
      if (!guestUser) {
        return res.status(500).json({ message: "Guest user not found" });
      }
      res.json({ id: guestUser.id, name: guestUser.name, email: guestUser.email });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}