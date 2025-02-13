import { Aggregat } from './Aggregat';

export interface EntrepotLecture<T> {
  lis(identifiant: string): Promise<T>;

  tous(): Promise<T[]>;

  typeAggregat(): string;
}

export interface EntrepotEcriture<T extends Aggregat>
  extends EntrepotLecture<T> {
  persiste(entite: T): Promise<void>;
}
