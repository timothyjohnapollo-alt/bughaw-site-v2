# Camp Bughaw — Landing Page

A static landing page. No build step, no installs — just HTML, CSS, and JavaScript.

## Files

```
bughaw-site/
├── index.html      ← page content (text, sections, structure)
├── styles.css      ← all colors, fonts, layout, animations
├── script.js       ← menu, scroll reveals, gallery filter, FAQ
├── images/         ← all photos (swap these for your own)
└── README.md       ← this file
```

## Open it in VS Code

1. Open VS Code → **File ▸ Open Folder…** → pick the `bughaw-site` folder.
2. To preview as you edit, install the **Live Server** extension (by Ritwick Dey):
   - Click the Extensions icon on the left, search "Live Server", Install.
   - Right-click `index.html` → **Open with Live Server**. It opens in your browser and refreshes automatically every time you save.
   - (You can also just double-click `index.html` to open it in a browser — you'll refresh manually.)

## How to change things

**Text** — open `index.html` and edit the words directly. Headlines, the story, activity descriptions, FAQ answers — it's all plain text between the tags.

**Photos** — drop your own images into the `images/` folder. Either keep the same filenames (e.g. `hero-cabin.jpg`) so everything updates automatically, or change the `src="images/..."` paths in `index.html` to match your new filenames.

**Colors** — open `styles.css`. The whole palette lives at the very top in `:root`:

```css
--night:#0e1410;     /* page background        */
--ember:#e8893f;     /* the orange accent       */
--leaf:#7fa05a;      /* green accent            */
--bone:#f4efe4;      /* main text color         */
```

Change a hex value there and it updates everywhere.

**Fonts** — also in `styles.css`. They load from Google Fonts via the `<link>` in `index.html`. Display face is **Anton**, body is **Bricolage Grotesque**, the italic accents are **Fraunces**.

**Contact link** — the Facebook URL appears a few times in `index.html`. Search (Ctrl/Cmd+F) for `facebook.com` to find and update them all.

## Going live later

Because it's just static files, you can host it free on Netlify, Vercel, GitHub Pages, or Cloudflare Pages — drag the folder in and it's online. Ask if you want a hand with that.
