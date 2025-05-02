import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { DemandeAide } from './DemandeAide';
import { UtilisateurMACDTO } from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { Departement } from '../departements';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { adaptateursCorpsMessage } from './adaptateursCorpsMessage';
import { MiseEnRelationDirecteAidant } from './MiseEnRelationDirecteAidant';
import { MiseEnRelationParCriteres } from './MiseEnRelationParCriteres';
import { MiseEnRelationDirecteUtilisateurInscrit } from './MiseEnRelationDirecteUtilisateurInscrit';
import { SecteurActivite } from '../../espace-aidant/preferences/secteursActivite';
import {
  Aidant,
  EntitesAssociations,
  EntitesEntreprisesPrivees,
  EntitesOrganisationsPubliques,
} from '../../espace-aidant/Aidant';
import { Entrepots } from '../../domaine/Entrepots';

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
  aidants: Aidant[],
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
      .genereCorpsMessage(aide, aidants, relationUtilisateur),
  });
};

export type DonneesMiseEnRelation = {
  demandeAide: DemandeAide;
  siret: string;
  typeEntite?:
    | EntitesOrganisationsPubliques
    | EntitesEntreprisesPrivees
    | EntitesAssociations;
  secteursActivite?: SecteurActivite[];
};

export interface MiseEnRelation {
  execute(donneesMiseEnRelation: DonneesMiseEnRelation): Promise<void>;
}

export interface FabriqueMiseEnRelation {
  fabrique: (utilisateurMac: UtilisateurMACDTO | undefined) => MiseEnRelation;
}

export class FabriqueMiseEnRelationConcrete implements FabriqueMiseEnRelation {
  constructor(
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly annuaireCOT: {
      rechercheEmailParDepartement: (departement: Departement) => string;
    },
    private readonly entrepots: Entrepots
  ) {}

  fabrique(utilisateurMac: UtilisateurMACDTO | undefined): MiseEnRelation {
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

    return new MiseEnRelationParCriteres(
      this.adaptateurEnvoiMail,
      this.annuaireCOT,
      this.entrepots
    );
  }
}

export const fabriqueMiseEnRelation = (
  adaptateurEnvoiMail: AdaptateurEnvoiMail,
  annuaireCOT: {
    rechercheEmailParDepartement: (departement: Departement) => string;
  },
  entrepots: Entrepots
): FabriqueMiseEnRelation =>
  new FabriqueMiseEnRelationConcrete(
    adaptateurEnvoiMail,
    annuaireCOT,
    entrepots
  );
