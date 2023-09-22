import {
  Action,
  ActionBase,
  ActionReponseDiagnostic,
  Diagnostic,
  EntrepotDiagnostic,
  Reponse,
} from "../../domaine/diagnostic/Diagnostic.ts";
import { FormatLien, LienRoutage } from "../../domaine/LienRoutage.ts";
import { APIEntrepot } from "./EntrepotsAPI.ts";
import { UUID } from "../../types/Types.ts";
type RepresentationReponseDonnee = {
  valeur: string | null;
  reponses: { identifiant: string; reponses: string[] }[];
};
type Format = "texte" | "nombre" | undefined;
type RepresentationReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  questions?: RepresentationQuestion[];
  type?: { type: RepresentationTypeDeSaisie; format?: Format } | undefined;
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
  questions: RepresentationQuestion[];
};
type RepresentationReferentiel = {
  [clef: string]: RepresentationThematique;
};
type RepresentationDiagnostic = {
  identifiant: UUID;
  referentiel: RepresentationReferentiel;
  actions: Action[];
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

  repond(
    action: ActionReponseDiagnostic,
    reponseDonnee: Reponse,
  ): Promise<void> {
    const actionAMener = Object.entries(action).map(([thematique, action]) => ({
      chemin: thematique,
      ressource: action.ressource,
    }))[0];
    return fetch(actionAMener.ressource.url, {
      method: actionAMener.ressource.methode,
      body: JSON.stringify({
        chemin: actionAMener.chemin,
        identifiant: reponseDonnee.identifiantQuestion,
        reponse: reponseDonnee.reponseDonnee,
      }),
      headers: { "Content-Type": "application/json" },
    }).then();
  }

  termine(action: ActionBase): Promise<void> {
    return fetch(action.ressource.url, {
      method: action.ressource.methode,
    })
      .then((reponse) => reponse.blob())
      .then((blob) => window.open(URL.createObjectURL(blob)))
      .then();
  }

  protected transcris(
    json: Promise<RepresentationDiagnostic>,
  ): Promise<Diagnostic> {
    return json.then((corps) => {
      const referentiel = Object.entries(corps.referentiel).reduce(
        (accumulateur, [clef, thematique]) => {
          const questions = thematique.questions.map((question) => {
            return {
              ...question,
              reponseDonnee: {
                valeur: question.reponseDonnee.valeur,
                reponses: question.reponseDonnee.reponses.map((rep) => ({
                  identifiant: rep.identifiant,
                  reponses: new Set(rep.reponses),
                })),
              },
            };
          });
          return {
            ...accumulateur,
            [clef]: { ...thematique, questions },
          };
        },
        {},
      );
      return {
        ...corps,
        referentiel,
      };
    });
  }
}
