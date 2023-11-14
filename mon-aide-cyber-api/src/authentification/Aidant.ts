import { Entrepot } from '../domaine/Entrepot';
import { Aggregat } from '../domaine/Aggregat';
import { ErreurMAC } from '../domaine/erreurMAC';

export type Aidant = Aggregat & {
  identifiantConnexion: string;
  nomPrenom: string;
  motDePasse: string;
};
export interface EntrepotAidant extends Entrepot<Aidant> {
  rechercheParIdentifiantConnexionEtMotDePasse(
    identifiantConnexion: string,
    motDePasse: string,
  ): Promise<Aidant>;
}
export class ErreurAuthentification extends Error {
  constructor(public readonly erreur: Error) {
    super('Identifiants incorrects.');
  }
}

export const authentifie = (
  entrepotAidant: EntrepotAidant,
  identifiant: string,
  motDePasse: string,
) => {
  return entrepotAidant
    .rechercheParIdentifiantConnexionEtMotDePasse(identifiant, motDePasse)
    .catch((erreur) =>
      Promise.reject(
        ErreurMAC.cree(
          "Demande d'Authentification",
          new ErreurAuthentification(erreur),
        ),
      ),
    );
};
