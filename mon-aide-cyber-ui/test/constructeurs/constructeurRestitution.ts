import { fakerFR } from '@faker-js/faker';
import { Restitution } from '../../src/domaine/diagnostic/Restitution';
import { Constructeur } from './Constructeur';

class ConstructeurRestitution implements Constructeur<Restitution> {
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

export const uneRestitution = () => new ConstructeurRestitution();
