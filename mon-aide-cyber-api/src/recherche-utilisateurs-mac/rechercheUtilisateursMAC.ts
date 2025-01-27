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

  rechercheParMail(email: string): Promise<UtilisateurMACDTO | undefined>;
}

export interface EntrepotUtilisateursMAC extends Entrepot<UtilisateurMAC> {
  rechercheParIdentifiant(identifiant: crypto.UUID): Promise<UtilisateurMAC>;

  rechercheParMail(email: string): Promise<UtilisateurMAC>;
}

const mappeUtilisateur = (utilisateur: UtilisateurMAC) => ({
  identifiant: utilisateur.identifiant,
  profil: utilisateur.profil,
  nomUsage: formateLeNom(utilisateur.nomPrenom),
  nomComplet: utilisateur.nomPrenom,
  ...(utilisateur.dateValidationCGU && {
    dateValidationCGU: utilisateur.dateValidationCGU,
  }),
  doitValiderLesCGU:
    (!!utilisateur.dateValidationCGU &&
      isAfter(dateValiditeCGU(), utilisateur.dateValidationCGU) &&
      isAfter(FournisseurHorloge.maintenant(), dateValiditeCGU())) ||
    !utilisateur.dateValidationCGU,
});

const formateLeNom = (nomPrenom: string): string => {
  const [prenom, nom] = nomPrenom.split(' ');
  return `${prenom} ${nom ? `${nom[0]}.` : ''}`.trim();
};

export const uneRechercheUtilisateursMAC = (
  entrepot: EntrepotUtilisateursMAC
): RechercheUtilisateursMAC => {
  return {
    rechercheParIdentifiant(
      identifiant: crypto.UUID
    ): Promise<UtilisateurMACDTO | undefined> {
      return entrepot
        .rechercheParIdentifiant(identifiant)
        .then((utilisateur) => mappeUtilisateur(utilisateur))
        .catch((erreur) => {
          console.error(
            'Erreur lors de la recherche de l’utilisateur portant l’id %s. %s',
            identifiant,
            erreur.message
          );
          return undefined;
        });
    },
    rechercheParMail(email: string): Promise<UtilisateurMACDTO | undefined> {
      return entrepot
        .rechercheParMail(email)
        .then((utilisateur) => mappeUtilisateur(utilisateur))
        .catch((erreur) => {
          console.error(
            'Erreur lors de la recherche de l’utilisateur avec le mail %s. %s',
            email,
            erreur.message
          );
          return undefined;
        });
    },
  };
};

export const dateValiditeCGU = () =>
  FournisseurHorloge.enDate(
    adaptateurEnvironnement.nouveauParcoursDevenirAidant()
  );
export const PROFILS_AIDANT: ProfilUtilisateurMAC[] = ['Aidant', 'Gendarme'];
