export interface Voca {
    id: number;
    vocaTitle: string;
    languages: string;
    userId: number;
    description?: string;
    createdAt: string;
    wordCount?: number;
    isShared?: boolean;
    progress?: string;
  }

export interface VocaShareRequest {
  isShared: boolean;
}

