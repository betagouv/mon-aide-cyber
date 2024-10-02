import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { executeRequete } from '../executeurRequete';
import { Constructeur } from '../../constructeurs/constructeur';
import { fakerFR } from '@faker-js/faker';
import { Statistiques } from '../../../src/statistiques/statistiques';
import { UUID } from 'crypto';
import { ReponseStatistiques } from '../../../src/api/statistiques/routesStatistiques';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { EntrepotStatistiquesMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';

class ConstructeurDeStatistiques implements Constructeur<Statistiques> {
  private identifiant: UUID = fakerFR.string.uuid() as UUID;
  private nombreDiagnostics: number = fakerFR.number.int();
  private nombreAidants: number = fakerFR.number.int();

  avecDesDiagnosticsAuNombreDe(
    nombreDeDiagnostics: number
  ): ConstructeurDeStatistiques {
    this.nombreDiagnostics = nombreDeDiagnostics;
    return this;
  }

  avecDesAidantsAuNombreDe(nombreAidants: number): ConstructeurDeStatistiques {
    this.nombreAidants = nombreAidants;
    return this;
  }

  construis(): Statistiques {
    return {
      identifiant: this.identifiant,
      nombreDiagnostics: this.nombreDiagnostics,
      nombreAidants: this.nombreAidants,
    };
  }
}

const unConstructeurDeStatistiques = () => new ConstructeurDeStatistiques();
describe('Le serveur MAC sur les routes /statistiques', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    testeurMAC.entrepots = new EntrepotsMemoire();
    donneesServeur = testeurMAC.initialise();
    testeurMAC.adaptateurDeVerificationDeSession.reinitialise();
    testeurMAC.adaptateurDeVerificationDeCGU.reinitialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('Quand une requête GET est reçue sur /statistiques', () => {
    it('Retourne le nombre de diagnostics effectués en prenant en compte les 500 Excels et en démo', async () => {
      const statistiques = unConstructeurDeStatistiques()
        .avecDesDiagnosticsAuNombreDe(754)
        .construis();
      await (
        testeurMAC.entrepots.statistiques() as EntrepotStatistiquesMemoire
      ).persiste(statistiques);
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/statistiques`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<ReponseStatistiques>({
        nombreDiagnostics: 1254,
        nombreAidantsFormes: expect.any(Number),
        nombreSessionFamiliarisation: expect.any(Number),
      });
    });

    it('Retourne le nombre d’Aidants formés', async () => {
      const statistiques = unConstructeurDeStatistiques()
        .avecDesAidantsAuNombreDe(238)
        .construis();
      await (
        testeurMAC.entrepots.statistiques() as EntrepotStatistiquesMemoire
      ).persiste(statistiques);
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/statistiques`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<ReponseStatistiques>({
        nombreAidantsFormes: 238,
        nombreDiagnostics: expect.any(Number),
        nombreSessionFamiliarisation: expect.any(Number),
      });
    });

    it('Retourne le nombre de formations', async () => {
      const statistiques = unConstructeurDeStatistiques().construis();
      await (
        testeurMAC.entrepots.statistiques() as EntrepotStatistiquesMemoire
      ).persiste(statistiques);
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/statistiques`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<ReponseStatistiques>({
        nombreAidantsFormes: expect.any(Number),
        nombreDiagnostics: expect.any(Number),
        nombreSessionFamiliarisation: 45,
      });
    });
  });
});
