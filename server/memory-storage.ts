import type { User, Note, InsertUser, InsertNote } from "@shared/schema";
import type { IStorage } from "./storage";
import MemoryStore from "memorystore";
import session from "express-session";

const MemStore = MemoryStore(session);

export class MemoryStorage implements IStorage {
  public sessionStore: any;
  private users: Map<number, User> = new Map();
  private notes: Map<number, Note> = new Map();
  private nextUserId = 1;
  private nextNoteId = 1;

  constructor() {
    // Initialize with a guest user
    const now = new Date();
    const guestUser: User = {
      id: 1,
      email: "guest@eduvision.com",
      name: "Guest User",
      password: "guest",
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(1, guestUser);
    this.nextUserId = 2;

    this.sessionStore = new MemStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Note methods
  async getNotesByUserId(userId: number): Promise<Note[]> {
    const userNotes = Array.from(this.notes.values())
      .filter(note => note.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    return userNotes;
  }

  async getNote(id: number, userId: number): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (note && note.userId === userId) {
      return note;
    }
    return undefined;
  }

  async createNote(noteData: InsertNote): Promise<Note> {
    const note: Note = {
      id: this.nextNoteId++,
      ...noteData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.notes.set(note.id, note);
    return note;
  }

  async updateNote(id: number, userId: number, updates: Partial<InsertNote>): Promise<Note | undefined> {
    const note = await this.getNote(id, userId);
    if (!note) return undefined;

    const updatedNote: Note = {
      ...note,
      ...updates,
      updatedAt: new Date(),
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: number, userId: number): Promise<boolean> {
    const note = await this.getNote(id, userId);
    if (!note) return false;
    this.notes.delete(id);
    return true;
  }

  async searchNotes(userId: number, query: string): Promise<Note[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.notes.values())
      .filter(note => 
        note.userId === userId &&
        (note.title.toLowerCase().includes(lowerQuery) ||
         note.content.toLowerCase().includes(lowerQuery))
      )
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getFavoriteNotes(userId: number): Promise<Note[]> {
    return Array.from(this.notes.values())
      .filter(note => note.userId === userId && note.isFavorite)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async toggleNoteFavorite(id: number, userId: number): Promise<Note | undefined> {
    const note = await this.getNote(id, userId);
    if (!note) return undefined;

    const updatedNote: Note = {
      ...note,
      isFavorite: !note.isFavorite,
      updatedAt: new Date(),
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }
}

