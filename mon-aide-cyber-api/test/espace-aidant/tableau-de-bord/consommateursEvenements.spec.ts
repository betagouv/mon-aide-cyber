import { describe, it } from 'vitest';
import { AdaptateurRelationsMAC } from '../../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../../src/relation/infrastructure/EntrepotRelationMemoire';
import { aidantInitieDiagnostic } from '../../../src/espace-aidant/tableau-de-bord/consommateursEvenements';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { DiagnosticLance } from '../../../src/diagnostic/CapteurCommandeLanceDiagnostic';
import crypto from 'crypto';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { uneRechercheUtilisateursMAC } from '../../../src/recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import {
  EntrepotAidantMemoire,
  EntrepotUtilisateurInscritMemoire,
  EntrepotUtilisateurMACMemoire,
} from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { EntrepotAidant } from '../../../src/espace-aidant/Aidant';

describe("Les consommateurs d'évènements du tableau de bord", () => {
  const entrepotUtilisateurInscrit = new EntrepotUtilisateurInscritMemoire();
  describe("Lorsque l'évènement 'DIAGNOSTIC_LANCE' est consommé", () => {
    it("Créé une relation entre l'aidant et le diagnostic", async () => {
      const entrepotRelation = new EntrepotRelationMemoire();
      const adaptateurRelations = new AdaptateurRelationsMAC(entrepotRelation);
      const aidant = unAidant().construis();
      const entrepotAidant: EntrepotAidant = new EntrepotAidantMemoire();
      await entrepotAidant.persiste(aidant);
      const identifiantDiagnostic = crypto.randomUUID();

      await aidantInitieDiagnostic(
        adaptateurRelations,
        uneRechercheUtilisateursMAC(
          new EntrepotUtilisateurMACMemoire({
            aidant: entrepotAidant,
            utilisateurInscrit: entrepotUtilisateurInscrit,
          })
        )
      ).consomme<DiagnosticLance>({
        corps: {
          identifiantDiagnostic,
          identifiantUtilisateur: aidant.identifiant,
        },
        identifiant: crypto.randomUUID(),
        type: 'DIAGNOSTIC_LANCE',
        date: FournisseurHorloge.maintenant(),
      });

      expect(
        await adaptateurRelations.identifiantsObjetsLiesAUtilisateur(
          aidant.identifiant
        )
      ).toStrictEqual([identifiantDiagnostic]);
    });

    it("Ne créé pas la relation s'il ne s'agit pas d'un Aidant", async () => {
      const entrepotRelation = new EntrepotRelationMemoire();
      const adaptateurRelations = new AdaptateurRelationsMAC(entrepotRelation);
      const entrepotAidant = new EntrepotAidantMemoire();
      const identifiantDiagnostic = crypto.randomUUID();
      const identifiantUtilisateur = crypto.randomUUID();

      await aidantInitieDiagnostic(
        adaptateurRelations,
        uneRechercheUtilisateursMAC(
          new EntrepotUtilisateurMACMemoire({
            aidant: entrepotAidant,
            utilisateurInscrit: entrepotUtilisateurInscrit,
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

    it("Créé une relation entre l'aidant et le diagnostic si il s’agit d’un Gendarme", async () => {
      const entrepotRelation = new EntrepotRelationMemoire();
      const adaptateurRelations = new AdaptateurRelationsMAC(entrepotRelation);
      const aidant = unAidant().avecUnProfilGendarme().construis();
      const entrepotAidant: EntrepotAidant = new EntrepotAidantMemoire();
      await entrepotAidant.persiste(aidant);
      const identifiantDiagnostic = crypto.randomUUID();

      await aidantInitieDiagnostic(
        adaptateurRelations,
        uneRechercheUtilisateursMAC(
          new EntrepotUtilisateurMACMemoire({
            aidant: entrepotAidant,
            utilisateurInscrit: entrepotUtilisateurInscrit,
          })
        )
      ).consomme<DiagnosticLance>({
        corps: {
          identifiantDiagnostic,
          identifiantUtilisateur: aidant.identifiant,
        },
        identifiant: crypto.randomUUID(),
        type: 'DIAGNOSTIC_LANCE',
        date: FournisseurHorloge.maintenant(),
      });

      expect(
        await adaptateurRelations.identifiantsObjetsLiesAUtilisateur(
          aidant.identifiant
        )
      ).toStrictEqual([identifiantDiagnostic]);
    });
  });
});
