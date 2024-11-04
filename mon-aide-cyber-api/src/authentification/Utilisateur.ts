import { Aggregat } from '../domaine/Aggregat';
import { Entrepot } from '../domaine/Entrepot';
import crypto from 'crypto';

export type Utilisateur = Aggregat & {
  identifiantConnexion: string;
  nomPrenom: string;
  dateSignatureCGU?: Date;
  motDePasse: string;
};

export interface EntrepotUtilisateur extends Entrepot<Utilisateur> {
  rechercheParIdentifiantConnexionEtMotDePasse(
    identifiantConnexion: string,
    motDePasse: string
  ): Promise<Utilisateur>;
}

export type UtilisateurAuthentifie = {
  identifiant: crypto.UUID;
  nomPrenom: string;
  dateSignatureCGU?: Date;
  jeton: string;
};

export class ErreurAuthentification extends Error {
  constructor(public readonly erreur: Error) {
    super('Identifiants incorrects.');
  }
}
