import { Constructeur } from './constructeur';
import { RecommandationPriorisee } from '../../src/diagnostic/Diagnostic';
import { fakerFR } from '@faker-js/faker';
import { Valeur } from '../../src/diagnostic/Indice';

class ConstructeurRecommandationPriorisee
  implements Constructeur<RecommandationPriorisee>
{
  private titre: string = fakerFR.lorem.words(3);
  private pourquoi: string = fakerFR.word.words(2);
  private comment: string = fakerFR.word.words(2);
  private priorisation: number = fakerFR.number.int();
  private valeurObtenue: Valeur = 0;

  construis(): RecommandationPriorisee {
    return {
      titre: this.titre,
      pourquoi: this.pourquoi,
      comment: this.comment,
      priorisation: this.priorisation,
      valeurObtenue: this.valeurObtenue,
    };
  }

  avecTitre(titre: string): ConstructeurRecommandationPriorisee {
    this.titre = titre;
    return this;
  }

  avecPourquoi(pourquoi: string): ConstructeurRecommandationPriorisee {
    this.pourquoi = pourquoi;
    return this;
  }

  avecComment(comment: string): ConstructeurRecommandationPriorisee {
    this.comment = comment;
    return this;
  }

  avecPriorisation(priorisation: number): ConstructeurRecommandationPriorisee {
    this.priorisation = priorisation;
    return this;
  }

  avecValeurObtenue(
    valeurObtenue: Valeur,
  ): ConstructeurRecommandationPriorisee {
    this.valeurObtenue = valeurObtenue;
    return this;
  }
}

export const uneRecommandationPriorisee = () =>
  new ConstructeurRecommandationPriorisee();
