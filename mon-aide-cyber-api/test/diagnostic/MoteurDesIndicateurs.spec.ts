import { describe, expect } from 'vitest';
import {
  desValeursDesReponsesAuDiagnostic,
  uneValeur,
} from '../constructeurs/constructeurValeur';
import { MoteurDesIndicateurs } from '../../src/diagnostic/MoteurDesIndicateurs';
import { Indicateurs } from '../../src/diagnostic/Diagnostic';

describe('Moteur des indicateurs', () => {
  it('génère les indicateurs uniquement pour les valeurs de réponses valorisées', () => {
    const valeurs = desValeursDesReponsesAuDiagnostic()
      .pourLaThematique('thematique')
      .ajoute(uneValeur().de(2).construis())
      .ajoute(undefined)
      .ajoute(uneValeur().de(3).construis())
      .construis();

    const indicateurs = MoteurDesIndicateurs.genereLesIndicateurs(valeurs);

    expect(indicateurs).toStrictEqual<Indicateurs>({
      thematique: { moyennePonderee: 2.5 },
    });
  });
});
