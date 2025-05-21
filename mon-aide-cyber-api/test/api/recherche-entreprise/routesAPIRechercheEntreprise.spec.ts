import { beforeEach, describe, expect, it } from 'vitest';
import { executeRequete } from '../executeurRequete';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { ReponseRechercheEntreprise } from '../../../src/api/recherche-entreprise/routesAPIRechercheEntreprise';
import { adaptateurRechercheEntreprise } from '../../../src/infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import { AdaptateurDeRequeteHTTPMemoire } from '../../adaptateurs/AdaptateurDeRequeteHTTPMemoire';
import { unConstructeurDeReponseAPIEntreprise } from '../../constructeurs/constructeurAPIEntreprise';

describe('Le serveur MAC, sur les routes de recherche entreprise', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };
  const adaptateurDeRequeteHTTP = new AdaptateurDeRequeteHTTPMemoire();
  adaptateurDeRequeteHTTP;

  beforeEach(() => {
    testeurMAC.adaptateurDeRechercheEntreprise = adaptateurRechercheEntreprise(
      adaptateurDeRequeteHTTP
    );
    donneesServeur = testeurMAC.initialise();
  });

  describe('Lorsqu’une requête GET est reçue sur /api/recherche-entreprise', () => {
    it('Retourne la liste des entreprises correspondant à la requête', async () => {
      adaptateurDeRequeteHTTP.reponse({
        results: [
          unConstructeurDeReponseAPIEntreprise()
            .portantLeNom('Beta-Gouv')
            .dansAdministration()
            .dansLaVille({
              commune: 'Bordeaux',
              departement: '33',
            })
            .avecLeSiret('1234567890')
            .estUneAssociation()
            .construis(),
        ],
      });

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/api/recherche-entreprise?nom=beta'
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<ReponseRechercheEntreprise>([
        {
          siret: '1234567890',
          nom: 'Beta-Gouv',
          departement: '33',
          commune: 'Bordeaux',
        },
      ]);
    });

    it('La requête est conforme', async () => {
      adaptateurDeRequeteHTTP.reponse({
        results: [
          unConstructeurDeReponseAPIEntreprise()
            .portantLeNom(
              'agence nationale de sécurité des systèmes d’information'
            )
            .construis(),
        ],
      });

      await executeRequete(
        donneesServeur.app,
        'GET',
        '/api/recherche-entreprise?nom=agence%20nationale%20de%20s%C3%A9curit%C3%A9%20des%20syst%C3%A8mes%20d%E2%80%99information'
      );

      expect(adaptateurDeRequeteHTTP.requeteAttendue).toStrictEqual(
        '/search?q=agence%20nationale%20de%20s%C3%A9curit%C3%A9%20des%20syst%C3%A8mes%20d%E2%80%99information&per_page=25&limite_matching_etablissements=1'
      );
    });

    it('Prends en compte les paramètres de requêtes optionnels', async () => {
      adaptateurDeRequeteHTTP.reponse({
        results: [
          unConstructeurDeReponseAPIEntreprise()
            .portantLeNom('Beta-Gouv')
            .estUneAssociation()
            .construis(),
        ],
      });

      await executeRequete(
        donneesServeur.app,
        'GET',
        '/api/recherche-entreprise?nom=beta&est_association=true'
      );

      expect(adaptateurDeRequeteHTTP.requeteAttendue).toStrictEqual(
        '/search?q=beta&est_association=true&per_page=25&limite_matching_etablissements=1'
      );
    });

    it('Retourne une erreur si la requête a échoué', async () => {
      adaptateurDeRequeteHTTP.reponse(
        {
          erreur: 'Une erreur s’est produite',
        },
        true
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/api/recherche-entreprise?nom=agence%20nationale%20de%20s%C3%A9curit%C3%A9%20des%20syst%C3%A8mes%20d%E2%80%99information'
      );

      expect(reponse.statusCode).toBe(400);
      expect(await reponse.json()).toStrictEqual({
        message: 'Une erreur s’est produite',
      });
    });

    it('Retourne la liste des entreprises et des associations non référencées correspondant à la requête', async () => {
      adaptateurDeRequeteHTTP.reponse({
        results: [
          unConstructeurDeReponseAPIEntreprise()
            .dansLaVille({
              commune: 'Bordeaux',
              departement: '33',
            })
            .avecLeSiret('1234567890')
            .portantLeNom('Réserviste')
            .estUneAssociation()
            .construis(),
        ],
      });

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/api/recherche-entreprise?nom=reserviste&est_association=true'
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<ReponseRechercheEntreprise>([
        {
          siret: '1234567890',
          nom: 'Réserviste',
          departement: '33',
          commune: 'Bordeaux',
        },
        {
          nom: 'Réserviste de la Gendarmerie',
          siret: '00000000000000',
          departement: '75',
          commune: 'Paris',
        },
      ]);
    });

    it('Ne Retourne pas la liste des associations non référencées si la recherche n’est pas lancée pour les associations', async () => {
      adaptateurDeRequeteHTTP.reponse({
        results: [
          unConstructeurDeReponseAPIEntreprise()
            .dansLaVille({
              commune: 'Bordeaux',
              departement: '33',
            })
            .avecLeSiret('1234567890')
            .portantLeNom('Réserviste')
            .estUneAssociation()
            .construis(),
        ],
      });

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/api/recherche-entreprise?nom=reserviste&est_service_public=true'
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<ReponseRechercheEntreprise>([
        {
          siret: '1234567890',
          nom: 'Réserviste',
          departement: '33',
          commune: 'Bordeaux',
        },
      ]);
    });
  });
});
