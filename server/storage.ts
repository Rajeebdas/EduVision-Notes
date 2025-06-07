import {
  users,
  notes,
  type User,
  type Note,
  type InsertUser,
  type InsertNote,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, or } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Note methods
  getNotesByUserId(userId: number): Promise<Note[]>;
  getNote(id: number, userId: number): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, userId: number, updates: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number, userId: number): Promise<boolean>;
  searchNotes(userId: number, query: string): Promise<Note[]>;
  getFavoriteNotes(userId: number): Promise<Note[]>;
  toggleNoteFavorite(id: number, userId: number): Promise<Note | undefined>;

  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Note methods
  async getNotesByUserId(userId: number): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.updatedAt));
  }

  async getNote(id: number, userId: number): Promise<Note | undefined> {
    const [note] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)));
    return note;
  }

  async createNote(noteData: InsertNote): Promise<Note> {
    const [note] = await db
      .insert(notes)
      .values(noteData)
      .returning();
    return note;
  }

  async updateNote(id: number, userId: number, updates: Partial<InsertNote>): Promise<Note | undefined> {
    const [note] = await db
      .update(notes)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    return note;
  }

  async deleteNote(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)));
    return (result.rowCount || 0) > 0;
  }

  async searchNotes(userId: number, query: string): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(
        and(
          eq(notes.userId, userId),
          or(
            ilike(notes.title, `%${query}%`),
            ilike(notes.content, `%${query}%`)
          )
        )
      )
      .orderBy(desc(notes.updatedAt));
  }

  async getFavoriteNotes(userId: number): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(and(eq(notes.userId, userId), eq(notes.isFavorite, true)))
      .orderBy(desc(notes.updatedAt));
  }

  async toggleNoteFavorite(id: number, userId: number): Promise<Note | undefined> {
    const note = await this.getNote(id, userId);
    if (!note) return undefined;

    const [updatedNote] = await db
      .update(notes)
      .set({ 
        isFavorite: !note.isFavorite,
        updatedAt: new Date()
      })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    return updatedNote;
  }
}

export const storage = new DatabaseStorage();