# ██████████ █████ Extension

<p align="center">
  <img src="https://img.shields.io/badge/status-DECLASSIFIED-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/redaction-90%25-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/tampermonkey-compatible-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/clearance-DENIED-black?style=for-the-badge" />
</p>

```
The following README has been reviewed for public release.

██████████ ████ ████████ ██ ███ ████████ █████████ ████ ██████ ████████
████ ████ ████████ ██ ████ ██████ ████ █████████ ████ ██ ███████████ ██
████████ ██ ████ █████████ ████ ██████ ████ ██████████ ████████ ███████

— Office of the Director of National Intelligence, 2025
```

---

## What is this?

A Tampermonkey userscript that transforms any website into a freshly
declassified government document. Exactly **90% of all text** on every page
is replaced with authentic ████████ black redaction blocks — the remaining
10% is left visible to taunt you.

Unlike naive implementations that roll a random dice per word (causing
some sections to go 100% black while others stay fully readable), this
script **collects every word on the page first**, then uses a deterministic
shuffle to guarantee a precise 90/10 split every single time.

---

## Preview

**Before:**
```
The quick brown fox jumps over the lazy dog. Pack my box with five
dozen liquor jugs. How vexingly quick daft zebras jump.
```

**After:**
```
███ █████ █████ ███ █████ ████ the ████ ███. ████ ██ ███ ████ ████
████████ ██████ ████. ███ █████████ █████ ████ ███████ ████.
```

---

## Installation

### 1. Install Tampermonkey

| Browser | Link |
|---------|------|
| Chrome | [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Firefox | [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/tampermonkey/) |
| Edge | [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) |
| Safari | [App Store](https://apps.apple.com/app/tampermonkey/id1482490089) |

### 2. Install the script

**Option A — Manual**
1. Click the Tampermonkey icon → **Create a new script**
2. Delete all placeholder code
3. Paste the entire contents of `epstein-files.user.js`
4. Hit **Ctrl+S** / **Cmd+S** to save

**Option B — Import file**
1. Open the Tampermonkey **Dashboard**
2. Go to **Utilities → Import from file**
3. Select `epstein-files.user.js`

### 3. Reload any webpage

████ ████ ██ ████████.

---

## How It Works

The script runs in two phases:

**Phase 1 — Collection**
A `TreeWalker` traverses every DOM text node on the page. All words are
extracted and indexed globally across the entire document.

**Phase 2 — Deterministic redaction**
The word index list is shuffled using a Fisher-Yates shuffle, and exactly
the top 90% of shuffled indices are marked for redaction. This guarantees
a mathematically precise 90/10 split — no word gets a lucky random roll,
no section goes 100% black by chance.

Each redacted word is replaced with `█` characters repeated to match the
original word's character length, preserving the visual rhythm of the text.

**Dynamic content** is handled via `MutationObserver` with debounced
batching, so infinite scroll feeds, SPAs, and lazy-loaded content all
get redacted as they appear.

---

## Configuration

At the top of the script:

```js
const REDACT_CHANCE = 0.90;   // 0.0 = nothing, 1.0 = everything
const BLOCK_CHAR    = "█";    // swap for ■, ▓, [REDACTED], etc.
const DEBOUNCE_MS   = 150;    // ms to wait before processing new DOM nodes
```

---

## File Structure

```
epstein-files-extension/
├── epstein-files.user.js   — The userscript (only file you need)
└── README.md               — ██████████████████████████████
```

---

## FAQ

**Why does 10% of the text survive?**
Someone has to leak it.

**Can I set it to 100%?**
`const REDACT_CHANCE = 1.0`. But then you're just browsing the dark.

**Will this break websites?**
The script only modifies text node values and injects inline `<span>`
elements. HTML structure, CSS, images, and functionality are untouched.

**Why is my text editor also redacted?**
`contenteditable` elements are explicitly skipped. If a site uses a
non-standard editor, add its container class to the `SKIP_TAGS` set.

**Who did it?**
██████ ██████████ ████ ████ ██████ ████ ████████ ████ █████████████.

---

## License

MIT — ████ ██ ████, ███████ ██ ████████, and ████████ ██ ████████.

---

<p align="center">
  <sub>This project is a parody. Any resemblance to actual classified documents is entirely █████████.</sub>
</p>
