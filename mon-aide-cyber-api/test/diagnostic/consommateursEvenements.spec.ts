import { describe, expect, it } from 'vitest';
import { EntrepotRelationMemoire } from '../../src/relation/infrastructure/EntrepotRelationMemoire';
import { AdaptateurRelationsMAC } from '../../src/relation/AdaptateurRelationsMAC';
import { DiagnosticLance } from '../../src/diagnostic/CapteurCommandeLanceDiagnostic';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { entiteAideeBeneficieDiagnostic } from '../../src/diagnostic/consommateursEvenements';
import { ServiceDeHashage } from '../../src/securite/ServiceDeHashage';
import { ServiceDeHashageClair } from '../../src/infrastructure/adaptateurs/adaptateurServiceDeHashage';
import { AdaptateurRepertoireDeContactsMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurRepertoireDeContactsMemoire';
import { Evenement } from '../../src/contacts/RepertoireDeContacts';

class FauxServiceDeHashage implements ServiceDeHashage {
  constructor(private tableDeHashage: Map<string, string>) {}

  hashe(chaine: string): string {
    return this.tableDeHashage.get(chaine) || '';
  }
}

describe('Les consommateurs d’événements du diagnostic', () => {
  describe('Lorsque l’événement DIAGNOSTIC_LANCE est consommé', () => {
    it('Stocke l’email hashé de l’entité Aidée', async () => {
      const entrepotRelation = new EntrepotRelationMemoire();
      const adaptateurRelations = new AdaptateurRelationsMAC(entrepotRelation);
      const identifiantDiagnostic = crypto.randomUUID();
      const hashEmailEntiteAidee = 'hash-email-entite-aidee';
      const serviceDeChiffrement = new FauxServiceDeHashage(
        new Map([['beta-gouv@beta.gouv.fr', hashEmailEntiteAidee]])
      );

      await entiteAideeBeneficieDiagnostic(
        adaptateurRelations,
        serviceDeChiffrement,
        new AdaptateurRepertoireDeContactsMemoire()
      ).consomme<DiagnosticLance>({
        corps: {
          emailEntite: 'beta-gouv@beta.gouv.fr',
          identifiantUtilisateur: crypto.randomUUID(),
          identifiantDiagnostic: identifiantDiagnostic,
        },
        identifiant: crypto.randomUUID(),
        type: 'DIAGNOSTIC_LANCE',
        date: FournisseurHorloge.maintenant(),
      });

      expect(
        await adaptateurRelations.diagnosticsDeLAide(hashEmailEntiteAidee)
      ).toStrictEqual([identifiantDiagnostic]);
    });

    it('Émet un événement dans le répertoire de contacts', async () => {
      const identifiantDiagnostic = crypto.randomUUID();
      const repertoireDeContactsMemoire =
        new AdaptateurRepertoireDeContactsMemoire();

      await entiteAideeBeneficieDiagnostic(
        new AdaptateurRelationsMAC(new EntrepotRelationMemoire()),
        new ServiceDeHashageClair(),
        repertoireDeContactsMemoire
      ).consomme<DiagnosticLance>({
        corps: {
          emailEntite: 'beta-gouv@beta.gouv.fr',
          identifiantUtilisateur: crypto.randomUUID(),
          identifiantDiagnostic: identifiantDiagnostic,
        },
        identifiant: crypto.randomUUID(),
        type: 'DIAGNOSTIC_LANCE',
        date: FournisseurHorloge.maintenant(),
      });

      expect(repertoireDeContactsMemoire.evenements).toContainEqual<Evenement>({
        email: 'beta-gouv@beta.gouv.fr',
        type: 'DIAGNOSTIC_DEMARRE',
      });
    });
  });
});
