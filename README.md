# Coin Catcher

A full-stack mini game built with Phaser 3, TypeScript, Vite, Node.js, Express, and PostgreSQL.

## Project Structure

```
coin-catcher/
├── shared/                 # Shared TypeScript interfaces
├── server/                 # Backend (Node.js + Express + PostgreSQL)
│   ├── src/
│   │   ├── index.ts        # Express server entry point
│   │   ├── routes/
│   │   │   └── scores.ts   # POST /api/scores, GET /api/leaderboard
│   │   └── db/
│   │       ├── pool.ts     # PostgreSQL connection pool
│   │       └── init.ts     # Database initialization
│   └── package.json
└── client/                 # Frontend (Phaser 3 + TypeScript + Vite)
    ├── src/
    │   ├── main.ts         # Game entry point
    │   ├── scenes/
    │   │   ├── BootScene.ts
    │   │   ├── PreloadScene.ts
    │   │   ├── MenuScene.ts      # Username input
    │   │   ├── GameScene.ts      # Main game logic
    │   │   └── GameOverScene.ts  # Game over + leaderboard
    │   ├── ui/
    │   │   └── ScoreDisplay.ts   # Score/timer UI component
    │   └── types/
    │       └── shared.ts         # Re-exports shared types
    ├── index.html
    └── package.json
```

## Game Rules

1. Enter a username to start
2. Control the basket with ←/→ arrow keys or A/D
3. Catch falling coins to score points
4. Game lasts exactly 30 seconds
5. Final score is saved to the leaderboard
6. Top 5 scores displayed on Game Over screen

## API Endpoints

- `POST /api/scores` - Save a score
  - Body: `{ "username": "string", "points": number }`
- `GET /api/leaderboard` - Get top 5 scores
  - Returns: `{ "scores": [{ "username": "string", "points": number, "created_at": "ISO date" }] }`

## Database Schema

```sql
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Install all dependencies
npm install

# Initialize database (create table)
npm run db:init
```

### Development

```bash
# Start backend server (port 3000)
npm run dev:server

# Start frontend dev server (port 5173)
npm run dev:client
```

### Production Build

```bash
# Build both frontend and backend
npm run build:server
npm run build:client

# Start production server
npm run start --workspace=server
```

## Configuration

Copy `server/.env.example` to `server/.env` and configure:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coin_catcher
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
```

## Technologies

- **Frontend**: Phaser 3, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Shared**: TypeScript interfaces for type-safe API communication