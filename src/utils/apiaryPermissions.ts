import type { ApiaryRole } from '../types/Apiary';

export const ROLE_LABELS: Record<ApiaryRole, string> = {
  owner: 'Owner',
  administrator: 'Administrator',
  contributor: 'Contributor',
  read_only: 'Read-only',
};

// Mirrors the Row Level Security policies in the database; the database is the real gatekeeper.
export function canEditApiary(role: ApiaryRole): boolean {
  return role === 'owner' || role === 'administrator';
}

export function canDeleteApiary(role: ApiaryRole): boolean {
  return role === 'owner';
}
