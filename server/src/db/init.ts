import 'dotenv/config';
import pool from './pool.js';

export async function initDatabase() {
  const initializeSchemaQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(20) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scores (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      points INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER REFERENCES users(id),
      difficulty VARCHAR(10) NOT NULL DEFAULT 'normal'
    );

    ALTER TABLE scores
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);
    ALTER TABLE scores
      ADD COLUMN IF NOT EXISTS difficulty VARCHAR(10) NOT NULL DEFAULT 'normal';

    CREATE TABLE IF NOT EXISTS best_scores (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'normal', 'hard')),
      points INTEGER NOT NULL CHECK (points >= 0),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, difficulty)
    );
    
    CREATE INDEX IF NOT EXISTS idx_scores_points_desc ON scores(points DESC);
    CREATE INDEX IF NOT EXISTS idx_scores_created_at ON scores(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_best_scores_points_desc ON best_scores(points DESC);
  `;

  try {
    await pool.query(initializeSchemaQuery);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

if (require.main === module) {
  initDatabase()
    .then(() => pool.end())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}