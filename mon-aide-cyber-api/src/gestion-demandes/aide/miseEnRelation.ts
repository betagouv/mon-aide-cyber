import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { DemandeAide } from './DemandeAide';
import { UtilisateurMACDTO } from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { Departement } from '../departements';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { adaptateursCorpsMessage } from './adaptateursCorpsMessage';
import { MiseEnRelationDirecteAidant } from './MiseEnRelationDirecteAidant';
import { MiseEnRelationParCritere } from './MiseEnRelationParCritere';
import { MiseEnRelationDirecteUtilisateurInscrit } from './MiseEnRelationDirecteUtilisateurInscrit';

export const envoieConfirmationDemandeAide = async (
  adaptateurEnvoiMail: AdaptateurEnvoiMail,
  aide: DemandeAide,
  relationUtilisateur: UtilisateurMACDTO | undefined
) => {
  await adaptateurEnvoiMail.envoieConfirmationDemandeAide(
    aide.email,
    relationUtilisateur
      ? {
          nomPrenom: relationUtilisateur.nomUsage,
          email: relationUtilisateur.email,
        }
      : undefined
  );
};

export const envoieRecapitulatifDemandeAide = async (
  adaptateurEnvoiMail: AdaptateurEnvoiMail,
  aide: DemandeAide,
  relationUtilisateur: string | undefined,
  annuaireCOT: {
    rechercheEmailParDepartement: (departement: Departement) => string;
  }
) => {
  await adaptateurEnvoiMail.envoie({
    objet: "Demande d'aide pour MonAideCyber",
    destinataire: {
      email: annuaireCOT.rechercheEmailParDepartement(aide.departement),
    },
    copie: adaptateurEnvironnement.messagerie().copieMAC(),
    corps: adaptateursCorpsMessage
      .demande()
      .recapitulatifDemandeAide()
      .genereCorpsMessage(aide, relationUtilisateur),
  });
};

export interface MiseEnRelation {
  execute(demandeAide: DemandeAide): Promise<void>;
}

export interface FabriqueMiseEnRelation {
  fabrique: (
    utilisateurMac: UtilisateurMACDTO | undefined
  ) => MiseEnRelation;
}

class FabriqueDeMiseEnRelation implements FabriqueMiseEnRelation {
  constructor(
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly annuaireCOT: {
      rechercheEmailParDepartement: (departement: Departement) => string;
    }
  ) {}

  fabrique(
    utilisateurMac: UtilisateurMACDTO | undefined
  ): MiseEnRelation {
    if (
      utilisateurMac &&
      (utilisateurMac?.profil === 'Aidant' ||
        utilisateurMac?.profil === 'Gendarme')
    ) {
      return new MiseEnRelationDirecteAidant(
        this.adaptateurEnvoiMail,
        this.annuaireCOT,
        utilisateurMac
      );
    }
    if (utilisateurMac && utilisateurMac.profil === 'UtilisateurInscrit') {
      return new MiseEnRelationDirecteUtilisateurInscrit(
        this.adaptateurEnvoiMail,
        utilisateurMac
      );
    }

    return new MiseEnRelationParCritere(
      this.adaptateurEnvoiMail,
      this.annuaireCOT
    );
  }
}

export const fabriqueMiseEnRelation = (
  adaptateurEnvoiMail: AdaptateurEnvoiMail,
  annuaireCOT: {
    rechercheEmailParDepartement: (departement: Departement) => string;
  }
): FabriqueMiseEnRelation =>
  new FabriqueDeMiseEnRelation(adaptateurEnvoiMail, annuaireCOT);
