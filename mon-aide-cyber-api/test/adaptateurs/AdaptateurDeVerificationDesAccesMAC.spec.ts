import { describe, expect } from 'vitest';
import {
  AdaptateurDeVerificationDesAccesMAC,
  ReponseVerificationRelationEnErreur,
} from '../../src/adaptateurs/AdaptateurDeVerificationDesAccesMAC';
import { unObjet, unTuple, unUtilisateur } from '../../src/relation/Tuple';
import { Response } from 'express';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { EntrepotRelationMemoire } from '../../src/relation/infrastructure/EntrepotRelationMemoire';
import { AdaptateurRelationsMAC } from '../../src/relation/AdaptateurRelationsMAC';

describe('Adaptateur de vérification de relations MAC', () => {
  const reponse = {} as Response;

  it('L’Aidant est l’initiateur du diagnostic et peut y accéder', async () => {
    const entrepotRelation = new EntrepotRelationMemoire();
    let suiteAppelee = false;
    const aidant = crypto.randomUUID();
    const diagnostic = crypto.randomUUID();
    entrepotRelation.persiste(
      unTuple()
        .avecRelationInitiateur()
        .avecObjet(
          unObjet().deTypeDiagnostic().avecIdentifiant(diagnostic).construis()
        )
        .avecUtilisateur(
          unUtilisateur().deTypeAidant().avecIdentifiant(aidant).construis()
        )
        .construis()
    );
    const adaptateurRelation = new AdaptateurRelationsMAC(entrepotRelation);

    await new AdaptateurDeVerificationDesAccesMAC(adaptateurRelation).verifie(
      'initiateur',
      unUtilisateur().deTypeAidant(),
      unObjet().deTypeDiagnostic()
    )(
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

    await new AdaptateurDeVerificationDesAccesMAC(adaptateurRelations).verifie(
      'initiateur',
      unUtilisateur().deTypeAidant(),
      unObjet().deTypeDiagnostic()
    )(
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
        'se-deconnecter': {
          methode: 'DELETE',
          url: '/api/token',
        },
      },
    });
    expect(suiteAppelee).toBe(false);
  });
});
