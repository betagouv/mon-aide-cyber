import { describe, it } from 'vitest';
import {
  EtatRestitution,
  reducteurRestitution,
  restitutionChargee,
  rubriqueCliquee,
} from '../../../src/domaine/diagnostic/reducteurRestitution';
import { Restitution } from '../../../src/domaine/diagnostic/Restitution';
import { fakerFR } from '@faker-js/faker';

class ConstructeurRestitution {
  constructor(
    private autresMesures: string = fakerFR.lorem.text(),
    private indicateurs: string = fakerFR.lorem.text(),
    private informations: string = fakerFR.lorem.text(),
    private mesuresPrioritaires: string = fakerFR.lorem.text(),
  ) {}

  construis(): Restitution {
    return {
      autresMesures: this.autresMesures,
      indicateurs: this.indicateurs,
      informations: this.informations,
      mesuresPrioritaires: this.mesuresPrioritaires,
    };
  }
}

const uneRestitution = () => new ConstructeurRestitution();
describe('Réducteur Restitution', () => {
  it('charge la restitution', () => {
    const restitution = uneRestitution().construis();
    const etatRestitution = reducteurRestitution(
      {} as EtatRestitution,
      restitutionChargee(restitution),
    );

    expect(etatRestitution).toStrictEqual({
      restitution,
    });
  });

  it('conserve la rubrique cliquée', () => {
    const restitution = uneRestitution().construis();

    const etatRestitution = reducteurRestitution(
      { restitution },
      rubriqueCliquee('informations'),
    );

    expect(etatRestitution).toStrictEqual<EtatRestitution>({
      restitution: restitution,
      rubrique: 'informations',
    });
  });
});
