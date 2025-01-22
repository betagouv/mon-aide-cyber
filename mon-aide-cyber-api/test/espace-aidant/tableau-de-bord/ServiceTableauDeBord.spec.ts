import { beforeEach, describe, expect, it } from 'vitest';
import {
  Diagnostic,
  ServiceTableauDeBord,
} from '../../../src/espace-aidant/tableau-de-bord/ServiceTableauDeBord';
import crypto from 'crypto';
import { ServiceDiagnosticDeTest } from '../../diagnostic/ServiceDiagnosticDeTest';
import { unContexte } from '../../diagnostic/ConstructeurContexte';
import { AdaptateurRelationsTest } from '../../relation/AdaptateurRelationTest';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { uneListeDeDiagnosticsPourTableauDeBordReliesAUnUtilisateur } from '../../diagnostic/constructeurDeDiagnosticsPourTableauDeBord';
import { uneRechercheUtilisateursMAC } from '../../../src/recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import {
  EntrepotAidantMemoire,
  EntrepotUtilisateurInscritMemoire,
  EntrepotUtilisateurMACMemoire,
} from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateur';
import { EntrepotAidant } from '../../../src/espace-aidant/Aidant';
import { ReponseHATEOAS } from '../../../src/api/hateoas/hateoas';
import { unUtilisateurInscrit } from '../../constructeurs/constructeurUtilisateurInscrit';
import { EntrepotUtilisateurInscrit } from '../../../src/espace-utilisateur-inscrit/UtilisateurInscrit';

describe('Service Tableau De Bord', () => {
  beforeEach(() => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-04-17T18:06:00+02:00'))
    );
  });

  describe('Liste les diagnostics initiés par un utilisateur', () => {
    const rechercheUtilisateurMAC = uneRechercheUtilisateursMAC(
      new EntrepotUtilisateurMACMemoire({
        aidant: new EntrepotAidantMemoire(),
        utilisateurInscrit: new EntrepotUtilisateurInscritMemoire(),
      })
    );

    it("Avec au moins l'identifiant et la date de création du diagnostic", async () => {
      const identifiantUtilisateur = crypto.randomUUID();
      const identifiantDiagnostic = crypto.randomUUID();

      const diagnosticTableauDeBord = await new ServiceTableauDeBord(
        new AdaptateurRelationsTest(
          new Map([[identifiantUtilisateur, [identifiantDiagnostic]]])
        ),
        new ServiceDiagnosticDeTest(
          new Map([[identifiantDiagnostic, unContexte().construis()]])
        ),
        rechercheUtilisateurMAC,
        true
      ).pour(identifiantUtilisateur);

      expect(diagnosticTableauDeBord.diagnostics[0]).toStrictEqual<Diagnostic>({
        identifiant: identifiantDiagnostic,
        dateCreation: '17.04.2024',
        secteurActivite: 'non renseigné',
        secteurGeographique: 'non renseigné',
      });
    });

    it('Avec la date de création au format dd.mm.yyyy', async () => {
      const date = new Date(Date.parse('2024-04-28T18:06:00+02:00'));
      const identifiantUtilisateur = crypto.randomUUID();
      const identifiantDiagnostic = crypto.randomUUID();

      const diagnosticTableauDeBord = await new ServiceTableauDeBord(
        new AdaptateurRelationsTest(
          new Map([[identifiantUtilisateur, [identifiantDiagnostic]]])
        ),
        new ServiceDiagnosticDeTest(
          new Map([
            [
              identifiantDiagnostic,
              unContexte().avecDateCreation(date).construis(),
            ],
          ])
        ),
        rechercheUtilisateurMAC,
        true
      ).pour(identifiantUtilisateur);

      expect(diagnosticTableauDeBord.diagnostics[0]).toStrictEqual<Diagnostic>({
        dateCreation: '28.04.2024',
        identifiant: identifiantDiagnostic,
        secteurActivite: 'non renseigné',
        secteurGeographique: 'non renseigné',
      });
    });

    describe('Pour la zone géographique', () => {
      it('Comprends le département si seulement celui-ci est renseigné', async () => {
        const departement = 'Corse-du-Sud';
        const identifiantUtilisateur = crypto.randomUUID();
        const identifiantDiagnostic = crypto.randomUUID();

        const diagnosticTableauDeBord = await new ServiceTableauDeBord(
          new AdaptateurRelationsTest(
            new Map([[identifiantUtilisateur, [identifiantDiagnostic]]])
          ),
          new ServiceDiagnosticDeTest(
            new Map([
              [
                identifiantDiagnostic,
                unContexte().avecLeDepartement(departement).construis(),
              ],
            ])
          ),
          rechercheUtilisateurMAC,
          true
        ).pour(identifiantUtilisateur);

        expect(
          diagnosticTableauDeBord.diagnostics[0]
        ).toStrictEqual<Diagnostic>({
          dateCreation: '17.04.2024',
          identifiant: identifiantDiagnostic,
          secteurActivite: 'non renseigné',
          secteurGeographique: departement,
        });
      });
    });

    it("Avec le secteur d'activité si celui-ci est renseigné", async () => {
      const secteurActivite =
        'Activités de services administratifs et de soutien';
      const identifiantUtilisateur = crypto.randomUUID();
      const identifiantDiagnostic = crypto.randomUUID();

      const diagnosticTableauDeBord = await new ServiceTableauDeBord(
        new AdaptateurRelationsTest(
          new Map([[identifiantUtilisateur, [identifiantDiagnostic]]])
        ),
        new ServiceDiagnosticDeTest(
          new Map([
            [
              identifiantDiagnostic,
              unContexte().avecSecteurActivite(secteurActivite).construis(),
            ],
          ])
        ),
        rechercheUtilisateurMAC,
        true
      ).pour(identifiantUtilisateur);

      expect(diagnosticTableauDeBord.diagnostics[0]).toStrictEqual<Diagnostic>({
        dateCreation: '17.04.2024',
        identifiant: identifiantDiagnostic,
        secteurActivite: secteurActivite,
        secteurGeographique: 'non renseigné',
      });
    });

    it('Liste seulement les diagnostics initiés par un aidant', async () => {
      const identifiantUtilisateur = crypto.randomUUID();
      const identifiantDiagnosticInitie1 = crypto.randomUUID();
      const identifiantDiagnosticInitie2 = crypto.randomUUID();
      const relations = new Map<string, string[]>([
        [
          identifiantUtilisateur,
          [identifiantDiagnosticInitie1, identifiantDiagnosticInitie2],
        ],
        ['identifiant-d-un-autre-utilisateur', [crypto.randomUUID()]],
      ]);

      const diagnosticTableauDeBord = await new ServiceTableauDeBord(
        new AdaptateurRelationsTest(relations),
        new ServiceDiagnosticDeTest(
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
                  'Arts, spectacles et activités récréatives'
                )
                .construis(),
            ],
          ])
        ),
        rechercheUtilisateurMAC,
        true
      ).pour(identifiantUtilisateur);

      expect(diagnosticTableauDeBord.diagnostics).toStrictEqual<Diagnostic[]>([
        {
          dateCreation: '17.04.2024',
          identifiant: identifiantDiagnosticInitie1,
          secteurActivite: 'enseignement',
          secteurGeographique: 'Corse-du-Sud',
        },
        {
          dateCreation: '17.04.2024',
          identifiant: identifiantDiagnosticInitie2,
          secteurActivite: 'Arts, spectacles et activités récréatives',
          secteurGeographique: 'Finistère',
        },
      ]);
    });

    it('Liste les diagnostics par ordre chronologique du plus récent au plus ancien', async () => {
      const diagnosticRelies =
        uneListeDeDiagnosticsPourTableauDeBordReliesAUnUtilisateur([
          '2024-02-04T14:30:00+01:00',
          '2024-02-17T14:32:00+01:00',
          '2024-03-16T14:32:00+01:00',
        ]);

      const diagnosticTableauDeBord = await new ServiceTableauDeBord(
        new AdaptateurRelationsTest(diagnosticRelies.relations),
        diagnosticRelies.serviceDiagnostic,
        rechercheUtilisateurMAC,
        true
      ).pour(diagnosticRelies.identifiantUtilisateur);

      const premierDiagnosicCree = diagnosticRelies.diagnosticsCrees[0];
      const deuxiemeDiagnosicCree = diagnosticRelies.diagnosticsCrees[1];
      const troisiemeDiagnosicCree = diagnosticRelies.diagnosticsCrees[2];
      expect(diagnosticTableauDeBord.diagnostics).toStrictEqual<Diagnostic[]>([
        {
          dateCreation: '16.03.2024',
          identifiant: troisiemeDiagnosicCree.identifiant,
          secteurActivite: troisiemeDiagnosicCree.contexte.secteurActivite!,
          secteurGeographique: troisiemeDiagnosicCree.contexte.departement!,
        },
        {
          dateCreation: '17.02.2024',
          identifiant: deuxiemeDiagnosicCree.identifiant,
          secteurActivite: deuxiemeDiagnosicCree.contexte.secteurActivite!,
          secteurGeographique: deuxiemeDiagnosicCree.contexte.departement!,
        },
        {
          dateCreation: '04.02.2024',
          identifiant: premierDiagnosicCree.identifiant,
          secteurActivite: premierDiagnosicCree.contexte.secteurActivite!,
          secteurGeographique: premierDiagnosicCree.contexte.departement!,
        },
      ]);
    });
  });

  describe('Dans le cas d’un Aidant', () => {
    it('Retourne les actions HATEOAS spécifiques', async () => {
      const aidant = unAidant().construis();
      const entrepotAidant: EntrepotAidant = new EntrepotAidantMemoire();
      await entrepotAidant.persiste(aidant);

      const diagnosticTableauDeBord = await new ServiceTableauDeBord(
        new AdaptateurRelationsTest(new Map()),
        new ServiceDiagnosticDeTest(),
        uneRechercheUtilisateursMAC(
          new EntrepotUtilisateurMACMemoire({
            aidant: entrepotAidant,
            utilisateurInscrit: new EntrepotUtilisateurInscritMemoire(),
          })
        ),
        true
      ).pour(aidant.identifiant);

      expect(diagnosticTableauDeBord.liens).toStrictEqual<ReponseHATEOAS>({
        liens: {
          'afficher-preferences': {
            methode: 'GET',
            url: '/api/aidant/preferences',
          },
          'afficher-profil': {
            methode: 'GET',
            url: '/api/profil',
          },
          'lancer-diagnostic': {
            methode: 'POST',
            url: '/api/diagnostic',
          },
          'se-deconnecter': {
            methode: 'GET',
            typeAppel: 'DIRECT',
            url: '/pro-connect/deconnexion',
          },
        },
      });
    });
  });

  describe('Dans le cas d’un Utilisateur Inscrit', () => {
    it('Retourne les actions HATEOAS spécifiques', async () => {
      const utilisateurInscrit = unUtilisateurInscrit().construis();
      const entrepotUtilisateurInscrit: EntrepotUtilisateurInscrit =
        new EntrepotUtilisateurInscritMemoire();
      await entrepotUtilisateurInscrit.persiste(utilisateurInscrit);

      const diagnosticTableauDeBord = await new ServiceTableauDeBord(
        new AdaptateurRelationsTest(new Map()),
        new ServiceDiagnosticDeTest(),
        uneRechercheUtilisateursMAC(
          new EntrepotUtilisateurMACMemoire({
            aidant: new EntrepotAidantMemoire(),
            utilisateurInscrit: entrepotUtilisateurInscrit,
          })
        ),
        true
      ).pour(utilisateurInscrit.identifiant);

      expect(diagnosticTableauDeBord.liens).toStrictEqual<ReponseHATEOAS>({
        liens: {
          'afficher-profil': {
            methode: 'GET',
            url: '/api/profil',
          },
          'lancer-diagnostic': {
            methode: 'POST',
            url: '/api/diagnostic',
          },
          'se-deconnecter': {
            methode: 'GET',
            typeAppel: 'DIRECT',
            url: '/pro-connect/deconnexion',
          },
        },
      });
    });
  });
});
