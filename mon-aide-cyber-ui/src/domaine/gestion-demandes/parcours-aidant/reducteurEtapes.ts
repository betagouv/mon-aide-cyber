import { Utilisation } from './ChoixUtilisation.tsx';
import { Entreprise } from './ChoixTypeAidant.tsx';

export type TypeAidant =
  | 'RepresentantEtat'
  | 'AgentPublic'
  | 'Association'
  | 'FuturAdherent';

export type TypeAidantEtSonEntreprise = {
  typeAidant: TypeAidant;
  entreprise?: Entreprise;
};

export type Etape =
  | 'choixUtilisation'
  | 'choixTypeAidant'
  | 'signatureCharteAidant'
  | 'signatureCGUs';

type DemandeDevenirAidant = {
  type: TypeAidantEtSonEntreprise;
};

export type EtatEtapesDemande = {
  etapeCourante: Etape;
  erreur?: Error;
  demande: DemandeDevenirAidant | undefined;
};

enum TypeActionEtapesDemande {
  CHOIX_UTILISATION_FAITE = 'CHOIX_UTILISATION_FAITE',
  CHOIX_TYPE_AIDANT_FAIT = 'CHOIX_TYPE_AIDANT_FAIT',
  RETOUR_ETAPE_PRECEDENTE = 'RETOUR_ETAPE_PRECEDENTE',
}

type ActionEtapesDemande =
  | {
      type: TypeActionEtapesDemande.CHOIX_UTILISATION_FAITE;
      choix: Utilisation;
    }
  | {
      type: TypeActionEtapesDemande.CHOIX_TYPE_AIDANT_FAIT;
      typeAidantEtSonEntreprise: TypeAidantEtSonEntreprise;
    }
  | {
      type: TypeActionEtapesDemande.RETOUR_ETAPE_PRECEDENTE;
    };

const etapesPrecedente: Map<Etape, Etape> = new Map<Etape, Etape>([
  ['choixTypeAidant', 'choixUtilisation'],
  ['signatureCharteAidant', 'choixTypeAidant'],
]);

export const reducteurEtapes = (
  etat: EtatEtapesDemande,
  action: ActionEtapesDemande
): EtatEtapesDemande => {
  switch (action.type) {
    case TypeActionEtapesDemande.RETOUR_ETAPE_PRECEDENTE:
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
            typeAidant: action.typeAidantEtSonEntreprise.typeAidant,
            entreprise: action.typeAidantEtSonEntreprise.entreprise,
          },
        },
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
  typeAidantEtSonEntreprise: TypeAidantEtSonEntreprise
): ActionEtapesDemande => ({
  type: TypeActionEtapesDemande.CHOIX_TYPE_AIDANT_FAIT,
  typeAidantEtSonEntreprise,
});

export const retourEtapePrecedente = (): ActionEtapesDemande => ({
  type: TypeActionEtapesDemande.RETOUR_ETAPE_PRECEDENTE,
});
export const initialiseReducteur = (): EtatEtapesDemande => ({
  demande: undefined,
  etapeCourante: 'choixUtilisation',
});
