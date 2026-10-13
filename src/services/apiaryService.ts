import { supabase } from './supabaseClient';
import { ServiceError, toServiceError } from './serviceError';
import type { Apiary, ApiaryInput, ApiaryRole } from '../types/Apiary';

const APIARY_COLUMNS = 'id, name, address, notes, created_at, role';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isApiaryRole(value: unknown): value is ApiaryRole {
  return (
    value === 'owner' ||
    value === 'administrator' ||
    value === 'contributor' ||
    value === 'read_only'
  );
}

// The database answer is untyped; check every field instead of assuming its shape.
function parseApiary(row: unknown): Apiary {
  if (!isRecord(row)) throw new ServiceError('unknown');
  const { id, name, address, notes, role, created_at: createdAt } = row;
  if (
    typeof id !== 'string' ||
    typeof name !== 'string' ||
    typeof address !== 'string' ||
    typeof notes !== 'string' ||
    typeof createdAt !== 'string' ||
    !isApiaryRole(role)
  ) {
    throw new ServiceError('unknown');
  }
  return { id, name, address, notes, role, createdAt };
}

function normalize(input: ApiaryInput): ApiaryInput {
  return {
    name: input.name.trim(),
    address: input.address.trim(),
    notes: input.notes.trim(),
  };
}

export async function getApiaries(): Promise<Apiary[]> {
  const { data, error } = await supabase
    .from('my_apiaries')
    .select(APIARY_COLUMNS)
    .order('name');
  if (error !== null) throw toServiceError(error);
  return data.map(parseApiary);
}

export async function getApiary(id: string): Promise<Apiary> {
  const { data, error } = await supabase
    .from('my_apiaries')
    .select(APIARY_COLUMNS)
    .eq('id', id)
    .maybeSingle();
  if (error !== null) throw toServiceError(error);
  if (data === null) throw new ServiceError('not_found');
  return parseApiary(data);
}

export async function createApiary(input: ApiaryInput): Promise<Apiary> {
  const { data, error } = await supabase
    .from('apiaries')
    .insert(normalize(input))
    .select('id')
    .single();
  if (error !== null) throw toServiceError(error);
  if (!isRecord(data) || typeof data['id'] !== 'string') throw new ServiceError('unknown');
  return getApiary(data['id']);
}

export async function updateApiary(id: string, input: ApiaryInput): Promise<Apiary> {
  const { data, error } = await supabase
    .from('apiaries')
    .update(normalize(input))
    .eq('id', id)
    .select('id');
  if (error !== null) throw toServiceError(error);
  // Row Level Security hides rows silently: nothing updated means we were not allowed to.
  if (data.length === 0) throw new ServiceError('forbidden');
  return getApiary(id);
}

export async function deleteApiary(id: string): Promise<void> {
  const { data, error } = await supabase.from('apiaries').delete().eq('id', id).select('id');
  if (error !== null) throw toServiceError(error);
  if (data.length === 0) throw new ServiceError('forbidden');
}
