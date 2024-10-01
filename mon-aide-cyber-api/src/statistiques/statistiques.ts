import { Entrepot } from '../domaine/Entrepot';
import { Aggregat } from '../domaine/Aggregat';

export type Statistiques = Aggregat & {
  nombreDiagnostics: number;
  nombreAidants: number;
};

export type EntrepotStatistiques = Omit<
  Entrepot<Statistiques>,
  'lis' | 'typeAggregat' | 'persiste' | 'tous'
> & {
  lis: () => Promise<Statistiques>;
};
