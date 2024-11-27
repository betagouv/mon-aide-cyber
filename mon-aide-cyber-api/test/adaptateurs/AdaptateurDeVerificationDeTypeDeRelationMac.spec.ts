import { describe, it, expect } from 'vitest';
import { EntrepotRelationMemoire } from '../../src/relation/infrastructure/EntrepotRelationMemoire';
import { unTupleAidantInitieDiagnostic } from '../../src/diagnostic/tuples';
import { AdaptateurRelationsMAC } from '../../src/relation/AdaptateurRelationsMAC';
import {
  definitionEntiteInitieAutoDiagnostic,
  unTupleEntiteInitieAutoDiagnostic,
} from '../../src/diagnostic-libre-acces/consommateursEvenements';
import { AdaptateurDeVerificationDeTypeDeRelationMAC } from '../../src/adaptateurs/AdaptateurDeVerificationDeTypeDeRelationMAC';
import { Request, Response } from 'express';
import { ReponseVerificationRelationEnErreur } from '../../src/adaptateurs/AdaptateurDeVerificationDesAccesMAC';

describe('L’adptateur de relations MAC', () => {
  it('Accepte l’accès au diagnostic', async () => {
    const entrepotRelation = new EntrepotRelationMemoire();
    let suiteAppelee = false;
    const identifiantEntiteAidee = crypto.randomUUID();
    const diagnostic = crypto.randomUUID();
    entrepotRelation.persiste(
      unTupleEntiteInitieAutoDiagnostic(identifiantEntiteAidee, diagnostic)
    );
    const adaptateurRelation = new AdaptateurRelationsMAC(entrepotRelation);

    await new AdaptateurDeVerificationDeTypeDeRelationMAC(
      adaptateurRelation
    ).verifie(definitionEntiteInitieAutoDiagnostic.definition)(
      { params: { id: diagnostic } } as unknown as Request,
      {} as Response,
      () => {
        suiteAppelee = true;
      }
    );

    expect(suiteAppelee).toBe(true);
  });

  it('Vérifie si la relation est du type désiré', async () => {
    const entrepotRelation = new EntrepotRelationMemoire();
    let suiteAppelee = false;
    let codeRecu = 0;
    let jsonRecu = {};
    const reponse = {
      status: (code) => {
        codeRecu = code;
        return { json: (corps) => (jsonRecu = corps) };
      },
    } as Response;
    const aidant = crypto.randomUUID();
    const diagnostic = crypto.randomUUID();
    entrepotRelation.persiste(
      unTupleAidantInitieDiagnostic(aidant, diagnostic)
    );
    const adaptateurRelation = new AdaptateurRelationsMAC(entrepotRelation);

    await new AdaptateurDeVerificationDeTypeDeRelationMAC(
      adaptateurRelation
    ).verifie(definitionEntiteInitieAutoDiagnostic.definition)(
      { params: { id: diagnostic } } as unknown as Request,
      reponse,
      () => {
        suiteAppelee = true;
      }
    );

    expect(codeRecu).toBe(404);
    expect(jsonRecu).toStrictEqual<ReponseVerificationRelationEnErreur>({
      titre: 'Diagnostic non trouvé.',
      message: 'Désolé, vous ne pouvez pas accéder à ce diagnostic.',
      liens: {
        'creer-auto-diagnostic': {
          url: '/api/auto-diagnostic',
          methode: 'POST',
        },
      },
    });
    expect(suiteAppelee).toBe(false);
  });
});
