import { describe, it } from 'vitest';
import {
  EtatRestitution,
  reducteurRestitution,
  restitutionChargee,
  rubriqueCliquee,
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
      rubriqueCliquee('informations')
    );

    expect(etatRestitution).toStrictEqual<EtatRestitution>({
      restitution: restitution,
      rubrique: 'informations',
    });
  });
});
