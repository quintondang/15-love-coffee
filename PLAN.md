# 15-Love Coffee: Website Build Plan

> **For the building model (Sonnet or Haiku):** read this entire file before you write any code. Build exactly what it describes. Don't add frameworks, build tools, or any paid service. If something is marked `TODO(Bernie)`, put in an obvious placeholder and keep going. Don't stop to ask.

---

## 0. Summary

| | |
|---|---|
| Business | **15-Love Coffee**, a tennis-themed coffee cart and delivery service (LA area, 323) |
| Owner | Bernie |
| Stack | Plain **HTML + CSS + a little vanilla JS**. No framework and no build step. |
| Hosting | **GitHub Pages** (free), served from the repo root on `main` |
| Domain | `15-lovecoffee.com`. Registration stays at GoDaddy. DNS points to GitHub Pages. |
| Forms | **No backend, no email, no accounts.** Order Ahead opens a pre-filled text (`sms:` link). Services copies a standardized booking request and opens Bernie's **Instagram DMs** (where he already handles bookings), with a pre-filled text as the backup. |
| Running cost | **$0/month**. Only the yearly domain renewal remains. |

---

## 1. Repo structure (create exactly this)

```
/
├── index.html            # Home (hero + Order CTA, signature drinks, short about)
├── menu.html
├── order.html            # Order Ahead
├── services.html         # Pop-up + Catering (one page, two tabs)
├── merch.html            # Coming soon
├── about.html
├── 404.html
├── CNAME                 # contains exactly: 15-lovecoffee.com
├── css/styles.css        # ONE stylesheet for all pages
├── js/main.js            # nav toggle, services tabs, order→SMS builder, booking→copy + IG DM
├── images/               # copy from the provided assets folder unchanged
│   ├── logo-mascot.jpg           # original logo (tennis guy with a coffee cup on a racket), cream bg
│   ├── menu.jpg                  # full menu flyer, 2560×1810
│   ├── gallery-coffee-bar.jpg    # photo of Bernie's espresso setup
│   ├── gallery/                  # later: Instagram photos go here (not needed for launch)
│   └── cutouts/                  # transparent PNG cartoons for decoration
│       ├── logo-mascot.png
│       ├── cartoon-reader-croissant.png
│       ├── cartoon-tennis-ball.png
│       └── cartoon-cloud.png
└── README.md             # how to edit text/photos (written for a non-developer)
```

Every page shares the same `<header>` (logo plus nav) and `<footer>` (contact). Because there's no build step, copy the header and footer markup into each page. Keep the copies identical.

---

## 2. Brand and design

### Colors (CSS custom properties on `:root`)

```css
--green-dark:  #014025;  /* primary: header, footer, headings, body text */
--green:       #00783D;  /* primary: buttons, active nav, CTAs */
--teal:        #036980;  /* accent: links, menu-style subheadings, focus rings */
--cream:       #FAF8E1;  /* accent: page background, text on dark green */
--white:       #FFFFFF;  /* cards/forms sit on white over cream for lift */
```

How much of each to use (60/30/10 rule):
- **60% cream** for page backgrounds. It matches the hand-drawn menu and cartoons.
- **30% dark green** for the header, the footer, all headings, and body text (`--green-dark` on cream has 11:1 contrast).
- **10% green and teal** for buttons (`--green` background with cream text), links and small labels (`--teal`), and the active nav item.
- The **Merch page** is the one exception. Its whole background is `--green` with cream text ("blank green page," as Bernie asked).
- All of these pairings pass WCAG AA: cream on #00783D is about 5.3:1, teal on cream about 5.9:1, and cream on dark green about 11:1. Never put `--green` text on `--teal`, or the reverse.

### Type (Google Fonts, one `<link>`)
- Headings: **Fredoka** (600). It is rounded and bold and matches the menu's "FIRST SERVE" lettering.
- Body: **Nunito** (400/700).
- Uppercase headings with slight letter-spacing, like the menu.

### Look and feel
- Playful and hand-drawn, with a tennis theme. Use the cutout cartoons as decoration: a cloud or two near the top of Home, the tennis ball flying into the header corner, and the reader-with-croissant on About or Order. Give decorative images `alt=""` and `aria-hidden="true"`.
- Use rounded corners (12–16px), soft shadows, and generous whitespace.
- **Mobile-first.** Most visitors will come from Instagram on a phone. The nav collapses to a hamburger below 768px.
- Tap targets are at least 44px. The phone number is always a `tel:` link.

### Wording style
- Keep it short, warm, and tennis-punny where it fits. The existing site's lines are good to reuse: *"Sit back, relax, play some tennis perhaps? We'll do the rest."*

---

## 3. Content you can use (taken from the current site)

- **Name:** 15-Love Coffee
- **Phone:** (323) 545-8235, link `tel:+13235458235`, SMS `sms:+13235458235`
- **Instagram:** https://www.instagram.com/15lovecoffee (handle `@15lovecoffee`)
- **Hours (old site, TODO(Bernie) confirm):** Delivery 7:00 am – 1:00 pm, Monday – Wednesday
- **Address / service area:** TODO(Bernie). The old site has no address. Show "Serving [area]" until he gives one.
- **About text (from the old site, lightly edited):**
  > 15-Love Coffee started as a small delivery service dedicated to bringing carefully crafted coffee right to your doorstep, and now it's a coffee cart too. The long-term goal is to one day open a storefront (maybe even with a tennis court, who knows) where everyone feels welcome, creating a fun environment for people from all walks of life. Until then, I'm grateful for the chance to start small and serve you. Thank you for letting me be a small part of your day.

### Menu (text version of `menu.jpg`, for SEO, accessibility, and the order form)
**First Serve** (iced or hot): Espresso $3.50 · Latte $6 · Cortado $5 · Cappuccino (hot only) $5 · Americano $4.50 · Macchiato $4.50 · Mocha $6 · Hot Chocolate $6
**Second Serve: Signature Drinks**: Ball Boy Latte $7 (latte with pistachio cold foam) · The Tweener $7 (caramel, brown sugar, cinnamon, espresso) · Ombilible Latte $7 (sweetened cream, sea salt, cocoa powder, espresso) · Drop Shot $4.50 (double shot of espresso topped with whipped cream)
**Game, Set, Matcha**: Matcha Latte $7 (hand-whisked matcha, choice of milk and syrup) · Wimby Latte $7 (strawberry and rose matcha) · Ball Girl Latte $7 (brown sugar matcha with lavender cold foam)
**Sweets** (text for availability): Traditional Mexican pastries, from conchas to empanadas and croissants
**Syrups:** Vanilla, Caramel, Lavender, White Mocha, Pistachio, Hazelnut
**Milks:** Whole, Almond, Soy

---

## 4. Pages

Nav order: **Home · Menu · Order Ahead · Services · Merch · About**. Highlight the current page with `aria-current="page"`.

### 4.1 Home: `index.html`
1. **Hero:** the mascot cutout (`logo-mascot.png`), "15-Love Coffee", the tagline *"Coffee that's always in your court."*, and two buttons: **Order Ahead** and **See the Menu**.
2. **Photos:** only `gallery-coffee-bar.jpg` exists right now. Show it in one image-plus-text block next to the short about text. Don't build an empty gallery grid. Leave an HTML comment showing where a gallery grid would go once more photos exist.
3. **Short about:** 2–3 sentences and a "More about us →" link to `about.html`.
4. **Services teaser:** "Pop-ups & catering. Book us for your event" → `services.html`.
5. **Footer** (on every page): address/service area, hours, a `tel:` link to the phone, an Instagram link with an inline SVG icon, and "© 2026 15-Love Coffee".

### 4.2 Menu: `menu.html`
- Show `menu.jpg` at full width in a container capped at 1200px, with descriptive `alt` text. Tapping it opens the full-size image in a new tab so people can pinch-zoom on a phone.
- Below the image, add a collapsible `<details>` titled "Text version of the menu" that holds the menu from section 3 as semantic HTML. It helps screen readers and search engines.
- CTA at the bottom: **Order ahead →**.

### 4.3 Order Ahead: `order.html` (free, no SMS API)
Bernie wants orders texted to him. We don't need a texting API. **The form builds a text message and opens the customer's own Messages app with it pre-filled**, and the customer taps send. It costs nothing and the order lands in Bernie's texts.

Most visitors to this page are regulars ordering from the cart, so **optimize this page for speed**: on a phone, one-handed, it should take under 30 seconds to send an order. Build it as a tap-to-add menu, not a long form.

- One line of intro at the top: "Tap your drinks, hit send, and your order goes to Bernie as a text."
- **Tap-to-add drink list** (grouped like the menu: First Serve / Second Serve / Game, Set, Matcha). Each drink is a row with the name, price, a one-line description for the signature drinks, and a **+** button.
  - Tapping **+** adds the drink with sensible defaults (iced, whole milk, no syrup) and shows a quantity stepper (− 1 +) on that row.
  - Each added drink gets a small **"Customize"** toggle that reveals Iced/Hot (Cappuccino is hot only), milk (Whole/Almond/Soy), and syrup (none plus the 6 syrups). It's collapsed by default, because most regulars order as-is.
  - Store the menu data (names, prices, descriptions, hot-only flags) in **one JS array** at the top of `js/main.js`, so a price change is a single edit. The text menu in `menu.html` is separate static HTML. Note in the README that both need updating.
- **Pastry:** a toggle reading "Add a pastry (text for availability)".
- **Sticky order summary at the bottom of the screen.** It's collapsed to one line ("3 drinks · est. $19 · **Send order →**") and tap-to-expand to review items. It's hidden while the cart is empty.
- **Details step** (shown in the expanded summary or right before sending; keep it minimal):
  - Name (required, remembered in `localStorage` for next time)
  - **When:** quick chips **ASAP · 15 min · 30 min · Pick a time** (the last reveals `<input type="time">`). Default to ASAP.
  - Notes (optional, one line)
- **"Order again"** (cheap and loved by regulars): after sending, save the order to `localStorage`. On the next visit, show a card at the top: "Your last order: 1× Ball Boy Latte (iced) · **Order again**", which refills the cart in one tap. Wrap all `localStorage` use in try/catch so the page works without it.
- Show the live estimated total from the menu prices, labeled "est.". Payment happens at the cart, so say so.
- On send, `js/main.js` builds a message like:
  ```
  ☕ 15-Love order – Sam
  2× Ball Boy Latte (iced)
  1× Drop Shot (hot)
  1× Matcha Latte (iced, almond, vanilla)
  + pastry if available
  Pickup: ASAP
  Est. $25.50
  ```
  Only list customizations that differ from the defaults, so messages stay short and easy for Bernie to scan at the cart. Then navigate to `sms:+13235458235?&body=` + `encodeURIComponent(msg)`. (`?&body=` works on both iOS and Android.)
- **Secondary option: "Send via Instagram instead."** It copies the same message to the clipboard, shows "Copied! Paste it in our DMs", and opens `https://ig.me/m/15lovecoffee`. Use the same copy logic as the Services page.
- **Desktop fallback.** If the device probably can't send texts (no touch, wide screen), also show the composed message in a read-only box with a **Copy** button and "Text it to (323) 545-8235".
- Under the drink list, show a plain "Prefer to just text?" section with the number as a `tel:`/`sms:` link and 3 short instructions. TODO(Bernie) gives more detail.

### 4.4 Services: `services.html`
- Two tabs at the top, **Pop-Up** and **Catering**, built as accessible tabs (`role="tablist"`, arrow-key support). Each tab has a 2–3 sentence description and then the same booking form. A hidden `service_type` field tracks which tab is active.
- Make the form look like an inviting booking card (inspiration: eyevel.com/book), not a bare form. Use clear grouped steps: **1. Your event → 2. Date & time → 3. Contact**.
- Fields: Service type (set by the tab) · Number of guests (number, min 1) · Event date (`type="date"`, min = today) · Start time · Number of hours (select 1–6+) · Event location/address · Name · Phone (optional) · Notes (optional). **No email field.** Bernie handles bookings in Instagram DMs.
- **Submission goes to Instagram DMs (no backend, no email).** Instagram links can't pre-fill DM text, so the form does the work:
  1. On submit, validate the form, then build a standardized message:
     ```
     🎾 15-Love booking request
     Service: Catering
     Date: Sat, Dec 13, 2026 · Start: 9:00 AM · Hours: 3
     Guests: 40
     Location: 123 Main St, Pasadena
     Name: Sam · Phone: (555) 555-5555
     Notes: Office holiday party
     ```
  2. Copy it to the clipboard (`navigator.clipboard.writeText`, with a fallback that selects a hidden textarea and calls `document.execCommand('copy')`).
  3. Show a confirmation panel: **"Copied! ✅ Now paste it in our DMs and hit send."** It has a big primary button **"Open Instagram DMs"** linking to `https://ig.me/m/15lovecoffee` (`target="_blank" rel="noopener"`). On phones this opens a chat with @15lovecoffee in the Instagram app.
  4. The same panel shows the message in a read-only box with a **Copy again** button, in case the clipboard step failed.
  5. Secondary button: **"No Instagram? Text it instead"** opens `sms:+13235458235?&body=` + `encodeURIComponent(msg)`. This one *does* pre-fill.
- Under the form, add a short "Prefer to just DM us?" line with a link to `https://ig.me/m/15lovecoffee`.
- Put the IG handle and phone in constants at the top of `js/main.js` (`IG_HANDLE = '15lovecoffee'`, `PHONE = '+13235458235'`) so they're easy to change.
- Add an HTML comment: *"To switch to an embedded booking/quote tool later, replace the `<form>` with the provider's embed `<iframe>`/script here."*

### 4.5 Merch: `merch.html`
- The full page background is `--green` with cream text. Center "Merch: coming soon" with the tennis-ball cutout and the line "We're still warming up. Follow @15lovecoffee for the drop." Keep the normal header and footer.

### 4.6 About: `about.html`
- The about text from section 3, the coffee-bar photo, the reader-with-croissant cartoon, and an Instagram CTA.

### 4.7 `404.html`
- "Out! That page doesn't exist." with a link home.

---

## 5. Technical requirements
- Use semantic HTML5, one `<h1>` per page, and a `<title>` and `<meta name="description">` on each page. Add Open Graph tags (og:title, og:description, og:image = `images/logo-mascot.jpg`) so links shared on Instagram look good.
- Favicon: `images/cutouts/logo-mascot.png` (also `apple-touch-icon`).
- Give `<img>` tags `width`/`height` attributes to avoid layout shift. Lazy-load everything below the fold.
- JS is progressive enhancement. The site must be readable with JS off. In that case, use a `<noscript>` note on Order and Services that says "DM us on Instagram or text (323) 545-8235", with both links.
- No cookies, no analytics, no cookie banner.
- Keep everything WCAG AA: visible focus rings (`--teal`), labels on every input, enough contrast.
- Test widths: 360px, 768px, 1280px. No horizontal scroll.
- Use relative paths only, such as `images/...` and `css/...`, so the site works on the github.io preview URL and on the custom domain.

## 6. Definition of done (check every item)
- [ ] All 7 HTML pages exist, share one stylesheet, and have identical header/footer markup
- [ ] Nav works on mobile (hamburger) and desktop and shows the current page
- [ ] **Order Ahead:** at 360px width, a regular can add a drink, enter a name, and send the text in ≤ 5 taps. The message is correct and short. "Order again" works on a second visit. Copy-text shows on desktop.
- [ ] Services tabs switch. Submitting copies the standardized message, shows the "Copied!" panel, and **Open Instagram DMs** goes to `https://ig.me/m/15lovecoffee`. The text-instead button pre-fills an SMS.
- [ ] Merch page is green with "coming soon"
- [ ] Every `tel:`, `sms:`, and Instagram link is correct
- [ ] `CNAME` contains `15-lovecoffee.com`
- [ ] README.md explains in plain English how to change the photos, the menu image, hours, and text
- [ ] Every remaining `TODO(Bernie)` is listed at the bottom of README.md

---

## 7. Deployment (done by a person, not the model)

### 7.1 GitHub Pages
1. Push to your GitHub repo on `main`. **The repo must be public** to use Pages on a free GitHub account.
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `/ (root)` → Save.
3. Check the preview at `https://<your-username>.github.io/<repo>/`.
4. Settings → Pages → **Custom domain**: `15-lovecoffee.com` → Save. (The `CNAME` file in the repo already sets this.)

### 7.2 GoDaddy DNS (keep the domain at GoDaddy, only repoint it)
1. **Before changing anything,** open GoDaddy → My Products → `15-lovecoffee.com` → **DNS** and screenshot the current records. If there are **MX** records (Bernie has email on the domain), leave them alone.
2. If the domain is still connected to GoDaddy **Website Builder** (the current site), it may hold the `@` record. Either disconnect the domain in Website Builder settings or just edit the records below.
3. Delete the existing `A` record(s) for `@` (they point to GoDaddy's builder) and any `@` "forwarding". Then add:
   | Type | Name | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | `<your-username>.github.io` |
4. Wait anywhere from 10 minutes to a few hours. When GitHub Pages shows the DNS check as passing, tick **Enforce HTTPS**.
5. Once the new site is live and verified, **cancel the GoDaddy Website Builder subscription**. **Do not** cancel the domain registration. Turn on domain auto-renew.

### 7.3 Test the booking flow (2 minutes)
1. On a phone that's **not** logged into @15lovecoffee, fill out the Services form, tap **Open Instagram DMs**, paste, and send. Confirm Bernie receives it.
2. Tip for Bernie: DMs from people he doesn't follow can land in **Message Requests**. He should check there, or pin a "Booking? Use the form on our site" note in his IG profile.

---

## 8. What we still need from Bernie
- [ ] *(Later, not blocking launch)* Photos from his Instagram to add a gallery on Home
- [ ] Address or service area, and current **hours/days** (the old site says delivery 7am–1pm Mon–Wed)
- [ ] Order-by-text details: typical prep time (to tune the ASAP / 15 / 30 min chips), payment method at the cart (Venmo/Zelle/cash?), and whether he still delivers or is cart-pickup only
- [ ] One-line descriptions of the **Pop-Up** vs **Catering** offerings (pricing optional)
- [ ] *(Nice to have)* The **original Canva/design files** for the menu and cartoons, so we get crisp transparent PNGs and can update prices without editing a flat image

---

## 9. Model and cost strategy (for the human running this)
- **The initial build is one Sonnet session.** Hand it this file and the `images/` folder in an empty repo, and ask it to build everything in section 1 and check section 6. A static site with no framework is small enough that Opus isn't needed.
- **Later edits use Haiku.** Swapping photos, changing hours or prices, and adjusting text are cheap, focused edits. Point it at the README and the specific file.
- Go back to Sonnet only for a new feature, such as a merch store, online payments, or a different booking tool.
- Keep sessions focused: one task per session, and give the exact file names. Asking "make it look better" wastes tokens. Ask for "increase hero spacing on mobile in css/styles.css".
