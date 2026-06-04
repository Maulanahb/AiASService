---
name: typewriter
description: >
  Use this skill whenever the user wants a typewriter text effect in a web app.
  Triggers include: "typewriter effect", "typing animation", "animated text",
  "text reveals itself", "character-by-character text", "blinking cursor effect",
  or any request where body/hero/UI text should appear as if being typed live.
  Applies to HTML/CSS/JS pages, React components, and Vue components.
  Do NOT use for Flutter/Dart — use an appropriate Flutter animation widget instead.
  Always ensure the text content (strings) is customized to match the specific application/project theme, domain, and language.
---

## What This Skill Produces

A production-grade typewriter text animation that:
- Types out one or more strings character-by-character
- Shows a blinking cursor during and/or after typing
- Optionally deletes text and cycles to the next string (loop mode)
- Is accessible (respects `prefers-reduced-motion`)
- Is self-contained — no external library required unless the user asks

---

## Decision Tree Before Coding

```
Is the target HTML/CSS/JS?         → Use Vanilla JS implementation below
Is the target React?               → Use React hook implementation below
Does the user want a library?      → Use Typed.js (CDN) or typewriter-effect (npm)
Does the user want loop/delete?    → Enable deleteMode in the implementation
Should it respect reduced motion?  → Always yes — wrap in matchMedia check
```

---

## Core Concepts

| Concept | Detail |
|--------|--------|
| **Typing speed** | 60–120ms per character feels natural |
| **Delete speed** | 30–60ms per character (faster than typing) |
| **Pause after typing** | 1500–2500ms before deleting |
| **Pause after deleting** | 400–800ms before typing next string |
| **Cursor** | `|` or `_`, blink via CSS `@keyframes` at 0.7s interval |
| **Accessibility** | Wrap in `aria-live="polite"` region; disable animation if `prefers-reduced-motion: reduce` |

---

## Implementation 1 — Vanilla HTML/CSS/JS (Self-Contained)

Use when output is a plain `.html` file or inline `<script>` in a web page.

```html
<!-- Container -->
<p class="typewriter-wrapper" aria-live="polite">
  <span id="typewriter-text"></span><span class="cursor" aria-hidden="true">|</span>
</p>

<style>
  .cursor {
    display: inline-block;
    animation: blink 0.7s step-end infinite;
    margin-left: 1px;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cursor { animation: none; }
    /* Optionally show full text immediately */
  }
</style>

<script>
  const STRINGS      = ["Futsal", "Mini Soccer", "Bulu Tangkis", "Basket", "Voli"];
  const TYPE_SPEED   = 120;  // ms per char
  const DELETE_SPEED = 80;   // ms per char
  const PAUSE_AFTER  = 1800; // ms after full string typed
  const PAUSE_BEFORE = 500;  // ms before typing next string

  const el       = document.getElementById("typewriter-text");
  let strIndex   = 0;
  let charIndex  = 0;
  let isDeleting = false;

  // Respect reduced motion
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    el.textContent = STRINGS[0];
  } else {
    tick();
  }

  function tick() {
    const current = STRINGS[strIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        strIndex   = (strIndex + 1) % STRINGS.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    } else {
      el.textContent = current.substring(0, charIndex++);
      if (charIndex > current.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    }
  }
</script>
```

---

## Implementation 2 — React Hook

Use when output is a `.jsx` / `.tsx` React component.

```jsx
import { useState, useEffect, useRef } from "react";

/**
 * useTypewriter — cycles through `strings`, typing then deleting each.
 * @param {string[]} strings
 * @param {{ typeSpeed?: number, deleteSpeed?: number, pauseAfter?: number, pauseBefore?: number, loop?: boolean }} options
 */
function useTypewriter(strings, {
  typeSpeed   = 80,
  deleteSpeed = 40,
  pauseAfter  = 2000,
  pauseBefore = 500,
  loop        = true,
} = {}) {
  const [displayed, setDisplayed] = useState("");
  const state = useRef({ strIndex: 0, charIndex: 0, isDeleting: false });

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setDisplayed(strings[0]); return; }

    let timer;
    function tick() {
      const { strIndex, charIndex, isDeleting } = state.current;
      const current = strings[strIndex];

      if (isDeleting) {
        const next = charIndex - 1;
        setDisplayed(current.substring(0, next));
        state.current.charIndex = next;
        if (next <= 0) {
          state.current.isDeleting = false;
          state.current.strIndex   = loop ? (strIndex + 1) % strings.length : strIndex;
          timer = setTimeout(tick, pauseBefore);
        } else {
          timer = setTimeout(tick, deleteSpeed);
        }
      } else {
        const next = charIndex + 1;
        setDisplayed(current.substring(0, next));
        state.current.charIndex = next;
        if (next > current.length) {
          state.current.isDeleting = true;
          timer = setTimeout(tick, pauseAfter);
        } else {
          timer = setTimeout(tick, typeSpeed);
        }
      }
    }
    timer = setTimeout(tick, pauseBefore);
    return () => clearTimeout(timer);
  }, []);  // run once on mount

  return displayed;
}

/* Example usage */
export default function HeroText() {
  const text = useTypewriter(
    ["Futsal", "Mini Soccer", "Bulu Tangkis", "Basket", "Voli"],
    { typeSpeed: 120, deleteSpeed: 80, pauseAfter: 1800 }
  );

  return (
    <h1 aria-live="polite" className="text-4xl font-extrabold">
      Booking Lapangan <span className="text-brand-primary">{text}</span> Tanpa Ribet.
      <span aria-hidden="true" className="typewriter-cursor text-brand-primary">|</span>
    </h1>
  );
}
```

---

## Implementation 3 — Using Typed.js (CDN, no build step)

Use when the user wants a quick drop-in with no custom code.

```html
<script src="https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js"></script>

<span id="typed"></span>

<script>
  new Typed("#typed", {
    strings:       ["Cari Lapangan Terdekat", "Pilih Jadwal Kosong", "Bayar & Dapatkan Tiket"],
    typeSpeed:     80,
    backSpeed:     40,
    backDelay:     1800,
    startDelay:    500,
    loop:          true,
    showCursor:    true,
    cursorChar:    "|",
  });
</script>
```

---

## Aesthetic & Content Guidelines (from frontend-design skill)

- **Content Alignment**: Always customize the typewriter strings to accurately fit the target project/application. Avoid generic placeholder texts (e.g., "First string", "Hello World"). Use relevant nouns, actions, or categories matching the domain and language of the project (e.g. for Lapangku, use sport categories like Futsal, Badminton, etc.).
- **Cursor style**: match the site's font — use `|` for sans-serif, `_` for monospace/terminal looks
- **Color**: cursor color should match or complement the text color, not contrast harshly
- **Font pairing**: typewriter effect works especially well with monospace (`'Courier New'`, `'JetBrains Mono'`, `'Space Mono'`) for terminal feel, or a bold display font for hero sections
- **Speed tuning**: slower (100–150ms) = dramatic/editorial; faster (40–60ms) = energetic/playful
- **Do not** pair typewriter with too many other animations — it competes for attention

---

## Common Mistakes to Avoid

| Mistake | Fix |
|---------|-----|
| No `prefers-reduced-motion` check | Always add `matchMedia` guard |
| Cursor flickers on string change | Keep cursor element separate from text span |
| `aria-live` on cursor span | Set `aria-hidden="true"` on cursor only |
| Typing stops after one cycle | Check loop logic and index reset |
| Characters appear double | `charIndex` mutated in closure — use `useRef` in React |
| Generic or unrelated typewriter strings | Replace placeholders with customized text matching the project domain, language, and theme |

---

## Parameters Reference

| Parameter | Default | Description |
|-----------|---------|-------------|
| `strings` | required | Array of strings to cycle through |
| `typeSpeed` | 80ms | Delay between each character typed |
| `deleteSpeed` | 40ms | Delay between each character deleted |
| `pauseAfter` | 2000ms | Pause after full string is typed |
| `pauseBefore` | 500ms | Pause before typing the next string |
| `loop` | true | Whether to cycle strings infinitely |
| `cursor` | `\|` | Cursor character |
