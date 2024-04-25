import { describe, expect, it } from 'vitest';
import {
  Diagnostic,
  ServiceTableauDeBord,
} from '../../../src/espace-aidant/tableau-de-bord/ServiceTableauDeBord';
import crypto from 'crypto';
import { ServiceDiagnosticTest } from '../../diagnostic/ServiceDiagnosticTest';
import { unContexte } from '../../diagnostic/ConstructeurContexte';
import { AdaptateurRelationsTest } from '../../relation/AdaptateurRelationTest';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';

describe('Service Tableau De Bord', () => {
  FournisseurHorlogeDeTest.initialise(
    new Date(Date.parse('2024-04-17T18:06:00+02:00')),
  );

  describe('Liste le diagnostic initié par un aidant', () => {
    it("Avec au moins l'identifiant et la date de création du diagnostic", async () => {
      const identifiantAidant = crypto.randomUUID();
      const identifiantDiagnostic = crypto.randomUUID();

      const diagnosticTableauDeBord = await new ServiceTableauDeBord(
        new AdaptateurRelationsTest(
          new Map([[identifiantAidant, [identifiantDiagnostic]]]),
        ),
        new ServiceDiagnosticTest(
          new Map([[identifiantDiagnostic, unContexte().construis()]]),
        ),
      ).diagnosticsInitiesPar(identifiantAidant);

      expect(diagnosticTableauDeBord[0]).toStrictEqual<Diagnostic>({
        identifiant: identifiantDiagnostic,
        dateCreation: '17.04.2024',
        secteurActivite: 'non renseigné',
        zoneGeographique: 'non renseigné',
      });
    });

    it('Avec la date de création au format dd.mm.yyyy', async () => {
      const date = new Date(Date.parse('2024-04-28T18:06:00+02:00'));
      const identifiantAidant = crypto.randomUUID();
      const identifiantDiagnostic = crypto.randomUUID();

      const diagnosticTableauDeBord = await new ServiceTableauDeBord(
        new AdaptateurRelationsTest(
          new Map([[identifiantAidant, [identifiantDiagnostic]]]),
        ),
        new ServiceDiagnosticTest(
          new Map([
            [
              identifiantDiagnostic,
              unContexte().avecDateCreation(date).construis(),
            ],
          ]),
        ),
      ).diagnosticsInitiesPar(identifiantAidant);

      expect(diagnosticTableauDeBord[0]).toStrictEqual<Diagnostic>({
        dateCreation: '28.04.2024',
        identifiant: identifiantDiagnostic,
        secteurActivite: 'non renseigné',
        zoneGeographique: 'non renseigné',
      });
    });

    describe('Pour la zone géographique', () => {
      it('Comprends le département si seulement celui-ci est renseigné', async () => {
        const departement = 'Corse-du-Sud';
        const identifiantAidant = crypto.randomUUID();
        const identifiantDiagnostic = crypto.randomUUID();

        const diagnosticTableauDeBord = await new ServiceTableauDeBord(
          new AdaptateurRelationsTest(
            new Map([[identifiantAidant, [identifiantDiagnostic]]]),
          ),
          new ServiceDiagnosticTest(
            new Map([
              [
                identifiantDiagnostic,
                unContexte().avecLeDepartement(departement).construis(),
              ],
            ]),
          ),
        ).diagnosticsInitiesPar(identifiantAidant);

        expect(diagnosticTableauDeBord[0]).toStrictEqual<Diagnostic>({
          dateCreation: '17.04.2024',
          identifiant: identifiantDiagnostic,
          secteurActivite: 'non renseigné',
          zoneGeographique: departement,
        });
      });
    });

    it("Avec le secteur d'activité si celui-ci est renseigné", async () => {
      const secteurActivite =
        'Activités de services administratifs et de soutien';
      const identifiantAidant = crypto.randomUUID();
      const identifiantDiagnostic = crypto.randomUUID();

      const diagnosticTableauDeBord = await new ServiceTableauDeBord(
        new AdaptateurRelationsTest(
          new Map([[identifiantAidant, [identifiantDiagnostic]]]),
        ),
        new ServiceDiagnosticTest(
          new Map([
            [
              identifiantDiagnostic,
              unContexte().avecSecteurActivite(secteurActivite).construis(),
            ],
          ]),
        ),
      ).diagnosticsInitiesPar(identifiantAidant);

      expect(diagnosticTableauDeBord[0]).toStrictEqual<Diagnostic>({
        dateCreation: '17.04.2024',
        identifiant: identifiantDiagnostic,
        secteurActivite: secteurActivite,
        zoneGeographique: 'non renseigné',
      });
    });

    it('Liste seulement les diagnostics initiés par un aidant', async () => {
      const identifiantAidant = crypto.randomUUID();
      const identifiantDiagnosticInitie1 = crypto.randomUUID();
      const identifiantDiagnosticInitie2 = crypto.randomUUID();

      const relations = new Map<string, string[]>([
        [
          identifiantAidant,
          [identifiantDiagnosticInitie1, identifiantDiagnosticInitie2],
        ],
        ['identifiant-d-un-autre-aidant', [crypto.randomUUID()]],
      ]);

      const diagnosticTableauDeBord = await new ServiceTableauDeBord(
        new AdaptateurRelationsTest(relations),
        new ServiceDiagnosticTest(
          new Map([
            [
              identifiantDiagnosticInitie1,
              unContexte()
                .enRegion('Corse')
                .avecLeDepartement('Corse-du-Sud')
                .avecSecteurActivite('enseignement')
                .construis(),
            ],
            [
              identifiantDiagnosticInitie2,
              unContexte()
                .enRegion('Bretagne')
                .avecLeDepartement('Finistère')
                .avecSecteurActivite(
                  'Arts, spectacles et activités récréatives',
                )
                .construis(),
            ],
          ]),
        ),
      ).diagnosticsInitiesPar(identifiantAidant);

      expect(diagnosticTableauDeBord).toStrictEqual<Diagnostic[]>([
        {
          dateCreation: '17.04.2024',
          identifiant: identifiantDiagnosticInitie1,
          secteurActivite: 'enseignement',
          zoneGeographique: 'Corse-du-Sud',
        },
        {
          dateCreation: '17.04.2024',
          identifiant: identifiantDiagnosticInitie2,
          secteurActivite: 'Arts, spectacles et activités récréatives',
          zoneGeographique: 'Finistère',
        },
      ]);
    });
  });
});
