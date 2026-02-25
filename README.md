# ⚡ DSA Recall Engine

A smart flashcard generator for Data Structures & Algorithms revision. Log solved problems, auto-generate Anki flashcards using AI, and build long-term retention with spaced repetition.

![Tech Stack](https://img.shields.io/badge/React-19-blue?logo=react)
![Tech Stack](https://img.shields.io/badge/Express-5-black?logo=express)
![AI](https://img.shields.io/badge/Llama_3.3_70B-Groq-orange?logo=meta)
![Anki](https://img.shields.io/badge/AnkiConnect-integrated-green)

---

## 🔗 How Anki Integration Works

This project talks directly to your local Anki app through **[AnkiConnect](https://ankiweb.net/shared/info/2055492159)** — a plugin that exposes Anki as a local REST API on port `8765`.

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐      ┌───────────┐
│  React App  │ ───► │  Express    │ ───► │  Groq API    │      │           │
│  (Browser)  │      │  Server     │      │  (Llama 3.3) │      │   Anki    │
│  :5173      │      │  :3001      │ ◄─── │  Free Cloud  │      │   App     │
└─────────────┘      │             │                             │  :8765    │
                     │             │ ──── AnkiConnect ─────────► │           │
                     └─────────────┘   (localhost REST API)      └───────────┘
```

### The Flow

1. **You submit a solved problem** → React frontend sends form data to Express server
2. **Server calls Groq AI** → Llama 3.3 70B generates 6 targeted flashcards (concept, pattern, mistakes, complexity)
3. **Server pushes cards to Anki** → via AnkiConnect API at `http://localhost:8765`:
   - Creates a **sub-deck** based on your topic (e.g. `DSA Recall Engine::Dynamic Programming`)
   - Adds each flashcard as a **Basic** note with front/back fields
   - Tags cards with topic and difficulty (e.g. `DSA::Arrays`, `Medium`)
4. **Real-time status** → The app checks Anki connection on load and shows a live status badge

### AnkiConnect API Calls Used

| Action | Purpose |
|--------|---------|
| `version` | Check if Anki is running |
| `deckNames` | List existing decks |
| `createDeck` | Create topic sub-deck (e.g. `DSA Recall Engine::Arrays`) |
| `addNote` | Push each flashcard with fields, tags, and deck assignment |

### Sub-Deck Structure in Anki

```
DSA Recall Engine
├── Arrays
├── Binary Search
├── Binary Search Tree
├── Binary Tree
├── Bit Manipulation
├── Dynamic Programming
├── Graph
├── Greedy
├── Heap / Priority Queue
├── Linked List
├── Recursion
├── Sliding Window
├── Stack & Queue
├── Strings
└── Tries
```

---

## 🎯 What It Does

1. **Log a solved DSA problem** — topic, approach, mistakes, complexity
2. **AI generates 6 flashcards** — concept, pattern recognition, mistake prevention, complexity recall
3. **Cards push directly to Anki** — organized into topic-based sub-decks

## 📚 Striver DSA Topics

Topics follow the [Striver A2Z DSA Sheet](https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2) curriculum:

`Arrays` · `Binary Search` · `Strings` · `Linked List` · `Recursion` · `Bit Manipulation` · `Stack & Queue` · `Sliding Window` · `Heap / Priority Queue` · `Greedy` · `Binary Tree` · `Binary Search Tree` · `Graph` · `Dynamic Programming` · `Tries`

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite |
| **Backend** | Express 5 (Node.js) |
| **AI Model** | Llama 3.3 70B via [Groq](https://groq.com) (free, open-source) |
| **Flashcards** | [AnkiConnect](https://ankiweb.net/shared/info/2055492159) (local REST API) |

## 🚀 Getting Started (Step-by-Step)

> **This is a local tool** — it runs on your machine and connects to your local Anki app. No cloud deployment needed.

### Step 1: Install Prerequisites

| Tool | How to Get It |
|------|---------------|
| **Node.js** (v18+) | Download from [nodejs.org](https://nodejs.org/) |
| **Anki** (desktop app) | Download from [apps.ankiweb.net](https://apps.ankiweb.net/) |
| **Groq API Key** (free) | Sign up at [console.groq.com](https://console.groq.com) → API Keys → Create |

### Step 2: Install AnkiConnect Add-on

AnkiConnect is a plugin that lets this app communicate with Anki.

1. Open **Anki**
2. Go to **Tools → Add-ons → Get Add-ons...**
3. Paste this code: `2055492159`
4. Click **OK** and **restart Anki**

> AnkiConnect runs silently in the background on port `8765` whenever Anki is open.

### Step 3: Clone & Install

```bash
# Clone the repo
git clone https://github.com/nameisahmedh/DSA-Recall-Engine.git
cd DSA-Recall-Engine
```

**Install server dependencies:**
```bash
cd server
npm install
```

**Install client dependencies:**
```bash
cd ../client/client
npm install
```

### Step 4: Add Your Groq API Key

Create a `.env` file inside the `server/` folder:

```
GROQ_API_KEY=gsk_your_actual_key_here
```

> Get your free key from [console.groq.com/keys](https://console.groq.com/keys). It's free forever with 30 requests/min.

### Step 5: Run the App

You need **3 things running** — Anki, the server, and the client:

```bash
# Terminal 1 — Start the server
cd server
node index.js
# Should show: "Server running at http://localhost:3001"
# Should show: "Groq API key: ✓ loaded"

# Terminal 2 — Start the client
cd client/client
npm run dev
# Should show: "Local: http://localhost:5173"
```

Also make sure **Anki is open** in the background.

### Step 6: Use It!

1. Open **http://localhost:5173** in your browser
2. Check the **"Anki connected"** badge is green ✅ (if red, open Anki)
3. Select a **topic** from the dropdown (e.g. Arrays)
4. Fill in your solved problem details — name, approach, mistakes, complexity
5. Click **Generate & Push →**
6. Wait a few seconds — AI generates 6 flashcards and pushes them to Anki
7. Open **Anki** → you'll see a new deck like `DSA Recall Engine::Arrays` with your cards!

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Badge shows "Anki disconnected" | Make sure Anki is open with AnkiConnect add-on installed |
| "Groq API key missing" | Check that `server/.env` has `GROQ_API_KEY=gsk_...` |
| "Rate limit reached" | Wait 1 minute and try again (free tier: 30 req/min) |
| Cards not appearing in Anki | Click the deck list refresh button in Anki, or close and reopen Anki |

## 📁 Project Structure

```
dsa-engine/
├── client/client/          # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx         # Main component + form + Anki status
│   │   ├── App.css         # Premium dark theme styling
│   │   ├── index.css       # Global styles + fonts
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   └── package.json
└── server/                 # Express backend
    ├── index.js            # API: Groq AI → AnkiConnect bridge
    ├── .env                # GROQ_API_KEY (not committed)
    └── package.json
```

## 🔑 Environment Variables

| Variable | Description | Where to get |
|----------|-------------|-------------|
| `GROQ_API_KEY` | Groq API key (free, no expiry) | [console.groq.com/keys](https://console.groq.com/keys) |

## 📄 License

MIT
