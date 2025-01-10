import { Utilisation } from './choix-utilisation/ChoixUtilisation.tsx';
import { Entreprise } from './Entreprise';

export type TypeAidant =
  | 'RepresentantEtat'
  | 'AgentPublic'
  | 'Association'
  | 'FuturAdherent';

export type TypeAidantEtSonEntite = {
  typeAidant: TypeAidant;
  entite?: Entreprise;
};

export type Etape =
  | 'choixUtilisation'
  | 'choixTypeAidant'
  | 'signatureCharteAidant'
  | 'signatureCGUs'
  | 'formulaireDevenirAidant';

type DemandeDevenirAidant = {
  type: TypeAidantEtSonEntite;
  signatureCharte?: boolean;
};

export type EtatEtapesDemande = {
  etapeCourante: Etape;
  erreur?: Error;
  demande: DemandeDevenirAidant | undefined;
};

enum TypeActionEtapesDemande {
  CHOIX_UTILISATION_FAITE = 'CHOIX_UTILISATION_FAITE',
  CHOIX_TYPE_AIDANT_FAIT = 'CHOIX_TYPE_AIDANT_FAIT',
  CHARTE_AIDANT_SIGNEE = 'CHARTE_AIDANT_SIGNEE',
  RETOUR_ETAPE_PRECEDENTE = 'RETOUR_ETAPE_PRECEDENTE',
}

type ActionEtapesDemande =
  | {
      type: TypeActionEtapesDemande.CHOIX_UTILISATION_FAITE;
      choix: Utilisation;
    }
  | {
      type: TypeActionEtapesDemande.CHOIX_TYPE_AIDANT_FAIT;
      typeAidantEtSonEntite: TypeAidantEtSonEntite;
    }
  | {
      type: TypeActionEtapesDemande.CHARTE_AIDANT_SIGNEE;
    }
  | {
      type: TypeActionEtapesDemande.RETOUR_ETAPE_PRECEDENTE;
    };

const etapesPrecedente: Map<Etape, Etape> = new Map<Etape, Etape>([
  ['choixTypeAidant', 'choixUtilisation'],
  ['signatureCharteAidant', 'choixTypeAidant'],
  ['formulaireDevenirAidant', 'signatureCharteAidant'],
]);

export const reducteurEtapes = (
  etat: EtatEtapesDemande,
  action: ActionEtapesDemande
): EtatEtapesDemande => {
  switch (action.type) {
    case TypeActionEtapesDemande.RETOUR_ETAPE_PRECEDENTE:
      delete etat.demande?.signatureCharte;
      return {
        ...etat,
        etapeCourante: etapesPrecedente.get(etat.etapeCourante)!,
      };
    case TypeActionEtapesDemande.CHOIX_UTILISATION_FAITE:
      return {
        ...etat,
        etapeCourante:
          action.choix === 'InteretGeneral'
            ? 'choixTypeAidant'
            : 'signatureCGUs',
      };
    case TypeActionEtapesDemande.CHOIX_TYPE_AIDANT_FAIT:
      return {
        ...etat,
        etapeCourante: 'signatureCharteAidant',
        demande: {
          ...etat.demande,
          type: {
            typeAidant: action.typeAidantEtSonEntite.typeAidant,
            entite: action.typeAidantEtSonEntite.entite,
          },
        },
      };
    case TypeActionEtapesDemande.CHARTE_AIDANT_SIGNEE:
      return {
        ...etat,
        ...(etat.demande && {
          demande: {
            ...etat.demande,
            signatureCharte: true,
          },
        }),
        etapeCourante: 'formulaireDevenirAidant',
      };
  }
};

export const choixUtilisationFaite = (
  choix: Utilisation
): ActionEtapesDemande => ({
  type: TypeActionEtapesDemande.CHOIX_UTILISATION_FAITE,
  choix,
});

export const choixTypeAidantFait = (
  typeAidantEtSonEntite: TypeAidantEtSonEntite
): ActionEtapesDemande => ({
  type: TypeActionEtapesDemande.CHOIX_TYPE_AIDANT_FAIT,
  typeAidantEtSonEntite,
});

export const signeCharteAidant = (): ActionEtapesDemande => ({
  type: TypeActionEtapesDemande.CHARTE_AIDANT_SIGNEE,
});

export const retourEtapePrecedente = (): ActionEtapesDemande => ({
  type: TypeActionEtapesDemande.RETOUR_ETAPE_PRECEDENTE,
});
export const initialiseReducteur = (): EtatEtapesDemande => ({
  demande: undefined,
  etapeCourante: 'choixUtilisation',
});
