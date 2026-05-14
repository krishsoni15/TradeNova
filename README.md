# TradeNova 🌌

A production-grade, highly performant trading dashboard built with a modern technology stack. It provides real-time portfolio tracking, beautiful dark-themed aesthetics, and a seamless connection to the Upstox broker API.

![TradeNova Dashboard](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3)

## 🚀 Features

- **Upstox Broker Integration**: Securely connect to your Upstox account using OAuth 2.0 to fetch live holdings and portfolio data.
- **Dark Trading Terminal**: Built with Tailwind CSS v4, utilizing glassmorphism, smooth animations, and neon accents.
- **Accurate Mathematical P&L**: Automatically calculates Net Quantity (excluding T1 unsettled day trades) and precise Day Change logic.
- **Blazing Fast Backend**: Powered by FastAPI, Uvicorn, and an asynchronous PostgreSQL database.
- **Seamless React Frontend**: Built on Next.js 16 (App Router), Zustand, TanStack Query, and Framer Motion.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (React 19)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (Base UI)
- **Framer Motion**
- **Zustand** & **TanStack Query**

### Backend
- **FastAPI** (Python 3.12)
- **SQLAlchemy** (Asyncpg)
- **PostgreSQL**
- **Alembic** (Database Migrations)
- **HTTPX** & **PyJWT**

---

## 🐳 Running with Docker (Recommended)

The easiest way to run TradeNova is using Docker Compose.

1. Ensure you have Docker and Docker Compose installed.
2. Create a `.env` file in the root directory and add your Upstox credentials:
   ```env
   UPSTOX_API_KEY=your_actual_api_key
   UPSTOX_API_SECRET=your_actual_api_secret
   ```
3. Run the complete stack:
   ```bash
   docker-compose up -d --build
   ```
4. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

*(Note: On the first run, ensure the database is initialized by running migrations manually or let Alembic auto-generate on startup if configured).*

---

## 💻 Local Development Setup

### 1. Database (PostgreSQL)
Ensure you have PostgreSQL installed and running.
```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
sudo -u postgres psql -c "CREATE DATABASE tradenova;"
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```
*Edit the `.env` file with your Upstox credentials.*

Initialize the database:
```bash
alembic upgrade head
```

Run the server:
```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd tradenova
npm install
cp .env.example .env.local
```
*Edit `.env.local` to include your `NEXT_PUBLIC_UPSTOX_API_KEY`.*

Run the development server:
```bash
npm run dev
```

---

## 🔐 Upstox Developer Setup
To connect real data, you need to register an app on Upstox:
1. Go to the [Upstox Developer Portal](https://developer.upstox.com/).
2. Create a new App named **TradeNova**.
3. Set the Redirect URI exactly to: `http://localhost:3000/auth/callback`
4. Put your local IP (`127.0.0.1` or your public IP) in the Primary IP field.
5. Copy the generated API Key and API Secret to your `.env` files.

---

## 📝 License
This project is for educational and personal use. Ensure you follow Upstox's API terms of service when deploying to production.
