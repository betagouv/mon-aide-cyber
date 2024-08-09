import { construisErreur, PresentationErreur } from '../../alertes/Erreurs.tsx';
import { estDepartement } from '../../demande-aide/SaisieInformations.tsx';
import { Departement } from '../../../domaine/demande-aide/Aide.ts';
import { estMailValide } from '../../../validateurs/email.ts';

type ErreursSaisieDemande = {
  cguValidees?: PresentationErreur;
  prenom?: PresentationErreur;
  nom?: PresentationErreur;
  mail?: PresentationErreur;
  departement?: PresentationErreur;
};
type EtatDemande = {
  cguValidees: boolean;
  prenom: string;
  nom: string;
  mail: string;
  departementSaisi: string | Departement;
  departementsProposes: Departement[];
  erreurs?: ErreursSaisieDemande;
  pretPourEnvoi: boolean;
  envoiReussi: boolean;
};

enum TypeAction {
  DEMANDE_VALIDEE = 'DEMANDE_VALIDEE',
  DEMANDE_INVALIDEE = 'DEMANDE_INVALIDEE',
  PRENOM_SAISI = 'PRENOM_SAISI',
  NOM_SAISI = 'NOM_SAISI',
  MAIL_SAISI = 'MAIL_SAISI',
  DEPARTEMENT_SAISI = 'DEPARTEMENT_SAISI',
  DEPARTEMENTS_PROPOSES = 'DEPARTEMENT_PROPOSES',
  DEMANDE_ENVOYEE = 'DEMANDE_ENVOYEE',
  CGU_VALIDEES = 'CGU_VALIDEES',
}

type Action =
  | { type: TypeAction.DEMANDE_VALIDEE }
  | { type: TypeAction.DEMANDE_INVALIDEE }
  | { type: TypeAction.PRENOM_SAISI; saisie: string }
  | { type: TypeAction.NOM_SAISI; saisie: string }
  | { type: TypeAction.MAIL_SAISI; saisie: string }
  | { type: TypeAction.DEPARTEMENT_SAISI; saisie: string | Departement }
  | { type: TypeAction.DEPARTEMENTS_PROPOSES; departements: Departement[] }
  | { type: TypeAction.DEMANDE_ENVOYEE }
  | { type: TypeAction.CGU_VALIDEES };

const construisErreurPrenom = (prenomValide: boolean) => {
  return !prenomValide
    ? construisErreur('prenom', {
        identifiantTexteExplicatif: 'prenom',
        texte: 'Veuillez saisir un prénom valide',
      })
    : undefined;
};

const construisErreurNom = (nomValide: boolean) => {
  return !nomValide
    ? construisErreur('nom', {
        identifiantTexteExplicatif: 'nom',
        texte: 'Veuillez saisir un nom valide',
      })
    : undefined;
};

const construisErreurMail = (mailValide: boolean) => {
  return !mailValide
    ? construisErreur('mail', {
        identifiantTexteExplicatif: 'mail',
        texte: 'Veuillez saisir un mail valide',
      })
    : undefined;
};

const construisErreurDepartement = (departementvalide: boolean) => {
  return !departementvalide
    ? construisErreur('departement', {
        identifiantTexteExplicatif: 'departement',
        texte: 'Veuillez sélectionner un département dans la liste',
      })
    : undefined;
};

const construisErreurCgu = (cguValidees: boolean) => {
  return (
    !cguValidees &&
    construisErreur('cguValidees', {
      identifiantTexteExplicatif: 'cguValidees',
      texte: 'Veuillez valider les CGU.',
    })
  );
};

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
    case TypeAction.CGU_VALIDEES: {
      const cguValidees = !etatDemande.cguValidees;
      const etatCourant = { ...etatDemande };

      if (cguValidees) {
        delete etatCourant.erreurs?.['cguValidees'];
      }
      return {
        ...etatCourant,
        cguValidees,
        ...(!cguValidees && {
          erreurs: {
            ...construisErreur('cguValidees', {
              identifiantTexteExplicatif: 'cguValidees',
              texte: 'Veuillez valider les CGU.',
            }),
          },
        }),
      };
    }
    case TypeAction.DEMANDE_ENVOYEE:
      return {
        ...etatDemande,
        pretPourEnvoi: false,
        envoiReussi: true,
      };
    case TypeAction.DEMANDE_VALIDEE: {
      delete etatDemande.erreurs;

      const nomValide = estPrenomValide(etatDemande.nom);
      const prenomValide = estPrenomValide(etatDemande.prenom);
      const mailValide = estMailValide(etatDemande.mail);
      const departement = trouveDepartement(
        estDepartement(etatDemande.departementSaisi)
          ? etatDemande.departementSaisi.nom
          : etatDemande.departementSaisi,
        etatDemande.departementsProposes
      );
      const departementvalide = !!departement;

      const pretPourEnvoi =
        nomValide &&
        prenomValide &&
        mailValide &&
        departementvalide &&
        etatDemande.cguValidees;

      const erreurs = {
        ...construisErreurPrenom(prenomValide),
        ...construisErreurNom(nomValide),
        ...construisErreurMail(mailValide),
        ...construisErreurDepartement(departementvalide),
        ...construisErreurCgu(etatDemande.cguValidees),
      };

      return {
        ...etatDemande,
        ...(!pretPourEnvoi && {
          erreurs,
        }),
        pretPourEnvoi,
      };
    }

    case TypeAction.DEMANDE_INVALIDEE: {
      return {
        ...etatDemande,
        pretPourEnvoi: false,
        envoiReussi: false,
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
  cguValidees: false,
  envoiReussi: false,
});
export const valideDemande = (): Action => ({
  type: TypeAction.DEMANDE_VALIDEE,
});
export const invalideDemande = (): Action => ({
  type: TypeAction.DEMANDE_INVALIDEE,
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
export const cguValidees = (): Action => ({
  type: TypeAction.CGU_VALIDEES,
});
export const confirmation = (): Action => ({
  type: TypeAction.DEMANDE_ENVOYEE,
});

export const proposeDepartements = (departements: Departement[]): Action => ({
  type: TypeAction.DEPARTEMENTS_PROPOSES,
  departements,
});
