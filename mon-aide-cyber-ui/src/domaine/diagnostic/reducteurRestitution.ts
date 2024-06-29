import { Restitution } from './Restitution.ts';

export type EtatRestitution = {
  restitution?: Restitution;
  nomRubriqueConsultee?: string;
};

type ActionRestitution =
  | {
      restitution: Restitution;
      type: TypeActionRestitution.RESTITUTION_CHARGEE;
    }
  | {
      nomRubrique: string;
      type: TypeActionRestitution.RUBRIQUE_CONSULTEE;
    };

enum TypeActionRestitution {
  RESTITUTION_CHARGEE = 'RESTITUTION_CHARGEE',
  RUBRIQUE_CONSULTEE = 'RUBRIQUE_CONSULTEE',
}

export const reducteurRestitution = (
  etat: EtatRestitution,
  action: ActionRestitution
): EtatRestitution => {
  switch (action.type) {
    case TypeActionRestitution.RUBRIQUE_CONSULTEE:
      return { ...etat, nomRubriqueConsultee: action.nomRubrique };
    case TypeActionRestitution.RESTITUTION_CHARGEE:
      return { ...etat, restitution: action.restitution };
  }
};

export const restitutionChargee = (
  restitution: Restitution
): ActionRestitution => ({
  restitution: restitution,
  type: TypeActionRestitution.RESTITUTION_CHARGEE,
});

export const rubriqueConsultee = (nomRubrique: string): ActionRestitution => ({
  nomRubrique,
  type: TypeActionRestitution.RUBRIQUE_CONSULTEE,
});
