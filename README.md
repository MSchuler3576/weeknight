# Weeknight

Snap your grocery receipt → get 7 dinners built from exactly what you bought, quality-checked for allergies and waste, and smarter every week as your household rates them.

**Stack:** Next.js (Vercel) · Supabase (auth + database) · n8n (AI workflow "brain") · OpenAI

## How it fits together

| Piece | Job |
|---|---|
| Web app (this repo) | Sign up, household setup, receipt photo, plan view, star ratings, requests |
| Supabase | Users, household profiles, meal history (row-level security: each user only sees their own household) |
| n8n workflow | Reads receipts, writes the plan, judges + revises it, emails it, handles swaps / preferences / allergies with human approval |

The app never talks to OpenAI directly. It sends jobs to three n8n webhooks:
`app-plan-week`, `app-request`, `app-read-receipt` (each checks a shared secret).

## Environment variables (Vercel → Project → Settings → Environment Variables)

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon / publishable key |
| `N8N_WEBHOOK_BASE` | `https://<your-n8n>.app.n8n.cloud/webhook` |
| `N8N_WEBHOOK_SECRET` | Same secret as in the n8n "Weekly Grocery Form", "Start Request" and "Check Receipt Request" code nodes |

## Run locally

```
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```
