# Isreal & Etieno — wedding invitation

Plain HTML/CSS/JS — no build step. Everything you'd edit is in **`js/config.js`**.

## 1. Preview locally
`python3 -m http.server 8000` in this folder, open http://localhost:8000
(or just open `index.html`).

## 2. Turn on RSVPs & Wishes (Supabase — free)
1. Create a project at supabase.com.
2. **SQL Editor** → paste `supabase/schema.sql` → Run.
3. **Project Settings → API**: copy the *Project URL* and the *anon / publishable* key.
4. Paste both into `supabase: { url, anonKey }` in `js/config.js`.
   (The anon key is meant to be public; the database rules above keep the data safe.)

**Where you see RSVPs:** Table Editor → `rsvps` (name, phone, attending, guests, message). Export CSV any time.
**Approving wishes:** Table Editor → `wishes` → tick `approved` on the ones you want shown. Nothing appears on the site until you do.

Until the keys are filled in, the forms tell visitors they're not connected — they never fake a save.

Spam protection: hidden honeypot field, minimum-time and 30-second cooldown, length limits, no links allowed, wishes need your approval, and database rules stop guests reading RSVPs or approving their own wishes. If you ever get bot floods, add Cloudflare Turnstile.

## 3. Deploy to ateezzylovestory.com (free hosting)
The site is already configured for **https://ateezzylovestory.com** (canonical URL, share image, sitemap).

**Option A — Netlify (easiest)**
1. Go to app.netlify.com/drop and drag in this whole folder (unzipped). You get a temporary `*.netlify.app` link — test it.
2. Site configuration → **Domain management → Add a domain** → enter `ateezzylovestory.com`.
3. Netlify shows DNS records. Easiest: **Use Netlify DNS** and copy its 4 nameservers into your domain provider's "Nameservers" setting. Or keep your provider's DNS and add:
   - `A` record, host `@` → `75.2.60.5`
   - `CNAME` record, host `www` → `your-site-name.netlify.app`
4. Wait for DNS (minutes to a few hours), then click **Provision SSL certificate** (HTTPS is free).

**Option B — Cloudflare Pages:** Workers & Pages → Create → Upload assets (drag the folder) → Custom domains → add `ateezzylovestory.com` and follow the prompts.

After the domain is live, check a WhatsApp link preview (share image: `assets/og.jpg`).

## 4. Things to fill in
- `usd.routingNumber` / `usd.swift` in `config.js` (not provided — hidden until filled).
- `venue.dressCode`, `venue.note`, `venue.mapsUrl` (paste your exact Google Maps link).
- Chapter four's proposal story (`text: []`), and a RSVP `deadline` if you want one.

## 5. Photos
Each photo is two files in `assets/img/`: `name-sm.webp` (640px wide) and `name-lg.webp` (1500px). Add a line to `photos` and `gallery` in `config.js`.
