# The Wolf & the Moon

A desert gothic music app for the album and companion podcast series *Desert Rose*. Built with React + Vite, wrapped for iOS with Capacitor.

---

## What This Is

A mobile-first app that releases the album one single at a time, each paired with an episode of *Desert Rose* — a supernatural true crime podcast about a woman, a corrupt officer, a man called Peach, and a stack of cassette tapes found in the drawer of Room 13 at the Desert Rose Motel.

---

## Tech Stack

- **React 18** + **Vite 6**
- **TailwindCSS** + **shadcn/ui** (Radix UI)
- **Framer Motion** for animation
- **TanStack Query** for data fetching
- **React Router v6**
- **Capacitor 8** for iOS native wrapping
- **RevenueCat** (`@revenuecat/purchases-capacitor`) for in-app donations
- **ReactMarkdown** for episode script rendering

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```
VITE_REVENUECAT_API_KEY=your_revenuecat_key_here
```

Get your key from [app.revenuecat.com](https://app.revenuecat.com). Use the sandbox/test key during development, the live key before App Store submission.

### 3. Run locally

```bash
npm run dev
```

---

## Content

Episode data lives in `content/episodes.json`. Each episode has the following shape:

```json
{
  "id": 1,
  "episode_number": 1,
  "title": "Everything",
  "description": "Short description shown in the episode list.",
  "is_latest": true,
  "podcast_file_url": null,
  "music_file_url": null,
  "music_video_url": null,
  "lyric_video_url": null,
  "video_url": null,
  "thumbnail_url": null,
  "published_at": "2026-04-26",
  "duration": null,
  "spotify_url": null,
  "story_content": "Markdown content rendered in the episode modal."
}
```

`story_content` renders via ReactMarkdown and supports standard markdown — headings, italics, horizontal rules, etc. Episode scripts use `##` headings for sections (Cold Open, Tape One, The Investigation) and `*italics*` for stage directions.

Media URLs are `null` until the corresponding single is released. `is_latest` should be `true` only on the current release.

---

## iOS Build

```bash
npm run build
npx cap sync
npx cap open ios
```

Then build and archive from Xcode.

**Bundle ID:** `com.wolfandmoon.app`  
**Capacitor config:** `capacitor.config.ts`

---

## In-App Donations

One-time consumable donations via Apple In-App Purchase, managed through RevenueCat.

**Product IDs** (must be created in App Store Connect):

| Product ID | Amount |
|---|---|
| `com.wolfandmoon.app.donate5` | $5 |
| `com.wolfandmoon.app.donate10` | $10 |
| `com.wolfandmoon.app.donate25` | $25 |
| `com.wolfandmoon.app.donate50` | $50 |

The donation UI is web-aware: on the web it shows a prompt to download the app; on native iOS it triggers the App Store purchase flow.

---

## App Store Checklist

See `APP_STORE_CHECKLIST.md` for remaining submission steps.
