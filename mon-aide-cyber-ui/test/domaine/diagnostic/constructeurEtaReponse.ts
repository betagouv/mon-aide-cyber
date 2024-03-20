import { ActionReponseDiagnostic, Reponse } from '../../../src/domaine/diagnostic/Diagnostic';
import { EtatReponse, EtatReponseStatut } from '../../../src/domaine/diagnostic/reducteurReponse';
import { Question, ReponseDonnee } from '../../../src/domaine/diagnostic/Referentiel';

class ConstructeurEtaReponse {
  private reponse: () => Reponse | null = () => null;
  private statut: EtatReponseStatut = EtatReponseStatut.CHARGEE;
  private valeur: () => string | undefined = () => undefined;

  constructor(private readonly question: Question) {}

  reponseChargee(): ConstructeurEtaReponse {
    this.statut = EtatReponseStatut.CHARGEE;
    return this;
  }
  construis(): EtatReponse {
    const reponseDonnee: ReponseDonnee = {
      valeur: this.question.reponseDonnee.valeur,
      reponses: this.question.reponseDonnee.reponses,
    };
    return {
      action(_: string): ActionReponseDiagnostic | undefined {
        return undefined;
      },
      actions: [],
      question: this.question,
      reponse: this.reponse,
      reponseDonnee,
      statut: this.statut,
      valeur: this.valeur,
    };
  }
}

export const unEtatDeReponse = (question: Question) => new ConstructeurEtaReponse(question);
