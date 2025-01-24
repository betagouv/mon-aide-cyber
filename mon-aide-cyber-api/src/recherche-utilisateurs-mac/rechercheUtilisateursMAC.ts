import crypto from 'crypto';
import { Aggregat } from '../domaine/Aggregat';
import { Entrepot } from '../domaine/Entrepot';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { adaptateurEnvironnement } from '../adaptateurs/adaptateurEnvironnement';
import { isAfter } from 'date-fns';

export type ProfilUtilisateurMAC = 'Aidant' | 'UtilisateurInscrit' | 'Gendarme';

export type UtilisateurMAC = Aggregat & {
  profil: ProfilUtilisateurMAC;
  dateValidationCGU?: Date;
  nomPrenom: string;
};

export type UtilisateurMACDTO = {
  identifiant: crypto.UUID;
  profil: ProfilUtilisateurMAC;
  dateValidationCGU?: Date;
  nomUsage: string;
  nomComplet: string;
  doitValiderLesCGU: boolean;
};

export interface RechercheUtilisateursMAC {
  rechercheParIdentifiant(
    identifiant: crypto.UUID
  ): Promise<UtilisateurMACDTO | undefined>;
}

export interface EntrepotUtilisateursMAC extends Entrepot<UtilisateurMAC> {
  rechercheParIdentifiant(identifiant: crypto.UUID): Promise<UtilisateurMAC>;
}

export const uneRechercheUtilisateursMAC = (
  entrepot: EntrepotUtilisateursMAC
): RechercheUtilisateursMAC => ({
  rechercheParIdentifiant(
    identifiant: crypto.UUID
  ): Promise<UtilisateurMACDTO | undefined> {
    const formateLeNom = (nomPrenom: string): string => {
      const [prenom, nom] = nomPrenom.split(' ');
      return `${prenom} ${nom ? `${nom[0]}.` : ''}`.trim();
    };

    return entrepot
      .rechercheParIdentifiant(identifiant)
      .then((utilisateur) => ({
        identifiant: utilisateur.identifiant,
        profil: utilisateur.profil,
        nomUsage: formateLeNom(utilisateur.nomPrenom),
        nomComplet: utilisateur.nomPrenom,
        ...(utilisateur.dateValidationCGU && {
          dateValidationCGU: utilisateur.dateValidationCGU,
        }),
        doitValiderLesCGU:
          !!utilisateur.dateValidationCGU &&
          isAfter(dateValiditeCGU(), utilisateur.dateValidationCGU) &&
          isAfter(FournisseurHorloge.maintenant(), dateValiditeCGU()),
      }))
      .catch((erreur) => {
        console.error(
          'Erreur lors de la recherche de l’utilisateur portant l’id %s. %s',
          identifiant,
          erreur.message
        );
        return undefined;
      });
  },
});

export const dateValiditeCGU = () =>
  FournisseurHorloge.enDate(
    adaptateurEnvironnement.nouveauParcoursDevenirAidant()
  );
