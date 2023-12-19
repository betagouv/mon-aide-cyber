import { Entrepot } from '../domaine/Entrepot';
import { Aggregat } from '../domaine/Aggregat';

export type Aidant = Aggregat & {
  identifiantConnexion: string;
  nomPrenom: string;
  motDePasse: string;
  dateSignatureCGU: Date;
  dateSignatureCharte: Date;
};
export interface EntrepotAidant extends Entrepot<Aidant> {
  rechercheParIdentifiantConnexionEtMotDePasse(
    identifiantConnexion: string,
    motDePasse: string,
  ): Promise<Aidant>;

  rechercheParIdentifiantDeConnexion(
    identifiantConnexion: string,
  ): Promise<Aidant>;
}
export class ErreurAuthentification extends Error {
  constructor(public readonly erreur: Error) {
    super('Identifiants incorrects.');
  }
}

export type AidantAuthentifie = Aidant & {
  jeton: string;
};
