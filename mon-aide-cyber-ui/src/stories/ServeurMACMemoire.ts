import {
  ActionReponseDiagnostic,
  Diagnostic,
  Reponse,
  ReponseQuestionATiroir,
} from '../domaine/diagnostic/Diagnostic.ts';
import { expect } from '@storybook/jest';
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
        })[0],
    );
  }

  verifieEnvoiReponse(
    actionRepondre: ActionReponseDiagnostic,
    reponseDonnee: Reponse,
  ) {
    expect(this.actionRepondre).toStrictEqual(actionRepondre);
    expect(this.reponseDonnee).toStrictEqual(reponseDonnee);
  }

  async verifieReponseNonEnvoyee() {
    return Promise.resolve(!this.reponseEnvoyee);
  }

  envoieReponse(
    parametresAPI: ParametresAPI<{
      chemin: string;
      identifiant: string;
      reponse: string | string[] | ReponseQuestionATiroir | null;
    }>,
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
  }
}
