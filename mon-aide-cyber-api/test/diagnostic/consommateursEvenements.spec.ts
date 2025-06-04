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
import { Tuple } from '../../src/relation/Tuple';

class FauxServiceDeHashage implements ServiceDeHashage {
  constructor(private tableDeHashage: Map<string, string>) {}

  hashe(chaine: string): string {
    return this.tableDeHashage.get(chaine) || '';
  }
}

describe('Les consommateurs d’événements du diagnostic', () => {
  describe('Lorsque l’événement DIAGNOSTIC_LANCE est consommé', () => {
    it('Stocke l’email hashé de l’entité Aidée, dans une relation', async () => {
      const entrepotRelation = new EntrepotRelationMemoire();
      const adaptateurRelations = new AdaptateurRelationsMAC(entrepotRelation);
      const relationsCreees: Tuple[] = [];
      adaptateurRelations.creeTuple = async (tuple: Tuple) => {
        relationsCreees.push(tuple);
        return;
      };
      const identifiantDiagnostic = crypto.randomUUID();
      const serviceDeChiffrement = new FauxServiceDeHashage(
        new Map([['beta-gouv@beta.gouv.fr', 'hash-email-entite-aidee']])
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

      expect(relationsCreees).toHaveLength(1);
      expect(relationsCreees[0].utilisateur.identifiant).toBe(
        'hash-email-entite-aidee'
      );
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
