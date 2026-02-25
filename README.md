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

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Anki](https://apps.ankiweb.net/) desktop app
- [AnkiConnect add-on](https://ankiweb.net/shared/info/2055492159) — open Anki → Tools → Add-ons → Get Add-ons → paste code `2055492159`
- Free [Groq API key](https://console.groq.com/keys)

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/dsa-engine.git
cd dsa-engine

# Server
cd server
npm install
echo "GROQ_API_KEY=your_key_here" > .env
node index.js

# Client (new terminal)
cd client/client
npm install
npm run dev
```

### Usage

1. Open **Anki** (AnkiConnect starts automatically)
2. Go to **http://localhost:5173**
3. Verify the **"Anki connected"** badge is green ✅
4. Select a **topic**, fill in the problem details
5. Click **Generate & Push**
6. Open Anki → check `DSA Recall Engine::YourTopic` deck

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
