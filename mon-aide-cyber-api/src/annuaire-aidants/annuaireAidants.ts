import { Entrepot } from '../domaine/Entrepot';
import { UUID } from 'crypto';

export type Aidant = {
  nomPrenom: string;
  identifiant: UUID;
};

export type EntrepotAnnuaireAidants = Entrepot<Aidant>;
