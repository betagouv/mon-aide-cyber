import { describe, expect, it } from 'vitest';
import { utilitairesCookies } from '../../src/adaptateurs/utilitairesDeCookies';
import { AdaptateurDeGestionDeCookiesMAC } from '../../src/adaptateurs/AdaptateurDeGestionDeCookiesMAC';
import { Request, Response } from 'express';

describe('L’adaptateur de gestion de cookies MAC', () => {
  describe('Lorsque l’utilisateur s’est connecté via la mire de login MAC', () => {
    it('Supprime le cookie MAC', async () => {
      let sesionReinitialisee = false;
      let suiteAppelee = false;
      utilitairesCookies.reinitialiseLaSession = () => {
        sesionReinitialisee = true;
      };

      await new AdaptateurDeGestionDeCookiesMAC().supprime()(
        {} as Request,
        {} as Response,
        () => {
          suiteAppelee = true;
        }
      );

      expect(sesionReinitialisee).toBe(true);
      expect(suiteAppelee).toBe(true);
    });
  });
});
