export type HiveType = 'dadant' | 'langstroth' | 'simplex' | 'warre' | 'top_bar' | 'other';

export interface Hive {
  id: string;
  apiaryId: string;
  name: string;
  type: HiveType;
  notes: string;
  createdAt: string;
}

export interface HiveInput {
  name: string;
  type: HiveType;
  notes: string;
}
