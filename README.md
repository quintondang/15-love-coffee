# 15-Love Coffee website

Plain HTML, CSS and a little JavaScript. No build step, no accounts, no monthly cost. Edit a file, commit, and GitHub Pages publishes it.

## How to change things

- **Photos:** replace the file in `images/` with a new one of the same name (e.g. `images/gallery-coffee-bar.jpg`). To add more photos, put them in `images/gallery/` and add them where the comment in `index.html` says "Gallery grid goes here".
- **Menu image:** replace `images/menu.jpg` (keep the name).
- **Menu text and prices:** update **two** places so they match:
  1. The list at the top of `js/main.js` (`MENU`). This powers the Order Ahead page and the estimated total.
  2. The "Text version of the menu" in `menu.html`.
- **Hours / address / phone:** the footer is copied into every page. Change it in all 7 `.html` files (search for "Delivery 7:00 am"). The phone number and Instagram handle used by the order and booking buttons are at the top of `js/main.js` (`PHONE`, `IG_HANDLE`).
- **Text on a page:** open that page's `.html` file and edit the words between the tags. Don't touch the `<` `>` parts.
- **Colors:** `css/styles.css`, the `:root` block at the top.

## How ordering and booking work

- **Order Ahead** builds a text message and opens the customer's Messages app with it pre-filled. They tap send. There is also a "Send via Instagram instead" option.
- **Services** builds a standard booking message, copies it, and opens Instagram DMs so the customer can paste it. Check Instagram **Message Requests** for bookings from people you don't follow.

## Publishing

See section 7 of `PLAN.md` (GitHub Pages and the GoDaddy DNS records). The `CNAME` file must contain `15-lovecoffee.com`.

## Still needed from Bernie (TODO list)

- Address or service area (footer shows a placeholder)
- Confirm hours/days (currently the old site's "Delivery 7am-1pm Mon-Wed")
- Typical prep time (for the ASAP / 15 / 30 min chips), payment method at the cart, and whether delivery is still offered
- One-line descriptions of the Pop-Up and Catering offerings (placeholders on `services.html`)
- Instagram photos for a Home gallery (later)
- Original Canva/design files for the menu and cartoons (nice to have)
