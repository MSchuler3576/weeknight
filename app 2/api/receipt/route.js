import { getHousehold, callN8n } from '@/lib/server';

export const maxDuration = 60;

// Read a receipt photo into a grocery list (the AI step runs in n8n)
export async function POST(req) {
  const ctx = await getHousehold(req);
  if (ctx.error) return Response.json({ error: ctx.error }, { status: ctx.status });

  const { image } = await req.json().catch(() => ({}));
  if (!/^data:image\/(jpeg|png|webp);base64,/.test(String(image || ''))) {
    return Response.json({ error: 'Please choose a photo (JPG or PNG).' }, { status: 400 });
  }
  if (image.length > 4_000_000) return Response.json({ error: 'That photo is too large. Try a closer, smaller photo.' }, { status: 400 });

  const res = await callN8n('app-read-receipt', { household_id: ctx.household.id, image });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.groceries) {
    return Response.json({ error: "We couldn't read that photo. Try a clearer, flatter shot, or type your list." }, { status: 502 });
  }
  return Response.json({ groceries: data.groceries });
}
