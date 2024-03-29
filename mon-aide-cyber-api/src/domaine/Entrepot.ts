import { Aggregat } from './Aggregat';

export interface Entrepot<T extends Aggregat> {
  lis(identifiant: string): Promise<T>;

  persiste(entite: T): Promise<void>;

  tous(): Promise<T[]>;

  typeAggregat(): string;
}
