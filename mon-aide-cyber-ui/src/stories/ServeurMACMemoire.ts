import {
  Diagnostic,
  Reponse,
  ReponseQuestionATiroir,
} from '../domaine/diagnostic/Diagnostic.ts';
import { expect } from '@storybook/test';
import { UUID } from '../types/Types.ts';

import { ParametresAPI } from '../fournisseurs/api/ConstructeurParametresAPI.ts';
import { RepresentationDiagnostic } from '../fournisseurs/api/APIDiagnostic.ts';
import { Constructeur } from '../../test/constructeurs/Constructeur.ts';

export type LienHATEOAS = {
  [clef: string]: { url: string; methode: 'PATCH' | 'POST' | 'GET' };
};

export class ServeurMACMemoire {
  private reponseEnvoyee = false;
  private lienHATEOAS: LienHATEOAS | undefined;
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

  verifieEnvoiReponse(lienHATEOAS: LienHATEOAS, reponseDonnee: Reponse) {
    expect(this.lienHATEOAS).toStrictEqual(lienHATEOAS);
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
    this.lienHATEOAS = {
      'repondre-diagnostic': {
        url: parametresAPI.url,
        methode: 'PATCH',
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

class ConstructeurLienHATEOAS implements Constructeur<LienHATEOAS> {
  private clef = '';
  private url = '';
  private methode: 'PATCH' | 'POST' | 'GET' = 'GET';

  construis(): LienHATEOAS {
    return {
      [this.clef]: { url: this.url, methode: this.methode },
    };
  }

  repondreDiagnostic(identifiantDiagnostic: UUID): ConstructeurLienHATEOAS {
    this.clef = 'repondre-diagnostic';
    this.url = `/diagnostic/${identifiantDiagnostic}`;
    this.methode = 'PATCH';
    return this;
  }
}

export const unLienHATEOAS = () => new ConstructeurLienHATEOAS();
