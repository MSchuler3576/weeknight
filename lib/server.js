import { createClient } from '@supabase/supabase-js';

// Find the signed-in user's household (Supabase row-level security
// guarantees a user can only ever see their own household).
export async function getHousehold(req) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return { error: 'Please sign in again.', status: 401 };

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } }
  );

  const { data: userData, error: userErr } = await sb.auth.getUser(token);
  const user = userData?.user;
  if (userErr || !user) return { error: 'Please sign in again.', status: 401 };

  const { data: household } = await sb
    .from('household_profile')
    .select('*')
    .eq('owner_id', user.id)
    .order('id')
    .limit(1)
    .maybeSingle();
  if (!household) return { error: 'Set up your household first.', status: 400 };

  return { sb, user, household };
}

// Send a job to the n8n workflow (the "brain" of the app)
export async function callN8n(path, payload) {
  const base = process.env.N8N_WEBHOOK_BASE;
  if (!base) throw new Error('N8N_WEBHOOK_BASE is not set');
  return fetch(`${base.replace(/\/$/, '')}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, secret: process.env.N8N_WEBHOOK_SECRET }),
  });
}
