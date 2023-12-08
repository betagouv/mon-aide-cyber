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
      .ajoute(uneValeur().de(3).construis())
      .construis();

    const indicateurs = MoteurDesIndicateurs.genereLesIndicateurs(valeurs);

    expect(indicateurs).toStrictEqual<Indicateurs>({
      thematique: { moyennePonderee: 2.5 },
    });
  });

  it('génère les indicateurs en prenant en compte le poids des réponses', () => {
    const valeurs = desValeursDesReponsesAuDiagnostic()
      .pourLaThematique('thematique')
      .ajoute(uneValeur().de(2).avecUnPoidsDe(3).construis())
      .ajoute(uneValeur().de(1).avecUnPoidsDe(2).construis())
      .ajoute(uneValeur().de(1.5).avecUnPoidsDe(3).construis())
      .construis();

    const indicateurs = MoteurDesIndicateurs.genereLesIndicateurs(valeurs);

    expect(indicateurs).toStrictEqual<Indicateurs>({
      thematique: { moyennePonderee: 1.5625 },
    });
  });
});
