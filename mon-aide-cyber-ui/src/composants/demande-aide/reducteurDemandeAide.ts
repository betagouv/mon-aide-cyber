enum TypeActionParcoursCGU {
  CONFIRMATION = 'CONFIRMATION',
  SAISIE_INFORMATION_EN_ERREUR = 'SAISIE_INFORMATION_EN_ERREUR',
}

export type EtatParcoursCGU = {
  etapeCourante: 'saisieInformations' | 'confirmation';
  erreur?: Error;
};

type ActionParcoursCGU =
  | {
      type: TypeActionParcoursCGU.CONFIRMATION;
    }
  | {
      type: TypeActionParcoursCGU.SAISIE_INFORMATION_EN_ERREUR;
      erreur: Error;
    };
export const reducteurDemandeAide = (
  etat: EtatParcoursCGU,
  action: ActionParcoursCGU,
): EtatParcoursCGU => {
  switch (action.type) {
    case TypeActionParcoursCGU.CONFIRMATION: {
      const etatCourant = { ...etat };
      delete etatCourant['erreur'];
      return {
        ...etatCourant,
        etapeCourante: 'confirmation',
      };
    }
    case TypeActionParcoursCGU.SAISIE_INFORMATION_EN_ERREUR:
      return {
        ...etat,
        etapeCourante: 'saisieInformations',
        erreur: action.erreur,
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
