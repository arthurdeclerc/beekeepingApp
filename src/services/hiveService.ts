import { supabase } from './supabaseClient';
import { ServiceError, toServiceError } from './serviceError';
import type { Hive, HiveInput, HiveType } from '../types/Hive';

const HIVE_COLUMNS =
  'id, apiary_id, name, hive_type, notes, queen_birth_year, queen_breed, queen_marked, queen_clipped, queen_mated, created_at';

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
  const {
    id,
    apiary_id: apiaryId,
    name,
    hive_type: type,
    notes,
    queen_birth_year: birthYear,
    queen_breed: breed,
    queen_marked: isMarked,
    queen_clipped: isClipped,
    queen_mated: isMated,
    created_at: createdAt,
  } = row;
  if (
    typeof id !== 'string' ||
    typeof apiaryId !== 'string' ||
    typeof name !== 'string' ||
    typeof notes !== 'string' ||
    typeof breed !== 'string' ||
    typeof isMarked !== 'boolean' ||
    typeof isClipped !== 'boolean' ||
    typeof isMated !== 'boolean' ||
    typeof createdAt !== 'string' ||
    !isHiveType(type) ||
    (birthYear !== null && typeof birthYear !== 'number')
  ) {
    throw new ServiceError('unknown');
  }
  return {
    id,
    apiaryId,
    name,
    type,
    notes,
    queen: { birthYear: birthYear ?? undefined, breed, isMarked, isClipped, isMated },
    createdAt,
  };
}

function toColumns(input: HiveInput) {
  return {
    name: input.name.trim(),
    hive_type: input.type,
    notes: input.notes.trim(),
    queen_birth_year: input.queen.birthYear ?? null,
    queen_breed: input.queen.breed.trim(),
    queen_marked: input.queen.isMarked,
    queen_clipped: input.queen.isClipped,
    queen_mated: input.queen.isMated,
  };
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
    .insert({ apiary_id: apiaryId, ...toColumns(input) })
    .select(HIVE_COLUMNS)
    .single();
  if (error !== null) throw toServiceError(error);
  return parseHive(data);
}

export async function updateHive(id: string, input: HiveInput): Promise<Hive> {
  const { data, error } = await supabase
    .from('hives')
    .update(toColumns(input))
    .eq('id', id)
    .select(HIVE_COLUMNS);
  if (error !== null) throw toServiceError(error);
  // Row Level Security hides rows silently: nothing updated means we were not allowed to.
  const [row] = data;
  if (row === undefined) throw new ServiceError('forbidden');
  return parseHive(row);
}
