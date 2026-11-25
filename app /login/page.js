'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Logo from '../Logo';

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('mode') === 'signup') setMode('signup');
    supabase().auth.getSession().then(({ data }) => { if (data.session) router.replace('/app'); });
  }, [router]);

  async function submit(e) {
    e.preventDefault();
    setError(''); setNotice(''); setBusy(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase().auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/app` },
        });
        if (error) throw error;
        if (!data.session) { setNotice('Check your email to confirm your account, then come back and sign in.'); return; }
      } else {
        const { error } = await supabase().auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.replace('/app');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 22 }}><Logo /></div>
        <div className="card">
          <div className="tabs">
            <button className={`tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => setMode('signin')} type="button">Sign in</button>
            <button className={`tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')} type="button">Create account</button>
          </div>
          <form onSubmit={submit}>
            {error && <div className="error">{error}</div>}
            {notice && <div className="notice">{notice}</div>}
            <label className="field">
              <span>Email</span>
              <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
            <label className="field">
              <span>Password</span>
              <input className="input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
              {mode === 'signup' && <small>At least 6 characters.</small>}
            </label>
            <button className="btn btn-dark" style={{ width: '100%' }} disabled={busy}>
              {busy ? 'One moment…' : mode === 'signup' ? 'Create my account' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
