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
import crypto from 'crypto';
import { AdaptateurRechercheEntreprise } from '../../infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import { AdaptateurGeographie } from '../../adaptateurs/AdaptateurGeographie';

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

export const envoieAuCOTAucunAidantPourLaDemandeAide = async (
  adaptateurEnvoiMail: AdaptateurEnvoiMail,
  donneesMiseEnRelation: DonneesMiseEnRelation,
  annuaireCOT: {
    rechercheEmailParDepartement: (departement: Departement) => string;
  }
) => {
  await adaptateurEnvoiMail.envoie({
    objet: "Demande d'aide pour MonAideCyber",
    destinataire: {
      email: annuaireCOT.rechercheEmailParDepartement(
        donneesMiseEnRelation.demandeAide.departement
      ),
    },
    copie: adaptateurEnvironnement.messagerie().copieMAC(),
    corps: adaptateursCorpsMessage
      .demande()
      .aucunAidantPourLaDemandeAide()
      .genereCorpsMessage(donneesMiseEnRelation),
  });
};

export const envoieAuCotRecapitulatifDemandeAideDirecteAidant = async (
  adaptateurEnvoiMail: AdaptateurEnvoiMail,
  donneesMiseEnRelation: DonneesMiseEnRelation,
  relationUtilisateur: string,
  annuaireCOT: {
    rechercheEmailParDepartement: (departement: Departement) => string;
  }
) => {
  await adaptateurEnvoiMail.envoie({
    objet:
      "Demande d'aide pour MonAideCyber en relation directe avec un Aidant",
    destinataire: {
      email: annuaireCOT.rechercheEmailParDepartement(
        donneesMiseEnRelation.demandeAide.departement
      ),
    },
    copie: adaptateurEnvironnement.messagerie().copieMAC(),
    corps: adaptateursCorpsMessage
      .demande()
      .recapitulatifDemandeAideDirecteAidant()
      .genereCorpsMessage(donneesMiseEnRelation, relationUtilisateur),
  });
};

export const envoieRecapitulatifDemandeAide = async (
  adaptateurEnvoiMail: AdaptateurEnvoiMail,
  aide: DemandeAide,
  aidants: Aidant[],
  annuaireCOT: {
    rechercheEmailParDepartement: (departement: Departement) => string;
  }
) => {
  await adaptateurEnvoiMail.envoie({
    objet: "Assignation d’un Aidant pour une demande d'aide pour MonAideCyber",
    destinataire: {
      email: annuaireCOT.rechercheEmailParDepartement(aide.departement),
    },
    copie: adaptateurEnvironnement.messagerie().copieMAC(),
    corps: adaptateursCorpsMessage
      .demande()
      .recapitulatifDemandeAide()
      .genereCorpsMessage(aide, aidants),
  });
};

export type DonneesMiseEnRelation = {
  demandeAide: DemandeAide;
  siret: string;
  typeEntite:
    | EntitesOrganisationsPubliques
    | EntitesEntreprisesPrivees
    | EntitesAssociations;
  secteursActivite: SecteurActivite[];
};

type DonneesEntite = {
  typeEntite: string;
  secteursActivite: string[];
  departement: string;
};

export type ParCriteres = DonneesEntite & {
  nombreAidants: number;
};

export type DirecteAidant = DonneesEntite & {
  idAidant: crypto.UUID;
};

export type DirecteUtilisateurInscrit = DonneesEntite & {
  idUtilisateurInscrit: crypto.UUID;
};

export type ResultatMiseEnRelation<
  T extends ParCriteres | DirecteAidant | DirecteUtilisateurInscrit,
> = {
  type: 'DIRECTE_UTILISATEUR_INSCRIT' | 'DIRECTE_AIDANT' | 'PAR_CRITERES';
  resultat: T;
};

export interface MiseEnRelation {
  execute(
    donneesMiseEnRelation: DonneesMiseEnRelation
  ): Promise<
    ResultatMiseEnRelation<
      ParCriteres | DirecteAidant | DirecteUtilisateurInscrit
    >
  >;
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
    private readonly entrepots: Entrepots,
    private readonly adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise,
    private readonly adaptateurGeo: AdaptateurGeographie
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
      this.entrepots,
      this.adaptateurRechercheEntreprise,
      this.adaptateurGeo
    );
  }
}

export const fabriqueMiseEnRelation = (
  adaptateurEnvoiMail: AdaptateurEnvoiMail,
  annuaireCOT: {
    rechercheEmailParDepartement: (departement: Departement) => string;
  },
  entrepots: Entrepots,
  adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise,
  adaptateurGeo: AdaptateurGeographie
): FabriqueMiseEnRelation =>
  new FabriqueMiseEnRelationConcrete(
    adaptateurEnvoiMail,
    annuaireCOT,
    entrepots,
    adaptateurRechercheEntreprise,
    adaptateurGeo
  );
