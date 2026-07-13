# CampaignOS – AI Marketing Decision Operating System

> **Hackathon MVP** – An AI-powered platform that automates marketing campaign approvals using multi-agent consensus (Marketing, Finance, Sales).

![Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Stack](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Stack](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Stack](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)
![Stack](https://img.shields.io/badge/OpenAI-GPT-412991?logo=openai&logoColor=white)

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    React + Vite Client                    │
│   Dashboard │ New Campaign │ Approval Queue │ History     │
└─────────────────────┬────────────────────────────────────┘
                      │ REST API (/api)
┌─────────────────────▼────────────────────────────────────┐
│                   Express.js Server                       │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Campaign   │  │  AI Agents   │  │  Integrations    │  │
│  │  CRUD       │  │  • Marketing │  │  • Notion        │  │
│  │             │  │  • Finance   │  │  • Slack          │  │
│  │             │  │  • Sales     │  │  • Email          │  │
│  └──────┬─────┘  │  • Orchestr. │  └──────────────────┘  │
│         │        └──────────────┘                         │
│  ┌──────▼─────┐                                          │
│  │  SQLite DB  │                                          │
│  └────────────┘                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

| Path | Description |
|------|-------------|
| `client/` | React + Vite frontend |
| `client/src/components/` | Reusable UI components (Sidebar, Navbar, StatsCard, etc.) |
| `client/src/pages/` | Page-level components (Dashboard, NewCampaign, ApprovalQueue, History) |
| `client/src/services/api.js` | Axios API client |
| `server/` | Express.js backend |
| `server/db/` | SQLite database initialization |
| `server/routes/` | Express route definitions |
| `server/controllers/` | Request handler logic |
| `server/services/` | Database query helpers |
| `server/ai/` | AI agent modules + orchestrator |
| `server/integrations/` | Notion, Slack, Email integrations |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm

### 1. Clone and Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your API keys (or leave MOCK_AI=true for demo)
```

### 3. Run the App

**Terminal 1 – Server:**
```bash
cd server
npm run dev
```

**Terminal 2 – Client:**
```bash
cd client
npm run dev
```

- **Client:** http://localhost:3000
- **Server:** http://localhost:5000

### 4. Mock AI Mode (No API Keys Needed)

Set `MOCK_AI=true` in `server/.env` to use hardcoded agent responses. Perfect for demos!

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/campaigns` | Create a new campaign |
| `GET` | `/api/campaigns` | List all campaigns |
| `GET` | `/api/campaigns/:id` | Get campaign details + agent results |
| `POST` | `/api/campaigns/:id/agents` | Run all 3 AI agents |
| `POST` | `/api/campaigns/:id/consensus` | Compute multi-agent consensus |
| `POST` | `/api/campaigns/approve/:id` | Approve campaign + fire integrations |
| `GET` | `/api/health` | Health check |

### Example cURL Commands

**Create a campaign:**
```bash
curl -X POST http://localhost:5000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Campaign","product":"Widget X","objective":"Brand awareness","audience":"Young adults 18-30","budget":80000,"startDate":"2026-07-13","endDate":"2026-08-13"}'
```

**Run AI agents:**
```bash
curl -X POST http://localhost:5000/api/campaigns/1/agents
```

**Get consensus:**
```bash
curl -X POST http://localhost:5000/api/campaigns/1/consensus
```

**Approve campaign:**
```bash
curl -X POST http://localhost:5000/api/campaigns/approve/1
```

**List all campaigns:**
```bash
curl http://localhost:5000/api/campaigns
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `MOCK_AI` | Skip real API calls (`true`/`false`) | No |
| `OPENAI_API_KEY` | OpenAI API key for agents | Only if `MOCK_AI=false` |
| `NOTION_TOKEN` | Notion integration token | No |
| `NOTION_DATABASE_ID` | Notion database ID | No |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook URL | No |
| `EMAIL_SMTP_HOST` | SMTP server hostname | No |
| `EMAIL_SMTP_PORT` | SMTP port (default: 587) | No |
| `EMAIL_USER` | SMTP username | No |
| `EMAIL_PASS` | SMTP password | No |
| `EMAIL_TO` | Default recipient email | No |

> ⚠️ **All integrations gracefully skip if credentials aren't configured.** Only `MOCK_AI` affects functionality.

---

## 🤖 AI Agent Workflow

1. **Campaign Submitted** → stored in SQLite
2. **Marketing Agent** → evaluates audience reach, channel fit, creative alignment
3. **Finance Agent** → analyzes ROI, cost efficiency, budget optimization
4. **Sales Agent** → assesses pipeline impact, revenue potential
5. **Orchestrator** → computes confidence-weighted budget consensus + final status
6. **Approval** → triggers Notion page, Slack webhook, and email notification

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy `dist/` folder to Vercel
```
Set the API base URL to your deployed server.

### Backend (Render / Railway)
- Set all environment variables
- Build command: `npm install`
- Start command: `npm start`
- Ensure persistent disk for SQLite, or switch to PostgreSQL for production

---

## 📜 License

MIT – Built for hackathon demonstration purposes.
