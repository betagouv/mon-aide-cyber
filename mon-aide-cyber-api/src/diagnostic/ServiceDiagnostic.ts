import {
  ajouteLaReponseAuDiagnostic,
  Diagnostic,
  initialiseDiagnostic,
} from "./Diagnostic";
import * as crypto from "crypto";
import { Entrepots } from "../domaine/Entrepots";
import { Adaptateur } from "../adaptateurs/Adaptateur";
import { TableauDeNotes } from "./TableauDeNotes";
import { Referentiel } from "./Referentiel";

export type CorpsReponseQuestionATiroir = {
  reponse: string;
  questions: { identifiant: string; reponses: string[] }[];
};
export type CorpsReponse = {
  chemin: string;
  identifiant: string;
  reponse: string | CorpsReponseQuestionATiroir;
};

export class ServiceDiagnostic {
  constructor(
    private readonly adaptateurReferentiel: Adaptateur<Referentiel>,
    private readonly adaptateurTableauDeNotes: Adaptateur<TableauDeNotes>,
    private readonly entrepots: Entrepots,
  ) {}

  diagnostic = async (id: crypto.UUID): Promise<Diagnostic> =>
    this.entrepots.diagnostic().lis(id);

  lance = async (): Promise<Diagnostic> => {
    return Promise.all([
      this.adaptateurReferentiel.lis(),
      this.adaptateurTableauDeNotes.lis(),
    ]).then(([r, t]) => {
      const diagnostic = initialiseDiagnostic(r, t);
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
}
