export type HiveType = 'dadant' | 'langstroth' | 'simplex' | 'warre' | 'top_bar' | 'other';

export interface Queen {
  // undefined when the birth year is unknown.
  birthYear: number | undefined;
  breed: string;
  isMarked: boolean;
  isClipped: boolean;
  isMated: boolean;
}

export interface Hive {
  id: string;
  apiaryId: string;
  name: string;
  type: HiveType;
  notes: string;
  queen: Queen;
  createdAt: string;
}

export interface HiveInput {
  name: string;
  type: HiveType;
  notes: string;
  queen: Queen;
}
