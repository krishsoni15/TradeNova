# 🚀 TradeNova — Real-Time Trading Terminal

A professional-grade trading dashboard built with Next.js and FastAPI, connecting directly to your Upstox brokerage account.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | TailwindCSS 4, Framer Motion |
| **Components** | shadcn/ui (Radix Primitives) |
| **State** | Zustand (auth/UI), TanStack React Query (data) |
| **Market Data** | `yahoo-finance2` via Next.js API route |
| **Backend** | Python FastAPI, SQLAlchemy Async |
| **Auth** | Upstox OAuth 2.0 → JWT |
| **Database** | PostgreSQL via asyncpg |

---

## Features

### ✅ Completed

- **Real-time market data** — Nifty 50, Sensex, Bank Nifty, Nifty IT indices update every 10 seconds
- **Live stock ticker** — scrolling marquee with 15 major NSE stocks
- **Portfolio dashboard** — investment, current value, total P&L, day's P&L
- **Holdings page** — full table with sort, search, filter (gainers/losers)
- **Top gainers & losers** — properly separated (positive % only in gainers, negative % only in losers)
- **Live search** — type any stock symbol in navbar, see real-time price + % change, click to filter holdings
- **Upstox OAuth login** — secure broker connection, fetches real portfolio data
- **Watchlist** — add/remove stocks, live price cards with high/low/volume
- **Orders page** — order history table with status badges
- **Positions page** — active F&O positions display
- **Settings page** — account, notification, security, app preferences
- **Responsive design** — works on mobile, tablet, desktop
- **Dark mode** — trading terminal aesthetic

### 🔜 Next Steps

1. **Upstox WebSocket** — replace Yahoo Finance polling with Upstox Market Data Feed v3 for sub-second ticks
2. **Order placement** — connect Buy/Sell buttons to Upstox execution API
3. **PostgreSQL** — persist user sessions and preferences
4. **Price alerts** — notify when stocks hit target prices

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                   Browser                    │
│  Next.js App (React + TanStack Query)        │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐     │
│  │Dashboard │ │ Holdings │ │ Watchlist  │     │
│  └────┬─────┘ └────┬─────┘ └─────┬─────┘     │
│       │             │             │           │
│       ▼             ▼             ▼           │
│  ┌──────────────────────────────────┐        │
│  │  market.service.ts (fetchQuotes) │        │
│  └──────────────┬───────────────────┘        │
└─────────────────┼────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────┐
│  /api/market (Next.js API)  │──► yahoo-finance2
└─────────────────────────────┘
                  
┌─────────────────────────────┐
│  FastAPI Backend (:8000)    │
│  /api/v1/auth/upstox/login  │──► Upstox OAuth
│  /api/v1/auth/upstox/callback│──► Token exchange
│  /api/v1/holdings           │──► Real portfolio
└─────────────────────────────┘
```

---

## How to Run

### Frontend
```bash
cd tradenova
npm install
npm run dev          # http://localhost:3000
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your Upstox keys
uvicorn app.main:app --reload --port 8000
```

### Environment Variables (backend/.env)
```
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/tradenova
SECRET_KEY=your-secret-key
UPSTOX_API_KEY=your-upstox-api-key
UPSTOX_API_SECRET=your-upstox-api-secret
UPSTOX_REDIRECT_URI=http://localhost:3000/auth/callback
FRONTEND_URL=http://localhost:3000
```

---

## Problems Solved

| Problem | Solution |
|---------|----------|
| Yahoo Finance 401 errors | Switched from raw `fetch` to `yahoo-finance2` library which handles crumb/cookie auth automatically |
| Holdings showing wrong prices | Removed simulator fallback for unknown symbols — only real data shown |
| Search bar not working | Rebuilt with live filtering against actual market quotes from watchlist |
| UI too cluttered/confusing | Simplified to 3-column dashboard layout, removed excessive glassmorphism, cleaner typography |
| Positive stocks in "Losers" | Added proper `.filter()` — gainers only show positive %, losers only show negative % |
| Build errors | Fixed `useSearchParams` Suspense boundary, TypeScript async/await type mismatch |
