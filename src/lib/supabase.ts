import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

const hasPlaceholderConfig =
  supabaseUrl?.includes("your-project-ref") || supabaseAnonKey === "your-anon-public-key";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !hasPlaceholderConfig,
);

export const supabaseConfigError =
  "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to this environment, then restart or redeploy the app.";

const canCreateBrowserClient = isSupabaseConfigured && typeof window !== "undefined";

export const supabase = canCreateBrowserClient
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
