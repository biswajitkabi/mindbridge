# 🌿 MindBridge — Mental Health First Aid Chatbot

> A calm space for the hard moments.

**Live Demo:** [https://mindbridge-murex.vercel.app/](https://mindbridge-murex.vercel.app/)

---

## What I Built

MindBridge is a **mental health first aid chatbot** — purpose-built to help users navigate difficult emotional moments using evidence-based techniques, without replacing professional therapy.

It's trained on:
- **CBT (Cognitive Behavioral Therapy)** techniques — thought reframing, cognitive distortion awareness
- **DBT skills** — TIPP, PLEASE, radical acceptance, distress tolerance
- **Grounding techniques** — 5-4-3-2-1 sensory method, box breathing, body scan
- **Psychoeducation** — plain-language explanations of anxiety, burnout, grief, panic
- **Self-compassion practices** based on Kristin Neff's research
- **Crisis awareness** — always surfaces Indian crisis helplines (iCall, Vandrevala Foundation) when needed

---

## Why I Picked This Topic

Mental health is one of the most real, underserved problems globally — and in India especially. Stigma keeps people from seeking help. Therapists are expensive and inaccessible. People often reach out to friends who don't know what to say.

I wanted to build something that bridges that gap: not a replacement for therapy, but a knowledgeable, compassionate presence that speaks the right language — validating first, offering tools second, always pointing to real help when it matters most.

The chatbot is **not** a crisis service, and it says so clearly. But it knows what to do if someone is struggling — surface crisis resources immediately, with warmth.

---

## Frontend Design Decisions

### The Landing Screen
The first thing a user sees matters enormously for a mental health product. I chose:
- **Dark, organic palette** (deep greens, muted roses, dark navy) — calming, not clinical
- **Drifting orb background** — gentle movement signals safety, not urgency
- **Fraunces serif** for the title — warm, literary, human
- **Feature pills** to set expectations before the user even starts

### Conversation Design
- **Quick-start prompts** in the sidebar — reduces friction for users who don't know how to begin
- **Typing indicator** — shows the bot is "thinking," not frozen
- **Crisis banner** — surfaces helplines automatically if crisis keywords are detected, without interrupting the conversation
- **Empty state** with swaying leaf emoji — signals "this is your space" before anything is said

### Error States
- Network errors shown inline with a dismissable banner — never loses conversation context
- Loading state shows dots, not a spinner — feels more human

### Accessibility
- Keyboard navigable (Enter to send, Shift+Enter for new line)
- ARIA labels on icon buttons
- Color contrast maintained throughout dark theme

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 |
| Fonts | Fraunces (display) + DM Sans (body) |
| AI | Anthropic Claude API (claude-sonnet-4) |
| Deployment | Vercel |
| Styling | Pure CSS (custom properties, no UI library) |

---

## Setup & Local Development

```bash
git clone https://github.com/biswajitkabi/mindbridge
cd mindbridge
npm install
npm start
```

The app calls the Anthropic API directly from the browser. For production, you should proxy this through a backend to protect your API key.

---

## Crisis Resources (India)

- **iCall** (TISS): 9152987821
- **Vandrevala Foundation**: 1860-2662-345
- **Snehi**: 044-24640050
- **NIMHANS**: 080-46110007

---

*MindBridge is not a substitute for professional mental health care. If you're in crisis, please reach out to the resources above.*
