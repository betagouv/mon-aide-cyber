import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';

export class FournisseurHorlogeDeTest {
  static initialise(maintenant: Date) {
    FournisseurHorloge.maintenant = () => maintenant;
  }
}
