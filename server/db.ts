import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    db = drizzle(pool, { schema });
  } catch (error) {
    console.warn("Failed to initialize database connection:", error);
    pool = null;
    db = null;
  }
} else {
  console.warn("DATABASE_URL not set - database features will be disabled");
}

export { pool, db };