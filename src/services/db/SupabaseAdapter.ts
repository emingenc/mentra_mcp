import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { DatabaseAdapter, UserToken } from "./Database";

export class SupabaseAdapter implements DatabaseAdapter {
  private supabase: SupabaseClient;

  constructor(url: string, key: string) {
    this.supabase = createClient(url, key);
  }

  async init(): Promise<void> {
    // In Supabase, tables are usually created via the dashboard or migrations.
    // We can check if the connection works.
    const { error } = await this.supabase.from('tokens').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error("[Supabase] Connection check failed or table 'tokens' missing:", error.message);
      console.log("[Supabase] Please ensure a table 'tokens' exists with columns: email (text, pk), token (text), created_at (int8)");
    } else {
      console.log("[Supabase] Connected successfully.");
    }
  }

  async getToken(email: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('tokens')
      .select('token')
      .eq('email', email)
      .single();

    if (error || !data) return null;
    return data.token;
  }

  async getUserByToken(token: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('tokens')
      .select('email')
      .eq('token', token)
      .single();

    if (error || !data) return null;
    return data.email;
  }

  async saveToken(email: string, token: string): Promise<void> {
    const { error } = await this.supabase
      .from('tokens')
      .upsert(
        { email, token, created_at: Date.now() },
        { onConflict: 'email' }
      );

    if (error) {
      console.error("[Supabase] Failed to save token:", error);
      throw error;
    }
  }

  async getAllTokens(): Promise<UserToken[]> {
    const { data, error } = await this.supabase
      .from('tokens')
      .select('*');

    if (error) {
      console.error("[Supabase] Failed to get all tokens:", error);
      return [];
    }

    return (data || []).map((r: any) => ({
      email: r.email,
      token: r.token,
      createdAt: r.created_at
    }));
  }
}
