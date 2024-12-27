import { describe, expect } from 'vitest';
import {
  AdaptateurDeVerificationDesAccesMAC,
  ReponseVerificationRelationEnErreur,
} from '../../src/adaptateurs/AdaptateurDeVerificationDesAccesMAC';
import { Request, Response } from 'express';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { EntrepotRelationMemoire } from '../../src/relation/infrastructure/EntrepotRelationMemoire';
import { AdaptateurRelationsMAC } from '../../src/relation/AdaptateurRelationsMAC';
import {
  definitionAidantInitieDiagnostic,
  DefinitionAidantInitieDiagnostic,
  unTupleAidantInitieDiagnostic,
} from '../../src/diagnostic/tuples';

type RequeteTest = Request;

describe('Adaptateur de vérification de relations MAC', () => {
  const reponse = {} as Response;

  it('L’Aidant est l’initiateur du diagnostic et peut y accéder', async () => {
    const entrepotRelation = new EntrepotRelationMemoire();
    let suiteAppelee = false;
    const aidant = crypto.randomUUID();
    const diagnostic = crypto.randomUUID();
    entrepotRelation.persiste(
      unTupleAidantInitieDiagnostic(aidant, diagnostic)
    );
    const adaptateurRelation = new AdaptateurRelationsMAC(entrepotRelation);

    await new AdaptateurDeVerificationDesAccesMAC(adaptateurRelation).verifie<
      DefinitionAidantInitieDiagnostic,
      RequeteTest
    >(definitionAidantInitieDiagnostic.definition)(
      {
        identifiantUtilisateurCourant: aidant,
        params: { id: diagnostic },
      } as unknown as RequeteUtilisateur,
      reponse,
      () => {
        suiteAppelee = true;
      }
    );

    expect(suiteAppelee).toBe(true);
  });

  it('L’Aidant n’est pas l’initiateur du diagnostic et ne peut y accéder', async () => {
    let suiteAppelee = false;
    let codeRecu = 0;
    let jsonRecu = {};
    const reponse = {
      status: (code) => {
        codeRecu = code;
        return { json: (corps) => (jsonRecu = corps) };
      },
    } as Response;
    const adaptateurRelations = new AdaptateurRelationsMAC(
      new EntrepotRelationMemoire()
    );

    await new AdaptateurDeVerificationDesAccesMAC(adaptateurRelations).verifie<
      DefinitionAidantInitieDiagnostic,
      RequeteTest
    >(definitionAidantInitieDiagnostic.definition)(
      {
        identifiantUtilisateurCourant: crypto.randomUUID(),
        params: { id: crypto.randomUUID() },
      } as unknown as RequeteUtilisateur,
      reponse,
      () => {
        suiteAppelee = true;
      }
    );

    expect(codeRecu).toBe(403);
    expect(jsonRecu).toStrictEqual<ReponseVerificationRelationEnErreur>({
      titre: 'Accès non autorisé',
      message: 'Désolé, vous ne pouvez pas accéder à ce diagnostic.',
      liens: {
        'afficher-profil': {
          methode: 'GET',
          url: '/api/profil',
        },
        'afficher-preferences': {
          methode: 'GET',
          url: '/api/aidant/preferences',
        },
        'afficher-tableau-de-bord': {
          url: '/api/espace-aidant/tableau-de-bord',
          methode: 'GET',
        },
        'lancer-diagnostic': {
          methode: 'POST',
          url: '/api/diagnostic',
        },
        'se-deconnecter': {
          methode: 'DELETE',
          typeAppel: 'API',
          url: '/api/token',
        },
      },
    });
    expect(suiteAppelee).toBe(false);
  });
});
