import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:3001";

const STRIVER_TOPICS = [
  "Arrays",
  "Binary Search",
  "Strings",
  "Linked List",
  "Recursion",
  "Bit Manipulation",
  "Stack & Queue",
  "Sliding Window",
  "Heap / Priority Queue",
  "Greedy",
  "Binary Tree",
  "Binary Search Tree",
  "Graph",
  "Dynamic Programming",
  "Tries",
];

const FIELDS = [
  { key: "problemName", label: "Problem Name", placeholder: "e.g. Two Sum", type: "input" },
  {
    key: "topic",
    label: "Topic",
    type: "select",
    options: STRIVER_TOPICS,
  },
  {
    key: "difficulty",
    label: "Difficulty",
    type: "select",
    options: ["Easy", "Medium", "Hard"],
  },
  { key: "pattern", label: "Pattern", placeholder: "e.g. Sliding Window, Two Pointers", type: "input" },
  { key: "approach", label: "Approach", placeholder: "Describe your approach in a few lines…", type: "textarea" },
  { key: "mistakes", label: "Mistakes / Learnings", placeholder: "What went wrong or what to remember…", type: "textarea" },
  { key: "timeComplexity", label: "Time Complexity", placeholder: "e.g. O(n)", type: "input" },
  { key: "spaceComplexity", label: "Space Complexity", placeholder: "e.g. O(1)", type: "input" },
];

export default function App() {
  const [form, setForm] = useState(
    Object.fromEntries(FIELDS.map((f) => [f.key, ""]))
  );
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ankiStatus, setAnkiStatus] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/api/anki-status`)
      .then((r) => setAnkiStatus(r.data))
      .catch(() => setAnkiStatus({ connected: false, error: "Server not reachable" }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/submit`, form);
      if (res.data.success) {
        setStatus({
          type: "success",
          msg: `${res.data.cardsAdded} of ${res.data.cardsGenerated} flashcards → ${res.data.deck} 🚀`,
        });
        setForm(Object.fromEntries(FIELDS.map((f) => [f.key, ""])));
      } else {
        setStatus({ type: "error", msg: res.data.error || "Something went wrong." });
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Cannot reach server.";
      setStatus({ type: "error", msg });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    if (field.type === "select") {
      return (
        <select name={field.key} value={form[field.key]} onChange={handleChange}>
          <option value="" disabled>Select {field.label.toLowerCase()}</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }
    if (field.type === "textarea") {
      return (
        <textarea
          name={field.key}
          placeholder={field.placeholder}
          value={form[field.key]}
          onChange={handleChange}
          rows={3}
        />
      );
    }
    return (
      <input
        name={field.key}
        placeholder={field.placeholder}
        value={form[field.key]}
        onChange={handleChange}
      />
    );
  };

  return (
    <div>
      <div className="app-header">
        <div className="icon-row">
          <span className="emoji">⚡</span>
          <h1>DSA Recall Engine</h1>
        </div>
        <p className="subtitle">Log problems, generate Anki flashcards, and build long-term retention.</p>

        {ankiStatus && (
          <div className={`anki-badge ${ankiStatus.connected ? "connected" : "disconnected"}`}>
            <span className="status-dot" />
            {ankiStatus.connected
              ? `Anki connected (v${ankiStatus.version})`
              : ankiStatus.error}
          </div>
        )}
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="section-label">
            <span className="dot" />
            Problem Details
          </div>

          <div className="field-group">
            <label>Problem Name</label>
            {renderField(FIELDS[0])}
          </div>

          <div className="field-row">
            <div className="field-group">
              <label>Topic (Sub-deck)</label>
              {renderField(FIELDS[1])}
            </div>
            <div className="field-group">
              <label>Difficulty</label>
              {renderField(FIELDS[2])}
            </div>
          </div>

          <div className="field-group">
            <label>Pattern</label>
            {renderField(FIELDS[3])}
          </div>

          <div className="divider" />

          <div className="section-label">
            <span className="dot" />
            Notes &amp; Analysis
          </div>

          {FIELDS.slice(4, 6).map((field) => (
            <div className="field-group" key={field.key}>
              <label>{field.label}</label>
              {renderField(field)}
            </div>
          ))}

          <div className="divider" />

          <div className="section-label">
            <span className="dot" />
            Complexity
          </div>

          <div className="field-row">
            {FIELDS.slice(6).map((field) => (
              <div className="field-group" key={field.key}>
                <label>{field.label}</label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Generating flashcards…
              </>
            ) : (
              <>
                Generate & Push
                <span className="arrow">→</span>
              </>
            )}
          </button>
        </form>

        {status && (
          <div className={`toast ${status.type}`}>
            <span>{status.type === "success" ? "✓" : "✕"}</span>
            {status.msg}
          </div>
        )}
      </div>

      <div className="app-footer">
        <p>Powered by Llama 3.3 (Groq) + AnkiConnect · Striver DSA Sheet</p>
      </div>
    </div>
  );
}