import { describe, it } from "vitest";
import {
  reducteurReponse,
  reponseChangee,
} from "../../../src/domaine/diagnostic/reducteurReponse";
import { uneReponsePossible } from "../../consructeurs/constructeurReponsePossible";

describe("Le réducteur de réponse", () => {
  it("change la réponse donnée", () => {
    const nouvelleReponse = uneReponsePossible().construis();

    const etatReponse = reducteurReponse(
      { reponseDonnee: undefined },
      reponseChangee(nouvelleReponse.identifiant),
    );

    expect(etatReponse.reponseDonnee).toMatchObject({
      valeur: nouvelleReponse.identifiant,
    });
  });
});
