import { Entrepot } from '../domaine/Entrepot';
import { Aggregat } from '../domaine/Aggregat';
import { SecteurActivite } from '../espace-aidant/preferences/secteursActivite';
import { Departement } from '../gestion-demandes/departements';

type Preferences = {
  secteursActivite: SecteurActivite[];
  departements: Departement[];
};

export type Aidant = Aggregat & {
  identifiantConnexion: string;
  nomPrenom: string;
  motDePasse: string;
  dateSignatureCGU?: Date;
  dateSignatureCharte?: Date;
  preferences: Preferences;
};
export interface EntrepotAidant extends Entrepot<Aidant> {
  rechercheParIdentifiantConnexionEtMotDePasse(
    identifiantConnexion: string,
    motDePasse: string
  ): Promise<Aidant>;

  rechercheParIdentifiantDeConnexion(
    identifiantConnexion: string
  ): Promise<Aidant>;
}
export class ErreurAuthentification extends Error {
  constructor(public readonly erreur: Error) {
    super('Identifiants incorrects.');
  }
}

export class ErreurCreationEspaceAidant extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}

export type AidantAuthentifie = Aidant & {
  jeton: string;
};
