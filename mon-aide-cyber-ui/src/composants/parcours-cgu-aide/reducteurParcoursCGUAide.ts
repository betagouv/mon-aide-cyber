enum TypeActionParcoursCGU {
  CONFIRMATION = 'CONFIRMATION',
  SAISIE_INFORMATION_EN_ERREUR = 'SAISIE_INFORMATION_EN_ERREUR',
}

type EtatParcoursCGU = {
  etapeCourante: 'saisieInformations' | 'confirmation';
};

type ActionParcoursCGU =
  | {
      type: TypeActionParcoursCGU.CONFIRMATION;
    }
  | {
      type: TypeActionParcoursCGU.SAISIE_INFORMATION_EN_ERREUR;
      erreur: Error;
    };
export const reducteurParcoursCGUAide = (
  etat: EtatParcoursCGU,
  action: ActionParcoursCGU,
): EtatParcoursCGU => {
  switch (action.type) {
    case TypeActionParcoursCGU.CONFIRMATION: {
      return {
        ...etat,
        etapeCourante: 'confirmation',
      };
    }
    case TypeActionParcoursCGU.SAISIE_INFORMATION_EN_ERREUR:
      return {
        ...etat,
        etapeCourante: 'saisieInformations',
      };
  }
};

export const confirmation = (): ActionParcoursCGU => ({
  type: TypeActionParcoursCGU.CONFIRMATION,
});

export const saisieInformationsEnErreur = (
  erreur: Error,
): ActionParcoursCGU => ({
  type: TypeActionParcoursCGU.SAISIE_INFORMATION_EN_ERREUR,
  erreur,
});
