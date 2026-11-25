'use client';
import { useEffect, useMemo, useState } from 'react';

// Each real step reported by the n8n workflow, in order
const STEPS = {
  reading:    { n: 1, title: 'Unpacking your groceries',             sub: 'Sorting what you bought and what needs cooking first.' },
  writing:    { n: 2, title: 'Cooking up 7 dinners',                 sub: 'Mixing your groceries with the family recipe box.' },
  judging:    { n: 3, title: 'Our picky taste-tester is judging',    sub: 'Checking amounts, allergies, freshness and repeats.' },
  fixing:     { n: 4, title: 'Sent back to the kitchen',             sub: 'Fixing what the taste-tester flagged.' },
  rechecking: { n: 5, title: 'Second taste test',                    sub: 'Making sure the fixes worked.' },
  plating:    { n: 6, title: 'Plating your week',                    sub: 'Almost ready. Setting the table now.' },
  ready:      { n: 7, title: 'Dinner is ready',                      sub: 'Your week is planned.' },
};

// If the workflow has not reported a step yet, estimate from elapsed time
function guessStep(seconds) {
  if (seconds < 20) return 'reading';
  if (seconds < 120) return 'writing';
  if (seconds < 180) return 'judging';
  if (seconds < 300) return 'rechecking';
  return 'plating';
}

// "1.5 lb pork tenderloin" -> "pork tenderloin"
function cleanItem(line) {
  return String(line)
    .replace(/\([^)]*\)/g, '')
    .replace(/^[\s\d.,/½¼¾⅓⅔-]+/, '')
    .replace(/^(lbs?|oz|g|kg|cups?|cans?|jars?|bags?|heads?|bunch(es)?|dozen|packs?|packages?|loaf|loaves|bottles?|boxes?|pints?|qt|quarts?|gallons?|ct|count|cloves?|bundles?)\b\.?\s*/i, '')
    .replace(/^of\s+/i, '')
    .trim();
}

const COLORS = ['#D9692F', '#3E5C46', '#E2A23B', '#B5563C', '#6E8B5B', '#C9853F'];

export default function Cooking({ step, detail, startedAt, groceries, done }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const seconds = startedAt ? Math.max(0, (now - new Date(startedAt).getTime()) / 1000) : 0;
  const key = done ? 'ready' : STEPS[step] ? step : guessStep(seconds);
  const s = STEPS[key];
  const plates = s.n;

  const items = useMemo(() => {
    const list = String(groceries || '').split('\n').map(cleanItem).filter((x) => x && x.length < 28);
    return (list.length ? list : ['chicken', 'onions', 'garlic', 'rice', 'peppers', 'eggs', 'broccoli', 'pasta']).slice(0, 14);
  }, [groceries]);

  // Drop a new ingredient into the pot every 1.7 seconds
  const tick = Math.floor(seconds / 1.7);
  const falling = done ? [] : [0, 1, 2].map((k) => {
    const i = tick - k;
    return i >= 0 ? { label: items[i % items.length], id: i, color: COLORS[i % COLORS.length] } : null;
  }).filter(Boolean);

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');

  return (
    <div className={`cooking ${done ? 'is-done' : ''}`} role="status" aria-live="polite">
      <div className="scene">
        <svg viewBox="0 0 260 190" className="pot-svg" aria-hidden="true">
          {/* steam */}
          <g className="steam" fill="none" stroke="#C9BCA8" strokeWidth="5" strokeLinecap="round">
            <path className="wisp w1" d="M100 70 q-10 -14 0 -28 q10 -14 0 -28" />
            <path className="wisp w2" d="M130 66 q-10 -14 0 -28 q10 -14 0 -28" />
            <path className="wisp w3" d="M160 70 q-10 -14 0 -28 q10 -14 0 -28" />
          </g>
          {/* lid */}
          <g className="lid">
            <rect x="66" y="70" width="128" height="12" rx="6" fill="#2F4A38" />
            <rect x="118" y="60" width="24" height="12" rx="5" fill="#D9692F" />
          </g>
          {/* pot body */}
          <rect x="70" y="84" width="120" height="74" rx="18" fill="#3E5C46" />
          <rect x="70" y="84" width="120" height="16" rx="8" fill="#2F4A38" />
          <rect x="44" y="100" width="30" height="12" rx="6" fill="#2F4A38" />
          <rect x="186" y="100" width="30" height="12" rx="6" fill="#2F4A38" />
          <circle cx="104" cy="128" r="4" fill="#F7F1E8" opacity=".35" />
          {/* bubbles peeking out */}
          <g className="bubbles" fill="#E2A23B">
            <circle className="b b1" cx="98" cy="86" r="5" />
            <circle className="b b2" cx="132" cy="86" r="4" />
            <circle className="b b3" cx="162" cy="86" r="6" />
          </g>
          {/* stove */}
          <rect x="40" y="160" width="180" height="10" rx="5" fill="#D8CDBD" />
          <g className="flames" fill="#D9692F">
            <path className="f f1" d="M95 160 q6 -14 12 0 z" />
            <path className="f f2" d="M124 160 q6 -16 12 0 z" />
            <path className="f f3" d="M153 160 q6 -14 12 0 z" />
          </g>
        </svg>
        <div className="drops">
          {falling.map((f) => (
            <span key={f.id} className="drop" style={{ '--c': f.color, left: `${30 + ((f.id * 37) % 40)}%` }}>{f.label}</span>
          ))}
        </div>

      </div>

      <div className="cook-text">
        <div className="cook-title">{s.title}{!done && <span className="dots"><i>.</i><i>.</i><i>.</i></span>}</div>
        <div className="cook-sub">{detail || s.sub}</div>
      </div>

      <div className="plates" aria-label={`${plates} of 7 steps done`}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
          <div key={d} className={`plate ${i < plates ? 'full' : ''}`} style={{ '--c': COLORS[i % COLORS.length], animationDelay: `${i * 60}ms` }}>
            <svg viewBox="0 0 44 44" aria-hidden="true">
              <circle cx="22" cy="22" r="20" fill="#FFFFFF" stroke="#E6DCCB" strokeWidth="2" />
              <circle cx="22" cy="22" r="14" fill="none" stroke="#F0E8DA" strokeWidth="2" />
              <g className="food">
                <ellipse cx="22" cy="23" rx="10" ry="7" fill="var(--c)" />
                <circle cx="18" cy="20" r="2.2" fill="#6E8B5B" />
                <circle cx="25" cy="19" r="1.8" fill="#F7F1E8" opacity=".8" />
                <circle cx="26" cy="25" r="2" fill="#6E8B5B" />
              </g>
            </svg>
            <span>{d}</span>
          </div>
        ))}
      </div>

      {!done && <div className="cook-time">{mins}:{secs} · usually 3 to 6 minutes · we will email it too</div>}
    </div>
  );
}
