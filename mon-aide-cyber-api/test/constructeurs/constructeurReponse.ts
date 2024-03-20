import { Constructeur } from './constructeur';
import { QuestionChoixMultiple, QuestionChoixUnique, ReponsePossible } from '../../src/diagnostic/Referentiel';
import { fakerFR } from '@faker-js/faker';
import { CorpsReponse, CorpsReponseQuestionATiroir } from '../../src/diagnostic/CapteurSagaAjoutReponse';

class ConstructeurDeCorpsDeReponse implements Constructeur<CorpsReponse> {
  private chemin = 'contexte';
  private identifiant = fakerFR.string.alpha(10);
  private reponse: string | CorpsReponseQuestionATiroir = '';

  pourLaThematique(thematique: string): ConstructeurDeCorpsDeReponse {
    this.chemin = thematique;
    return this;
  }

  concernantLaQuestion(question: QuestionChoixUnique | QuestionChoixMultiple): ConstructeurDeCorpsDeReponse {
    this.identifiant = question.identifiant;
    return this;
  }

  avecLaReponse(reponse: string | CorpsReponseQuestionATiroir): ConstructeurDeCorpsDeReponse {
    this.reponse = reponse;
    return this;
  }
  construis(): CorpsReponse {
    return {
      reponse: this.reponse,
      identifiant: this.identifiant,
      chemin: this.chemin,
    };
  }
}

class ConstructeurDeCorpsDeReponseQuestionATiroir implements Constructeur<CorpsReponseQuestionATiroir> {
  private questions: { identifiant: string; reponses: string[] }[] = [];
  private reponse = '';

  construis(): CorpsReponseQuestionATiroir {
    return {
      questions: this.questions,
      reponse: this.reponse,
    };
  }

  avecLaReponse(reponse: {
    reponse: string;
    valeurs: { question: string; reponses: ReponsePossible[] }[];
  }): ConstructeurDeCorpsDeReponseQuestionATiroir {
    this.reponse = reponse.reponse;
    this.questions = reponse.valeurs.map((valeur) => ({
      identifiant: valeur.question,
      reponses: valeur.reponses.map((rep) => rep.identifiant),
    }));
    return this;
  }
}

export const unCorspsDeReponse = () => new ConstructeurDeCorpsDeReponse();

export const unCorpsDeReponseQuestionATiroir = () => new ConstructeurDeCorpsDeReponseQuestionATiroir();
