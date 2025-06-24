import {
  InformationsAidant,
  InformationsTypeAidant,
} from './EcranMonEspaceDemandeDevenirAidant.tsx';

export type EtatInformationsAidant = {
  informations: InformationsAidant;
};

enum TypeActionInformationsAidant {
  CHOIX_TYPE_AIDANT_FAIT = 'CHOIX_TYPE_AIDANT_FAIT',
  CHARTE_AIDANT_SIGNEE = 'CHARTE_AIDANT_SIGNEE',
  VIDE_INFORMATIONS_TYPE_AIDANT = 'VIDE_INFORMATIONS_TYPE_AIDANT',
}

type ActionInformationsAidant =
  | { type: TypeActionInformationsAidant.CHARTE_AIDANT_SIGNEE }
  | {
      type: TypeActionInformationsAidant.CHOIX_TYPE_AIDANT_FAIT;
      informationsTypeAidant: InformationsTypeAidant;
    }
  | {
      type: TypeActionInformationsAidant.VIDE_INFORMATIONS_TYPE_AIDANT;
    };

export const reducteurInformationsAidant = (
  etat: EtatInformationsAidant,
  action: ActionInformationsAidant
): EtatInformationsAidant => {
  switch (action.type) {
    case TypeActionInformationsAidant.VIDE_INFORMATIONS_TYPE_AIDANT:
      return {
        ...etat,
        informations: {
          ...etat.informations,
          entite: undefined,
          typeAidant: undefined,
        },
      };
    case TypeActionInformationsAidant.CHARTE_AIDANT_SIGNEE:
      return {
        ...etat,
        informations: {
          ...etat.informations,
          charteValidee: true,
        },
      };
    case TypeActionInformationsAidant.CHOIX_TYPE_AIDANT_FAIT:
      return {
        ...etat,
        informations: {
          ...etat.informations,
          entite: action.informationsTypeAidant.entite,
          typeAidant: action.informationsTypeAidant.typeAidant,
        },
      };
  }
};

export const choixTypeAidantFait = (
  informationsTypeAidant: InformationsTypeAidant
): ActionInformationsAidant => ({
  type: TypeActionInformationsAidant.CHOIX_TYPE_AIDANT_FAIT,
  informationsTypeAidant,
});

export const valideLaCharteAidant = (): ActionInformationsAidant => ({
  type: TypeActionInformationsAidant.CHARTE_AIDANT_SIGNEE,
});

export const videLesInformationsDuTypeAidant =
  (): ActionInformationsAidant => ({
    type: TypeActionInformationsAidant.VIDE_INFORMATIONS_TYPE_AIDANT,
  });

export const initialiseReducteurInformationsAidant =
  (): EtatInformationsAidant => ({
    informations: {
      charteValidee: false,
      entite: undefined,
      typeAidant: undefined,
    },
  });
