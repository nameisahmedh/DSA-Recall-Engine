require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";
const ANKI_URL = "http://127.0.0.1:8765";

async function ankiRequest(action, params = {}) {
  const res = await fetch(ANKI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, version: 6, params }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`AnkiConnect: ${data.error}`);
  return data.result;
}

app.get("/api/anki-status", async (_req, res) => {
  try {
    const version = await ankiRequest("version");
    const decks = await ankiRequest("deckNames");
    res.json({ connected: true, version, decks });
  } catch (err) {
    res.json({
      connected: false,
      error: "Cannot reach AnkiConnect. Make sure Anki is open with AnkiConnect add-on installed.",
    });
  }
});

app.post("/api/submit", async (req, res) => {
  const { problemName, topic, difficulty, approach, mistakes, pattern, timeComplexity, spaceComplexity } = req.body;

  try {
    console.log("Generating flashcards via Groq (Llama 3.3 70B)...");

    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert DSA tutor. Generate flashcards as a JSON object with a "cards" array.
Each card: { "front": "question", "back": "answer", "tags": ["DSA::${topic}", "${difficulty}"] }
Generate exactly: 2 Concept cards, 2 Pattern recognition cards, 1 Mistake prevention card, 1 Complexity recall card.
Return ONLY the JSON object.`,
        },
        {
          role: "user",
          content: `Problem: ${problemName}
Topic: ${topic}
Difficulty: ${difficulty}
Approach: ${approach}
Mistakes: ${mistakes}
Pattern: ${pattern}
Time: ${timeComplexity}
Space: ${spaceComplexity}`,
        },
      ],
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    const cards = parsed.cards || parsed;
    console.log(`Generated ${cards.length} flashcards`);

    const deckName = `DSA Recall Engine::${topic}`;
    await ankiRequest("createDeck", { deck: deckName });

    const results = [];
    for (const card of cards) {
      try {
        const noteId = await ankiRequest("addNote", {
          note: {
            deckName,
            modelName: "Basic",
            fields: { Front: card.front, Back: card.back },
            tags: card.tags || [],
            options: { allowDuplicate: true },
          },
        });
        results.push({ front: card.front, noteId, status: "added" });
      } catch (err) {
        results.push({ front: card.front, status: "failed", error: err.message });
      }
    }

    const added = results.filter((r) => r.status === "added").length;
    console.log(`Pushed ${added}/${cards.length} cards to ${deckName}`);
    res.json({ success: true, cardsGenerated: cards.length, cardsAdded: added, deck: deckName, results });
  } catch (error) {
    console.error("Submit error:", error.message);

    let userMessage = error.message;
    if (error.message.includes("ECONNREFUSED") && error.message.includes("8765")) {
      userMessage = "Cannot reach AnkiConnect. Make sure Anki is open with the AnkiConnect add-on.";
    } else if (error.message.includes("API key") || error.message.includes("401")) {
      userMessage = "Invalid or missing Groq API key. Check your .env file.";
    } else if (error.message.includes("429") || error.message.includes("rate")) {
      userMessage = "Rate limit reached. Wait a moment and try again.";
    }

    res.status(500).json({ success: false, error: userMessage });
  }
});

app.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
  console.log("Model:", MODEL, "(open-source, via Groq)");
  console.log("Groq API key:", process.env.GROQ_API_KEY ? "✓ loaded" : "✕ MISSING");
});