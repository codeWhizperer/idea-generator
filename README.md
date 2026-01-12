# Idea Generator

> Transform your startup ideas into comprehensive strategic plans with AI-powered analysis

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 📖 Overview

Idea Generator is an AI-powered tool for capturing, evolving, and planning startup ideas over time.

It is inspired by a tweet from [@jacalulu](https://x.com/jacalulu) describing the frustration of having too many ideas, constant inspiration, and not enough time to properly develop them. The core idea is simple:

> Capture ideas instantly.  
> Let context accumulate over time.  
> Turn raw thoughts into structured plans when you’re ready.

Idea Generator takes this concept further by using AI to transform raw ideas into **clear, structured, and actionable startup strategies** — covering problem definition, solution design, MVP scope, go-to-market, monetization, and risk validation.


![tweet](/public/idea-generator%20tweet.jpeg)

### What It Does

-  **AI-Powered Analysis**: Leverages GPT-4o to generate comprehensive business strategies
-  **Structured Output**: Returns organized plans with 6 key sections
-  **Real-time Streaming**: Watch your strategic plan materialize in real-time
-  **Persistent Storage**: Saves all your ideas locally for future reference
-  **Beautiful UI**: Clean, modern interface with color-coded sections

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                                  │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐     │
│  │   Dashboard (/)   │    │  New Idea Page   │    │ Strategy Detail  │     │
│  │                   │    │   (/new-idea)    │    │  (/strategy/id)  │     │
│  │  - List Ideas     │◄──►│  - Input Form    │    │  - View Plan     │     │
│  │  - Search/Filter  │    │  - Generate Btn  │    │  - Full Details  │     │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘     │
│                                    │                                         │
│                                    ▼                                         │
│                          ┌──────────────────┐                               │
│                          │  localStorage     │                               │
│                          │  (Client-side)    │                               │
│                          └──────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP POST
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS API LAYER                                     │
│                         /api/chat Route                                      │
│                                    │                                         │
│                                    ▼                                         │
│                          ┌──────────────────┐                               │
│                          │  Cencori SDK     │                               │
│                          │  - Auth          │                               │
│                          │  - Streaming     │                               │
│                          │  - Error Handle  │                               │
│                          └──────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          OPENAI API (GPT-4o)                                 │
│                      Generates Strategic JSON                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input → API Route → Cencori SDK → GPT-4o → Stream Response → Parse JSON → Display UI → Save localStorage
```

**Step-by-step Process:**

1. **User Input**: User fills form with idea title, description, and tags
2. **API Request**: POST to `/api/chat` with idea data
3. **AI Processing**: Cencori SDK sends structured prompt to GPT-4o
4. **Streaming Response**: AI generates JSON incrementally (20-30 seconds)
5. **Real-time Display**: Frontend shows loading state, then formatted sections
6. **Persistence**: User saves idea to localStorage
7. **Review**: Access saved ideas from dashboard or detail page

### Why Cencori SDK?

| Without Cencori | With Cencori |
|----------------|--------------|
| ~100+ lines of boilerplate | ~15 lines of clean code |
| Manual API key management | Automatic authentication |
| Complex streaming setup | Built-in `chatStream()` |
| Custom error handling | Automatic retry logic |
| No type safety | Full TypeScript support |

**Example:**
```typescript
// Clean, simple integration
const stream = cencori.ai.chatStream({
  model: 'gpt-4o',
  messages,
  max_tokens: 4096
});

for await (const chunk of stream) {
  controller.enqueue(encoder.encode(chunk.delta));
}
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Cencori SDK → GPT-4o (via OpenAI)
- **Storage**: localStorage (browser-based persistence)
- **Streaming**: Server-Sent Events (SSE) via ReadableStream

## ✨ Key Features

- ✨ **Real-time streaming** of AI responses with visual feedback
- 🛡️ **Robust JSON parsing** with error handling and recovery
- 🎨 **Beautiful formatted output** with color-coded sections:
  -  Problem Statement (Red)
  -  Proposed Solution (Green)
  -  MVP Scope (Purple)
  -  Go-to-Market Strategy (Blue)
  -  Monetization (Green)
  -  Risks & Validation (Orange)
-  **Persistent storage** across sessions
-  **Fully responsive** design
-  **Optimistic UI** updates during generation

##  Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Cencori API account ([Sign up here](https://cencori.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/codeWhizperer/idea-generator.git
   cd idea-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Cencori API**
   - Create an account at [cencori.com](https://cencori.com)
   - Generate an API key from your dashboard
   - See [Cencori Documentation](https://cencori.com/docs) for details

4. **Configure environment variables**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   ```
   
   Add your API key:
   ```env
   CENCORI_API_KEY=your_api_key_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

##  Usage

1. Navigate to `/new-idea` page
2. Fill in your idea details:
   - **Title**: A compelling name for your idea
   - **Description**: Detailed explanation of the problem and solution
   - **Tags**: Categories (e.g., SaaS, AI, B2B)
3. Click "Generate AI Strategy"
4. Wait 20-30 seconds for the complete strategic plan
5. Review the formatted output with 6 key sections
6. Click "Save Idea" to store in localStorage
7. Access saved ideas from the dashboard

##  Customization

### AI Model Selection

Cencori supports multiple AI models. Update in `route.ts`:

```typescript
const stream = cencori.ai.chatStream({
  model: 'gpt-4o',        // Options: gpt-4o, claude-3-opus, gemini-pro
  messages,
  max_tokens: 4096
});
```

See [Cencori Models Documentation](https://cencori.com/docs/concepts/models) for all available models.

### System Prompt Customization

The AI's behavior is controlled by `IDEA_GENERATOR_SYSTEM_PROMPT` in `/lib/prompt.ts`. Modify this to:
- Change output structure
- Adjust tone and style
- Add industry-specific knowledge
- Customize section requirements

**Example structure:**
```typescript
export const IDEA_GENERATOR_SYSTEM_PROMPT = `
You are a world-class startup strategist...

Response Format:
{
  "title": "...",
  "problem": [...],
  "solution": [...],
  "mvp": [...],
  "goToMarket": [...],
  "monetization": [...],
  "risksValidation": [...]
}
`;
```

## ⚠️ Limitations

### 1. Free Tier Constraints
- Running on Cencori's free plan
- Shared API key may experience latency under heavy load
- Rate limiting may apply during peak usage

### 2. Prompt Design
- Current prompt optimized for startup/business ideas
- May not be ideal for all use cases (academic research, creative writing, etc.)
- Feel free to customize for your specific needs

### 3. Data Persistence
- Ideas stored in browser localStorage
- **Clearing browser data will delete all saved ideas**
- No cloud backup or cross-device sync
- Consider exporting important ideas manually

### 4. Browser Compatibility
- Requires modern browser with localStorage support
- Streaming requires ReadableStream API support
- Best experience on Chrome, Firefox, Safari, Edge (latest versions)


## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style (TypeScript + ESLint)
- Add comments for complex logic
- Update README if adding new features
- Test thoroughly before submitting PR


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

**This project is for educational purposes only.** 

- Not intended for production use without modifications
- No warranty or support provided
- Use at your own risk
- Always review AI-generated content critically

## 🙏 Acknowledgments

- Inspired by [@jacululu's tweet](https://twitter.com/jacululu) on AI-assisted ideation
- Powered by [Cencori SDK](https://cencori.com)
- Built with [Next.js](https://nextjs.org)
- UI components from [Lucide React](https://lucide.dev)

## 📬 Contact

**Ademola Kelvin** - [@codewhizper](https://x.com/codewhizperer)

Project Link: [https://github.com/codeWhizperer/idea-generator](https://github.com/codeWhizperer/idea-generator)

---

⭐ **If you find this project useful, please consider giving it a star!**

🍴 **Fork it and build something amazing!**