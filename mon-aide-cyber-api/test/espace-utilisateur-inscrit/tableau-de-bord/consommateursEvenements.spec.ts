import { describe, expect, it } from 'vitest';
import { AdaptateurRelationsMAC } from '../../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../../src/relation/infrastructure/EntrepotRelationMemoire';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { DiagnosticLance } from '../../../src/diagnostic/CapteurCommandeLanceDiagnostic';
import crypto from 'crypto';
import {
  unAidant,
  unUtilisateurInscrit,
} from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { uneRechercheUtilisateursMAC } from '../../../src/recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import {
  EntrepotAidantMemoire,
  EntrepotUtilisateurInscritMemoire,
  EntrepotUtilisateurMACMemoire,
} from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { utilisateurInscritInitieDiagnostic } from '../../../src/espace-utilisateur-inscrit/tableau-de-bord/consommateursEvenements';
import { EntrepotUtilisateurInscrit } from '../../../src/espace-utilisateur-inscrit/UtilisateurInscrit';

describe("Les consommateurs d'évènements du tableau de bord d’un utilisateur inscrit", () => {
  describe("Lorsque l'évènement 'DIAGNOSTIC_LANCE' est consommé", () => {
    it("Créé une relation entre l'utilisateur inscrit et le diagnostic", async () => {
      const entrepotRelation = new EntrepotRelationMemoire();
      const adaptateurRelations = new AdaptateurRelationsMAC(entrepotRelation);
      const utilisateurInscrit = unUtilisateurInscrit().construis();
      const entrepotUtilisateurInscrit: EntrepotUtilisateurInscrit =
        new EntrepotUtilisateurInscritMemoire();
      await entrepotUtilisateurInscrit.persiste(utilisateurInscrit);
      const identifiantDiagnostic = crypto.randomUUID();

      await utilisateurInscritInitieDiagnostic(
        adaptateurRelations,
        uneRechercheUtilisateursMAC(
          new EntrepotUtilisateurMACMemoire({
            aidant: new EntrepotAidantMemoire(),
            utilisateurInscrit: entrepotUtilisateurInscrit,
          })
        )
      ).consomme<DiagnosticLance>({
        corps: {
          identifiantDiagnostic,
          identifiantUtilisateur: utilisateurInscrit.identifiant,
        },
        identifiant: crypto.randomUUID(),
        type: 'DIAGNOSTIC_LANCE',
        date: FournisseurHorloge.maintenant(),
      });

      expect(
        await adaptateurRelations.identifiantsObjetsLiesAUtilisateur(
          utilisateurInscrit.identifiant
        )
      ).toStrictEqual([identifiantDiagnostic]);
    });

    it("Ne créé pas la relation s'il ne s'agit pas d'un Utilisateur Inscrit", async () => {
      const entrepotRelation = new EntrepotRelationMemoire();
      const adaptateurRelations = new AdaptateurRelationsMAC(entrepotRelation);
      const aidant = unAidant().construis();
      const entrepotAidant = new EntrepotAidantMemoire();
      entrepotAidant.persiste(aidant);
      const identifiantDiagnostic = crypto.randomUUID();
      const identifiantUtilisateur = aidant.identifiant;

      await utilisateurInscritInitieDiagnostic(
        adaptateurRelations,
        uneRechercheUtilisateursMAC(
          new EntrepotUtilisateurMACMemoire({
            aidant: entrepotAidant,
            utilisateurInscrit: new EntrepotUtilisateurInscritMemoire(),
          })
        )
      ).consomme<DiagnosticLance>({
        corps: {
          identifiantDiagnostic,
          identifiantUtilisateur,
        },
        identifiant: crypto.randomUUID(),
        type: 'DIAGNOSTIC_LANCE',
        date: FournisseurHorloge.maintenant(),
      });

      expect(
        await adaptateurRelations.identifiantsObjetsLiesAUtilisateur(
          identifiantUtilisateur
        )
      ).toStrictEqual([]);
    });
  });
});
