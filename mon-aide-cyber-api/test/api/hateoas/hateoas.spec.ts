import { beforeEach, describe, expect, it } from 'vitest';
import { lesContextesUtilisateursNouveauParcoursExistants } from './lesContextesUtilisateursExistants';
import {
  constructeurActionsHATEOAS,
  Options,
} from '../../../src/api/hateoas/hateoas';
import { InformationsContexte } from '../../../src/adaptateurs/AdaptateurDeVerificationDeSession';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { AdaptateurRelationsMAC } from '../../../src/relation/AdaptateurRelationsMAC';
import { relieUneEntiteAideeAUnDiagnostic } from '../../constructeurs/relationsUtilisateursMACDiagnostic';
import { unDiagnostic } from '../../constructeurs/constructeurDiagnostic';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { EntrepotRelationMemoire } from '../../../src/relation/infrastructure/EntrepotRelationMemoire';
import { ServiceDeChiffrementClair } from '../../infrastructure/securite/ServiceDeChiffrementClair';

describe('HATEOAS', () => {
  describe('Nouveau parcours', async () => {
    beforeEach(async () => {
      adaptateurEnvironnement.nouveauParcoursDevenirAidant = () =>
        '2025-01-31T08:00:00';
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2025-02-02T08:00:00'))
      );
    });

    it.each(lesContextesUtilisateursNouveauParcoursExistants)(
      'Retourne les liens correspondant au contexte $contexte',
      (contexte) => {
        const reponseHATEOAS = constructeurActionsHATEOAS()
          .pour(contexte.informationContexte as InformationsContexte)
          .construis();

        expect(reponseHATEOAS).toStrictEqual({
          liens: { ...contexte.liens },
        });
      }
    );
  });

  describe('Accès au diagnostic', () => {
    it('retourne l’action envoyer-restitution-entite-aidee', async () => {
      const entrepots = new EntrepotsMemoire();
      const diagnostic = unDiagnostic().construis();
      await entrepots.diagnostic().persiste(diagnostic);
      const adaptateurRelationsMAC = new AdaptateurRelationsMAC(
        new EntrepotRelationMemoire(),
        new ServiceDeChiffrementClair()
      );
      const relationDiagnosticDemandeAide =
        await relieUneEntiteAideeAUnDiagnostic(
          'email-entite@aidee.com',
          diagnostic.identifiant,
          entrepots,
          adaptateurRelationsMAC
        );

      const reponseHATEOAS = (
        await constructeurActionsHATEOAS().demandeLaRestitution(
          relationDiagnosticDemandeAide.diagnostic.identifiant,
          adaptateurRelationsMAC
        )
      ).construis();

      expect(
        reponseHATEOAS.liens['envoyer-restitution-entite-aidee']
      ).toStrictEqual<Options>({
        url: `/api/diagnostic/${diagnostic.identifiant}/restitution/demande-envoi-mail-restitution`,
        methode: 'POST',
      });
    });
  });
});
