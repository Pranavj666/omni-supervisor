# Omni-Supervisor - AI Observability Dashboard

Real-time monitoring dashboard for AI chatbot conversations with automatic detection of hallucinations and user frustration.

## Features

- **Real-time Chat Monitoring**: View all active conversations in a clean, organized interface
- **Sentiment Analysis**: Automatically detect user frustration using negative keyword detection
- **Hallucination Detection**: Compare bot responses against a knowledge base to catch incorrect information
- **Risk Classification**: Conversations are categorized as Safe, Warning, Critical, or Hallucination
- **Human Intervention**: Take over high-risk conversations with a single click
- **Simulated Conversations**: Generates realistic test conversations on startup

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── dashboard.tsx      # Main dashboard container
│   ├── chat-list.tsx      # Left panel - chat list
│   ├── chat-details.tsx   # Right panel - chat details
│   └── alert-badge.tsx    # Risk level indicators
├── lib/                   # Core logic
│   ├── types.ts           # TypeScript interfaces
│   ├── supervisor-engine.ts  # Risk evaluation
│   └── simulation.ts      # Conversation generator
├── store/                 # State management
│   └── chat-store.ts      # Zustand store
└── data/                  # Static data
    └── knowledgeBase.json # Ground truth policies
```

## How It Works

### Supervisor Engine

The supervisor engine evaluates each bot response using two critical rules:

1. **Sentiment Analysis**: Detects negative keywords indicating user frustration
2. **Grounding Check**: Compares responses against the knowledge base to detect hallucinations

### Risk Levels

- 🟢 **Safe**: No issues detected
- 🟡 **Warning**: Minor concerns
- 🔴 **Critical**: User shows frustration
- 🟣 **Hallucination**: Bot provided incorrect information

### Intervention

When a conversation is flagged as Critical or Hallucination, a prominent "TAKE OVER CONVERSATION" button appears, allowing human supervisors to intervene immediately.

## License

MIT