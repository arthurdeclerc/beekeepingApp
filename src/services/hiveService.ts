import { supabase } from './supabaseClient';
import { ServiceError, toServiceError } from './serviceError';
import type { Hive, HiveInput, HiveType } from '../types/Hive';

const HIVE_COLUMNS = 'id, apiary_id, name, hive_type, notes, created_at';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isHiveType(value: unknown): value is HiveType {
  return (
    value === 'dadant' ||
    value === 'langstroth' ||
    value === 'simplex' ||
    value === 'warre' ||
    value === 'top_bar' ||
    value === 'other'
  );
}

// The database answer is untyped; check every field instead of assuming its shape.
function parseHive(row: unknown): Hive {
  if (!isRecord(row)) throw new ServiceError('unknown');
  const { id, apiary_id: apiaryId, name, hive_type: type, notes, created_at: createdAt } = row;
  if (
    typeof id !== 'string' ||
    typeof apiaryId !== 'string' ||
    typeof name !== 'string' ||
    typeof notes !== 'string' ||
    typeof createdAt !== 'string' ||
    !isHiveType(type)
  ) {
    throw new ServiceError('unknown');
  }
  return { id, apiaryId, name, type, notes, createdAt };
}

export async function getHives(apiaryId: string): Promise<Hive[]> {
  const { data, error } = await supabase
    .from('hives')
    .select(HIVE_COLUMNS)
    .eq('apiary_id', apiaryId)
    .order('name');
  if (error !== null) throw toServiceError(error);
  return data.map(parseHive);
}

export async function createHive(apiaryId: string, input: HiveInput): Promise<Hive> {
  const { data, error } = await supabase
    .from('hives')
    .insert({
      apiary_id: apiaryId,
      name: input.name.trim(),
      hive_type: input.type,
      notes: input.notes.trim(),
    })
    .select(HIVE_COLUMNS)
    .single();
  if (error !== null) throw toServiceError(error);
  return parseHive(data);
}
