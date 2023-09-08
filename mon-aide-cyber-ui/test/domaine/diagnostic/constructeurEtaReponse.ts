import { Reponse } from "../../../src/domaine/diagnostic/Diagnostic";
import {
  EtatReponse,
  EtatReponseStatut,
} from "../../../src/domaine/diagnostic/reducteurReponse";
import {
  ReponseDonnee,
  ReponsePossible,
} from "../../../src/domaine/diagnostic/Referentiel";

class ConstructeurEtaReponse {
  private reponse: () => Reponse | null = () => null;
  private statut: EtatReponseStatut = EtatReponseStatut.CHARGEE;
  private reponseDonnee: ReponseDonnee = {
    valeur: null,
    reponses: [],
  };
  private valeur: () => string | undefined = () => undefined;

  constructor(private readonly identifiantQuestion: string) {}

  reponseChargee(): ConstructeurEtaReponse {
    this.statut = EtatReponseStatut.CHARGEE;
    return this;
  }

  avecUneReponseDonnee(reponse: {
    reponse: ReponsePossible;
    reponses: { identifiant: string; reponses: string[] }[];
  }): ConstructeurEtaReponse {
    this.reponseDonnee = {
      valeur: reponse.reponse.identifiant,
      reponses: reponse.reponses.map((rep) => ({
        identifiant: rep.identifiant,
        reponses: new Set(rep.reponses),
      })),
    };
    return this;
  }

  construis(): EtatReponse {
    return {
      identifiantQuestion: this.identifiantQuestion,
      reponse: this.reponse,
      reponseDonnee: this.reponseDonnee,
      statut: this.statut,
      valeur: this.valeur,
    };
  }
}

export const unEtatDeReponse = (identifiantQuestion: string) =>
  new ConstructeurEtaReponse(identifiantQuestion);
