import { Entreprise } from '../../gestion-demandes/parcours-aidant/Entreprise';

export type TypeAidant =
  | 'RepresentantEtat'
  | 'AgentPublic'
  | 'Association'
  | 'FuturAdherent';

export type TypeAidantEtSonEntite = {
  typeAidant: TypeAidant;
  entite?: Entreprise;
};

export type Etape = 'choixTypeAidant' | 'validationCharteEtCGU';

type DemandeDevenirAidant = {
  type: TypeAidantEtSonEntite;
  signatureCharte?: boolean;
  CGUValidees?: boolean;
};

export type EtatEtapesDemande = {
  etapeCourante: Etape;
  erreur?: Error;
  demande: DemandeDevenirAidant | undefined;
};

enum TypeActionEtapesDemande {
  CHOIX_TYPE_AIDANT_FAIT = 'CHOIX_TYPE_AIDANT_FAIT',
  // DEMANDE_DEVENIR_AIDANT_CREEE = 'DEMANDE_DEVENIR_AIDANT_CREEE',
  RETOUR_ETAPE_PRECEDENTE = 'RETOUR_ETAPE_PRECEDENTE',
}

type ActionEtapesDemande =
  | {
      type: TypeActionEtapesDemande.CHOIX_TYPE_AIDANT_FAIT;
      typeAidantEtSonEntite: TypeAidantEtSonEntite;
    }
  | {
      type: TypeActionEtapesDemande.RETOUR_ETAPE_PRECEDENTE;
    };

const etapesPrecedente: Map<Etape, Etape> = new Map<Etape, Etape>([
  ['validationCharteEtCGU', 'choixTypeAidant'],
]);

export const reducteurEtapesValidationProfilAidant = (
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

    case TypeActionEtapesDemande.CHOIX_TYPE_AIDANT_FAIT:
      return {
        ...etat,
        etapeCourante: 'validationCharteEtCGU',
        demande: {
          ...etat.demande,
          type: {
            typeAidant: action.typeAidantEtSonEntite.typeAidant,
            entite: action.typeAidantEtSonEntite.entite,
          },
        },
      };
  }
};

export const choixTypeAidantFait = (
  typeAidantEtSonEntite: TypeAidantEtSonEntite
): ActionEtapesDemande => ({
  type: TypeActionEtapesDemande.CHOIX_TYPE_AIDANT_FAIT,
  typeAidantEtSonEntite,
});

export const retourEtapePrecedente = (): ActionEtapesDemande => ({
  type: TypeActionEtapesDemande.RETOUR_ETAPE_PRECEDENTE,
});
export const initialiseReducteur = (): EtatEtapesDemande => ({
  demande: undefined,
  etapeCourante: 'choixTypeAidant',
});
