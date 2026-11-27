export interface ScoreEntry {
    username: string;
    points: number;
    created_at?: Date;
}
export interface ScoreSubmitRequest {
    username: string;
    points: number;
}
export interface LeaderboardResponse {
    scores: ScoreEntry[];
}
//# sourceMappingURL=types.d.ts.map