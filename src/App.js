import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const SYSTEM_PROMPT = `You are MindBridge — a compassionate, trauma-informed mental health first aid companion. You are NOT a therapist or crisis hotline, but you ARE a knowledgeable, warm, and grounding presence.

Your knowledge base includes:
- CBT (Cognitive Behavioral Therapy) techniques: thought reframing, cognitive distortions, behavioral activation
- Grounding techniques: 5-4-3-2-1 sensory method, box breathing, body scan, cold water technique
- DBT skills: TIPP, PLEASE, radical acceptance, distress tolerance
- Psychoeducation: explaining anxiety, depression, burnout, grief, panic attacks in simple language
- Crisis awareness: recognizing warning signs and always recommending professional help for serious situations
- Self-compassion practices from Kristin Neff's work
- Sleep hygiene, routine building, social connection tips

Your communication style:
- Warm, gentle, non-judgmental — like a wise friend who happens to know psychology
- Use "I notice..." and "It sounds like..." instead of diagnostic language
- Ask one focused question at a time
- Validate FIRST, then offer tools
- Never dismiss, minimize, or give toxic positivity ("just think positive!")
- If someone expresses suicidal ideation or self-harm, ALWAYS provide crisis resources: iCall (India): 9152987821, Vandrevala Foundation: 1860-2662-345, and encourage them to call immediately
- Keep responses concise (3-5 sentences max unless doing a technique walkthrough)
- Occasionally use gentle metaphors for hard feelings

You do not: diagnose, prescribe, replace therapy, or promise outcomes. You always recommend professional help for persistent symptoms.

Start by warmly greeting the user and asking what's on their mind today.`;

const QUICK_PROMPTS = [
  { emoji: "😮‍💨", text: "I'm feeling anxious" },
  { emoji: "😔", text: "I've been really low lately" },
  { emoji: "🔥", text: "I'm completely burned out" },
  { emoji: "😴", text: "I can't sleep" },
  { emoji: "😤", text: "I'm overwhelmed with stress" },
  { emoji: "💭", text: "I can't stop overthinking" },
];

const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end my life",
  "self-harm",
  "hurt myself",
  "don't want to live",
];

function TypingDots() {
  return (
    <div className="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

function Message({ msg }) {
  const isBot = msg.role === "assistant";
  return (
    <div className={`message-row ${isBot ? "bot-row" : "user-row"}`}>
      {isBot && (
        <div className="avatar bot-avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}
      <div className={`bubble ${isBot ? "bot-bubble" : "user-bubble"}`}>
        {msg.content}
      </div>
    </div>
  );
}

function CrisisBanner() {
  return (
    <div className="crisis-banner">
      <div className="crisis-icon">🆘</div>
      <div>
        <strong>If you're in crisis, please reach out now:</strong>
        <div className="crisis-links">
          <span>
            iCall (India): <a href="tel:9152987821">9152987821</a>
          </span>
          <span>
            Vandrevala Foundation: <a href="tel:18602662345">1860-2662-345</a>
          </span>
          <span>
            Snehi: <a href="tel:+914424640050">044-24640050</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const checkForCrisis = (text) => {
    return CRISIS_KEYWORDS.some((k) => text.toLowerCase().includes(k));
  };

  const startChat = async () => {
    setStarted(true);
    setLoading(true);
    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${process.env.REACT_APP_GROQ_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            max_tokens: 1000,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: "Hello" },
            ],
          }),
        },
      );
      const data = await res.json();
      const text =
        data.choices?.[0]?.message?.content ||
        "Hi, I'm MindBridge. What's on your mind?";
      setMessages([{ role: "assistant", content: text }]);
    } catch {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi, I'm MindBridge. I'm here to listen. What's on your mind today?",
        },
      ]);
    }
    setLoading(false);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    setError(null);

    if (checkForCrisis(text)) setShowCrisis(true);

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${process.env.REACT_APP_GROQ_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            max_tokens: 1000,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...newMessages,
            ],
          }),
        },
      );
      const data = await res.json();
      const botText =
        data.choices?.[0]?.message?.content ||
        "I'm here with you. Can you tell me more?";
      if (checkForCrisis(botText)) setShowCrisis(true);
      setMessages((prev) => [...prev, { role: "assistant", content: botText }]);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!started) {
    return (
      <div className="landing">
        <div className="landing-bg">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
          <div className="orb orb3"></div>
        </div>
        <div className="landing-content">
          <div className="logo-mark">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle
                cx="24"
                cy="24"
                r="22"
                stroke="#a8d5ba"
                strokeWidth="1.5"
                opacity="0.4"
              />
              <path
                d="M24 12C17.37 12 12 17.37 12 24C12 30.63 17.37 36 24 36C30.63 36 36 30.63 36 24"
                stroke="#a8d5ba"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="24" cy="24" r="4" fill="#a8d5ba" opacity="0.6" />
              <path
                d="M32 14L36 18M36 14L32 18"
                stroke="#e8b4b8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="landing-title">
            Mind<em>Bridge</em>
          </h1>
          <p className="landing-tagline">A calm space for the hard moments</p>
          <p className="landing-desc">
            Mental health first aid, grounding techniques, and a compassionate
            ear — available whenever you need it. Not a therapist, but always
            here.
          </p>

          <div className="feature-pills">
            <span className="pill">🧘 Grounding Exercises</span>
            <span className="pill">💭 CBT Techniques</span>
            <span className="pill">😮‍💨 Breathing Tools</span>
            <span className="pill">📚 Psychoeducation</span>
          </div>

          <button className="start-btn" onClick={startChat}>
            <span>Begin your session</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <p className="disclaimer">
            MindBridge is not a crisis service. If you're in immediate danger,
            please call <strong>iCall: 9152987821</strong> or your local
            emergency services.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-logo">
          <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
            <circle
              cx="24"
              cy="24"
              r="22"
              stroke="#a8d5ba"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <path
              d="M24 12C17.37 12 12 17.37 12 24C12 30.63 17.37 36 24 36C30.63 36 36 30.63 36 24"
              stroke="#a8d5ba"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="24" cy="24" r="4" fill="#a8d5ba" opacity="0.7" />
          </svg>
          <span>MindBridge</span>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">Quick start</p>
          {QUICK_PROMPTS.map((p, i) => (
            <button
              key={i}
              className="quick-btn"
              onClick={() => sendMessage(p.text)}
            >
              <span className="quick-emoji">{p.emoji}</span>
              <span>{p.text}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="crisis-mini">
            <p className="sidebar-label">Crisis support</p>
            <p className="crisis-mini-line">📞 iCall: 9152987821</p>
            <p className="crisis-mini-line">📞 Vandrevala: 1860-2662-345</p>
          </div>
          <p className="sidebar-disclaimer">
            Not a substitute for professional care.
          </p>
        </div>
      </div>

      <div className="chat-area">
        <div className="chat-header">
          <div className="header-info">
            <div className="status-dot"></div>
            <div>
              <h2>Your session</h2>
              <p>Compassionate · Confidential · Present</p>
            </div>
          </div>
          <button
            className="new-session-btn"
            onClick={() => {
              setMessages([]);
              setStarted(false);
              setShowCrisis(false);
            }}
          >
            New session
          </button>
        </div>

        {showCrisis && <CrisisBanner />}

        <div className="messages-area">
          {messages.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-icon">🌿</div>
              <p>This is your space. No judgment here.</p>
              <p className="empty-sub">
                Use the quick starts on the left, or just type what's on your
                mind.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}

          {loading && (
            <div className="message-row bot-row">
              <div className="avatar bot-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="bubble bot-bubble">
                <TypingDots />
              </div>
            </div>
          )}

          {error && (
            <div className="error-banner">
              ⚠️ {error}
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Share what's on your mind..."
              rows={1}
              disabled={loading}
            />
            <button
              className={`send-btn ${input.trim() && !loading ? "active" : ""}`}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <p className="input-hint">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
