'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, api } from '@/lib/supabase';
import { parsePlan, DAYS } from '@/lib/parsePlan';
import Logo from '../Logo';
import Cooking from './Cooking';

const DEFAULT_PANTRY = 'oil, butter, salt, pepper, garlic, common dried spices, flour, sugar';
const STALE_MINUTES = 12;

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [household, setHousehold] = useState(undefined); // undefined = loading, null = none yet
  const [meals, setMeals] = useState([]);

  const load = useCallback(async (uid) => {
    const sb = supabase();
    const { data: h } = await sb.from('household_profile').select('*').eq('owner_id', uid).order('id').limit(1).maybeSingle();
    setHousehold(h || null);
    if (h) {
      const { data: m } = await sb.from('meal_history').select('*').eq('household_id', h.id)
        .order('last_served', { ascending: false }).order('id', { ascending: true }).limit(120);
      setMeals(m || []);
    }
  }, []);

  useEffect(() => {
    supabase().auth.getSession().then(({ data }) => {
      if (!data.session) { router.replace('/login'); return; }
      setUser(data.session.user);
      load(data.session.user.id);
    });
  }, [router, load]);

  // While a plan is cooking, check back every 8 seconds
  const planning = household?.plan_status === 'planning';
  useEffect(() => {
    if (!planning || !user) return;
    const t = setInterval(() => load(user.id), 4000);
    return () => clearInterval(t);
  }, [planning, user, load]);

  async function signOut() {
    await supabase().auth.signOut();
    router.replace('/');
  }

  if (household === undefined) {
    return <main className="auth-shell"><div className="spinner" /></main>;
  }

  return (
    <main>
      <header className="topbar">
        <div className="wrap nav">
          <Logo href="/app" />
          <div className="who">
            <span>{household?.household_name || user?.email}</span>
            <button className="link-btn" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </header>

      {household === null
        ? <Onboarding user={user} onDone={() => load(user.id)} />
        : <Home household={household} meals={meals} reload={() => load(user.id)} setHousehold={setHousehold} />}
    </main>
  );
}

/* ---------------- Onboarding ---------------- */
function Onboarding({ user, onDone }) {
  const [f, setF] = useState({
    household_name: '', email: user?.email || '', family_size: 2, max_cook_time_minutes: 45,
    likes: '', dislikes: '', allergies_and_restrictions: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setBusy(true); setError('');
    const { error } = await supabase().from('household_profile').insert({
      owner_id: user.id,
      household_name: f.household_name.trim() || 'Our household',
      email: f.email.trim() || user.email,
      family_size: Number(f.family_size) || 2,
      max_cook_time_minutes: Number(f.max_cook_time_minutes) || 45,
      likes: f.likes.trim(),
      dislikes: f.dislikes.trim(),
      allergies_and_restrictions: f.allergies_and_restrictions.trim() || 'none',
      pantry_staples: DEFAULT_PANTRY,
      plan_status: 'idle',
      updated_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) { setError(error.message); return; }
    onDone();
  }

  return (
    <div className="narrow" style={{ padding: '36px 20px 60px' }}>
      <div className="hello">
        <h1>Welcome! Tell us about your table.</h1>
        <p>Takes one minute. Every plan follows these rules, and you can change them anytime.</p>
      </div>
      <form className="card" onSubmit={save}>
        {error && <div className="error">{error}</div>}
        <div className="grid-2">
          <label className="field"><span>Household name</span>
            <input className="input" placeholder="The Schulers" value={f.household_name} onChange={set('household_name')} /></label>
          <label className="field"><span>Where should plans be emailed?</span>
            <input className="input" type="email" required value={f.email} onChange={set('email')} /></label>
          <label className="field"><span>People eating dinner</span>
            <input className="input" type="number" min="1" max="12" value={f.family_size} onChange={set('family_size')} /></label>
          <label className="field"><span>Max cook time (minutes)</span>
            <input className="input" type="number" min="15" max="120" step="5" value={f.max_cook_time_minutes} onChange={set('max_cook_time_minutes')} /></label>
        </div>
        <label className="field"><span>Cuisines you love</span>
          <input className="input" placeholder="Mexican, Italian, Asian, comfort food…" value={f.likes} onChange={set('likes')} /></label>
        <label className="field"><span>Foods to avoid (dislikes)</span>
          <input className="input" placeholder="mushrooms, olives…" value={f.dislikes} onChange={set('dislikes')} /></label>
        <label className="field"><span>Allergies or diet restrictions</span>
          <textarea className="textarea" style={{ minHeight: 80 }} placeholder="Example: peanut allergy, no pork" value={f.allergies_and_restrictions} onChange={set('allergies_and_restrictions')} />
          <small>Every plan is checked against this list. Leave blank if none.</small></label>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save and continue'}</button>
      </form>
    </div>
  );
}

/* ---------------- Main dashboard ---------------- */
function Home({ household, meals, reload, setHousehold }) {
  const plan = useMemo(() => parsePlan(household.last_meal_plan), [household.last_meal_plan]);

  // This week's saved meals = the most recent plan date
  const week = useMemo(() => {
    if (!meals.length) return {};
    const latest = meals[0].last_served;
    const byDay = {};
    for (const m of meals) if (m.last_served === latest && !byDay[m.day_served]) byDay[m.day_served] = m;
    return byDay;
  }, [meals]);

  const minutesSince = household.plan_requested_at ? (Date.now() - new Date(household.plan_requested_at).getTime()) / 60000 : 999;
  const planning = household.plan_status === 'planning';
  const stale = planning && minutesSince > STALE_MINUTES;
  const firstName = (household.household_name || '').replace(/^the\s+/i, '');

  // When a plan finishes, show a short "Dinner is ready" moment
  const [celebrate, setCelebrate] = useState(false);
  const wasPlanning = useRef(planning);
  useEffect(() => {
    if (wasPlanning.current && !planning) {
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 3500);
      wasPlanning.current = planning;
      return () => clearTimeout(t);
    }
    wasPlanning.current = planning;
  }, [planning]);
  let savedGroceries = '';
  try { savedGroceries = window.localStorage.getItem('weeknight-groceries') || ''; } catch {}

  return (
    <div className="wrap dash">
      <div>
        <div className="hello">
          <h1>{plan.days.length ? `This week${firstName ? `, ${firstName}` : ''}` : `Let's plan your first week`}</h1>
          <p>{plan.days.length ? 'Tap a night to see the recipe. Rate it after dinner — it shapes next week.' : 'Add the groceries you just bought and we will turn them into 7 dinners.'}</p>
        </div>

        {planning && !stale && (
          <Cooking step={household.plan_step} detail={household.plan_step_detail} startedAt={household.plan_requested_at} groceries={savedGroceries} />
        )}
        {celebrate && <Cooking done groceries={savedGroceries} />}
        {stale && (
          <div className="status planning">
            <div><b>This is taking longer than usual.</b><br /><span style={{ fontSize: 14 }}>Check your email for the plan, or try again below.</span></div>
          </div>
        )}

        {plan.days.length > 0 && <WeekPlan plan={plan} week={week} onRated={reload} />}

        <PlanNextWeek household={household} hasPlan={plan.days.length > 0} busy={planning && !stale}
          onStarted={() => setHousehold({ ...household, plan_status: 'planning', plan_requested_at: new Date().toISOString() })} />
      </div>

      <aside>
        <ChangeSomething household={household} days={plan.days} />
        <Favorites meals={meals} />
        <HouseholdCard household={household} onSaved={reload} />
      </aside>
    </div>
  );
}

function WeekPlan({ plan, week, onRated }) {
  const [open, setOpen] = useState(null);
  const ordered = [...plan.days].sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));
  return (
    <div className="card" style={{ padding: 16 }}>
      {plan.prep && <div className="prep"><b>Prep on shopping day</b>{plan.prep}</div>}
      {ordered.map((d) => {
        const row = week[d.day];
        const isOpen = open === d.day;
        // If the night was swapped, the saved meal name is the source of truth
        const norm = (x) => String(x || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        const swapped = !!(row && row.meal_name && norm(row.meal_name) !== norm(d.glanceMeal) && norm(row.meal_name) !== norm(d.meal));
        const mealName = swapped ? row.meal_name : d.meal;
        return (
          <div className={`day ${isOpen ? 'open' : ''}`} key={d.day}>
            <div className="day-head" onClick={() => setOpen(isOpen ? null : d.day)}>
              <span className="day-name">{d.day.slice(0, 3)}</span>
              <div>
                <div className="day-meal">{mealName}{d.chef && !swapped && <span className="chef">Chef recipe</span>}{swapped && <span className="chef">Swapped</span>}</div>
                <div className="day-meta">{[d.cuisine, d.time].filter(Boolean).join(' · ')}</div>
              </div>
              <svg className="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
            </div>
            {row && (
              <div className="rate-line">
                <span>How was it?</span>
                <Stars row={row} onRated={onRated} />
              </div>
            )}
            {isOpen && !swapped && (
              <div className="day-body">
                {d.haul && <p className="haul"><b>From your haul:</b> {d.haul}</p>}
                {d.ingredients.length > 0 && (<><h4>Ingredients</h4><ul>{d.ingredients.map((x, i) => <li key={i}>{x}</li>)}</ul></>)}
                {d.steps.length > 0 && (<><h4>Instructions</h4><ol>{d.steps.map((x, i) => <li key={i}>{x}</li>)}</ol></>)}
              </div>
            )}
            {isOpen && swapped && <div className="day-body"><p className="haul">This night was swapped — the full recipe is in your swap confirmation email.</p></div>}
          </div>
        );
      })}
    </div>
  );
}

function Stars({ row, onRated }) {
  const [value, setValue] = useState(row.rating || 0);
  const [hover, setHover] = useState(0);
  useEffect(() => setValue(row.rating || 0), [row.rating]);
  async function rate(n) {
    setValue(n);
    const { error } = await supabase().from('meal_history').update({ rating: n }).eq('id', row.id);
    if (error) { setValue(row.rating || 0); alert('Could not save that rating. Please try again.'); return; }
    onRated();
  }
  const labels = ['', 'Never again', "Didn't like it", 'It was okay', 'Liked it', 'Loved it'];
  return (
    <span className="stars" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} className={`star ${(hover || value) >= n ? 'on' : ''}`} onMouseEnter={() => setHover(n)} onClick={() => rate(n)} aria-label={`${n} star${n > 1 ? 's' : ''}`} title={labels[n]}>★</button>
      ))}
      <span style={{ marginLeft: 6 }}>{labels[hover || value]}</span>
    </span>
  );
}

function PlanNextWeek({ household, hasPlan, busy, onStarted }) {
  const [groceries, setGroceries] = useState('');
  const [reading, setReading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  async function onPhoto(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(''); setReading(true);
    try {
      const image = await shrinkImage(file);
      const { groceries: list } = await api('/api/receipt', { image });
      setGroceries((g) => (g.trim() ? g.trim() + '\n' : '') + list);
    } catch (err) {
      setError(err.message);
    } finally {
      setReading(false);
    }
  }

  async function start() {
    setError(''); setSending(true);
    try {
      try { window.localStorage.setItem('weeknight-groceries', groceries); } catch {}
      await api('/api/plan', { groceries });
      setGroceries('');
      onStarted();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-title">{hasPlan ? 'Just went shopping?' : 'What did you buy?'}</div>
      <div className="card-sub">Snap your receipt or type your groceries, one per line with amounts.</div>
      {error && <div className="error">{error}</div>}
      <textarea className="textarea" value={groceries} onChange={(e) => setGroceries(e.target.value)} disabled={busy}
        placeholder={'2 lb chicken thighs\n1 bag spinach\n1 lb penne\n1 dozen eggs'} />
      <div className="row" style={{ marginTop: 12 }}>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={onPhoto} />
        <button className="btn btn-ghost" type="button" onClick={() => fileRef.current?.click()} disabled={reading || busy}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
          {reading ? 'Reading receipt…' : 'Scan receipt'}
        </button>
        <button className="btn btn-primary" type="button" onClick={start} disabled={sending || busy || groceries.trim().length < 10}>
          {sending ? 'Starting…' : 'Plan my week'}
        </button>
      </div>
      <p className="fineprint">Plans follow your household rules: {household.family_size || 2} people · {household.max_cook_time_minutes || 45} min max · allergies always checked.</p>
    </div>
  );
}

function ChangeSomething({ household, days }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const examples = [
    days.length ? `Swap ${days[3]?.day || 'Thursday'} for something vegetarian` : 'Swap Thursday for something vegetarian',
    "We don't like olives",
    'How do I know when chicken thighs are done?',
  ];

  async function send() {
    setBusy(true); setError(''); setMsg('');
    try {
      await api('/api/request', { request: text });
      setText('');
      setMsg(`Got it! Check ${household.email || 'your email'} — we'll send a suggestion to approve before anything changes.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <div className="card-title">Change something</div>
      <div className="card-sub">Swap a night, update tastes, report an allergy, or ask a cooking question.</div>
      <div className="chips">{examples.map((ex) => <button key={ex} className="chip" type="button" onClick={() => setText(ex)}>{ex}</button>)}</div>
      {msg && <div className="notice">{msg}</div>}
      {error && <div className="error">{error}</div>}
      <textarea className="textarea" style={{ minHeight: 90 }} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your request…" />
      <button className="btn btn-dark btn-sm" style={{ marginTop: 10 }} onClick={send} disabled={busy || text.trim().length < 4}>
        {busy ? 'Sending…' : 'Send request'}
      </button>
      <p className="fineprint">Allergy and diet changes are always reviewed by a person first.</p>
    </div>
  );
}

function Favorites({ meals }) {
  const favs = useMemo(() => {
    const seen = new Map();
    for (const m of meals) if (m.rating >= 4 && !seen.has(m.meal_name.toLowerCase())) seen.set(m.meal_name.toLowerCase(), m);
    return [...seen.values()].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }, [meals]);
  const rated = meals.filter((m) => m.rating).length;
  return (
    <div className="card">
      <div className="card-title">Your favorites</div>
      <div className="card-sub">{rated ? `${rated} dinners rated so far. 4–5★ meals come back every few weeks; 1–2★ never return.` : 'Rate dinners to teach the planner what you love.'}</div>
      {favs.map((m) => (
        <div className="fav" key={m.id}><span>{m.meal_name}</span><span>{'★'.repeat(m.rating)}</span></div>
      ))}
    </div>
  );
}

function HouseholdCard({ household, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [f, setF] = useState(household);
  const [allergyAdd, setAllergyAdd] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => setF(household), [household]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function save() {
    setBusy(true);
    const current = String(household.allergies_and_restrictions || '').trim();
    const add = allergyAdd.trim();
    const allergies = add ? (!current || current.toLowerCase() === 'none' ? add : `${current}; ${add}`) : current;
    const { error } = await supabase().from('household_profile').update({
      household_name: f.household_name, email: f.email,
      family_size: Number(f.family_size) || 2, max_cook_time_minutes: Number(f.max_cook_time_minutes) || 45,
      likes: f.likes, dislikes: f.dislikes, allergies_and_restrictions: allergies,
      updated_at: new Date().toISOString(),
    }).eq('id', household.id);
    setBusy(false);
    if (error) { alert(error.message); return; }
    setAllergyAdd(''); setEditing(false); onSaved();
  }

  if (!editing) {
    return (
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="card-title">Your household</div>
          <button className="link-btn" onClick={() => setEditing(true)}>Edit</button>
        </div>
        <dl className="kv">
          <div><dt>People</dt><dd>{household.family_size || 2}</dd></div>
          <div><dt>Max cook time</dt><dd>{household.max_cook_time_minutes || 45} min</dd></div>
          <div><dt>Loves</dt><dd>{household.likes || '—'}</dd></div>
          <div><dt>Avoid</dt><dd>{household.dislikes || '—'}</dd></div>
          <div><dt>Allergies</dt><dd>{household.allergies_and_restrictions || 'none'}</dd></div>
        </dl>
      </div>
    );
  }
  return (
    <div className="card">
      <div className="card-title">Edit household</div>
      <label className="field"><span>Household name</span><input className="input" value={f.household_name || ''} onChange={set('household_name')} /></label>
      <label className="field"><span>Plan email</span><input className="input" type="email" value={f.email || ''} onChange={set('email')} /></label>
      <div className="grid-2">
        <label className="field"><span>People</span><input className="input" type="number" min="1" value={f.family_size || 2} onChange={set('family_size')} /></label>
        <label className="field"><span>Max minutes</span><input className="input" type="number" min="15" step="5" value={f.max_cook_time_minutes || 45} onChange={set('max_cook_time_minutes')} /></label>
      </div>
      <label className="field"><span>Loves</span><input className="input" value={f.likes || ''} onChange={set('likes')} /></label>
      <label className="field"><span>Avoid</span><input className="input" value={f.dislikes || ''} onChange={set('dislikes')} /></label>
      <label className="field"><span>Add an allergy or restriction</span>
        <input className="input" placeholder="e.g. shellfish allergy" value={allergyAdd} onChange={(e) => setAllergyAdd(e.target.value)} />
        <small>Current: {household.allergies_and_restrictions || 'none'}. For safety, allergies can be added here but only removed by contacting support.</small></label>
      <div className="row">
        <button className="btn btn-dark btn-sm" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        <button className="link-btn" onClick={() => { setF(household); setEditing(false); }}>Cancel</button>
      </div>
    </div>
  );
}

/* Shrink a phone photo so it uploads fast (max 1400px, JPEG) */
function shrinkImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 1400;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not open that photo. Try a JPG or PNG.')); };
    img.src = url;
  });
}
