import Link from 'next/link';
import Logo from './Logo';

const SAMPLE = [
  ['MON', "Grandma's Chicken Savoyarde", 'Family recipe'],
  ['TUE', 'Classic Cheeseburger + oven fries', 'Chef recipe'],
  ['WED', 'Red Curry Chicken over Rice', '★ Favorite'],
  ['THU', 'Tomato & White-Bean Skillet', 'Swapped'],
  ['FRI', 'Sausage Penne with Broccoli', '35 min'],
];

export default function Home() {
  return (
    <main>
      <div className="wrap">
        <nav className="nav">
          <Logo />
          <div className="row">
            <Link href="/login" className="link-btn" style={{ textDecoration: 'none', color: 'var(--ink)', fontWeight: 600 }}>Sign in</Link>
            <Link href="/login?mode=signup" className="btn btn-dark btn-sm">Get started</Link>
          </div>
        </nav>

        <section className="hero">
          <div>
            <span className="eyebrow">For busy couples &amp; families</span>
            <h1>You already bought the food. <em>We&rsquo;ll plan the week.</em></h1>
            <p className="lede">
              Snap your grocery receipt. Get 7 dinners built from exactly what you bought, checked for
              allergies and waste, and smarter every week as your household rates them.
            </p>
            <div className="hero-cta">
              <Link href="/login?mode=signup" className="btn btn-primary">Plan my week — free</Link>
              <a href="#how" className="btn btn-ghost">How it works</a>
            </div>
            <p className="fineprint">No meal kits. No new shopping list. Just your groceries, planned.</p>
          </div>

          <div className="mock" aria-hidden="true">
            <div className="mock-head">
              <small>This week</small>
              <div>Your dinners, Mon–Sun</div>
            </div>
            <div style={{ padding: '6px 4px 0' }}>
              {SAMPLE.map(([d, m, t]) => (
                <div className="mock-row" key={d}>
                  <span className="mock-day">{d}</span>
                  <span className="mock-meal">{m}</span>
                  <span className="mock-tag">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="section" id="how" style={{ background: '#fffaf2', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <h2 className="section-title">Three steps. Five minutes a week.</h2>
          <p className="section-sub">Most meal planners start with recipes and send you shopping. Weeknight starts with the groceries already in your fridge.</p>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h3>Snap your receipt</h3>
              <p>Take a photo after you shop, or type the list. AI turns it into a clean grocery list with amounts.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Get 7 checked dinners</h3>
              <p>Every plan is scored on 9 checks — only what you bought, amounts that add up, allergies, freshness — and fixed before you see it.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Rate, swap, repeat</h3>
              <p>Tap stars after dinner. Ask to swap a night. Next week&rsquo;s plan brings back favorites and drops the misses.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="band">
            <h2 className="section-title">Why it gets better the longer you use it</h2>
            <p className="section-sub">Anyone can ask a chatbot for recipes. Weeknight builds something a chatbot can&rsquo;t: a memory of what your household actually buys, cooks and loves.</p>
            <div className="moat">
              <div className="moat-item">
                <h3>Chef-tested recipe library</h3>
                <p>Plans are built on real restaurant-kitchen and family recipes, scaled for home — not just whatever an AI invents.</p>
              </div>
              <div className="moat-item">
                <h3>Learns your household</h3>
                <p>Every star rating, swap and &ldquo;we don&rsquo;t like that&rdquo; is saved and read back into the next plan.</p>
              </div>
              <div className="moat-item">
                <h3>Safety with a human in the loop</h3>
                <p>Allergy and diet changes are flagged, reviewed and approved before they touch your profile. Allergies can only be added, never silently removed.</p>
              </div>
              <div className="moat-item">
                <h3>Less food thrown away</h3>
                <p>Perishables get cooked first, and anything bought for later in the week comes with a freeze-and-thaw tip.</p>
              </div>
            </div>
          </div>

          <div className="stats">
            <div className="stat"><b>~5 min</b><span>from receipt photo to a full week of dinners</span></div>
            <div className="stat"><b>9 checks</b><span>run on every plan before it reaches you</span></div>
            <div className="stat"><b>100+</b><span>chef and family recipes in the library</span></div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link href="/login?mode=signup" className="btn btn-primary">Plan my first week</Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <footer className="footer">
          <span>© 2026 Weeknight · An ASU W. P. Carey MS-AIB project by Madison Schuler</span>
          <span>Built with n8n, Supabase &amp; OpenAI</span>
        </footer>
      </div>
    </main>
  );
}
