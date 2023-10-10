import {
  ajouteLaReponseAuDiagnostic,
  Diagnostic,
  genereLesRecommandations,
  initialiseDiagnostic,
} from "./Diagnostic";
import * as crypto from "crypto";
import { Entrepots } from "../domaine/Entrepots";
import { Adaptateur } from "../adaptateurs/Adaptateur";
import { Referentiel } from "./Referentiel";
import { TableauDeRecommandations } from "./TableauDeRecommandations";

export type CorpsReponseQuestionATiroir = {
  reponse: string;
  questions: { identifiant: string; reponses: string[] }[];
};
export type CorpsReponse = {
  chemin: string;
  identifiant: string;
  reponse: string | string[] | CorpsReponseQuestionATiroir;
};

export class ServiceDiagnostic {
  constructor(
    private readonly adaptateurReferentiel: Adaptateur<Referentiel>,
    private readonly adaptateurTableauDeRecommandations: Adaptateur<TableauDeRecommandations>,
    private readonly entrepots: Entrepots,
  ) {}

  diagnostic = async (id: crypto.UUID): Promise<Diagnostic> =>
    this.entrepots.diagnostic().lis(id);

  lance = async (): Promise<Diagnostic> => {
    return Promise.all([
      this.adaptateurReferentiel.lis(),
      this.adaptateurTableauDeRecommandations.lis(),
    ]).then(([ref, rec]) => {
      const diagnostic = initialiseDiagnostic(ref, rec);
      this.entrepots.diagnostic().persiste(diagnostic);
      return diagnostic;
    });
  };

  ajouteLaReponse = async (
    id: crypto.UUID,
    corpsReponse: CorpsReponse,
  ): Promise<void> => {
    return this.entrepots
      .diagnostic()
      .lis(id)
      .then((diagnostic) => {
        ajouteLaReponseAuDiagnostic(diagnostic, corpsReponse);
      });
  };

  async termine(id: crypto.UUID) {
    return this.entrepots
      .diagnostic()
      .lis(id)
      .then((diagnostic) => {
        genereLesRecommandations(diagnostic);
      });
  }
}
