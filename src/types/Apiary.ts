export type ApiaryRole = 'owner' | 'administrator' | 'contributor' | 'read_only';

export interface Apiary {
  id: string;
  name: string;
  address: string;
  notes: string;
  // The signed-in user's role in this apiary.
  role: ApiaryRole;
  createdAt: string;
}

export interface ApiaryInput {
  name: string;
  address: string;
  notes: string;
}
