# Eight Dates — Relationship Guide

A beautiful web guide based on the book *Eight Dates* by John & Julie Gottman.

## Files

```
eight-dates-site/
├── index.html     ← The full website
├── vercel.json    ← Vercel config
└── README.md      ← This file
```

## Deploy to Vercel

### Step 1 — Push to GitHub

1. Go to https://github.com → sign in → click **+** → **New repository**
2. Name it `eight-dates` → click **Create repository**
3. Upload `index.html` and `vercel.json` to the repo

### Step 2 — Deploy on Vercel

1. Go to https://vercel.com → sign in with GitHub
2. Click **Add New Project**
3. Select your `eight-dates` repo
4. Leave all settings as default
5. Click **Deploy**

Your site will be live at `eight-dates.vercel.app` (or similar) in ~30 seconds.

Every future change you push to GitHub redeploys automatically.

### Option B — Vercel CLI (fastest)

```bash
npm install -g vercel
cd eight-dates-site
vercel
```

Follow the prompts — live in under a minute.
