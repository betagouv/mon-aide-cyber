import {
  ActionReponseDiagnostic,
  Diagnostic,
  Reponse,
  ReponseQuestionATiroir,
} from '../domaine/diagnostic/Diagnostic.ts';
import { expect } from '@storybook/test';
import { UUID } from '../types/Types.ts';

import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { RepresentationDiagnostic } from '../fournisseurs/api/APIDiagnostic.ts';

export class ServeurMACMemoire {
  private reponseEnvoyee = false;
  private actionRepondre: ActionReponseDiagnostic | undefined;
  private reponseDonnee: Reponse | undefined;

  constructor(private readonly diagnostics: Diagnostic[] = []) {}

  persiste(diagnostic: Diagnostic) {
    this.diagnostics.push(diagnostic);
  }

  find(idDiagnostic: UUID): Promise<RepresentationDiagnostic> {
    return Promise.resolve(
      this.diagnostics
        .filter((d) => d.identifiant === idDiagnostic)
        .map((d) => {
          return { diagnostic: d, liens: {} };
        })[0]
    );
  }

  verifieEnvoiReponse(
    actionRepondre: ActionReponseDiagnostic,
    reponseDonnee: Reponse
  ) {
    expect(this.actionRepondre).toStrictEqual(actionRepondre);
    expect(this.reponseDonnee).toStrictEqual(reponseDonnee);
  }

  async verifieReponseNonEnvoyee() {
    return Promise.resolve(!this.reponseEnvoyee);
  }

  async envoieReponse(
    parametresAPI: ParametresAPI<{
      chemin: string;
      identifiant: string;
      reponse: string | string[] | ReponseQuestionATiroir | null;
    }>
  ) {
    this.actionRepondre = {
      [parametresAPI.corps!.chemin]: {
        action: 'repondre',
        ressource: { url: parametresAPI.url, methode: parametresAPI.methode },
      },
    };
    this.reponseDonnee = {
      reponseDonnee: parametresAPI.corps!.reponse,
      identifiantQuestion: parametresAPI.corps!.identifiant,
    };
    const idDiagnostic = parametresAPI.url.split('/').at(-1);

    const estReponseQuestionATiroir = (
      reponse: string | string[] | ReponseQuestionATiroir | null | undefined
    ): reponse is ReponseQuestionATiroir =>
      reponse !== null &&
      reponse !== undefined &&
      (reponse as ReponseQuestionATiroir) !== null &&
      (reponse as ReponseQuestionATiroir) !== undefined &&
      (reponse as ReponseQuestionATiroir).reponse !== null &&
      (reponse as ReponseQuestionATiroir).reponse !== undefined;

    const estReponseQuestionAChoixMultilpe = (
      reponse: string | string[] | null | undefined
    ): reponse is string[] => Array.isArray(reponse);

    if (idDiagnostic) {
      const representationDiagnosticPromise = await this.find(
        idDiagnostic as UUID
      );
      representationDiagnosticPromise.diagnostic.referentiel[
        parametresAPI.corps!.chemin
      ].groupes.forEach((g) => {
        const question = g.questions.find(
          (q) => q.identifiant === parametresAPI.corps!.identifiant
        );

        if (question !== undefined) {
          const reponseCorps = parametresAPI.corps?.reponse;
          if (estReponseQuestionATiroir(reponseCorps)) {
            question.reponseDonnee = {
              valeur: reponseCorps.reponse,
              reponses: reponseCorps.questions.map((q) => ({
                reponses: new Set(q.reponses),
                identifiant: q.identifiant,
              })),
            };
          } else if (estReponseQuestionAChoixMultilpe(reponseCorps)) {
            question.reponseDonnee = {
              valeur: parametresAPI.corps!.identifiant,
              reponses: [
                {
                  identifiant: parametresAPI.corps!.identifiant,
                  reponses: new Set(reponseCorps),
                },
              ],
            };
          } else {
            question.reponseDonnee = {
              valeur: parametresAPI.corps!.reponse as string | null,
              reponses: [],
            };
          }
        }
      });
    }
  }
}
