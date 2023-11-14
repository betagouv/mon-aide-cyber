import { Entrepot } from '../domaine/Entrepot';
import { Aggregat } from '../domaine/Aggregat';
import { ErreurMAC } from '../domaine/erreurMAC';
import { GestionnaireDeJeton } from './GestionnaireDeJeton';

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

export type AidantAuthentifie = Aidant & {
  jeton: string;
};
export const authentifie = (
  entrepotAidant: EntrepotAidant,
  gestionnaireDeJeton: GestionnaireDeJeton,
  identifiant: string,
  motDePasse: string,
): Promise<AidantAuthentifie> => {
  return entrepotAidant
    .rechercheParIdentifiantConnexionEtMotDePasse(identifiant, motDePasse)
    .then((aidant) => ({
      ...aidant,
      jeton: gestionnaireDeJeton.genereJeton(aidant.identifiant),
    }))
    .catch((erreur) =>
      Promise.reject(
        ErreurMAC.cree(
          "Demande d'Authentification",
          new ErreurAuthentification(erreur),
        ),
      ),
    );
};
