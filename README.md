<div align="center">

<img src="./assets/hero.svg" alt="NavGPT — your conversations, beautifully connected" width="100%" />

<br />

[![Next.js](https://img.shields.io/badge/Next.js_16-13221E?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-10A37F?style=for-the-badge&logo=openai&logoColor=white)](https://platform.openai.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Clerk](https://img.shields.io/badge/Clerk-BD955F?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)

**An AI conversation workspace that combines the familiarity of chat with the engineering of a full-stack application.**

[Explore features](#-the-experience) · [See how it works](#-behind-the-conversation) · [Architecture](#-architecture) · [Run locally](#-run-it-locally)

</div>

---

## Meet NavGPT

NavGPT is a ChatGPT-inspired application built with **Next.js 16**. Sign in, start a conversation, watch OpenAI-powered replies stream into the interface, and return to your chats whenever you need them. Pin a favorite, rename a thread, archive old discussions, and switch between light and dark modes.

What makes it interesting is the full stack behind the experience: **Clerk handles identity, the Vercel AI SDK handles streaming, Prisma + PostgreSQL preserve the conversation, and TanStack Query keeps the client in sync.** Rather than treating the app as a one-page demo, the codebase is organized by feature so it remains understandable as it grows.

> **Designed for natural conversations. Engineered for the details behind them.**

## The experience

<img src="./assets/feature-strip.svg" width="100%" alt="NavGPT features: real-time streaming, persistent history, personalized workspace, and polished user interface" />

| | Feature | The experience |
| :--: | :-- | :-- |
| ⚡ | **Live AI responses** | Responses stream through `POST /api/chat` instead of waiting for a full completion. |
| 🧠 | **Persistent memory of the thread** | Conversations and messages are stored in PostgreSQL, including AI SDK `parts` for reconstruction. |
| 🗂️ | **Conversation control** | Create, rename, pin, archive, and delete chats from a dedicated sidebar. |
| 🔐 | **Personal workspace** | Clerk email/social sign-in with first-visit database onboarding. |
| 🌗 | **Light or dark** | Theme switching powered by `next-themes`. |
| 🔄 | **Responsive state** | TanStack Query manages fetching, caching, and invalidation. |

> [!NOTE]
> The hero above is a **concept illustration**, not a captured product screenshot. Replace or complement it with a real UI screenshot/GIF when you have one.

## 🪄 Behind the conversation

From the first sign-in to the last token, the app connects authentication, routing, model streaming, and persistence into one flow.

```mermaid
flowchart LR
    A[Sign in with Clerk] --> B[Onboard user]
    B --> C[Create or open chat]
    C --> D[POST /api/chat]
    D --> E[Vercel AI SDK + OpenAI]
    E -->|Stream| F[Chat interface]
    D <-->|Save / restore| G[(PostgreSQL + Prisma)]
    F --> H[Chat sidebar / history]
    G --> H
```

**A typical session:**

1. **Sign in.** Clerk authenticates the user; first-visit onboarding syncs them into the database.
2. **Start talking.** The home route creates a conversation and redirects to `/c/[id]`.
3. **See the answer arrive.** The chat endpoint streams AI output through the Vercel AI SDK.
4. **Keep the conversation.** Message content and structured parts are persisted for later reconstruction.
5. **Pick up where you left off.** Reopen, pin, rename, archive, or delete chats using the sidebar.

## 🏗️ Architecture

NavGPT uses **feature-first organization**. Each domain owns its own actions, hooks, components, and utilities. Shared infrastructure stays shared, and application routes stay focused on composition and navigation.

```mermaid
flowchart TB
  subgraph UI[Next.js App Router]
    P[Authenticated pages + ChatShell]
    Q[TanStack Query + Theme]
  end
  subgraph Features[Feature modules]
    AU[auth]
    CO[conversation]
    ME[messages]
    AI[ai]
    HO[home]
  end
  subgraph Services[External services]
    CL[Clerk]
    OA[OpenAI]
    PG[(PostgreSQL)]
  end
  P --> Q
  P --> Features
  AU --> CL
  CO --> PG
  ME --> PG
  AI --> OA
  AI --> PG
  HO --> CO
```

<details>
<summary><b>Explore the folder structure</b></summary>

```text
app/
├── (auth)/                   Public sign-in routes
├── (root)/                   Authenticated routes
│   ├── layout.tsx            Route protection, onboarding, ChatShell
│   ├── page.tsx              Create a chat and redirect
│   └── c/[id]/page.tsx       Conversation and messages
├── api/chat/route.ts         AI streaming endpoint
└── layout.tsx                Global providers

features/
├── auth/                     Clerk helpers: requireUser, onBoard
├── conversation/             CRUD, sidebar, chat shell
├── messages/                 CRUD, thread, composer, bubbles
├── ai/                       Model configuration, chat-store
└── home/                     New-chat route logic

components/
├── ui/                       shadcn/ui primitives
├── ai-elements/              AI chat UI elements
└── providers/                Query + theme providers

lib/                          Shared db, query keys, utilities
prisma/                       Schema and migrations
```

Each feature exports a barrel `index.ts`:

```ts
import { useConversations } from "@/features/conversation";
```

**Adding a feature?** Prefer extending or creating a feature module. Keep `lib/` and shared `components/` for genuinely cross-feature code.

</details>

## 🧩 The stack

| Layer | Built with | Why it belongs |
| :-- | :-- | :-- |
| Framework | [Next.js 16](https://nextjs.org/) | App Router and Server Actions |
| Language | [TypeScript](https://www.typescriptlang.org/) | Typed application code |
| Authentication | [Clerk](https://clerk.com/) | Email/social sign-in and identity |
| Database | [PostgreSQL](https://www.postgresql.org/) + [Prisma](https://www.prisma.io/) (`@prisma/adapter-pg`) | Persistent relational data |
| AI | [Vercel AI SDK](https://ai-sdk.dev/) + `@ai-sdk/openai` | Model integration and streaming |
| Server state | [TanStack Query](https://tanstack.com/query) | Cache, fetch, and invalidation |
| Interface | Tailwind CSS v4, shadcn/ui, Base UI | UI styling and components |
| Theming | `next-themes` | Light/dark appearance |

## 🗃️ Data that stays with the conversation

```mermaid
erDiagram
  USER ||--o{ CONVERSATION : owns
  CONVERSATION ||--o{ MESSAGE : contains
  USER {
    string clerkId
  }
  CONVERSATION {
    string title
    boolean isPinned
    boolean isArchived
    datetime lastMessageAt
  }
  MESSAGE {
    string content
    json parts
  }
```

- **User** links the app account to Clerk through `clerkId`.
- **Conversation** stores the title, pin/archive status, and `lastMessageAt` for ordering the sidebar.
- **Message** saves both plain-text `content` and the AI SDK's structured `parts` so the thread can be reconstructed.

Browse your local data with `npx prisma studio`.

## 🚀 Run it locally

### Prerequisites

- Node.js **20+** (or [Bun](https://bun.sh/); a `bun.lock` is provided)
- A running **PostgreSQL** database
- A **[Clerk application](https://dashboard.clerk.com/)**
- An **[OpenAI API key](https://platform.openai.com/api-keys)**

### 01 / Install

Clone this repository, enter the project directory, and install dependencies:

```bash
npm install
# or
bun install
```

### 02 / Configure

```bash
cp .env.example .env
```

Set your own values in `.env`:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
OPENAI_API_KEY="your_openai_api_key"
```

> [!CAUTION]
> Never commit a populated `.env` file or share real API keys. Keep `.env.example` placeholder-only.

### 03 / Prepare the database

```bash
npx prisma migrate dev
```

Applies the existing migrations and generates the Prisma client into `lib/generated/prisma`.

### 04 / Launch

```bash
npm run dev
```

Open **http://localhost:3000**. Sign in and NavGPT will onboard your account and take you into a new conversation.

<details>
<summary><b>Available scripts</b></summary>

| Command | Purpose |
| :-- | :-- |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Explore local database records |

</details>

---

<div align="center">

### Built for the joy of building.

**NavGPT** explores what it takes to build a complete AI-powered product — from the first streamed token to the saved conversation you return to tomorrow.

`Next.js` · `TypeScript` · `AI SDK` · `Prisma` · `PostgreSQL`

<sub>Made with care, curiosity, and a lot of conversations. ✦</sub>

</div>
