import { describe, expect, it } from 'vitest';
import {
  avancerEtapeSuivante,
  EtatEtapesDemande,
  initialiseReducteur,
  reducteurMonEspaceDemandeDevenirAidant,
  retourEtapePrecedente,
} from '../../../../src/domaine/gestion-demandes/parcours-aidant/reducteurMonEspaceDemandeDevenirAidant';

describe('Reducteur d’étapes pour le parcours Aidant', () => {
  it("Initialise le réducteur sur l'étape de choix du type d'Aidant", () => {
    const etatInitial = initialiseReducteur();
    expect(etatInitial).toStrictEqual<EtatEtapesDemande>({
      etapeCourante: 'choixTypeAidant',
    });
  });

  describe("Pour aller sur l'étape suivante", () => {
    it('Vers la signature de la charte', () => {
      const etat = reducteurMonEspaceDemandeDevenirAidant(
        { etapeCourante: 'choixTypeAidant' },
        avancerEtapeSuivante()
      );

      expect(etat).toStrictEqual({
        etapeCourante: 'signatureCharteAidant',
      });
    });

    it('Vers la saisie des informations', () => {
      const etat = reducteurMonEspaceDemandeDevenirAidant(
        { etapeCourante: 'signatureCharteAidant' },
        avancerEtapeSuivante()
      );

      expect(etat).toStrictEqual({
        etapeCourante: 'formulaireDevenirAidant',
      });
    });

    it('Vers la confirmation', () => {
      const etat = reducteurMonEspaceDemandeDevenirAidant(
        {
          etapeCourante: 'formulaireDevenirAidant',
        },
        avancerEtapeSuivante()
      );

      expect(etat).toStrictEqual<EtatEtapesDemande>({
        etapeCourante: 'confirmationDemandeDevenirAidantPriseEnCompte',
      });
    });
  });

  describe("Pour aller sur l'étape suivante", () => {
    it('Revenir sur son choix', () => {
      const etat = reducteurMonEspaceDemandeDevenirAidant(
        { etapeCourante: 'signatureCharteAidant' },
        retourEtapePrecedente()
      );

      expect(etat).toStrictEqual({
        etapeCourante: 'choixTypeAidant',
      });
    });
  });
});
