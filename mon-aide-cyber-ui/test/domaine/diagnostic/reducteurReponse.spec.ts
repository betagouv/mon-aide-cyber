import { describe, expect, it } from "vitest";
import {
  EtatReponseStatut,
  reducteurReponse,
  reponseChangee,
} from "../../../src/domaine/diagnostic/reducteurReponse";
import { uneReponsePossible } from "../../constructeurs/constructeurReponsePossible";

describe("Le réducteur de réponse", () => {
  it("change la réponse donnée et modifie le statut", () => {
    const nouvelleReponse = uneReponsePossible().construis();

    const etatReponse = reducteurReponse(
      {
        reponseDonnee: undefined,
        statut: EtatReponseStatut.EN_COURS_DE_CHARGEMENT,
      },
      reponseChangee(nouvelleReponse.identifiant),
    );

    expect(etatReponse).toStrictEqual({
      reponseDonnee: { valeur: nouvelleReponse.identifiant },
      statut: EtatReponseStatut.MODIFIE,
    });
  });
});
