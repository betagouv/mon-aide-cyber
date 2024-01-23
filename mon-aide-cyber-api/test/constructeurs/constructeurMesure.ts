import { Constructeur } from './constructeur';
import { MesurePriorisee } from '../../src/diagnostic/Diagnostic';
import { fakerFR } from '@faker-js/faker';
import { Valeur } from '../../src/diagnostic/Indice';

class ConstructeurMesurePriorisee implements Constructeur<MesurePriorisee> {
  private titre: string = fakerFR.lorem.words(3);
  private pourquoi: string = fakerFR.word.words(2);
  private comment: string = fakerFR.word.words(2);
  private priorisation: number = fakerFR.number.int();
  private valeurObtenue: Valeur = 0;

  construis(): MesurePriorisee {
    return {
      titre: this.titre,
      pourquoi: this.pourquoi,
      comment: this.comment,
      priorisation: this.priorisation,
      valeurObtenue: this.valeurObtenue,
    };
  }

  avecTitre(titre: string): ConstructeurMesurePriorisee {
    this.titre = titre;
    return this;
  }

  avecPourquoi(pourquoi: string): ConstructeurMesurePriorisee {
    this.pourquoi = pourquoi;
    return this;
  }

  avecComment(comment: string): ConstructeurMesurePriorisee {
    this.comment = comment;
    return this;
  }

  avecPriorisation(priorisation: number): ConstructeurMesurePriorisee {
    this.priorisation = priorisation;
    return this;
  }

  avecValeurObtenue(valeurObtenue: Valeur): ConstructeurMesurePriorisee {
    this.valeurObtenue = valeurObtenue;
    return this;
  }
}

export const uneMesurePriorisee = () => new ConstructeurMesurePriorisee();
