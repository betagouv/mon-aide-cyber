import { describe, expect } from 'vitest';
import {
  confirmation,
  EtatEtapesDemandeAide,
  reducteurDemandeAide,
  saisieInformationsEnErreur,
} from '../../../src/composants/demande-aide/reducteurDemandeAide.ts';

describe('Réducteur Demande d’aide', () => {
  it('Marque la demande d’aide en erreur', () => {
    const erreur = new Error('Une erreur');
    const etat = reducteurDemandeAide(
      { etapeCourante: 'saisieInformations' },
      saisieInformationsEnErreur(erreur)
    );

    expect(etat).toStrictEqual<EtatEtapesDemandeAide>({
      etapeCourante: 'saisieInformations',
      erreur,
    });
  });

  it('Retire l’erreur lorsque l’on change d’étape', () => {
    const erreur = new Error('Une erreur');
    const etat = reducteurDemandeAide(
      { etapeCourante: 'saisieInformations', erreur },
      confirmation()
    );

    expect(etat).toStrictEqual<EtatEtapesDemandeAide>({
      etapeCourante: 'confirmation',
    });
  });
});
