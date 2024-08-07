import { construisErreur, PresentationErreur } from '../../alertes/Erreurs.tsx';
import { estDepartement } from '../../demande-aide/SaisieInformations.tsx';
import { Departement } from '../../../domaine/demande-aide/Aide.ts';
import { estMailValide } from '../../../validateurs/email.ts';

type ErreursSaisieDemande = {
  prenom?: PresentationErreur;
  nom?: PresentationErreur;
  mail?: PresentationErreur;
  departement?: PresentationErreur;
};
type EtatDemande = {
  prenom: string;
  nom: string;
  mail: string;
  departementSaisi: string | Departement;
  departementsProposes: Departement[];
  erreurs?: ErreursSaisieDemande;
  pretPourEnvoi: boolean;
};

enum TypeAction {
  DEMANDE_VALIDEE = 'DEMANDE_VALIDEE',
  PRENOM_SAISI = 'PRENOM_SAISI',
  NOM_SAISI = 'NOM_SAISI',
  MAIL_SAISI = 'MAIL_SAISI',
  DEPARTEMENT_SAISI = 'DEPARTEMENT_SAISI',
  DEPARTEMENTS_PROPOSES = 'DEPARTEMENT_PROPOSES',
  DEMANDE_ENVOYEE = 'DEMANDE_ENVOYEE',
}

type Action =
  | { type: TypeAction.DEMANDE_VALIDEE }
  | { type: TypeAction.PRENOM_SAISI; saisie: string }
  | { type: TypeAction.NOM_SAISI; saisie: string }
  | { type: TypeAction.MAIL_SAISI; saisie: string }
  | { type: TypeAction.DEPARTEMENT_SAISI; saisie: string | Departement }
  | { type: TypeAction.DEPARTEMENTS_PROPOSES; departements: Departement[] }
  | { type: TypeAction.DEMANDE_ENVOYEE };
const estVide = (chaine: string): boolean => chaine === '';
const contientUnChiffre = (chaine: string): boolean =>
  chaine.match(/[0-9]+/) !== null;
const estPrenomValide = (prenom: string): boolean =>
  !estVide(prenom) && !contientUnChiffre(prenom);

const trouveDepartement = (
  nomDepartement: string,
  listeDepartements: Departement[]
): Departement | undefined =>
  listeDepartements.find(({ nom }) => nom === nomDepartement);
export const reducteurDemandeDevenirAidant = (
  etatDemande: EtatDemande,
  action: Action
): EtatDemande => {
  switch (action.type) {
    case TypeAction.DEMANDE_ENVOYEE:
      return {
        ...etatDemande,
        pretPourEnvoi: false,
      };
    case TypeAction.DEMANDE_VALIDEE: {
      delete etatDemande.erreurs;
      return {
        erreurs: {
          ...(!estPrenomValide(etatDemande.prenom)
            ? construisErreur('prenom', {
                identifiantTexteExplicatif: 'prenom',
                texte: 'Veuillez saisir un prénom valide',
              })
            : undefined),
          ...(!estPrenomValide(etatDemande.nom)
            ? construisErreur('nom', {
                identifiantTexteExplicatif: 'nom',
                texte: 'Veuillez saisir un nom valide',
              })
            : undefined),
          ...(!estMailValide(etatDemande.mail)
            ? construisErreur('mail', {
                identifiantTexteExplicatif: 'mail',
                texte: 'Veuillez saisir un mail valide',
              })
            : undefined),
          ...(!trouveDepartement(
            estDepartement(etatDemande.departementSaisi)
              ? etatDemande.departementSaisi.nom
              : etatDemande.departementSaisi,
            etatDemande.departementsProposes
          )
            ? construisErreur('departement', {
                identifiantTexteExplicatif: 'departement',
                texte: 'Veuillez sélectionner un département dans la liste',
              })
            : undefined),
        },
        ...etatDemande,
        pretPourEnvoi: true,
      };
    }

    case TypeAction.PRENOM_SAISI: {
      delete etatDemande.erreurs?.prenom;

      return {
        ...etatDemande,
        prenom: action.saisie,
      };
    }

    case TypeAction.NOM_SAISI: {
      delete etatDemande.erreurs?.nom;

      return {
        ...etatDemande,
        nom: action.saisie,
      };
    }

    case TypeAction.MAIL_SAISI: {
      delete etatDemande.erreurs?.mail;

      return {
        ...etatDemande,
        mail: action.saisie,
      };
    }

    case TypeAction.DEPARTEMENT_SAISI: {
      delete etatDemande.erreurs?.departement;

      const nomDepartementSaisi = estDepartement(action.saisie)
        ? action.saisie.nom
        : action.saisie;

      return {
        ...etatDemande,
        departementSaisi:
          trouveDepartement(
            nomDepartementSaisi,
            etatDemande.departementsProposes
          ) || ({} as Departement),
      };
    }

    case TypeAction.DEPARTEMENTS_PROPOSES: {
      return {
        ...etatDemande,
        departementsProposes: action.departements,
      };
    }
  }
};
export const initialiseDemande = (): EtatDemande => ({
  prenom: '',
  nom: '',
  mail: '',
  departementSaisi: '',
  departementsProposes: [],
  pretPourEnvoi: false,
});
export const valideDemande = (): Action => ({
  type: TypeAction.DEMANDE_VALIDEE,
});
export const saisiPrenom = (saisie: string): Action => ({
  type: TypeAction.PRENOM_SAISI,
  saisie,
});
export const saisieNom = (saisie: string): Action => ({
  type: TypeAction.NOM_SAISI,
  saisie,
});
export const saisieMail = (saisie: string): Action => ({
  type: TypeAction.MAIL_SAISI,
  saisie,
});
export const saisieDepartement = (saisie: Departement | string): Action => ({
  type: TypeAction.DEPARTEMENT_SAISI,
  saisie,
});
export const confirmation = (): Action => ({
  type: TypeAction.DEMANDE_ENVOYEE,
});

export const proposeDepartements = (departements: Departement[]): Action => ({
  type: TypeAction.DEPARTEMENTS_PROPOSES,
  departements,
});
