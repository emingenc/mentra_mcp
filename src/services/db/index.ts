import { DatabaseAdapter } from "./Database";
import { SQLiteAdapter } from "./SQLiteAdapter";
import { SupabaseAdapter } from "./SupabaseAdapter";

export let db: DatabaseAdapter;

export async function initDatabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (supabaseUrl && supabaseKey) {
    console.log("☁️ Initializing Supabase Adapter...");
    db = new SupabaseAdapter(supabaseUrl, supabaseKey);
    await db.init();
    console.log("📦 Database initialized (Supabase)");
  } else {
    console.log("📂 Initializing SQLite Adapter...");
    db = new SQLiteAdapter(process.env.SQLITE_DB_PATH || "mcp.sqlite");
    await db.init();
    console.log("📦 Database initialized (SQLite)");
  }
}
