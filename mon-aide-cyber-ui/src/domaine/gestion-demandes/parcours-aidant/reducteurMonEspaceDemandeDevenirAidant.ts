export type Etape =
  | 'choixTypeAidant'
  | 'signatureCharteAidant'
  | 'formulaireDevenirAidant'
  | 'confirmationDemandeDevenirAidantPriseEnCompte';

export type EtatEtapesDemande = {
  etapeCourante: Etape;
};

enum TypeActionEtapesDemande {
  AVANCER_ETAPE_SUIVANTE = 'AVANCER_ETAPE_SUIVANTE',
  RETOUR_ETAPE_PRECEDENTE = 'RETOUR_ETAPE_PRECEDENTE',
}

type ActionEtapesDemande =
  | {
      type: TypeActionEtapesDemande.RETOUR_ETAPE_PRECEDENTE;
    }
  | { type: TypeActionEtapesDemande.AVANCER_ETAPE_SUIVANTE };

const etapesOrdonnees: Etape[] = [
  'choixTypeAidant',
  'signatureCharteAidant',
  'formulaireDevenirAidant',
  'confirmationDemandeDevenirAidantPriseEnCompte',
];

export const reducteurMonEspaceDemandeDevenirAidant = (
  etat: EtatEtapesDemande,
  action: ActionEtapesDemande
): EtatEtapesDemande => {
  const indexEtapeCourante = etapesOrdonnees.findIndex(
    (x) => x === etat.etapeCourante
  );

  switch (action.type) {
    case TypeActionEtapesDemande.AVANCER_ETAPE_SUIVANTE:
      return {
        ...etat,
        etapeCourante: etapesOrdonnees[indexEtapeCourante + 1],
      };
    case TypeActionEtapesDemande.RETOUR_ETAPE_PRECEDENTE:
      return {
        ...etat,
        etapeCourante: etapesOrdonnees[indexEtapeCourante - 1],
      };
  }
};

export const retourEtapePrecedente = (): ActionEtapesDemande => ({
  type: TypeActionEtapesDemande.RETOUR_ETAPE_PRECEDENTE,
});

export const avancerEtapeSuivante = (): ActionEtapesDemande => ({
  type: TypeActionEtapesDemande.AVANCER_ETAPE_SUIVANTE,
});

export const initialiseReducteur = (): EtatEtapesDemande => ({
  etapeCourante: 'choixTypeAidant',
});
