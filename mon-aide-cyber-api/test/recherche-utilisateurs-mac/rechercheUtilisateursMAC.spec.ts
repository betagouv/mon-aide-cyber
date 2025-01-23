import { describe, expect, it } from 'vitest';
import { uneRechercheUtilisateursMAC } from '../../src/recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import {
  EntrepotAidantMemoire,
  EntrepotUtilisateurInscritMemoire,
  EntrepotUtilisateurMACMemoire,
} from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { unAidant } from '../constructeurs/constructeursAidantUtilisateur';
import { unUtilisateurInscrit } from '../constructeurs/constructeurUtilisateurInscrit';

describe('La recherche utilisateur MAC', () => {
  describe('Dans le cas de l’Aidant', () => {
    it('Retourne la date de validation des CGU', async () => {
      const dateValidationCGU = new Date(Date.parse('2024-12-22T13:41:24'));
      const aidant = unAidant().cguValideesLe(dateValidationCGU).construis();
      const entrepotAidant = new EntrepotAidantMemoire();
      await entrepotAidant.persiste(aidant);

      const utilisateur = await uneRechercheUtilisateursMAC(
        new EntrepotUtilisateurMACMemoire({
          aidant: entrepotAidant,
          utilisateurInscrit: new EntrepotUtilisateurInscritMemoire(),
        })
      ).rechercheParIdentifiant(aidant.identifiant);

      expect(utilisateur).toBeDefined();
      expect(utilisateur?.dateValidationCGU).toStrictEqual(dateValidationCGU);
    });
  });

  describe('Dans le cas de l’Utilisateur Inscrit', () => {
    it('Retourne la date de validation des CGU', async () => {
      const dateValidationCGU = new Date(Date.parse('2024-12-22T13:41:24'));
      const utilisateurInscrit = unUtilisateurInscrit()
        .avecUneDateDeSignatureDeCGU(dateValidationCGU)
        .construis();
      const entrepotUtilisateurInscrit =
        new EntrepotUtilisateurInscritMemoire();
      await entrepotUtilisateurInscrit.persiste(utilisateurInscrit);

      const utilisateur = await uneRechercheUtilisateursMAC(
        new EntrepotUtilisateurMACMemoire({
          aidant: new EntrepotAidantMemoire(),
          utilisateurInscrit: entrepotUtilisateurInscrit,
        })
      ).rechercheParIdentifiant(utilisateurInscrit.identifiant);

      expect(utilisateur).toBeDefined();
      expect(utilisateur?.dateValidationCGU).toStrictEqual(dateValidationCGU);
    });
  });
});
