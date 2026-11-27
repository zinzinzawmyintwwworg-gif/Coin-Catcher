import { Router, Request, Response } from 'express';
import pool from '../db/pool.js';
import { authenticateToken } from '../middleware/auth.js';
import type { LeaderboardResponse, ScoreEntry } from 'shared/types';

const router = Router();


// Save score (Login required)
router.post(
  '/scores',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const points = req.body?.points;
      const difficulty = req.body?.difficulty;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (
        typeof points !== 'number' ||
        !Number.isInteger(points) ||
        points < 0
      ) {
        return res.status(400).json({ error: 'Valid points value is required' });
      }

      if (!['easy', 'normal', 'hard'].includes(difficulty)) {
        return res.status(400).json({ error: 'Valid difficulty is required' });
      }

      const result = await pool.query(
        `INSERT INTO scores (username, points, user_id, difficulty)
         SELECT username, $2, id, $3
         FROM users
         WHERE id = $1
         RETURNING id, username, points, created_at, user_id, difficulty`,
        [userId, points, difficulty]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User account not found' });
      }

      await pool.query(
        `INSERT INTO best_scores (user_id, difficulty, points)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, difficulty)
         DO UPDATE SET
           points = GREATEST(best_scores.points, EXCLUDED.points),
           updated_at = CURRENT_TIMESTAMP`,
        [userId, difficulty, points]
      );

      const score: ScoreEntry = result.rows[0];
      return res.status(201).json(score);
    } catch (error) {
      console.error('Error saving score:', error);
      return res.status(500).json({ error: 'Failed to save score' });
    }
  }
);


 // Get Top 5 Leaderboard
router.get(
  '/leaderboard',
  async (req: Request, res: Response<LeaderboardResponse>) => {
    try {
      const difficulty = req.query.difficulty;

      if (
        difficulty &&
        !['easy', 'normal', 'hard'].includes(String(difficulty))
      ) {
        return res.status(400).json({ scores: [] });
      }

     
const result =
  difficulty === 'all' || !difficulty
    ? await pool.query(
        `SELECT
           u.username,
           MAX(b.points) AS points,
           MIN(b.updated_at) AS created_at,
           (
             SELECT b2.difficulty
             FROM best_scores b2
             WHERE b2.user_id = b.user_id
             ORDER BY b2.points DESC, b2.updated_at ASC
             LIMIT 1
           ) AS difficulty
         FROM best_scores b
         LEFT JOIN users u ON b.user_id = u.id
         GROUP BY b.user_id, u.username
         ORDER BY MAX(b.points) DESC
         LIMIT 5`
      )
    : await pool.query(
        `SELECT
           u.username,
           b.points,
           b.updated_at AS created_at,
           b.difficulty
         FROM best_scores b
         LEFT JOIN users u ON b.user_id = u.id
         WHERE b.difficulty = $1
         ORDER BY b.points DESC, b.updated_at ASC
         LIMIT 5`,
        [difficulty]
      );


      const scores: ScoreEntry[] = result.rows;
      return res.json({ scores });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return res.status(500).json({ scores: [] });
    }
  }
);



export default router;