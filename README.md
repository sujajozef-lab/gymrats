# My Portfolio

Personal portfolio website built with plain HTML, CSS, and JavaScript.

## Project structure

```
portfolio/
├── index.html      ← Main page
├── style.css       ← All styles
├── script.js       ← Interactions
├── vercel.json     ← Vercel config
└── README.md       ← This file
```

## Customise before deploying

Open `index.html` and update:
- Your name (search for "Your Name")
- Your location ("Based in Prague")
- Your email ("hello@yourname.com")
- Project titles, descriptions, and links
- Social links (GitHub, LinkedIn, Twitter)

Open `style.css` to change colours — edit the `:root` variables at the top.

## Deploy to Vercel

### Option A — GitHub (recommended)

1. Create a free account at https://github.com
2. Create a new repository (click + → New repository)
3. Upload all files from this folder to the repo
4. Go to https://vercel.com and sign in with GitHub
5. Click "Add New Project" → select your repo
6. Leave all settings as default → click "Deploy"
7. Your site is live at `yourproject.vercel.app`

Every time you push a change to GitHub, Vercel redeploys automatically.

### Option B — Vercel CLI (faster)

```bash
# Install Vercel CLI
npm install -g vercel

# Inside this folder, run:
vercel

# Follow the prompts. Your site will be live in ~30 seconds.
```

## Add a custom domain

1. In Vercel dashboard → your project → Settings → Domains
2. Add your domain (e.g. yourname.com)
3. Update your DNS records as shown — usually just an A record or CNAME

## License

Feel free to use this as a starting point for your own portfolio.
