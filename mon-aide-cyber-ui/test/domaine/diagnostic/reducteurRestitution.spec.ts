import { describe, expect, it } from 'vitest';
import {
  EtatRestitution,
  reducteurRestitution,
  restitutionChargee,
  rubriqueConsultee,
} from '../../../src/domaine/diagnostic/reducteurRestitution';
import { uneRestitution } from '../../constructeurs/constructeurRestitution.ts';

describe('Réducteur Restitution', () => {
  it('charge la restitution', () => {
    const restitution = uneRestitution().construis();
    const etatRestitution = reducteurRestitution(
      {} as EtatRestitution,
      restitutionChargee(restitution)
    );

    expect(etatRestitution).toStrictEqual({
      restitution,
    });
  });

  it('conserve la rubrique cliquée', () => {
    const restitution = uneRestitution().construis();

    const etatRestitution = reducteurRestitution(
      { restitution },
      rubriqueConsultee('informations')
    );

    expect(etatRestitution).toStrictEqual<EtatRestitution>({
      restitution: restitution,
      nomRubriqueConsultee: 'informations',
    });
  });
});
