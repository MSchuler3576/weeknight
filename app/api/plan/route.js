import { getHousehold, callN8n } from '@/lib/server';

export const maxDuration = 30;

// Start planning a week: mark the household as "planning" and hand the haul to n8n
export async function POST(req) {
  const ctx = await getHousehold(req);
  if (ctx.error) return Response.json({ error: ctx.error }, { status: ctx.status });

  const { groceries } = await req.json().catch(() => ({}));
  const list = String(groceries || '').trim();
  if (list.length < 10) return Response.json({ error: 'Add your groceries first (one per line, with amounts).' }, { status: 400 });
  if (list.length > 4000) return Response.json({ error: 'That list is too long. Trim it to your main groceries.' }, { status: 400 });

  await ctx.sb
    .from('household_profile')
    .update({ plan_status: 'planning', plan_requested_at: new Date().toISOString() })
    .eq('id', ctx.household.id);

  const res = await callN8n('app-plan-week', { household_id: ctx.household.id, groceries: list });
  if (!res.ok) {
    await ctx.sb.from('household_profile').update({ plan_status: 'idle' }).eq('id', ctx.household.id);
    return Response.json({ error: 'The planner is offline right now. Please try again in a minute.' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
