// Turn the planner's plain-text plan into structured recipe cards.
// Mirrors the parsing used in the n8n email builder.
const DAY_RE = /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export function parsePlan(text) {
  const t = String(text || '').replace(/\r/g, '');
  if (!t.trim()) return { prep: '', days: [] };
  const parts = t.split(/\n?[ \t]*={5,}[ \t]*\n?/);
  const top = (parts[0] || '').split('\n').map((l) => l.trim()).filter(Boolean);

  const prep = top
    .filter((l) => /^PREP ON SHOPPING DAY/i.test(l))
    .map((l) => l.replace(/^PREP ON SHOPPING DAY:\s*/i, ''))
    .join(' ');

  // Glance list: "Monday: Meal name (cuisine, chef recipe, 30 min)"
  const glance = {};
  for (const line of top) {
    const m = line.match(/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*:\s*(.+)$/i);
    if (!m) continue;
    const rest = m[2];
    const meta = rest.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
    glance[cap(m[1])] = { meal: meta ? meta[1] : rest, meta: meta ? meta[2] : '' };
  }

  const days = [];
  for (const block of parts.slice(1)) {
    if (!DAY_RE.test(block.trim())) continue;
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    const title = lines.shift() || '';
    const c = title.indexOf(':');
    const day = cap((c > -1 ? title.slice(0, c) : title).trim());
    const meal = (c > -1 ? title.slice(c + 1) : '').replace(/\(chef recipe\)/i, '').trim();
    const info = {};
    const haul = [];
    const ingredients = [];
    const steps = [];
    let mode = '';
    for (const line of lines) {
      let m;
      if (/^(notes?\b|inventory|rule check|constraint|summary|if you|let me know|want me to|i can )/i.test(line.replace(/^[-•*#\s]+/, ''))) break;
      if (mode === 'steps' && /^[-•*]\s/.test(line)) break;
      if ((m = line.match(/^ingredients:\s*(.*)$/i))) { mode = 'ing'; if (m[1]) ingredients.push(m[1]); continue; }
      if ((m = line.match(/^instructions:\s*(.*)$/i))) { mode = 'steps'; if (m[1]) steps.push(m[1]); continue; }
      if ((mode === '' || mode === 'haul') && (m = line.match(/^(cuisine|total cook time|serves|from your haul):\s*(.*)$/i))) {
        const key = m[1].toLowerCase();
        if (key === 'from your haul') { mode = 'haul'; if (m[2]) haul.push(m[2]); }
        else { mode = ''; info[key] = m[2]; }
        continue;
      }
      if (mode === 'haul') haul.push(line.replace(/^[-•*]\s*/, ''));
      else if (mode === 'ing') ingredients.push(line.replace(/^[-•*]\s*/, ''));
      else if (mode === 'steps') steps.push(line.replace(/^\d+[.)]\s*/, ''));
    }
    const g = glance[day] || {};
    const isChef = /chef recipe/i.test((g.meta || '') + ' ' + (info.cuisine || '') + ' ' + title);
    days.push({
      day,
      meal: meal || g.meal || '',
      glanceMeal: g.meal || meal || '',
      cuisine: (info.cuisine || '').replace(/\(chef recipe\)/i, '').trim(),
      time: info['total cook time'] || '',
      serves: (info.serves || '').replace(/^serves\s*/i, ''),
      chef: isChef,
      haul: haul.join(', '),
      ingredients,
      steps,
    });
  }

  // If the detailed blocks are missing, fall back to the glance list
  if (!days.length) {
    for (const d of DAYS) if (glance[d]) days.push({ day: d, meal: glance[d].meal, cuisine: glance[d].meta, ingredients: [], steps: [] });
  }
  return { prep, days };
}
