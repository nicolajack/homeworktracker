# SEO & AI Discoverability Optimization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Study Buddy discoverable by search engines and AI assistants, with proper metadata, structured data, crawlable content, and performance improvements.

**Architecture:** Add Next.js App Router metadata exports at root and per-route layouts, create sitemap/robots via Next.js conventions, enhance homepage with keyword-rich empty states and semantic HTML, migrate fonts to next/font for performance.

**Tech Stack:** Next.js 15 App Router, next/font/google, JSON-LD, Open Graph, llms.txt

---

## File Structure

**New files:**
- `app/sitemap.js` — Next.js sitemap generator
- `app/robots.js` — Next.js robots.txt generator
- `public/llms.txt` — AI crawler description file
- `app/assignments/layout.js` — metadata for /assignments
- `app/assignment/layout.js` — metadata for /assignment/[id]
- `app/calendar/layout.js` — metadata for /calendar
- `app/todo/layout.js` — metadata for /todo
- `app/pomodoro/layout.js` — metadata for /pomodoro
- `app/settings/layout.js` — metadata for /settings

**Modified files:**
- `app/layout.js` — root metadata overhaul, font imports, JSON-LD
- `app/globals.css` — remove @import font URLs, add sr-only class, update font-family references
- `app/page.js` — enhanced empty states, tool card descriptors, semantic sections, aria-labels
- `next.config.mjs` — security headers

---

### Task 1: Root Layout Metadata & JSON-LD

**Files:**
- Modify: `app/layout.js:1-46`

- [ ] **Step 1: Update root metadata export**

Replace the existing metadata export in `app/layout.js` (lines 7-13) with:

```js
export const metadata = {
  metadataBase: new URL("https://homeworktracker-eight.vercel.app"),
  title: {
    default: "Study Buddy — Homework Tracker & Assignment Planner",
    template: "%s — Study Buddy",
  },
  description:
    "Track assignments, manage due dates, and stay on top of your homework with Study Buddy. Free student planner with pomodoro timer, calendar, and to-do lists.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    siteName: "Study Buddy",
    locale: "en_US",
    url: "https://homeworktracker-eight.vercel.app",
  },
  twitter: {
    card: "summary",
  },
};
```

- [ ] **Step 2: Add JSON-LD structured data to the layout body**

In the `RootLayout` component, add a `<script>` tag inside `<head>` (before `<body>`). Update the return in `app/layout.js` from:

```jsx
return (
    <html lang="en">
      <body>
```

to:

```jsx
return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Study Buddy",
              "url": "https://homeworktracker-eight.vercel.app",
              "description":
                "Track assignments, manage due dates, and stay on top of your homework. Free student planner with pomodoro timer, calendar, and to-do lists.",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
              },
            }),
          }}
        />
      </head>
      <body>
```

- [ ] **Step 3: Verify the app still loads**

Run: `cd /Users/nicooo/homeworktracker && npm run dev`

Open `http://localhost:3000` and verify the page loads. View page source and confirm:
- `<title>` contains "Study Buddy — Homework Tracker"
- `<meta name="description">` is present
- `<script type="application/ld+json">` is present
- `<meta property="og:site_name">` is present

- [ ] **Step 4: Commit**

```bash
git add app/layout.js
git commit -m "feat: add root metadata, Open Graph, Twitter Cards, and JSON-LD structured data"
```

---

### Task 2: Sitemap, Robots, and llms.txt

**Files:**
- Create: `app/sitemap.js`
- Create: `app/robots.js`
- Create: `public/llms.txt`

- [ ] **Step 1: Create sitemap.js**

Create `app/sitemap.js`:

```js
export default function sitemap() {
  const baseUrl = "https://homeworktracker-eight.vercel.app";

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/assignments`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/calendar`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/todo`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/pomodoro`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/settings`, lastModified: new Date(), priority: 0.5 },
  ];
}
```

- [ ] **Step 2: Create robots.js**

Create `app/robots.js`:

```js
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://homeworktracker-eight.vercel.app/sitemap.xml",
  };
}
```

- [ ] **Step 3: Create llms.txt**

Create `public/llms.txt`:

```
# Study Buddy

> A free, browser-based homework tracker and assignment planner for students.

Study Buddy helps high school and college students stay organized by tracking assignments, managing due dates, and building study habits.

## Features

- Assignment Tracker: Add assignments with titles, subjects, due dates, and descriptions. Track progress with a percentage slider. Color-coded by subject.
- Calendar View: See all assignments on a monthly calendar. Drag and drop to reschedule due dates.
- Pomodoro Timer: 25-minute focused work sessions with 5-minute short breaks and 15-minute long breaks.
- To-Do List: Simple daily task management for quick study goals.
- Customization: Choose from multiple color themes. Manage classes and subjects with custom colors.

## Details

- All data is stored locally in the browser (localStorage). No account required.
- Built with Next.js and React.
- Free to use at https://homeworktracker-eight.vercel.app
```

- [ ] **Step 4: Verify sitemap and robots**

Run: `cd /Users/nicooo/homeworktracker && npm run dev`

- Open `http://localhost:3000/sitemap.xml` — should return XML with 6 URLs
- Open `http://localhost:3000/robots.txt` — should return robots rules with sitemap URL
- Open `http://localhost:3000/llms.txt` — should return the plain text file

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.js app/robots.js public/llms.txt
git commit -m "feat: add sitemap.xml, robots.txt, and llms.txt for search engine and AI discoverability"
```

---

### Task 3: Per-Route Metadata Layouts

**Files:**
- Create: `app/assignments/layout.js`
- Create: `app/assignment/layout.js`
- Create: `app/calendar/layout.js`
- Create: `app/todo/layout.js`
- Create: `app/pomodoro/layout.js`
- Create: `app/settings/layout.js`

- [ ] **Step 1: Create assignments layout**

Create `app/assignments/layout.js`:

```js
export const metadata = {
  title: "My Assignments",
  description:
    "View and manage all your homework assignments in one place. Track progress, set due dates, and stay organized with Study Buddy.",
};

export default function AssignmentsLayout({ children }) {
  return children;
}
```

- [ ] **Step 2: Create assignment detail layout**

Create `app/assignment/layout.js`:

```js
export const metadata = {
  title: "Assignment Details",
  description:
    "View assignment details, update progress, and manage your homework with Study Buddy.",
};

export default function AssignmentDetailLayout({ children }) {
  return children;
}
```

- [ ] **Step 3: Create calendar layout**

Create `app/calendar/layout.js`:

```js
export const metadata = {
  title: "Assignment Calendar",
  description:
    "View your homework assignments on a calendar. Drag and drop to reschedule due dates with Study Buddy.",
};

export default function CalendarLayout({ children }) {
  return children;
}
```

- [ ] **Step 4: Create todo layout**

Create `app/todo/layout.js`:

```js
export const metadata = {
  title: "To-Do List",
  description:
    "Keep track of daily tasks and study goals. Simple, free to-do list for students.",
};

export default function TodoLayout({ children }) {
  return children;
}
```

- [ ] **Step 5: Create pomodoro layout**

Create `app/pomodoro/layout.js`:

```js
export const metadata = {
  title: "Pomodoro Study Timer",
  description:
    "Stay focused with timed study sessions. 25-minute work intervals with short and long breaks to boost productivity.",
};

export default function PomodoroLayout({ children }) {
  return children;
}
```

- [ ] **Step 6: Create settings layout**

Create `app/settings/layout.js`:

```js
export const metadata = {
  title: "Settings",
  description:
    "Customize your Study Buddy experience. Manage your name, classes, and subjects.",
};

export default function SettingsLayout({ children }) {
  return children;
}
```

- [ ] **Step 7: Verify per-page titles**

Run: `cd /Users/nicooo/homeworktracker && npm run dev`

Navigate to each route and verify the browser tab title:
- `/assignments` → "My Assignments — Study Buddy"
- `/calendar` → "Assignment Calendar — Study Buddy"
- `/todo` → "To-Do List — Study Buddy"
- `/pomodoro` → "Pomodoro Study Timer — Study Buddy"
- `/settings` → "Settings — Study Buddy"

The `— Study Buddy` suffix comes from the root layout `title.template: "%s — Study Buddy"`.

- [ ] **Step 8: Commit**

```bash
git add app/assignments/layout.js app/assignment/layout.js app/calendar/layout.js app/todo/layout.js app/pomodoro/layout.js app/settings/layout.js
git commit -m "feat: add per-route metadata for SEO with unique titles and descriptions"
```

---

### Task 4: Crawlable Dashboard Content & Semantic HTML

**Files:**
- Modify: `app/page.js:137-315`
- Modify: `app/globals.css`

- [ ] **Step 1: Add sr-only utility class to globals.css**

Add at the end of `app/globals.css`:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

- [ ] **Step 2: Add toolDescriptor style to globals.css**

Add after the `.toolLabel` rule in `app/globals.css` (after line 381):

```css
.toolDescriptor {
  font-family: "Lexend Exa", sans-serif;
  font-size: 0.6rem;
  color: var(--bg-gradient-to);
  font-weight: 400;
  margin-top: 0.15rem;
}
```

- [ ] **Step 3: Update homepage — enhanced empty states**

In `app/page.js`, replace the subtitle text (lines 232-236):

Replace:
```jsx
        {dueThisWeek > 0 ? (
          <>you have <span>{dueThisWeek} assignment{dueThisWeek !== 1 ? "s" : ""}</span> due this week</>
        ) : (
          "you're all caught up this week!"
        )}
```

With:
```jsx
        {dueThisWeek > 0 ? (
          <>you have <span>{dueThisWeek} assignment{dueThisWeek !== 1 ? "s" : ""}</span> due this week</>
        ) : (
          "you're all caught up this week! study buddy helps you track assignments, plan your week, and stay focused."
        )}
```

- [ ] **Step 4: Update homepage — enhanced empty upcoming state**

In `app/page.js`, replace the empty state paragraph (line 261):

Replace:
```jsx
            <p className="emptyState">no upcoming assignments</p>
```

With:
```jsx
            <p className="emptyState">no upcoming assignments yet — add your first one to get started tracking homework and due dates</p>
```

- [ ] **Step 5: Update homepage — add visually hidden heading and section landmarks**

In `app/page.js`, replace the opening `<div className="bentoGrid">` (line 239) with:

Replace:
```jsx
      <div className="bentoGrid">
```

With:
```jsx
      <h2 className="sr-only">your homework dashboard</h2>
      <div className="bentoGrid">
```

- [ ] **Step 6: Update homepage — wrap upcoming assignments in section**

In `app/page.js`, replace the upcoming assignments bento card (lines 241-262):

Replace:
```jsx
        <div className="bentoCard bentoCardWide" style={staggerDelay(0)}>
          <div className="bentoLabelRow">
            <span className="bentoLabel" style={{ marginBottom: 0 }}>Upcoming Assignments</span>
            <Link href="/assignments">view all →</Link>
          </div>
```

With:
```jsx
        <section className="bentoCard bentoCardWide" aria-label="Upcoming assignments" style={staggerDelay(0)}>
          <div className="bentoLabelRow">
            <span className="bentoLabel" style={{ marginBottom: 0 }}>Upcoming Assignments</span>
            <Link href="/assignments">view all →</Link>
          </div>
```

And replace the corresponding closing `</div>` after the upcoming list (the one that closes this card, after line 262) — change it from `</div>` to `</section>`.

Find:
```jsx
            <p className="emptyState">no upcoming assignments yet — add your first one to get started tracking homework and due dates</p>
          )}
        </div>
```

Replace with:
```jsx
            <p className="emptyState">no upcoming assignments yet — add your first one to get started tracking homework and due dates</p>
          )}
        </section>
```

- [ ] **Step 7: Update homepage — tool cards with descriptors and aria-labels**

In `app/page.js`, replace the three tool card Links (lines 274-289):

Replace:
```jsx
        <Link href="/pomodoro" className="bentoCard toolCard" style={staggerDelay(2)}>
          <div className="toolIcon">
            <ClockIcon />
          </div>
          <div className="toolLabel">pomodoro</div>
        </Link>

        <Link href="/calendar" className="bentoCard toolCard" style={staggerDelay(3)}>
          <div className="toolIcon"><CalendarIcon /></div>
          <div className="toolLabel">calendar</div>
        </Link>

        <Link href="/todo" className="bentoCard toolCard" style={staggerDelay(4)}>
          <div className="toolIcon"><TodoIcon /></div>
          <div className="toolLabel">to-do</div>
        </Link>
```

With:
```jsx
        <Link href="/pomodoro" className="bentoCard toolCard" aria-label="Pomodoro study timer" style={staggerDelay(2)}>
          <div className="toolIcon">
            <ClockIcon />
          </div>
          <div className="toolLabel">pomodoro</div>
          <div className="toolDescriptor">stay focused with timed study sessions</div>
        </Link>

        <Link href="/calendar" className="bentoCard toolCard" aria-label="Assignment calendar" style={staggerDelay(3)}>
          <div className="toolIcon"><CalendarIcon /></div>
          <div className="toolLabel">calendar</div>
          <div className="toolDescriptor">view assignments by due date</div>
        </Link>

        <Link href="/todo" className="bentoCard toolCard" aria-label="To-do list" style={staggerDelay(4)}>
          <div className="toolIcon"><TodoIcon /></div>
          <div className="toolLabel">to-do</div>
          <div className="toolDescriptor">keep track of daily tasks</div>
        </Link>
```

- [ ] **Step 8: Verify the homepage visually**

Run: `cd /Users/nicooo/homeworktracker && npm run dev`

Open `http://localhost:3000` and verify:
- Tool cards show small descriptor text below the label
- Empty state messages are updated (clear localStorage to test: `localStorage.clear()` in browser console)
- No visual breakage
- View page source: confirm `<section>`, `<h2>`, and descriptive text are in the server-rendered HTML

- [ ] **Step 9: Commit**

```bash
git add app/page.js app/globals.css
git commit -m "feat: add crawlable content, semantic sections, and accessibility labels to homepage"
```

---

### Task 5: Font Migration to next/font

**Files:**
- Modify: `app/layout.js`
- Modify: `app/globals.css`

- [ ] **Step 1: Add font imports to layout.js**

At the top of `app/layout.js`, after the existing imports, add:

```js
import { Lexend_Exa, Fredoka } from "next/font/google";

const lexendExa = Lexend_Exa({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-lexend-exa",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});
```

- [ ] **Step 2: Apply font CSS variables to body**

In `app/layout.js`, update the `<body>` tag from:

```jsx
      <body>
```

To:

```jsx
      <body className={`${lexendExa.variable} ${fredoka.variable}`}>
```

- [ ] **Step 3: Remove @import font URLs from globals.css**

In `app/globals.css`, remove lines 1-2:

```css
@import url('https://fonts.googleapis.com/css2?family=Lexend+Exa:wght@100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap');
```

- [ ] **Step 4: Update font-family references in globals.css**

Replace all instances of `"Lexend Exa"` with `var(--font-lexend-exa)` throughout `app/globals.css`.

These are the specific replacements:

| Line | Current | Replacement |
|------|---------|-------------|
| 16 | `font-family: "Lexend Exa", Helvetica, sans-serif, sans-serif;` | `font-family: var(--font-lexend-exa), Helvetica, sans-serif;` |
| 54 | `font-family: "Lexend Exa", sans-serif !important;` | `font-family: var(--font-lexend-exa), sans-serif !important;` |
| All other occurrences | `"Lexend Exa", sans-serif` | `var(--font-lexend-exa), sans-serif` |
| All other occurrences | `"Lexend Exa", sans-serif !important` | `var(--font-lexend-exa), sans-serif !important` |

Use find-and-replace:
- `"Lexend Exa"` → `var(--font-lexend-exa)`

This covers all ~25 occurrences in globals.css.

Note: Fredoka is imported in CSS but grep the codebase to check where it's used. If it's only in the @import and not referenced anywhere as `font-family: "Fredoka"`, the import still makes it available via the CSS variable for future use.

- [ ] **Step 5: Verify fonts load correctly**

Run: `cd /Users/nicooo/homeworktracker && npm run dev`

Open `http://localhost:3000` and verify:
- Fonts still render correctly (Lexend Exa should appear the same)
- No render-blocking font requests in the Network tab (fonts should be self-hosted now)
- Check DevTools > Network: no requests to `fonts.googleapis.com`

- [ ] **Step 6: Commit**

```bash
git add app/layout.js app/globals.css
git commit -m "perf: migrate Google Fonts to next/font for self-hosting and eliminating render-blocking requests"
```

---

### Task 6: Security Headers in next.config.mjs

**Files:**
- Modify: `next.config.mjs`

- [ ] **Step 1: Add security headers**

Replace the contents of `next.config.mjs` with:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
};

export default nextConfig;
```

- [ ] **Step 2: Verify headers**

Run: `cd /Users/nicooo/homeworktracker && npm run dev`

In a terminal, run:
```bash
curl -I http://localhost:3000
```

Verify the response includes:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

- [ ] **Step 3: Commit**

```bash
git add next.config.mjs
git commit -m "feat: add security headers to next.config.mjs"
```

---

### Task 7: Final Build Verification

**Files:** None (verification only)

- [ ] **Step 1: Run production build**

```bash
cd /Users/nicooo/homeworktracker && npm run build
```

Expected: Build completes with no errors. The output should show all routes compiled successfully.

- [ ] **Step 2: Start production server and spot-check**

```bash
cd /Users/nicooo/homeworktracker && npm run start
```

Verify:
- `http://localhost:3000` loads with correct title and metadata
- `http://localhost:3000/sitemap.xml` returns valid XML
- `http://localhost:3000/robots.txt` returns robots rules
- `http://localhost:3000/llms.txt` returns the description
- `http://localhost:3000/assignments` shows "My Assignments — Study Buddy" in tab
- `http://localhost:3000/pomodoro` shows "Pomodoro Study Timer — Study Buddy" in tab
- View source on homepage: JSON-LD script, OG tags, descriptive content all present

- [ ] **Step 3: Commit any remaining fixes**

If any issues were found and fixed, commit them:

```bash
git add -A
git commit -m "fix: address issues found during final build verification"
```
