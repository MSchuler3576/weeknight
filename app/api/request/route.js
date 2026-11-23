import { getHousehold, callN8n } from '@/lib/server';

export const maxDuration = 30;

// Swap a dinner, change a preference, report an allergy, or ask a cooking question.
// n8n sorts the request and emails the household for approval before anything changes.
export async function POST(req) {
  const ctx = await getHousehold(req);
  if (ctx.error) return Response.json({ error: ctx.error }, { status: ctx.status });

  const { request } = await req.json().catch(() => ({}));
  const text = String(request || '').trim();
  if (text.length < 4) return Response.json({ error: 'Tell us what you would like to change.' }, { status: 400 });
  if (text.length > 1000) return Response.json({ error: 'Please keep requests under 1,000 characters.' }, { status: 400 });

  const res = await callN8n('app-request', {
    household_id: ctx.household.id,
    email: ctx.household.email || ctx.user.email,
    request: text,
  });
  if (!res.ok) return Response.json({ error: 'Could not send your request. Please try again.' }, { status: 502 });
  return Response.json({ ok: true });
}
