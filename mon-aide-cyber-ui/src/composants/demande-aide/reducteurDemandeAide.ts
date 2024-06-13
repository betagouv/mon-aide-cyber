enum TypeActionEtapesDemandeAide {
  CONFIRMATION = 'CONFIRMATION',
  SAISIE_INFORMATION_EN_ERREUR = 'SAISIE_INFORMATION_EN_ERREUR',
}

export type EtatEtapesDemandeAide = {
  etapeCourante: 'saisieInformations' | 'confirmation';
  erreur?: Error;
};

type ActionEtapesDemandeAide =
  | {
      type: TypeActionEtapesDemandeAide.CONFIRMATION;
    }
  | {
      type: TypeActionEtapesDemandeAide.SAISIE_INFORMATION_EN_ERREUR;
      erreur: Error;
    };
export const reducteurDemandeAide = (
  etat: EtatEtapesDemandeAide,
  action: ActionEtapesDemandeAide
): EtatEtapesDemandeAide => {
  switch (action.type) {
    case TypeActionEtapesDemandeAide.CONFIRMATION: {
      const etatCourant = { ...etat };
      delete etatCourant['erreur'];
      return {
        ...etatCourant,
        etapeCourante: 'confirmation',
      };
    }
    case TypeActionEtapesDemandeAide.SAISIE_INFORMATION_EN_ERREUR:
      return {
        ...etat,
        etapeCourante: 'saisieInformations',
        erreur: action.erreur,
      };
  }
};

export const confirmation = (): ActionEtapesDemandeAide => ({
  type: TypeActionEtapesDemandeAide.CONFIRMATION,
});

export const saisieInformationsEnErreur = (
  erreur: Error
): ActionEtapesDemandeAide => ({
  type: TypeActionEtapesDemandeAide.SAISIE_INFORMATION_EN_ERREUR,
  erreur,
});
