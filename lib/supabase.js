'use client';
import { createClient } from '@supabase/supabase-js';

let client = null;

// One shared Supabase client for the browser
export function supabase() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return client;
}

// Call one of our own API routes with the signed-in user's token
export async function api(path, body) {
  const { data } = await supabase().auth.getSession();
  const token = data?.session?.access_token;
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` },
    body: JSON.stringify(body || {}),
  });
  let json = {};
  try { json = await res.json(); } catch {}
  if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.');
  return json;
}
