import { beforeAll, describe, it } from 'vitest';
import {
  lesContextesUtilisateursExistants,
  lesContextesUtilisateursNouveauParcoursExistants,
} from './lesContextesUtilisateursExistants';
import { constructeurActionsHATEOAS } from '../../../src/api/hateoas/hateoas';
import { InformationsContexte } from '../../../src/adaptateurs/AdaptateurDeVerificationDeSession';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';

describe('HATEOAS', () => {
  describe('Avant nouveau parcours', () => {
    beforeAll(() => {
      adaptateurEnvironnement.nouveauParcoursDevenirAidant = () =>
        '2025-01-31T08:00:00';
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2025-01-14T08:00:00'))
      );
    });

    it.each(lesContextesUtilisateursExistants)(
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
});
