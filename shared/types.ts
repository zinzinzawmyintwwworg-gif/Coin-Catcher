export interface ScoreEntry {
  username: string;
  points: number;
  difficulty?: 'easy' | 'normal' | 'hard' | null;
  created_at?: Date;
}

export interface ScoreSubmitRequest {
  username: string;
  points: number;
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface LeaderboardResponse {
  scores: ScoreEntry[];
}