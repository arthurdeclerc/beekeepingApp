import type { HiveType } from '../types/Hive';

export const HIVE_TYPE_LABELS: Record<HiveType, string> = {
  dadant: 'Dadant',
  langstroth: 'Langstroth',
  simplex: 'Simplex',
  warre: 'Warré',
  top_bar: 'Top-bar',
  other: 'Other',
};

export const HIVE_TYPES = Object.keys(HIVE_TYPE_LABELS) as HiveType[];
