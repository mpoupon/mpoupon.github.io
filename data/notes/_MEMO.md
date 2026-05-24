# Memo — Layout & writing conventions for Notes

This file is a reminder of how Notes are structured and styled.
Do **not** include this file in `index.json` (it's not a note, it's a memo).

## File naming convention

`YYYY-MM-DD-slug-en-kebab-case.json`

Examples:
- `2026-05-23-bientot.json`
- `2025-11-04-port-attache.json`
- `2025-07-08-flux-ajoute-deplace.json`

The date prefix keeps files sorted chronologically on disk.
The slug should be short, French (or English, pick one), kebab-case.

## JSON schema (per note)

```json
{
  "date": "YYYY-MM-DD",
  "read": "N min",
  "tag":   { "fr": "TAG_FR", "en": "TAG_EN" },
  "title": { "fr": "Title FR", "en": "Title EN" },
  "sub":   { "fr": "Subtitle/lede FR", "en": "Subtitle/lede EN" },
  "body":  { "fr": "<p>HTML body FR</p>...", "en": "<p>HTML body EN</p>..." }
}
```

### Field guide

- **date** — ISO 8601 (`YYYY-MM-DD`). Used for sorting (newest first) and
  rendered as `YYYY·MM·DD` in the UI (dots replace dashes).
- **read** — Reading time in minutes, e.g. `"8 min"`. Free text.
- **tag** — Short uppercase category label, one or two words.
  Suggested kit: `MÉTHODE/METHOD`, `NOTE`, `CDR`, `GOUVERNANCE/GOVERNANCE`,
  `TERRAIN/FIELDWORK`, `LECTURE/READING`, `AVIS/NOTICE`.
- **title** — One short sentence, no terminal full stop.
- **sub** — One- or two-sentence lede. Sets up the note.
- **body** — Inline HTML string. See allowed tags below.

## HTML body — allowed tags

The body is rendered with `dangerouslySetInnerHTML`, so you can use:

| Tag       | Purpose                                                        |
|-----------|----------------------------------------------------------------|
| `<p>`     | Paragraph. Default style: Source Serif 4, line-height 1.66.    |
| `<h2>`    | Sub-section. Fraunces display, opens a breath.                 |
| `<h3>`    | Tertiary heading (use sparingly).                              |
| `<em>`    | Italic emphasis — for the keyword carrying the distinction.    |
| `<strong>`| Bold emphasis — use rarely; italics is usually preferred.      |
| `<a>`     | Link. Always `href` + ideally `target="_blank" rel="noopener"`.|
| `<blockquote>` | Block quote.                                              |
| `<ul>` / `<ol>` / `<li>` | Lists.                                              |
| `<code>`  | Inline mono. For filenames, code identifiers, technical terms. |
| `<pre><code>` | Code block.                                                |
| `<hr>`    | Horizontal rule — section break.                               |

Avoid: `<div>`, `<span>` with classes, inline styles. Keep semantic.

## Tone & style

- **First-person sparingly** — the page is personal but not selfie.
- **Short sentences > long ones.** Hemingway over Proust.
- **One idea per paragraph.**
- **Italics for the key term**, not for emphasis in general.
- **Em dashes (—) over commas** when you want a pause stronger than
  a comma but lighter than a semicolon.
- **Citations** — inline, with the doi or URL.

## Publication workflow

1. Draft the note as a JSON file in `data/notes/` following the schema.
2. Add the slug (filename without `.json`) to `index.json`.
   Most recent FIRST — the array order drives display order.
3. The home page features the most recent note at the top, and lists
   the rest below.

## Reminders for future-me

- **Don't add this file to `index.json`.** It's a memo, not a note.
- **`window.ARTICLES`** caches the loaded list — the full-page view
  (`BlogPost`) reuses it when navigating from the Notes index for
  instant render.
- **Image embedding** — not supported yet in the body. If you need a
  figure, ship the image to `assets/notes/` and add an `<img src="..."
  alt="...">` to the body. Style with a `class="note-fig"` if added later.
