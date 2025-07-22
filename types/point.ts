export interface Point {
  id: number;
  title: string;
  content: string;
  points: number;
  type: 'earn' | 'use';
  createdAt: string;
  userId: number;
}

export interface PointSummary {
  totalPoints: number;
  earnedPoints: number;
  usedPoints: number;
  userId: number;
}

export interface PointRequest {
  title: string;
  content: string;
  points: number;
  type: 'earn' | 'use';
} 