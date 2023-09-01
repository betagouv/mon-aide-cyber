import {
  ActionDiagnostic,
  Diagnostic,
  EntrepotDiagnostic,
  Reponse,
} from "../../domaine/diagnostic/Diagnostic.ts";
import { FormatLien, LienRoutage } from "../../domaine/LienRoutage.ts";
import { APIEntrepot } from "./EntrepotsAPI.ts";

type RepresentationActionDiagnostic = {
  action: "repondre";
  chemin: string;
  ressource: { url: string; methode: "PATCH" };
};
type RepresentationReponseDonnee = {
  valeur: string | null;
  reponsesMultiples: string[];
};
type Format = "texte" | "nombre" | undefined;
export type RepresentationReponseComplementaire = Omit<
  RepresentationReponsePossible,
  "question" | "reponsesComplementaires"
>;
type RepresentationReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  question?: RepresentationQuestion;
  type?: { type: RepresentationTypeDeSaisie; format?: Format } | undefined;
  reponsesComplementaires?: RepresentationReponseComplementaire[] | undefined;
};
type RepresentationQuestion = {
  identifiant: string;
  libelle: string;
  reponseDonnee: RepresentationReponseDonnee;
  reponsesPossibles: RepresentationReponsePossible[];
  type?: Exclude<RepresentationTypeDeSaisie, "saisieLibre">;
};
export type RepresentationTypeDeSaisie =
  | "choixMultiple"
  | "choixUnique"
  | "saisieLibre"
  | "liste";
type RepresentationThematique = {
  actions: RepresentationActionDiagnostic[];
  questions: RepresentationQuestion[];
};
type RepresentationReferentiel = {
  [clef: string]: RepresentationThematique;
};

export class APIEntrepotDiagnostic
  extends APIEntrepot<Diagnostic>
  implements EntrepotDiagnostic
{
  constructor() {
    super("diagnostic");
  }

  lancer(): Promise<LienRoutage> {
    return super
      .persiste()
      .then((reponse) => {
        const lien = reponse.headers.get("Link");
        return lien !== null
          ? new LienRoutage(lien as FormatLien)
          : Promise.reject(
              "Impossible de récupérer le lien vers le diagnostic",
            );
      })
      .catch((erreur) =>
        Promise.reject({
          message: `Lors de la création ou de la récupération du diagnostic pour les raisons suivantes : '${erreur}'`,
        }),
      );
  }

  repond(action: ActionDiagnostic, reponseDonnee: Reponse): Promise<void> {
    return fetch(action.ressource.url, {
      method: action.ressource.methode,
      body: JSON.stringify({
        chemin: action.chemin,
        identifiant: reponseDonnee.identifiantQuestion,
        reponse: reponseDonnee.reponseDonnee,
      }),
      headers: { "Content-Type": "application/json" },
    }).then();
  }

  protected transcris(json: Promise<any>): Promise<Diagnostic> {
    return json.then((corps) => {
      const referentiel = Object.entries(
        corps.referentiel as RepresentationReferentiel,
      ).reduce((accumulateur, [clef, thematique]) => {
        const questions = thematique.questions.map((question) => {
          return {
            ...question,
            reponseDonnee: {
              valeur: question.reponseDonnee.valeur,
              reponsesMultiples: new Set(
                question.reponseDonnee.reponsesMultiples,
              ),
            },
          };
        });
        return {
          ...accumulateur,
          [clef]: { ...thematique, questions },
        };
      }, {});
      return {
        ...corps,
        referentiel,
      };
    });
  }
}
