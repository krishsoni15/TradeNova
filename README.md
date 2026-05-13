# 🚀 TradeNova — Premium Trading Dashboard

A production-grade trading dashboard built with Next.js 15, FastAPI, and Upstox API integration.

> **Phase 1** — Foundation + Upstox Integration + Holdings Dashboard

![Dashboard](https://img.shields.io/badge/Status-Phase%201%20Complete-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![License](https://img.shields.io/badge/License-Private-red)

---

## ✨ Features (Phase 1)

- 🎨 **Premium Dark Trading Terminal UI** — TradingView/Binance-inspired design
- 📊 **Portfolio Summary Cards** — Total investment, current value, P&L, day change
- 📋 **Holdings Table** — Sortable, color-coded, with animated row entrance
- 🔐 **JWT Authentication** — Secure token-based auth structure
- 🔗 **Upstox Integration** — OAuth2 flow + Holdings API
- 📱 **Fully Responsive** — Desktop sidebar, mobile sheet navigation
- ⚡ **Mock Data Fallback** — Works immediately without Upstox credentials
- 🌐 **WebSocket Ready** — Scaffold for live market data streaming
- 🎭 **Smooth Animations** — Framer Motion throughout
- 🧩 **Glassmorphism UI** — Modern glass-effect cards and panels

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Framework + SSR |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| shadcn/ui | Component library |
| Framer Motion | Animations |
| TanStack Query | Server state |
| Zustand | Client state |
| Axios | HTTP client |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API |
| PostgreSQL | Database |
| SQLAlchemy (async) | ORM |
| JWT (python-jose) | Authentication |
| httpx | Upstox API calls |
| Pydantic Settings | Configuration |

---

## 📁 Project Structure

```
trading app/
├── tradenova/                      # Next.js Frontend
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx      # Upstox login page
│   │   │   └── layout.tsx          # Auth layout (gradient bg)
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Dashboard shell (sidebar + navbar)
│   │   │   ├── page.tsx            # Dashboard home
│   │   │   └── holdings/page.tsx   # Holdings detail page
│   │   ├── globals.css             # Dark trading terminal theme
│   │   └── layout.tsx              # Root layout (providers)
│   ├── components/
│   │   ├── ui/                     # shadcn/ui primitives (11 components)
│   │   ├── layout/
│   │   │   ├── sidebar.tsx         # Collapsible glassmorphism sidebar
│   │   │   ├── top-navbar.tsx      # Search, notifications, user menu
│   │   │   └── mobile-nav.tsx      # Sheet-based mobile navigation
│   │   ├── dashboard/
│   │   │   ├── portfolio-summary.tsx  # 4 summary cards with animations
│   │   │   ├── holdings-table.tsx     # Sortable data table
│   │   │   └── holdings-skeleton.tsx  # Skeleton loading state
│   │   └── shared/
│   │       ├── logo.tsx            # Animated brand logo
│   │       └── empty-state.tsx     # Reusable empty state
│   ├── hooks/                      # Custom React hooks
│   ├── services/                   # API service layer
│   ├── stores/                     # Zustand state stores
│   ├── providers/                  # React context providers
│   ├── types/                      # TypeScript type definitions
│   └── lib/                        # Utilities & constants
│
└── backend/                        # FastAPI Backend
    ├── app/
    │   ├── main.py                 # App entry + CORS + health
    │   ├── config.py               # Pydantic Settings
    │   ├── database.py             # Async SQLAlchemy
    │   ├── routes/                 # API endpoints
    │   │   ├── auth.py             # Upstox OAuth + JWT
    │   │   ├── holdings.py         # Portfolio holdings
    │   │   └── ws.py               # WebSocket scaffold
    │   ├── services/               # Business logic
    │   │   ├── auth_service.py     # JWT create/verify
    │   │   └── upstox_service.py   # Upstox API + mock data
    │   ├── models/                 # SQLAlchemy models
    │   ├── schemas/                # Pydantic schemas
    │   └── middleware/             # Auth middleware
    ├── requirements.txt
    └── .env.example
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (LTS)
- Python 3.11+
- PostgreSQL (optional — mock data works without it)

### Frontend Setup

```bash
# Navigate to frontend
cd tradenova

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

The frontend runs at **http://localhost:3000** with mock data — no backend required!

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your credentials

# Run the server
uvicorn app.main:app --reload --port 8000
```

The API runs at **http://localhost:8000** with docs at **/api/docs**.

### Upstox Setup (Optional)

1. Visit [Upstox Developer Portal](https://account.upstox.com/developer/apps)
2. Create a new app
3. Set redirect URI to `http://localhost:3000/auth/callback`
4. Copy API Key and Secret to your `.env` file

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--background` | Deep charcoal | Page backgrounds |
| `--primary` | Neon green | Accents, CTAs, profit indicators |
| `--destructive` | Warm red | Loss indicators, errors |
| `--glass` | 4% white | Glassmorphism cards |
| `--profit` | Green | Positive P&L |
| `--loss` | Red | Negative P&L |

### Custom CSS Classes
- `.glass` — Glassmorphism with blur
- `.glass-strong` — Stronger glass effect
- `.glow-profit` / `.glow-loss` — Glow box shadows
- `.gradient-mesh` — Animated gradient background
- `.tabular-nums` — Monospaced numbers for alignment

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/health` | ❌ | Health check |
| `POST` | `/api/v1/auth/upstox/callback` | ❌ | Exchange Upstox code for JWT |
| `GET` | `/api/v1/auth/me` | ✅ | Get current user profile |
| `GET` | `/api/v1/holdings` | ✅ | Get portfolio holdings |
| `GET` | `/api/v1/holdings/mock` | ❌ | Get mock holdings (dev) |
| `WS` | `/ws/market` | ❌ | WebSocket scaffold |

---

## 🔒 Security Practices

- JWT tokens with expiry (24h default)
- CORS restricted to frontend origin
- Environment variables for all secrets
- Token interceptor with auto-logout on 401
- Upstox tokens stored server-side only
- No client-side API key exposure

---

## 🗺️ Roadmap

- [x] **Phase 1** — Foundation + Holdings Dashboard
- [ ] **Phase 2** — Live market data (WebSocket)
- [ ] **Phase 3** — Orders & Positions
- [ ] **Phase 4** — Watchlist & Alerts
- [ ] **Phase 5** — Advanced Analytics

---

## 📝 License

Private — All rights reserved.
