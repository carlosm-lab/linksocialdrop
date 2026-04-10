import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase admin client using the service_role key.
 * This client bypasses RLS and should ONLY be used in server-side code
 * (Server Components, Server Actions) for admin operations.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
