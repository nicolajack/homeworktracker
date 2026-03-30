# Study Buddy — SEO & AI Discoverability Optimization

**Date:** 2026-03-30
**Domain:** https://homeworktracker-eight.vercel.app/
**Target audience:** High school and college students searching for homework trackers, assignment planners, study tools
**Target queries:** "homework tracker app," "assignment planner," "study planner," "online pomodoro timer for students"

---

## 1. Technical SEO Foundations

### 1a. Per-Page Metadata

Each route gets its own `title` and `description`. Since all page components are `"use client"`, metadata will be exported from per-route `layout.js` files (which are server components by default in Next.js App Router). For routes that don't have a `layout.js`, we create a minimal one that only exports metadata.

| Route | Title | Description |
|-------|-------|-------------|
| `/` | `Study Buddy — Homework Tracker & Assignment Planner` | `Track assignments, manage due dates, and stay on top of your homework with Study Buddy. Free student planner with pomodoro timer, calendar, and to-do lists.` |
| `/assignments` | `My Assignments — Study Buddy` | `View and manage all your homework assignments in one place. Track progress, set due dates, and stay organized with Study Buddy.` |
| `/assignment/[id]` | `Assignment Details — Study Buddy` | `View assignment details, update progress, and manage your homework with Study Buddy.` |
| `/calendar` | `Assignment Calendar — Study Buddy` | `View your homework assignments on a calendar. Drag and drop to reschedule due dates with Study Buddy.` |
| `/todo` | `To-Do List — Study Buddy` | `Keep track of daily tasks and study goals. Simple, free to-do list for students.` |
| `/pomodoro` | `Pomodoro Study Timer — Study Buddy` | `Stay focused with timed study sessions. 25-minute work intervals with short and long breaks to boost productivity.` |
| `/settings` | `Settings — Study Buddy` | `Customize your Study Buddy experience. Manage your name, classes, and subjects.` |

### 1b. Open Graph & Twitter Card Tags

Added to root layout metadata so every page gets social sharing previews:

```js
openGraph: {
  type: "website",
  siteName: "Study Buddy",
  locale: "en_US",
  url: "https://homeworktracker-eight.vercel.app",
}
twitter: {
  card: "summary",
}
```

Per-page overrides inherit the base and add their own `title` and `description`.

### 1c. sitemap.xml

Created via Next.js `app/sitemap.js` (static export). Lists all public routes:

- `/`
- `/assignments`
- `/calendar`
- `/todo`
- `/pomodoro`
- `/settings`

Priority: `/` gets `1.0`, tool pages get `0.8`, settings gets `0.5`.

### 1d. robots.txt

Created via Next.js `app/robots.js`:

```
User-agent: *
Allow: /
Sitemap: https://homeworktracker-eight.vercel.app/sitemap.xml
```

### 1e. JSON-LD Structured Data

Added to root layout as a `<script type="application/ld+json">` tag:

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Study Buddy",
  "url": "https://homeworktracker-eight.vercel.app",
  "description": "Track assignments, manage due dates, and stay on top of your homework. Free student planner with pomodoro timer, calendar, and to-do lists.",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### 1f. llms.txt

A plain-text file at `public/llms.txt` describing the app for AI crawlers:

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

### 1g. Canonical URLs

Set `metadataBase` in root layout:

```js
metadataBase: new URL("https://homeworktracker-eight.vercel.app")
```

This makes all relative OG/canonical URLs resolve correctly.

---

## 2. Crawlable Dashboard Content

Changes to make the homepage meaningful to crawlers while preserving the UI for users with data.

### 2a. Enhanced Empty States

| Element | Current Text | New Text |
|---------|-------------|----------|
| Subtitle (no assignments) | `you're all caught up this week!` | `you're all caught up this week! study buddy helps you track assignments, plan your week, and stay focused.` |
| Empty upcoming list | `no upcoming assignments` | `no upcoming assignments yet — add your first one to get started tracking homework and due dates` |

### 2b. Tool Card Descriptors

Add a small subtitle line under each tool card label:

| Card | Label | New Descriptor |
|------|-------|---------------|
| Pomodoro | `pomodoro` | `stay focused with timed study sessions` |
| Calendar | `calendar` | `view assignments by due date` |
| To-Do | `to-do` | `keep track of daily tasks` |

Styled as a small, muted line (~0.6rem) below the existing label.

### 2c. Visually Hidden Dashboard Heading

Add an `<h2>` with `sr-only` styling: `your homework dashboard`. This gives crawlers a meaningful heading for the main content area without changing the visual design.

---

## 3. Semantic HTML & Accessibility

### 3a. Heading Hierarchy

Ensure each page has exactly one `<h1>` and uses `<h2>`/`<h3>` logically:

- Home: `<h1>hello, {name}!</h1>` + `<h2 class="sr-only">your homework dashboard</h2>`
- Assignments: `<h1>` for page title
- Each sub-page: verify single `<h1>` usage

### 3b. Section Landmarks

Wrap bento grid sections in `<section>` with `aria-label`:

```html
<section aria-label="Upcoming assignments">...</section>
<section aria-label="Study tools">...</section>
```

### 3c. Link Accessibility

Add `aria-label` to tool card links:

```html
<Link href="/pomodoro" aria-label="Pomodoro study timer">
<Link href="/calendar" aria-label="Assignment calendar">
<Link href="/todo" aria-label="To-do list">
```

---

## 4. Performance

### 4a. Google Fonts Migration

Replace CSS `@import url(...)` for Lexend Exa and Fredoka with `next/font/google` in root layout:

```js
import { Lexend_Exa, Fredoka } from "next/font/google";

const lexendExa = Lexend_Exa({ subsets: ["latin"], variable: "--font-lexend-exa" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });
```

Then apply via `<body className={`${lexendExa.variable} ${fredoka.variable}`}>` and update CSS to use `var(--font-lexend-exa)` instead of `"Lexend Exa"`.

This eliminates render-blocking external font requests and self-hosts the fonts.

### 4b. metadataBase

Set in root layout metadata (covered in section 1g).

### 4c. Security Headers

Add to `next.config.mjs`:

```js
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
```

---

## What Does NOT Change

- Visual design for users who have assignment data
- The Taylor Swift lyric card
- Overall layout/structure of any page
- No new pages or routes
- No backend/API changes
- No authentication
