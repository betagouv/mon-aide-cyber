import { describe, expect, it } from 'vitest';
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
import {
  unAidant,
  unUtilisateurInscrit,
} from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import {
  EntrepotAidantMemoire,
  EntrepotUtilisateurInscritMemoire,
  EntrepotUtilisateurMACMemoire,
} from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';

type RequeteTest = Request;

describe('Adaptateur de vérification de relations MAC', () => {
  const reponse = {} as Response;

  it('L’Aidant est l’initiateur du diagnostic et peut y accéder', async () => {
    const aidant = unAidant().construis();
    const entrepotAidant = new EntrepotAidantMemoire();
    await entrepotAidant.persiste(aidant);
    const entrepotRelation = new EntrepotRelationMemoire();
    let suiteAppelee = false;
    const diagnostic = crypto.randomUUID();
    entrepotRelation.persiste(
      unTupleAidantInitieDiagnostic(aidant.identifiant, diagnostic)
    );
    const adaptateurRelation = new AdaptateurRelationsMAC(entrepotRelation);

    await new AdaptateurDeVerificationDesAccesMAC(
      adaptateurRelation,
      new EntrepotUtilisateurMACMemoire({
        aidant: entrepotAidant,
        utilisateurInscrit: new EntrepotUtilisateurInscritMemoire(),
      })
    ).verifie<DefinitionAidantInitieDiagnostic, RequeteTest>(
      definitionAidantInitieDiagnostic.definition
    )(
      {
        identifiantUtilisateurCourant: aidant.identifiant,
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
    const aidant = unAidant().construis();
    const entrepotAidant = new EntrepotAidantMemoire();
    await entrepotAidant.persiste(aidant);
    const entrepotUtilisateurMAC = new EntrepotUtilisateurMACMemoire({
      aidant: entrepotAidant,
      utilisateurInscrit: new EntrepotUtilisateurInscritMemoire(),
    });
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

    await new AdaptateurDeVerificationDesAccesMAC(
      adaptateurRelations,
      entrepotUtilisateurMAC
    ).verifie<DefinitionAidantInitieDiagnostic, RequeteTest>(
      definitionAidantInitieDiagnostic.definition
    )(
      {
        identifiantUtilisateurCourant: aidant.identifiant,
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
          url: '/api/mon-espace/tableau-de-bord',
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

  it('L’Utilisateur Inscrit n’est pas l’initiateur du diagnostic et ne peut y accéder', async () => {
    const utilisateurInscrit = unUtilisateurInscrit().construis();
    const entrepotUtilisateurInscrit = new EntrepotUtilisateurInscritMemoire();
    await entrepotUtilisateurInscrit.persiste(utilisateurInscrit);
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

    await new AdaptateurDeVerificationDesAccesMAC(
      adaptateurRelations,
      new EntrepotUtilisateurMACMemoire({
        aidant: new EntrepotAidantMemoire(),
        utilisateurInscrit: entrepotUtilisateurInscrit,
      })
    ).verifie<DefinitionAidantInitieDiagnostic, RequeteTest>(
      definitionAidantInitieDiagnostic.definition
    )(
      {
        identifiantUtilisateurCourant: utilisateurInscrit.identifiant,
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
        'afficher-tableau-de-bord': {
          url: '/api/mon-espace/tableau-de-bord',
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
        'nouvelle-demande-devenir-aidant': {
          url: '/api/demandes/devenir-aidant',
          methode: 'GET',
        },
        'envoyer-demande-devenir-aidant': {
          url: '/api/demandes/devenir-aidant',
          methode: 'POST',
        },
        'rechercher-entreprise': {
          url: '/api/recherche-entreprise',
          methode: 'GET',
        },
      },
    });
    expect(suiteAppelee).toBe(false);
  });
});
