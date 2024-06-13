import { Restitution } from './Restitution.ts';

export type EtatRestitution = {
  restitution?: Restitution;
  rubrique?: string;
};

type ActionRestitution =
  | {
      restitution: Restitution;
      type: TypeActionRestitution.RESTITUTION_CHARGEE;
    }
  | {
      rubrique: string;
      type: TypeActionRestitution.RUBRIQUE_CLIQUEE;
    };

enum TypeActionRestitution {
  RESTITUTION_CHARGEE = 'RESTITUTION_CHARGEE',
  RUBRIQUE_CLIQUEE = 'RUBRIQUE_CLIQUEE',
}

export const reducteurRestitution = (
  etat: EtatRestitution,
  action: ActionRestitution
): EtatRestitution => {
  switch (action.type) {
    case TypeActionRestitution.RUBRIQUE_CLIQUEE:
      return { ...etat, rubrique: action.rubrique };
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

export const rubriqueCliquee = (rubrique: string): ActionRestitution => ({
  rubrique,
  type: TypeActionRestitution.RUBRIQUE_CLIQUEE,
});
