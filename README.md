# Omni-Supervisor - AI Observability Dashboard

Real-time monitoring dashboard for AI chatbot conversations with automatic detection of hallucinations and user frustration.

## Features

- **Real-time Chat Monitoring**: View all active conversations in a clean, organized interface
- **Live AI Conversations**: Chat with real OpenAI GPT-4o in real-time via Vercel AI SDK
- **Sentiment Analysis**: Automatically detect user frustration using negative keyword detection
- **Hallucination Detection**: Compare bot responses against a knowledge base to catch incorrect information
- **Risk Classification**: Conversations are categorized as Safe, Warning, Critical, or Hallucination
- **Human Intervention**: Take over high-risk conversations with a single click
- **Simulated Conversations**: Generates realistic test conversations on startup for demo purposes

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **AI**: Vercel AI SDK with OpenAI GPT-4o
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=sk-proj-your-key-here
```

#### How to Get an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key and paste it into your `.env.local` file

**Important**: Never commit your `.env.local` file to version control. It's already included in `.gitignore`.

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

## Real AI Integration

### Using the "New Live Chat" Feature

1. Click the **"New Live Chat"** button in the top-right corner of the dashboard
2. Enter a user name for the conversation
3. Click **"Start Chat"** to begin
4. Type messages and receive real-time responses from OpenAI GPT-4o
5. The supervisor monitors every AI response in real-time
6. Risk alerts appear automatically when issues are detected

### How Supervisor Monitoring Works with Real AI

The supervisor engine evaluates each AI response using the same logic as simulated chats:

1. **User sends a message** → Forwarded to OpenAI GPT-4o
2. **AI streams response** → Displayed in real-time
3. **Supervisor evaluates** → Runs `evaluateResponse()` on completion
4. **Risk detection** → Alerts appear for sentiment issues or hallucinations
5. **Chat classification** → Risk level badge updates automatically

### Cost Considerations

- OpenAI charges per token (input + output)
- GPT-4o pricing: ~$5 per 1M input tokens, ~$15 per 1M output tokens
- Typical conversation: 100-500 tokens per message
- Estimated cost: $0.001-0.01 per message exchange
- **Recommendation**: Set usage limits in your OpenAI account settings

### Development vs Production Setup

**Development:**
- Use your personal OpenAI API key
- Test with small conversations
- Monitor usage in OpenAI dashboard

**Production:**
- Use organization API keys
- Implement rate limiting
- Add conversation persistence (database)
- Monitor costs and usage metrics
- Consider caching for repeated queries

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # OpenAI API endpoint
│   ├── layout.tsx             # Root layout with metadata
│   ├── page.tsx               # Main page
│   └── globals.css            # Global styles
├── components/
│   ├── dashboard.tsx          # Main dashboard container
│   ├── chat-list.tsx          # Left panel - chat list
│   ├── chat-details.tsx       # Right panel - simulated chats
│   ├── live-chat.tsx          # Real-time AI chat component
│   └── alert-badge.tsx        # Risk level indicators
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   ├── supervisor-engine.ts   # Risk evaluation logic
│   └── simulation.ts          # Conversation generator
├── store/
│   └── chat-store.ts          # Zustand store
└── data/
    └── knowledgeBase.json     # Ground truth policies
```

## How It Works

### Supervisor Engine

The supervisor engine evaluates each bot response using two critical rules:

1. **Sentiment Analysis**: Detects negative keywords indicating user frustration
2. **Grounding Check**: Compares responses against the knowledge base to detect hallucinations

### Risk Levels

- 🟢 **Safe**: No issues detected
- 🟡 **Warning**: Minor concerns
- 🔴 **Critical**: User shows frustration (negative keywords detected)
- 🟣 **Hallucination**: Bot provided incorrect information (policy mismatch)

### Intervention

When a conversation is flagged as Critical or Hallucination, a prominent "TAKE OVER CONVERSATION" button appears, allowing human supervisors to intervene immediately.

### Testing the Supervisor

The AI is instructed to occasionally make small policy errors (e.g., "60-day refund" instead of 30 days) to demonstrate the hallucination detection system. In production, you would remove this instruction from the system prompt.

**Test Scenarios:**

1. **Frustrated User Detection**
   - Type: "This is stupid, where is my order?"
   - Expected: Red alert appears, chat marked as Critical

2. **Hallucination Detection**
   - Ask: "What's your refund policy?"
   - AI might say: "We offer 60-day refunds" (intentional error)
   - Expected: Purple alert appears, chat marked as Hallucination

## Security

- ✅ API key stored in environment variable only
- ✅ API key never exposed to client
- ✅ `.env.local` excluded from version control
- ✅ API route validates key exists before processing
- ✅ Error messages don't leak sensitive information

## License

MIT